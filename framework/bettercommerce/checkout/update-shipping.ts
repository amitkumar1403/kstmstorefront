import { CHECKOUT_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'

interface Props {
  basketId?: string
  countryCode?: string
  shippingId?: string
}

export default function updateShippingMethod() {
  return async function handler({ basketId, shippingId, countryCode }: Props) {
    const url =
      CHECKOUT_ENDPOINT +
      `/${basketId}/delivery/shipping-method?shippingMethodId=${shippingId}&countryCode=${countryCode}`
    try {
      const response: any = await fetcher({
        url,
        method: 'put',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
