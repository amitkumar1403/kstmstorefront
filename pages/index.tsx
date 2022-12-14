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

  // // ---- Display data from content entries ----
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
      <div className="grid gap-0 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 mt-10">
        {pageContents?.topbanner.map((topbanners: any, hid: number) => (
          <Link href={topbanners.topbanner_link}>
            <div className="relative" key={hid}>
              <img src={topbanners.topbanner_image} alt="" />
              <div className="absolute bottom-0 left-0 w-16 h-16 mx-10">
                <h2 className="text-sm font-bold">
                  {topbanners.topbanner_title}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* categorylist */}
      <div className="grid gap-0 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2">
        {pageContents?.categorylist.map((category: any, id: number) => (
          <Link href={category.categorylist_link}>
            <div
              className="relative border border-slate-300 hover:border-black"
              key={id}
            >
              <img src={category.categorylist_image} alt="" />
              <div className="absolute bottom-0 left-0 w-16 h-16 mx-10">
                <h2 className="text-sm font-bold">
                  {category.categorylist_title}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Banner */}
      {pageContents?.banner.map((banner: any, sid: number) => (
        <Link href={banner.link}>
          <div className="flex columns-auto" key={sid}>
            <img src={banner.url} alt="" />
          </div>
        </Link>
      ))}

      {/* Headings */}
      {pageContents?.heading.map((headings: any, pid: number) => (
        <div className="mt-2 text-center" key={pid}>
          <h2 className="text-lg font-bold">{headings.heading_title}</h2>
          <div
            className=""
            dangerouslySetInnerHTML={{ __html: headings.heading_subtitle }}
          ></div>
        </div>
      ))}

      {/* Carusal */}
      <div className="flex flex-col px-4 py-4 pr-0 sm:px-4 sm:pr-4 sm:py-8 home-banner-swiper m-hide-navigation">
        <Swiper
          slidesPerView={4}
          spaceBetween={10}
          navigation={true}
          loop={false}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            480: {
              slidesPerView: 2,
            },
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 4,
            },
            1520: {
              slidesPerView: 4,
            },
          }}
        >
          {pageContents?.productcollection.map((item: any, gid: number) => (
            <SwiperSlide>
              <div
                className="inline-flex flex-col w-64 text-center border cursor-pointer lg:w-auto border-slate-300 hover:border-black"
                key={gid}
              >
                <div className="relative group">
                  <Link href={item.slug}>
                    <div className="w-full overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1">
                      <img
                        src="/image/Caru1.jpg"
                        // src={item.image || IMG_PLACE}
                        alt={item.name}
                        className="object-cover object-center w-full h-full"
                      />
                    </div>
                  </Link>
                  <div className="mt-6">
                    <h3 className="mt-1 font-semibold text-gray-900">
                      <span className="absolute inset-0" />
                      {item.name}
                    </h3>
                    {item?.price?.formatted?.withTax}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  )
}
Home.Layout = Layout

export default withDataLayer(Home, PAGE_TYPE)
