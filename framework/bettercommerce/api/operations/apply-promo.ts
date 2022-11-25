import fetcher from '../../fetcher'
import { BASKET_ENDPOINT } from '@components/utils/constants'
export default function applyPromo() {
  async function applyPromoAsync(query: any) {
    const { basketId, promoCode, method = 'apply', cookies } = query
    let httpMethod = method === 'remove' ? 'delete' : 'post'
    try {
      const response: any = await fetcher({
        url: `${BASKET_ENDPOINT}/${basketId}/promo/${promoCode}/${method}`,
        method: httpMethod,
        cookies,
      })
      return response
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return applyPromoAsync
}
