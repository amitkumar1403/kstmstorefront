import dynamic from 'next/dynamic'
// Base Imports
import React from 'react'
import type { GetStaticPropsContext } from 'next'

// Other Imports
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Hero } from '@components/ui'
import { HOMEPAGE_SLUG } from '@components/utils/constants'
const  ProductSlider  = dynamic(() => import('@components/product/ProductSlider'));
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales };
  const slugsPromise = commerce.getSlugs({ slug: HOMEPAGE_SLUG });
  const slugs = await slugsPromise;
  const infraPromise = commerce.getInfra();
  const infra = await infraPromise;

  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  return {
    props: {
      categories,
      brands,
      pages,
      slugs,
      globalSnippets: infra?.snippets ?? [],
      snippets: slugs?.snippets
    },
    revalidate: 60,
  }
}

const PAGE_TYPE = PAGE_TYPES.Home

function Home({ slugs, setEntities, recordEvent, ipAddress }: any) {
  const { PageViewed } = EVENTS_MAP.EVENT_TYPES;

  useAnalytics(PageViewed, {
    entity: JSON.stringify({
      id: slugs?.id,
      name: slugs?.name,
      metaTitle: slugs?.metaTitle,
      MetaKeywords: slugs?.metaKeywords,
      MetaDescription: slugs?.metaDescription,
      Slug: slugs?.slug,
      Title: slugs?.title,
      ViewType: slugs?.viewType,
    }),
    entityName: PAGE_TYPE,
    pageTitle: slugs?.title,
    entityType: 'Page',
    entityId: slugs?.id,
    eventType: 'PageViewed',
  });

  return (
    <>
      <Hero banners={slugs?.components[0]?.images} />
      <ProductSlider
        config={slugs?.components?.find((i?: any) => i.componentType === 52)}
      />
    </> 
  )
}

Home.Layout = Layout

export default withDataLayer(Home, PAGE_TYPE)
