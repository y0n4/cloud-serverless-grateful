import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = '...'

// generated certification from Auth0 (instruction from lesson 5/exercise)
const cert = `
-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJIXj6fS+aiR1PMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi15Zml6YzB5ci5hdXRoMC5jb20wHhcNMTkwOTEyMDE1MTI5WhcNMzMw
NTIxMDE1MTI5WjAhMR8wHQYDVQQDExZkZXYteWZpemMweXIuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsWzgYKQ2qjgoShDzQrB0yDMN
QfJem5uxaG2kA1AvDRL43CKy8eo8L689/AJj6CnLxPIzkCmXLszqEeefOqKi9cAg
KSQf+m4H/u9ESwbGFiPqFbaodhEjRRBVK4CLyALzAHJTvTERc7g/K00xDlJzyBkQ
kl2YhyA7ig3erpnsXv3mkA79VdyRMrSnXWongVQnEOxvNbKR/0vP2eWU0IEMfOKm
qJ5aNDuJtdGt6V/qODyuhBzfCdcZ6Fk0VRywnO+DbEVR+uihDl5TdVvRzeyFSLr8
KkvUSxqK5HcZbaHL2wIVO3Waj952lT6Uw6/yb1ogzgkO05uyd7MkXfRKp9jYqwID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSrdHOHxM5KwOvDzEnn
zzSMEJNMCTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAI7dUAbq
F5N6BC1vZI/CtpEXJke7QF17L1Sy9BQNXFDtGOLw6l2sa2+LaRgvbotTRNgNBWWy
Ib9dUWY17KmxpX0Fm9sHZruMr4MM02X/X1pii94mmxqs1iFq+Rp343BbwK3OEUFP
cfD3rb1AXKFHOEvbJ4WkM49huO1sV1hI9lcS/PZGNt8eWuQ0w4iOlg6AF1OK6KR8
oNCf2r31XXEouLXL8omP613+yvhb0PDnFKjua+B10eZhNPgJ7BGVxqOSn/jecMZV
mk3fudQAHNa/dMns7XRI/owGg2TB9YSpTEKW66y1by7CE5/7e/18VCgZYezzBEvD
b5cHZVaNeA513Zk=
-----END CERTIFICATE-----
`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

// receives one parameter from client to api gateway
async function verifyToken(authHeader: string): Promise<JwtPayload> {
  console.log('🌸🌸', authHeader);
  const token = getToken(authHeader)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification ✅
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/

  // const token = need token to verify
  // const secret = used to sign this token
  // if thrown error, else valid token
  return verify(
    token,           // Token from an HTTP header to validate
    cert,            // A certificate copied from Auth0 website
    { algorithms: ['RS256'] } // We need to specify that we use the RS256 algorithm
  ) as JwtPayload;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
