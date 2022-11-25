import { clickAndCollect } from '@framework/shipping'

interface BodyProps {
  items: []
  postCode: string
}

export default async (req: any, res: any) => {
  const { items, postCode }: any = req.body
  try {
    const response = await clickAndCollect()({
      items,
      postCode,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
