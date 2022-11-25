import { loginCheckout } from '@framework/cart'
export default async (req: any, res: any) => {
  const { basketId, email, password }: any = req.body
  try {
    const response = await loginCheckout()({
      basketId,
      email,
      password,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
