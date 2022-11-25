import { useShipping } from '@framework/checkout'
export default async (req: any, res: any) => {
  const { basketId, countryCode, postCode, method }: any = req.body
  try {
    const response = await useShipping()({
      basketId,
      countryCode,
      postCode,
      cookies: req.cookies,
      method,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
