import fetcher from '../fetcher'
import { CUSTOMER_BASE_API } from '@components/utils/constants'
export default async function validateToken(token: string, cookies?: any) {
  try {
    const endpoint = `${CUSTOMER_BASE_API}/validate-token?token=${token}`
    const res = await fetcher({ url: endpoint, method: 'get', cookies })
    console.log(res, 'res from framework/bettercommerc/customer/validate-token')
    return res
  } catch (error: any) {
    throw new Error(error)
  }
}
