import dynamic from 'next/dynamic'
// Base Imports
import React from 'react'
import type { GetStaticPropsContext } from 'next'
import Image from 'next/image'

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
import { Layout } from '@components/common'
import { Hero } from '@components/ui'
import { HOMEPAGE_SLUG } from '@components/utils/constants'
const ProductSlider = dynamic(() => import('@components/product/ProductSlider'))
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'


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

  return {
    props: {
      categories,
      brands,
      pages,
      slugs,
      globalSnippets: infra?.snippets ?? [],
      snippets: slugs?.snippets,
    },
    revalidate: 60,
  }
}

const PAGE_TYPE = PAGE_TYPES.Home

function Home({ slugs, setEntities, recordEvent, ipAddress }: any) {
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

  return (
    <>
      {/* <Hero banners={slugs?.components[0]?.images} />
      <ProductSlider
        config={slugs?.components?.find((i?: any) => i.componentType === 52)}
      /> */}
     
      <main>
        {/* First Banner */}
        <div className="grid gap-0 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2">
          <div className="relative">
            <img src="/image/Banner1.jpg" alt="Picture of the author" />
            <div className="absolute bottom-0 left-0 w-16 h-16 mx-10">
              <h2 className="text-sm font-bold">MEN</h2>
            </div>
          </div>
          <div className="relative">
            <img src="/image/Banner2.jpg" alt="Picture of the author" />
            <div className="absolute bottom-0 left-0 w-16 h-16 mx-2">
              <h2 className="text-sm font-bold">WOMEN</h2>
            </div>
          </div>
        </div>

        {/* Sencond Banner */}
        <div className="grid gap-0 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2">
          <div className="relative border border-slate-300 hover:border-black">
            <img
              src="/image/prod1.jpg"
              alt="Picture of the author"
              width={500}
              height={500}
            />
            <div className="absolute bottom-0 left-0 w-16 h-16 mx-10">
              <h2 className="text-sm font-bold">JOGGERS</h2>
            </div>
          </div>
          <div className="relative border border-slate-300 hover:border-black">
            <img
              src="/image/prod2.jpg"
              alt="Picture of the author"
              width={500}
              height={500}
            />
            <div className="absolute bottom-0 left-0 w-16 h-16 mx-10">
              <h2 className="text-sm font-bold">SHORTS</h2>
            </div>
          </div>
          <div className="relative border border-slate-300 hover:border-black">
            <img
              src="/image/prod3.jpg"
              alt="Picture of the author"
              width={500}
              height={500}
            />
            <div className="absolute bottom-0 left-0 w-16 h-16 mx-10">
              <h2 className="text-sm font-bold">TROUSERS</h2>
            </div>
          </div>
          <div className="relative border border-slate-300 hover:border-black">
            <img
              src="/image/prod4.jpg"
              alt="Picture of the author"
              width={500}
              height={500}
            />
            <div className="absolute bottom-0 left-0 w-16 h-16 mx-10">
              <h2 className="text-sm font-bold">JUMPERS</h2>
            </div>
          </div>
        </div>

        {/* Banner 3 */}
        <div className="flex columns-auto">
          <img src="/image/slide1.jpg" alt="Picture of the author" />
        </div>

        {/* Banner 4 */}
        <div className="mt-2 text-center">
          <h2 className="text-lg font-bold">SHOP FRESH</h2>
          <p className="font-bold">View all</p>
        </div>

        {/* Carusal */}
        <div className="flex flex-col px-4 py-4 pr-0 sm:px-4 sm:pr-4 sm:py-8 home-banner-swiper m-hide-navigation">
          <Swiper
            slidesPerView={4}
            spaceBetween={10}
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
              1520: {
                slidesPerView: 4,
              },
            }}
          >
            <SwiperSlide>
              <div className="inline-flex flex-col w-64 text-center border cursor-pointer lg:w-auto border-slate-300 hover:border-black">
                <div className="relative group">
                  <div className="w-full overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1">
                    <img
                      src="/image/Caru1.jpg"
                      alt="Picture of the author"
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                  <div className="mt-6">
                    <h3 className="mt-1 font-semibold text-gray-900">
                      <span className="absolute inset-0" />
                      Hoodie Urban
                    </h3>
                    <p className="mt-1 text-gray-900">£75</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="inline-flex flex-col w-64 text-center border cursor-pointer lg:w-auto border-slate-300 hover:border-black">
                <div className="relative group">
                  <div className="w-full overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1">
                    <img
                      src="/image/Caru2.jpg"
                      alt="Picture of the author"
                      className="object-cover object-center w-full h-full"
                    ></img>
                  </div>
                  <div className="mt-6">
                    <h3 className="mt-1 font-semibold text-gray-900">
                      <span className="absolute inset-0" />
                      Joggers Urban
                    </h3>
                    <p className="mt-1 text-gray-900">£50</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="inline-flex flex-col w-64 text-center border cursor-pointer lg:w-auto border-slate-300 hover:border-black">
                <div className="relative group">
                  <div className="w-full overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1">
                    <img
                      src="/image/Caru3.jpg"
                      alt="Picture of the author"
                      className="object-cover object-center w-full h-full"
                    ></img>
                  </div>
                  <div className="mt-6">
                    <h3 className="mt-1 font-semibold text-gray-900">
                      <span className="absolute inset-0" />
                      Jumper Urban
                    </h3>
                    <p className="mt-1 text-gray-900">£60</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="inline-flex flex-col w-64 text-center border cursor-pointer lg:w-auto border-slate-300 hover:border-black">
                <div className="relative group">
                  <div className="w-full overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1">
                    <img
                      src="/image/Caru4.jpg"
                      alt="Picture of the author"
                      className="object-cover object-center w-full h-full"
                    ></img>
                  </div>
                  <div className="mt-6">
                    <h3 className="mt-1 font-semibold text-gray-900">
                      <span className="absolute inset-0" />
                      Hoodie Ocean
                    </h3>
                    <p className="mt-1 text-gray-900">£65</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="inline-flex flex-col w-64 text-center border cursor-pointer lg:w-auto border-slate-300 hover:border-black">
                <div className="relative group">
                  <div className="w-full overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1">
                    <img
                      src="/image/Caru1.jpg"
                      alt="Picture of the author"
                      className="object-cover object-center w-full h-full"
                    ></img>
                  </div>
                  <div className="mt-6">
                    <h3 className="mt-1 font-semibold text-gray-900">
                      <span className="absolute inset-0" />
                      Hoodie Urban
                    </h3>
                    <p className="mt-1 text-gray-900">£75</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="inline-flex flex-col w-64 text-center border cursor-pointer lg:w-auto border-slate-300 hover:border-black">
                <div className="relative group">
                  <div className="w-full overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1">
                    <img
                      src="/image/Caru2.jpg"
                      alt="Picture of the author"
                      className="object-cover object-center w-full h-full"
                    ></img>
                  </div>
                  <div className="mt-6">
                    <h3 className="mt-1 font-semibold text-gray-900">
                      <span className="absolute inset-0" />
                      Joggers Urban
                    </h3>
                    <p className="mt-1 text-gray-900">£50</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="inline-flex flex-col w-64 text-center border cursor-pointer lg:w-auto border-slate-300 hover:border-black">
                <div className="relative group">
                  <div className="w-full overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1">
                    <img
                      src="/image/Caru3.jpg"
                      alt="Picture of the author"
                      className="object-cover object-center w-full h-full"
                    ></img>
                  </div>
                  <div className="mt-6">
                    <h3 className="mt-1 font-semibold text-gray-900">
                      <span className="absolute inset-0" />
                      Jumper Urban
                    </h3>
                    <p className="mt-1 text-gray-900">£60</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="inline-flex flex-col w-64 text-center border cursor-pointer lg:w-auto border-slate-300 hover:border-black">
                <div className="relative group">
                  <div className="w-full overflow-hidden bg-gray-200 rounded-md aspect-w-1 aspect-h-1">
                    <img
                      src="/image/Caru4.jpg"
                      alt="Picture of the author"
                      className="object-cover object-center w-full h-full"
                    ></img>
                  </div>
                  <div className="mt-6">
                    <h3 className="mt-1 font-semibold text-gray-900">
                      <span className="absolute inset-0" />
                      Hoodie Ocean
                    </h3>
                    <p className="mt-1 text-gray-900">£65</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </main>
   </>
  )
}
Home.Layout = Layout

export default withDataLayer(Home, PAGE_TYPE)
