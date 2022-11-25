import { guestCheckout } from '@framework/cart'
export default async (req: any, res: any) => {
  const { basketId, email, notifyByEmail, notifyBySms, notifyByPost }: any =
    req.body
  try {
    const response = await guestCheckout()({
      basketId,
      email,
      notifyByEmail,
      notifyBySms,
      notifyByPost,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
