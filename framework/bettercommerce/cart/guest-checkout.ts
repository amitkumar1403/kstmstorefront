import { CHECKOUT_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
interface Props {
  basketId: string
  email: string
  notifyByEmail: boolean
  notifyBySms: boolean
  notifyByPost: boolean
  cookies: any
}

export default function useGuestCheckout() {
  return async function handler({
    basketId,
    email,
    notifyByEmail,
    notifyBySms,
    notifyByPost,
    cookies,
  }: Props) {
    try {
      const response: any = await fetcher({
        url: `${CHECKOUT_ENDPOINT}/${basketId}/guest-checkout`,
        method: 'post',
        data: {
          email,
          notifyByEmail,
          notifyBySms,
          notifyByPost,
        },
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
