import getSingleLookbook from '@framework/api/content/singleLookbook'

export default async (req: any, res: any) => {
  const { slug } = req.body
  try {
    const response = await getSingleLookbook(slug, req.cookies)
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
