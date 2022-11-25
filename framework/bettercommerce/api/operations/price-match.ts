import fetcher from '../../fetcher'
import { PRICE_MATCH_ENDPOINT } from '@components/utils/constants'
export default function priceMatch() {
  async function priceMatchAsync(data: any, cookies?: any) {
    try {
      const response: any = await fetcher({
        url: `${PRICE_MATCH_ENDPOINT}`,
        method: 'post',
        data,
        cookies,
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return priceMatchAsync
}
