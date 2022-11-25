import commerce from '@lib/api/commerce'

export default async (req: any, res: any) => {
  try {
    const response = await commerce.createReview(req.body, req.cookies)
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
}
