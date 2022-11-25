import fetcher from '../../../fetcher'
import { CATALOG_ENDPOINT } from '@components/utils/constants'

export default async function getBrands(query: any) {
  try {
    const response: any = await fetcher({
      url: `${CATALOG_ENDPOINT}/all?page=${query.page || 1}&sortBy=${
        query.sortBy || 'manufacturerName'
      }&sortOrder=${query.sortOrder || 'asc'}&brandIds=${query.brandIds || ''}`,
      method: 'get',
    })

    return response
  } catch (error) {
    return { hasError: true, error }
  }
}
