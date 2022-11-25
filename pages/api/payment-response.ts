import { putPaymentResponse } from '@framework/payment'
export default async (req: any, res: any) => {
  const { orderId, model }: any = req.body
  try {
    const response = await putPaymentResponse()({
      orderId,
      model,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
