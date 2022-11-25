import fetcher from '../../fetcher'
import { SITEVIEW_ENDPOINT } from '@components/utils/constants'

export default function getSlugsOperation() {
  async function getSlugs({ slug = '/' }: any) {
    //console.log(slug);
    try {
      const response: any = await fetcher({
        url: `${SITEVIEW_ENDPOINT}/slug?slug=${slug}`,
        method: 'post',
      });
      return { ...response.result, ...{ snippets: response.snippets } };
    } catch (error) {
      console.log(error);
    }
  }
  return getSlugs;
}
