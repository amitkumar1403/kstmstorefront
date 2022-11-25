import { useLogin } from '@framework/auth'
export default async (req: any, res: any) => {
  const { email, password }: any = req.body.data
  try {
    const response = await useLogin()({
      email,
      password,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error: any) {
    throw new Error(error)
  }
}
