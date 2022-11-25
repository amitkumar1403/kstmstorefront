import fetcher from '../../fetcher'
import { CUSTOMER_NEWSLETTER } from '@components/utils/constants'
export default function subscribeToNewsletter() {
  async function subscribeToNewsletterAsync({ query, cookies }: any) {
    try {
      const response: any = await fetcher({
        url: `${CUSTOMER_NEWSLETTER}`,
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
  return subscribeToNewsletterAsync
}
