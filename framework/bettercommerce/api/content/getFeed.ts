import fetcher from '../../fetcher'
import { XML_FEED } from '@components/utils/constants'
export default async function getFeed(slug: string) {
  const url = `${XML_FEED}?slug=feed/${slug}`
  try {
    const response: any = await fetcher({
      url: url,
      method: 'get',
    })
    return response.result
  } catch (error: any) {
    console.log(error)
    // throw new Error(error.message)
  }
}
