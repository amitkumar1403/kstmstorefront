import { INFRA_ENDPOINT } from '@components/utils/constants'
import { cachedGetData } from '../utils/cached-fetch';

export default function getInfraOperation() {
  async function getInfra() {
    try {
      const response: any = await cachedGetData(INFRA_ENDPOINT);
      return response?.result;
    } catch (error) {
      console.log(error);
    }
  }
  return getInfra;
}
