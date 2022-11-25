import type { BetterCommerceConfig } from '../index'
import { Product } from '@commerce/types/product'
import { GetProductOperation } from '@commerce/types/product'
import data from '../../data.json'
import type { OperationContext } from '@commerce/api/operations'
import fetcher from '../../fetcher'
import { PRODUCT_PREVIEW_API_ENDPOINT } from '@components/utils/constants'
export default function getProductOperation({
  commerce,
}: OperationContext<any>) {
  async function getProductPreview<T extends GetProductOperation>({
    query = '',
    cookies = {},
  }: {
    query?: string
    cookies?: any
  } = {}): Promise<any> {
    const response: any = await fetcher({
      url: `${PRODUCT_PREVIEW_API_ENDPOINT}?slug=products/${query}`,
      method: 'post',
      cookies,
    })
    //console.log(response)
    return {
      product: response.result,
      snippets: response?.snippets ?? [],
    }
  }

  return getProductPreview
}