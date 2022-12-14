// Base Imports
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { GetStaticPropsContext } from 'next'
import dynamic from 'next/dynamic'
import { IMG_PLACE } from '@components/utils/textVariables'
//
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

// Other Imports
import commerce from '@lib/api/commerce'
import {
  HOMEPAGE_SLUG,
  HOME_PAGE_DEFAULT_SLUG,
} from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
const Layout = dynamic(() => import('@components/common/Layout'))
const Loader = dynamic(() => import('@components/ui/LoadingDots'))
import { useState } from 'react'
import SearchProductCard from '@components/product/ProductCard/SearchProductCard'
import ProductCard from '@components/product/ProductCard/HomeProductCart'
export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const slugsPromise = commerce.getSlugs({ slug: HOMEPAGE_SLUG })
  const slugs = await slugsPromise
  const infraPromise = commerce.getInfra()
  const infra = await infraPromise

  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  // ---- Display data from content entries ----
  // const id = "05905b59-84a7-41a3-b992-5137c11f86f7";
  // const PageContentsPromise = commerce.getPageContent({ id: id, slug: slugs?.slug });
  // const pageContents = await PageContentsPromise;

  // ---- Display data from pages ----
  //const pageId = "7c79d1b2-53e1-4435-a64f-8298446f3546";

  const PageContentsPromise = commerce.getPagePreviewContent({
    id: '08a007a7-ffeb-4502-ad1d-c1dcb6f1ca2a', //pageId,
    slug: HOME_PAGE_DEFAULT_SLUG, //slugs?.slug,
    workingVersion: process.env.NODE_ENV === 'production' ? true : true, // TRUE for preview, FALSE for prod.
  })
  const pageContents = await PageContentsPromise

  return {
    props: {
      categories,
      brands,
      pages,
      slugs,
      globalSnippets: infra?.snippets ?? [],
      snippets: slugs?.snippets ?? [],
      pageContents: pageContents ?? {},
    },
    revalidate: 60,
  }
}

const PAGE_TYPE = PAGE_TYPES.Home

function Home({
  slugs,
  setEntities,
  recordEvent,
  ipAddress,
  pageContents,
}: any) {
  const { PageViewed } = EVENTS_MAP.EVENT_TYPES
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
  })

  return !pageContents ? (
    <>
      <div className="flex w-full text-center flex-con">
        <Loader />
      </div>
    </>
  ) : (
    <>

      {/* <p>{JSON.stringify(pageContents)}</p> */}
      {/* topbanner */}
      <div className="grid gap-0 mt-10 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
        {pageContents?.topbanner?.map((topbanners: any, hid: number) => (
          <Link href={topbanners?.topbanner_link} passHref key={hid}>
            <a>
              <div className="relative h-full w-full bg-gray-100">
                <img src={topbanners?.topbanner_image} alt={topbanners?.topbanner_title} className='w-full h-full object-contain'/>
                <div className="absolute z-99 top-4 left-4">
                  <h2 className="text-xl">
                    {topbanners?.topbanner_title}
                  </h2>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>

      {/* categorylist */}
      <div className="grid gap-0 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2">
        {pageContents?.categorylist?.map((category: any, id: number) => (
          <Link href={category?.categorylist_link} passHref key={id}>
            <a>
              <div className="relative">
                <div className="absolute z-99 top-4 left-4">
                  <h2 className="text-xl">
                    {category?.categorylist_title}
                  </h2>
                </div>
                <div style={{position: 'relative'}}>
                  <Image
                    priority
                    src={category?.categorylist_image || ""} 
                    alt={category?.categorylist_title || ""}
                    layout='responsive'
                    width={600}
                    height={800}
                  />
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>

      {/* Banner */}
      {pageContents?.banner?.map((banner: any, sid: number) => (
        <Link href={banner?.link} key={sid} passHref><a>
          <div className="flex columns-auto">
            <img src={banner?.url} alt="" />
          </div></a>
        </Link>
      ))}

      {/* Headings */}
      {pageContents?.heading?.map((headings: any, pid: number) => (
        <div className="px-6 py-9 flex items-end gap-2" key={pid}>
          <h2 className="text-xl capitalize">{headings?.heading_title?.toLowerCase()}</h2>
          <div className="text-sm capitalize text-gray-500" dangerouslySetInnerHTML={{ __html: headings?.heading_subtitle?.toLowerCase() }}></div>
        </div>
      ))}

      {/* Carusal */}
      {/* <div className="grid grid-cols-4 gap-4">
        {pageContents?.productcollection.map((item: any, gid: number) => (
          <SearchProductCard key={gid} product={item} />
        ))}
      </div> */}

      <div className="flex flex-col w-full home-banner-swiper m-hide-navigation swiper-slide-home">
        <Swiper
          slidesPerView={4}
          navigation={true}
          loop={false}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="mySwier"
        >
          {pageContents?.productcollection?.map((item: any, gid: number) => (
            <>
              <SwiperSlide key={gid}>
                <div className="grid grid-cols-1 text-left">
                  <ProductCard key={gid} product={item} />
                </div>
              </SwiperSlide>
            </>
          ))}
        </Swiper>
      </div>
    </>
  )
}
Home.Layout = Layout

export default withDataLayer(Home, PAGE_TYPE)
