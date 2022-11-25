import fetcher from '../fetcher'
import { CUSTOMER_BASE_API } from '@components/utils/constants'
import validateToken from './validate-token'

export default async function forgotPassword(email: string, cookies: any) {
  try {
    const endpoint = `${CUSTOMER_BASE_API}/password/forgot?email=${email}`
    const res: any = await fetcher({ url: endpoint, method: 'post', cookies })
    if (res.result.isValid) {
      const validate = await validateToken(res.result.recordId)
      return { forgotRes: res, validate }
    }
    return { forgotRes: res }
  } catch (error: any) {
    throw new Error(error)
  }
}
