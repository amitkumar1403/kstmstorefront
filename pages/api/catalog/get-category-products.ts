import { getCategoryProducts } from '@framework/api/operations'

export default async function categoryProducts(req: any, res: any) {
  try {
    const response = await getCategoryProducts(req.body.categoryId, req.cookies)
    res.status(200).json(response)
  } catch (error) {
    return { error }
  }
}
