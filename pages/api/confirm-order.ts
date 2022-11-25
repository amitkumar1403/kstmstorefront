import { confirmOrder } from '@framework/checkout'
export default async (req: any, res: any) => {
  const { basketId, model }: any = req.body
  try {
    const response = await confirmOrder()({
      basketId,
      model,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
