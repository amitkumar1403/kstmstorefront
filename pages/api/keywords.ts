import useKeywords from '@framework/api/endpoints/keywords'
export default async (req: any, res: any) => {
  try {
    const response = await useKeywords(req.cookies)
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error })
  }
}
