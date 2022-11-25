import store from 'store'

export default async (req: any, res: any) => {
  const { obj } = req.body
  try {
    Object.keys(obj).forEach((item: any) => {
      store.set(item, obj[item])
    })
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error })
  }
}
