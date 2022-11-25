import getReturnData from '@framework/return/get-return-data'

export default async function createReturnEndpoint(req: any, res: any) {
  try {
    const response = await getReturnData(req.body.orderId, req.cookies)
    res.status(200).json({ response })
  } catch (error) {
    res.status(500).json({ error })
  }
}
