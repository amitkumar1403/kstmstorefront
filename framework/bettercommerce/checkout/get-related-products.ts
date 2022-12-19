import { PRODUCT_API_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'

interface Props {
  id?: string
}

export default function getOrderRelatedProducts() {
  return async function handler(id?: string) {
    const url = PRODUCT_API_ENDPOINT + `/${id}/related-products`
    try {
      const response: any = await fetcher({
        url,
        method: 'get',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response
    } catch (error: any) {
      console.log(error, 'err')
      // throw new Error(error.message)
    }
  }
}
