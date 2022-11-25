import fetcher from '../../fetcher'
import { CATALOG_SEARCH } from '@components/utils/constants'

export type GetAllProductPathsResult = {
  products: Array<{ path: string }>
}

export default function getAllProductPathsOperation() {
  async function getAllProductPaths(): Promise<GetAllProductPathsResult> {
    try {
      const response: any = await fetcher({
        url: CATALOG_SEARCH,
        method: 'post',
      })
      return {
        products:
          response.result.products.map(({ slug }: any) => ({ slug })) || [],
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  return getAllProductPaths
  // function getAllProductPaths(): Promise<GetAllProductPathsResult> {
  //   return Promise.resolve({
  //     products: data.products.map(({ path }) => ({ path })),
  //   })
  // }

  // return getAllProductPaths
}
