// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it ✅
const apiId = 'nkdvcowthf' // result of "successful sls deploy -v" on backend
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-yfizc0yr.auth0.com',            // Auth0 domain
  clientId: 'nrsER55D4nnfBYRa8DSzn2sb5mV6Y24y',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
