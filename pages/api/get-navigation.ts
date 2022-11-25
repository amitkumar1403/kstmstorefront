import getNavTree from '@framework/api/content/getNavTree'

export default async (req: any, res: any) => {
  try {
    const response = await getNavTree(req.cookies)
    res.status(200).json({ nav: response.header, footer: response.footer })
  } catch (error) {
    res.status(500).json({ error })
  }
}
