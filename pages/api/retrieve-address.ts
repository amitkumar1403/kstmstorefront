import { retrieveAddress } from '@framework/checkout'
export default async (req: any, res: any) => {
  const { id }: any = req.body
  try {
    const response = await retrieveAddress()(id, req.cookies)
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
}
