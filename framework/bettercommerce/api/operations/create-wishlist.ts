import fetcher from '../../fetcher'
import { CUSTOMER_BASE_API } from '@components/utils/constants'
export default function createWishlist() {
  async function createWishlistAsync({ query, cookies }: any) {
    try {
      const response: any = await fetcher({
        url: `${CUSTOMER_BASE_API}${query.id}/wishlist/add-item?productId=${query.productId}&saveForLater=${query.flag}`,
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
  return createWishlistAsync
}
