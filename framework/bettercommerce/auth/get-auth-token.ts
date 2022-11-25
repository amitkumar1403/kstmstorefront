import { CLIENT_ID, SHARED_SECRET, AUTH_URL } from '../utils/constants'
import { setToken, setRefreshToken } from '../utils/index'
export default async function getAuthToken() {
  const url = new URL('oAuth/token', AUTH_URL)
  try {
    const response = await fetch(url.href, {
      method: 'POST',
      body: `client_id=${CLIENT_ID}&client_secret=${SHARED_SECRET}&grant_type=client_credentials`,
      redirect: 'follow',
    })

    const result = await response.json()
    setToken(result.access_token)
    setRefreshToken(result.refresh_token)
    return result
  } catch (error) {
    console.log(error)
  }
}
