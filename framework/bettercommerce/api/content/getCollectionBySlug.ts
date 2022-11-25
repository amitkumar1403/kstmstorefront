import fetcher from '../../fetcher'
import { COLLECTIONS_ENDPOINT } from '@components/utils/constants'
export default function getCollectionBySlug(slug: string) {
  async function getCollectionBySlugAsync() {
    try {
      const response: any = await fetcher({
        url: COLLECTIONS_ENDPOINT + `/slug-minimal/?slug=${slug}`,
        method: 'get',
      })
      return { ...response.result, ...{ snippets: response.snippets } };
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return getCollectionBySlugAsync()
}
