
import fetcher from '../../fetcher'
import { PRODUCT_API_ENDPOINT } from '@components/utils/constants'
export default function useGetRelatedProducts() {
  async function useGetRelatedProductsAsync({ query }: any) {
    try {
      const response: any = await fetcher({
        url: `${PRODUCT_API_ENDPOINT}${query}/related-products`,
        method: 'get',
      })
      return {
        relatedProducts: response.result
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
  return useGetRelatedProductsAsync
}
