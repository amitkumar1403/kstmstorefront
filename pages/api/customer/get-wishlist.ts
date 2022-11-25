import commerce from '@lib/api/commerce'

export default async (req: any, res: any) => {
  try {
    const response = await commerce.getWishlist({
      query: req.body,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error, 'error')
    res.status(500).json({ error })
  }
}
