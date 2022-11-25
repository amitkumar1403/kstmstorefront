import { useResetPassword } from '@framework/customer'

export default async function ResetPassword(req: any, res: any) {
  try {
    const response = await useResetPassword(req.body, req.cookies)
    res.status(200).json({ response })
  } catch (error) {
    res.status(500).json({ error })
  }
}
