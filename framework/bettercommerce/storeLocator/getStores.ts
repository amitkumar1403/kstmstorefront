import fetcher from '../fetcher'
import { OMS_BASE_URL } from '@framework/utils/constants'
import { STORE_LOCATOR_API } from '@components/utils/constants'
export default async function getStores(postCode: string) {
  try {
    const response: any = await fetcher({
      url: `${STORE_LOCATOR_API}/${postCode}`,
      method: 'get',
      //data: { postCode: postCode },
      baseUrl: OMS_BASE_URL,
    })
    return response.result
  } catch (error) {
    console.log(error)
  }
}
