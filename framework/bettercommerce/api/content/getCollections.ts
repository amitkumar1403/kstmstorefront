import fetcher from '../../fetcher'
import { COLLECTIONS_ENDPOINT } from '@components/utils/constants'
export default function getCollections() {
  async function getCollectionsAsync() {
    try {
      const response: any = await fetcher({
        url: COLLECTIONS_ENDPOINT + '/all',
        method: 'get',
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return getCollectionsAsync()
}
