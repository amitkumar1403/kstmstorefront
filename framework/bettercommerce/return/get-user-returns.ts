import { CUSTOMER_BASE_API } from '@components/utils/constants'
import fetcher from '../fetcher'

export default async function getReturnData(userId: string, cookies?: any) {
  try {
    const res = await fetcher({
      url: `${CUSTOMER_BASE_API}/${userId}/returns`,
      method: 'get',
      cookies,
    })
    return res
  } catch (error: any) {
    console.log(error)
    throw new Error(error)
  }
}
