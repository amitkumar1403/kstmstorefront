import fetcher from '../../fetcher'
import { NAV_ENDPOINT } from '@components/utils/constants'
import { addCache, cachedGetData, lookupCache } from '../utils/cached-fetch'

export default function getNavTree(cookies?: any) {
  async function getNavTreeAsync() {
    try {
      /*// TODO: This is not working on preview/prod. Works well on localhost.
      const response: any = await cachedGetData(NAV_ENDPOINT, cookies)
      return response.result;
      /////////////////////////////////////////////////////////////////////*/

      // Workaround to make cached-xhr calls work on preview/prod.
      const url = NAV_ENDPOINT;
      const cachedResponse = lookupCache(url);
      if (!cachedResponse) {
        const response: any = await fetcher({
          url: url,
          method: 'GET',
          cookies,
        })
        addCache(url, response.result)
        return response.result
      }
      return cachedResponse;
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return getNavTreeAsync()
}
