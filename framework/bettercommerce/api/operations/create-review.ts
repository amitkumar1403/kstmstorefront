import fetcher from '../../fetcher'
import { PRODUCT_API_ENDPOINT } from '@components/utils/constants'
export default function createREview() {
  async function createReviewAsync(query: any, cookies?: any) {
    const { title, rating, comment, userId, userEmail, productId, nickname } =
      query
    try {
      const response: any = await fetcher({
        url: `${PRODUCT_API_ENDPOINT}${productId}/review`,
        method: 'post',
        data: {
          title,
          rating,
          comment,
          userId,
          userEmail,
          nickname,
        },
        cookies,
      })
      return response.result
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
  return createReviewAsync
}
