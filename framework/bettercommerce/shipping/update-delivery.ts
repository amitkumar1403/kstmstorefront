import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import qs from 'qs'

interface Props {
  data: any
  id: string
  cookies?: any
}

export default function getShippingPlans() {
  return async function handler({ data, id, cookies }: Props) {
    const url = `${BASKET_ENDPOINT}/${id}/delivery/plan`

    try {
      const response: any = await fetcher({
        url: url,
        method: 'put',
        data: qs.stringify({ ...data }),
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        cookies,
      })
      return response
    } catch (error: any) {
      console.log(error, 'error')
      // throw new Error(error.message)
    }
  }
}
