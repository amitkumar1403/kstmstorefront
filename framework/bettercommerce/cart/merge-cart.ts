import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
interface Props {
  userBasketId: string
  currentBasketId: string
  cookies?: any
}

export default function useMergeCart() {
  return async function handler({
    userBasketId,
    currentBasketId,
    cookies,
  }: Props) {
    try {
      const response: any = await fetcher({
        url: `${BASKET_ENDPOINT}/${userBasketId}/merge/${currentBasketId}`,
        method: 'post',
        cookies,
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
