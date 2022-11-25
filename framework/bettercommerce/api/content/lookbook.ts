import fetcher from '../../fetcher'
import { LOOKBOOK_ENDPOINT } from '@components/utils/constants'
export default function getLookbook() {
  async function getLookbookAsync() {
    try {
      const response: any = await fetcher({
        url: LOOKBOOK_ENDPOINT,
        method: 'GET',
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return getLookbookAsync()
}
