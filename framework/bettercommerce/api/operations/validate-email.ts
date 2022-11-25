import fetcher from '../../fetcher'
import { CUSTOMER_BASE_API } from '@components/utils/constants'
export default function validateEmail() {
  async function validateEmailAsync({ query, cookies }: any) {
    const { data } = query
    try {
      const response: any = await fetcher({
        url: `${CUSTOMER_BASE_API}${data}/exists`,
        method: 'post',
        cookies,
      })
      return response.result
    } catch (error: any) {
      console.log(error, 'error')
      throw new Error(error)
    }
  }
  return validateEmailAsync
}
