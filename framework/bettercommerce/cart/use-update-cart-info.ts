import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
interface Props {
  basketId?: string
  info: any
  lineInfo: any
  cookies?: any
}

export default function useUpdateCartInfo() {
  return async function handler({ basketId, info, lineInfo, cookies }: Props) {
    const params: any = {}
    info.forEach((item: any, index: number) => {
      params[`customInfo${index + 1}`] = item
    })
    params['lineInfo'] = JSON.stringify(lineInfo)
    try {
      const response: any = await fetcher({
        url: `${BASKET_ENDPOINT}/${basketId}/items/add-bulk`,
        method: 'put',
        data: {
          ...params,
        },
        cookies,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }
}
