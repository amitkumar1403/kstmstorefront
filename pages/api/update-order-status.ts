import { updateOrder } from '@framework/checkout/update-order'

export default async function updateOrderStatus(req: any, res: any) {
  try {
    await updateOrder(req.body.id, req.body.paymentIntent)
    res.status(200).json({ updated: true })
  } catch (error) {
    console.log(error)
  }
}
