import fetcher from '../../fetcher'
import { PRODUCT_API_ENDPOINT } from '@components/utils/constants'
export default function notifyUser() {
  async function notifyUserAsync(query: any) {
    const { email, productId, cookies } = query
    try {
      const response: any = await fetcher({
        url: `${PRODUCT_API_ENDPOINT}${productId}/notifyme?email=email`,
        method: 'post',
        cookies,
        data: {
          email,
          id: productId,
        },
      })
      return response.result
    } catch (error: any) {
      // throw new Error(error.message)
    }
  }
  return notifyUserAsync
}
