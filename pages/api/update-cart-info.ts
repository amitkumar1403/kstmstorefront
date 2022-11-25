import { useUpdateCartInfo } from '@framework/cart'
export default async (req: any, res: any) => {
  const { basketId, info, lineInfo }: any = req.body
  try {
    const response = await useUpdateCartInfo()({
      basketId,
      info,
      lineInfo,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
