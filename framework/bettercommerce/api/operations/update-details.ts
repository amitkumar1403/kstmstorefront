import fetcher from '../../fetcher'
import { CUSTOMER_BASE_API } from '@components/utils/constants'
export default function updateDetails() {
  async function updateDetailsAsync({ query, cookies }: any) {
    const { userId } = query
    try {
      const response: any = await fetcher({
        url: `${CUSTOMER_BASE_API}${userId}/update`,
        method: 'post',
        data: query,
        cookies,
      })
      return response.result
    } catch (error: any) {
      console.log(error, 'error')
      throw new Error(error)
    }
  }
  return updateDetailsAsync
}
