import { useForgotPassword } from '@framework/customer'

export default async function ForgotPassword(req: any, res: any) {
  const { email } = req.body
  const response = await useForgotPassword(email, req.cookies)
  res.status(200).json(response)
  try {
  } catch (error) {
    console.log(error, 'error inside pages/api/customer/forgot-password')
    res.status(500).json({ error: 'Woops! something went wrong' })
  }
}
