import commerce from '@lib/api/commerce'

export default async (req: any, res: any) => {
  try {
    console.group(req.body, 'req body')
    const response = await commerce.editAddress({
      query: req.body,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error, 'error')
    res.status(500).json({ error })
  }
}
