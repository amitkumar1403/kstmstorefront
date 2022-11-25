import { useValidateToken } from '@framework/customer'

export default async function ValidateToken(req: any, res: any) {
  try {
    const response = await useValidateToken(req.body.token, req.cookies)
    res.status(200).json({ response })
  } catch (error) {
    res.status(500).json({ error: 'Woops! something went wrong' })
  }
}
