import { NAV_ENDPOINT } from '@components/utils/constants'
import { cachedGetData } from '../utils/cached-fetch';

export default async function useNavTree(cookies?: any) {
  try {
    const headers = {
      DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
    };
    const response: any = await cachedGetData(NAV_ENDPOINT, cookies, headers);
    return response
  } catch (error: any) {
    console.log(error)
    // throw new Error(error.message)
  }
}
