import { useCart } from '@framework/cart'
export default async (req: any, res: any) => {
  const { basketId }: any = req.query
  try {
    const response = await useCart()({
      basketId,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
