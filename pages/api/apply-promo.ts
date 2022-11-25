import commerce from '@lib/api/commerce'

export default async (req: any, res: any) => {
  try {
    const response = await commerce.applyPromo({
      basketId: req.body.basketId,
      promoCode: req.body.promoCode,
      method: req.body.method,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
