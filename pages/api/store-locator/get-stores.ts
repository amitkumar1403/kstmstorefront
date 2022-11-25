import getStores from '@framework/storeLocator/getStores'

export default async function getStoresMiddleware(req: any, res: any) {
  const { postCode } = req.body // == const postCode = req.body.postCode
  try {
    const response = await getStores(postCode)
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json(error)
  }
}
