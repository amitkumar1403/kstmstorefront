import { useAddItem } from '@framework/cart'
export default async (req: any, res: any) => {
  const {
    basketId,
    productId,
    qty,
    manualUnitPrice,
    displayOrder,
    stockCode,
  }: any = req.body.data
  try {
    const response = await useAddItem()({
      basketId,
      productId,
      qty,
      manualUnitPrice,
      displayOrder,
      stockCode,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
