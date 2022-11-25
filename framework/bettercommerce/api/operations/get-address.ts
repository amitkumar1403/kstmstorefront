import fetcher from '../../fetcher'
import { ADDRESS_ENDPOINT } from '@components/utils/constants'
export default function useAddress() {
  async function getAdressAsync({ query, cookies }: any) {
    try {
      const response: any = await fetcher({
        url: `${ADDRESS_ENDPOINT}${query.id}`,
        method: 'get',
        data: query,
        cookies,
      })
      return response.result
    } catch (error: any) {
      throw new Error(error)
    }
  }
  return getAdressAsync
}
