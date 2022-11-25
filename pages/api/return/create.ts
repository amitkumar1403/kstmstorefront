import createReturn from '@framework/return/create'

export default async function createReturnEndpoint(req: any, res: any) {
  try {
    const response = await createReturn(req.body.model, req.cookies)
    res.status(200).json({ response })
  } catch (error) {
    res.status(500).json({ error })
  }
}
