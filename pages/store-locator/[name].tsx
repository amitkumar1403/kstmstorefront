import { Layout } from '@components/common'
import type { GetStaticPropsContext } from 'next'
import getStores from '@framework/storeLocator/getStores'

interface Props {
  data: any
}

export default function StoreLocatorDetailsPage({ data }: Props) {
  if (!data) return null

  return (
    <div className="text-gray-900">
      <h1>{data.name}</h1>
      <h1>{data.availableToCollectIn}</h1>

      <h1>{data.postCode}</h1>
    </div>
  )
}

export async function getStaticPaths() {
  //this would require an endpoint to fetch all existing stores
  const response = await getStores('')
  return {
    paths: response ? response?.map((store: any) => `/store-locator/${store.name}`) : [],
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  //this would require an endpoint to fetch a specific store
  const response = await getStores('')
  return {
    props: { data: response[0] },
  }
}

StoreLocatorDetailsPage.Layout = Layout
