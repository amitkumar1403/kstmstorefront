import { getOrderDetails } from '@framework/checkout'
export default async (req: any, res: any) => {
  const { id }: any = req.body
  try {
    const response: any = await getOrderDetails()(id, req.cookies)
    res.status(200).json({ order: response.result })
  } catch (error) {
    res.status(500).json({ error })
  }
}
