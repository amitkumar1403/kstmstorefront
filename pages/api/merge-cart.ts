import { mergeCart } from '@framework/cart'
export default async (req: any, res: any) => {
  const { userBasketId, currentBasketId }: any = req.body.data
  try {
    const response = await mergeCart()({
      userBasketId,
      currentBasketId,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
