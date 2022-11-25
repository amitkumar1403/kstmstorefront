import { GetServerSideProps } from 'next'
import getBrandBySlug from '@framework/api/endpoints/catalog/getBrandBySlug'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import {
  PlainText,
  ProductCollection,
  Video,
  Image,
  ImageCollection,
} from '@components/brand'
import React from 'react'
import commerce from '@lib/api/commerce'

const COMPONENTS_MAP: any = {
  PlainText: (props: any) => <PlainText {...props} />,
  ProductCollection: (props: any) => <ProductCollection {...props} />,
  Video: (props: any) => <Video {...props} />,
  ImageBanner: (props: any) => <Image {...props} />,
  ImageCollection: (props: any) => <ImageCollection {...props} />,
  undefined: () => null,
}

function BrandPage({ brandDetails }: any) {
  const widgetsConfig = JSON.parse(brandDetails.result.widgetsConfig).sort(
    (a: any, b: any) => a.displayOrder - b.displayOrder
  )

  return (
    <>
      {widgetsConfig.map((widget: any, idx: number) => {
        const enhancedProps = { ...widget, brandDetails: brandDetails.result }
        return (
          <div key={idx}>
            {COMPONENTS_MAP[widget.manufacturerSettingType]
              ? COMPONENTS_MAP[widget.manufacturerSettingType](enhancedProps)
              : null}
          </div>
        )
      })}
    </>
  )
}

const PAGE_TYPE = PAGE_TYPES['Brand']

export default withDataLayer(BrandPage, PAGE_TYPE)

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const slug: any = context?.query?.pages[0] || ''
  const response = await getBrandBySlug(slug, context.req.cookies)

  const infraPromise = commerce.getInfra();
  const infra = await infraPromise;
  return {
    props: {
      query: context.query,
      brandDetails: response,
      globalSnippets: infra?.snippets ?? [],
      snippets: response?.snippets
    }, // will be passed to the page component as props
  }
}
