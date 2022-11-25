import { RETURNS_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'

export default async function getReturnData(orderId: string, cookies?: any) {
  try {
    const res = await fetcher({
      url: RETURNS_ENDPOINT + '/' + orderId,
      method: 'get',
      cookies,
    })
    return res
  } catch (error: any) {
    console.log(error)
    throw new Error(error)
  }
}
