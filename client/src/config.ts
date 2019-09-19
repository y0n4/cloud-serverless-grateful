// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it ✅
const apiId = '0v1spzg1ib'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-yfizc0yr.auth0.com',            // Auth0 domain
  clientId: 'OFN1luy3JzNDSr0I5z6I1VgCdg6FHylt',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
