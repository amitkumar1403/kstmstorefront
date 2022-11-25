import searchProducts from '@framework/api/operations/search-product'
export default async (req: any, res: any) => {
  const { value }: any = req.body
  try {
    const response = await searchProducts()({
      value,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
