import { useEffect } from 'react'
import DataLayerInstance, { KEYS_MAP } from '@components/utils/dataLayer'
import { Layout } from '@components/common'

export const PAGE_TYPES = {
  Blog: 'Blog',
  Brand: 'Brand',
  Category: 'Category',
  Checkout: 'Checkout',
  Common: 'Common',
  Home: 'Home',
  Page: 'Page',
  Product: 'Product',
  Search: 'Search',
  Survey: 'Survey',
}
export default function withDataLayer(
  Component: any,
  pageType: string,
  showLayout = true
) {
  function WrappedComponent(props: any) {
    useEffect(() => {
      DataLayerInstance.setItemInDataLayer('pageCategory', pageType)
    }, [])

    const setEntities = (entities: any) => {
      DataLayerInstance.setEntities(entities)
    }
    const recordEvent = (event: string) =>
      DataLayerInstance.setItemInDataLayer(KEYS_MAP.eventType, event)

    return (
      <Component
        {...props}
        setEntities={setEntities}
        recordEvent={recordEvent}
      />
    )
  }

  if (showLayout) {
    WrappedComponent.Layout = Layout
  }
  return WrappedComponent
}
