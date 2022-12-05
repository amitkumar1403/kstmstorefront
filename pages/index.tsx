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

      {/* Header Start */}
      <header>
        {/* Black Bar */}
        <div className="bg-black p-3">
          <div className="text-white text-center text-xs">
            SIGN UP TO OUR NEWSLETTER TO HEAR ABOUT NEW STUFF
          </div>
        </div>

        {/* Menu Bar */}
        <div className="flex flex-wrap place-items-center">
          <section className="relative mx-auto">
            {/* <!-- navbar --> */}
            <nav className="flex justify-between w-screen">
              <div className="px-5 xl:px-12 py-6 flex w-full items-center">
                {/* <!-- Nav Links --> */}
                <ul className="hidden md:flex px-4 font-semibold font-heading space-x-12">
                  <li>
                    <a className="hover:text-gray-800" href="#">
                      MENU
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-gray-800" href="#">
                      SHOP
                    </a>
                  </li>
                </ul>
                <a className="text-3xl font-bold font-heading mx-auto" href="#">
                  <img className="h-9" src="/image/logo.jpg" alt="logo" />
                </a>
                {/* <!-- Header Icons --> */}
                <div className="hidden xl:flex items-center space-x-5">
                  <a className="hover:text-gray-800" href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </a>
                  <a className="flex items-center hover:text-gray-500" href="#">
                    <svg
                      className="ml-auto h-5 px-4 text-gray-500"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="search"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      // className="svg-inline--fa fa-search fa-w-16 fa-9x"
                    >
                      <path
                        fill="currentColor"
                        d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"
                      ></path>
                    </svg>
                  </a>
                  <a className="flex items-center hover:text-gray-500" href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </a>
                  <a className="flex items-center hover:text-gray-500" href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="flex absolute -mt-5 ml-4">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                    </span>
                    0
                  </a>
                  {/* <!-- Sign In / Register      --> */}
                </div>
              </div>
              {/* <!-- Responsive navbar --> */}
              <a className="xl:hidden flex mr-6 items-center" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 hover:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="flex absolute -mt-5 ml-4">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
              </a>
              <a className="navbar-burger self-center mr-12 xl:hidden" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 hover:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </a>
            </nav>
            <hr />
          </section>
        </div>
        {/* <!-- Does this resource worth a follow? --> */}
        <div className="absolute bottom-0 right-0 mb-4 mr-4 z-10">
          <div>
            <a
              title="Follow me on twitter"
              href="https://www.twitter.com/asad_codes"
              target="_blank"
              className="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12"
            >
              <img
                className="object-cover object-center w-full h-full rounded-full"
                src="https://www.imore.com/sites/imore.com/files/styles/large/public/field/image/2019/12/twitter-logo.jpg"
              />
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* First Banner */}
        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-0">
          <div className="relative">
            <img src="/image/Banner1.jpg" alt="Picture of the author" />
            <div className="absolute bottom-0 left-0 h-16 w-16 mx-10">
              <h2 className="text-sm font-bold">MEN</h2>
            </div>
          </div>
          <div className="relative">
            <img src="/image/Banner2.jpg" alt="Picture of the author" />
            <div className="absolute bottom-0 left-0 h-16 w-16 mx-2">
              <h2 className="text-sm font-bold">WOMEN</h2>
            </div>
          </div>
        </div>

        {/* Sencond Banner */}
        <div className="grid lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 gap-0">
          <div className="relative border border-slate-300 hover:border-black">
            <Image
              src="/image/prod1.jpg"
              alt="Picture of the author"
              width={500}
              height={500}
            />
            <div className="absolute bottom-0 left-0 h-16 w-16 mx-10">
              <h2 className="text-sm font-bold">JOGGERS</h2>
            </div>
          </div>
          <div className="relative border border-slate-300 hover:border-black">
            <Image
              src="/image/prod2.jpg"
              alt="Picture of the author"
              width={500}
              height={500}
            />
            <div className="absolute bottom-0 left-0 h-16 w-16 mx-10">
              <h2 className="text-sm font-bold">SHORTS</h2>
            </div>
          </div>
          <div className="relative border border-slate-300 hover:border-black">
            <Image
              src="/image/prod3.jpg"
              alt="Picture of the author"
              width={500}
              height={500}
            />
            <div className="absolute bottom-0 left-0 h-16 w-16 mx-10">
              <h2 className="text-sm font-bold">TROUSERS</h2>
            </div>
          </div>
          <div className="relative border border-slate-300 hover:border-black">
            <Image
              src="/image/prod4.jpg"
              alt="Picture of the author"
              width={500}
              height={500}
            />
            <div className="absolute bottom-0 left-0 h-16 w-16 mx-10">
              <h2 className="text-sm font-bold">JUMPERS</h2>
            </div>
          </div>
        </div>

        {/* Banner 3 */}
        <div className="flex columns-auto">
          <img src="/image/slide1.jpg" alt="Picture of the author" />
        </div>

        {/* Banner 4 */}
        <div className="text-center mt-2">
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
              <div className="cursor-pointer w-64 inline-flex flex-col text-center lg:w-auto border border-slate-300 hover:border-black">
                <div className="group relative">
                  <div className="w-full bg-gray-200 rounded-md overflow-hidden aspect-w-1 aspect-h-1">
                    <img
                      priority
                      src="/image/Caru1.jpg"
                      alt="Picture of the author"
                      layout="responsive"
                      className="w-full h-full object-center object-cover"
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
              <div className="cursor-pointer w-64 inline-flex flex-col text-center lg:w-auto border border-slate-300 hover:border-black">
                <div className="group relative">
                  <div className="w-full bg-gray-200 rounded-md overflow-hidden aspect-w-1 aspect-h-1">
                    <img
                      priority
                      src="/image/Caru2.jpg"
                      alt="Picture of the author"
                      layout="responsive"
                      className="w-full h-full object-center object-cover"
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
              <div className="cursor-pointer w-64 inline-flex flex-col text-center lg:w-auto border border-slate-300 hover:border-black">
                <div className="group relative">
                  <div className="w-full bg-gray-200 rounded-md overflow-hidden aspect-w-1 aspect-h-1">
                    <img
                      priority
                      src="/image/Caru3.jpg"
                      alt="Picture of the author"
                      layout="responsive"
                      className="w-full h-full object-center object-cover"
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
              <div className="cursor-pointer w-64 inline-flex flex-col text-center lg:w-auto border border-slate-300 hover:border-black">
                <div className="group relative">
                  <div className="w-full bg-gray-200 rounded-md overflow-hidden aspect-w-1 aspect-h-1">
                    <img
                      priority
                      src="/image/Caru4.jpg"
                      alt="Picture of the author"
                      layout="responsive"
                      className="w-full h-full object-center object-cover"
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
              <div className="cursor-pointer w-64 inline-flex flex-col text-center lg:w-auto border border-slate-300 hover:border-black">
                <div className="group relative">
                  <div className="w-full bg-gray-200 rounded-md overflow-hidden aspect-w-1 aspect-h-1">
                    <img
                      priority
                      src="/image/Caru1.jpg"
                      alt="Picture of the author"
                      layout="responsive"
                      className="w-full h-full object-center object-cover"
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
              <div className="cursor-pointer w-64 inline-flex flex-col text-center lg:w-auto border border-slate-300 hover:border-black">
                <div className="group relative">
                  <div className="w-full bg-gray-200 rounded-md overflow-hidden aspect-w-1 aspect-h-1">
                    <img
                      priority
                      src="/image/Caru2.jpg"
                      alt="Picture of the author"
                      layout="responsive"
                      className="w-full h-full object-center object-cover"
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
              <div className="cursor-pointer w-64 inline-flex flex-col text-center lg:w-auto border border-slate-300 hover:border-black">
                <div className="group relative">
                  <div className="w-full bg-gray-200 rounded-md overflow-hidden aspect-w-1 aspect-h-1">
                    <img
                      priority
                      src="/image/Caru3.jpg"
                      alt="Picture of the author"
                      layout="responsive"
                      className="w-full h-full object-center object-cover"
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
              <div className="cursor-pointer w-64 inline-flex flex-col text-center lg:w-auto border border-slate-300 hover:border-black">
                <div className="group relative">
                  <div className="w-full bg-gray-200 rounded-md overflow-hidden aspect-w-1 aspect-h-1">
                    <img
                      priority
                      src="/image/Caru4.jpg"
                      alt="Picture of the author"
                      layout="responsive"
                      className="w-full h-full object-center object-cover"
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

      {/* Footer */}
         {/* Footer */}
         <footer>
        <div className="bg-black p-2 mt-5">
          <div className="grid grid-cols-2 gap-0 p-4 mt-5 pb-8">
            <div className="text-white mx-14">
              <h2 className="lg:text-2xl sm:text-lg md:text-xl lg:mt-3 lg:mb-2 md:mt-2 md:mb-1 sm:mt-1 sm:mb-1">HAVE A QUESTION ?</h2>
            </div>
            <div className="text-white">
              <div className="flex justify-center">
                <div className="xl:w-96 lg:mt-3 lg:mb-2 md:mt-2 md:mb-1 sm:mt-1 sm:mb-1">
                  <input
                    type="text"
                    className="h-12 form-control block w-full px-3 py-1.5 text-xs font-normal text-center text-white bg-black border border-solid border-gray-300 transition ease-in-out        m-0
        focus:text-white focus:bg-white focus:border-blue-600 focus:outline-none
      "
                    id="exampleText0"
                    placeholder="GET IN TOUCH"
                  />
                </div>
              </div>
            </div>
          </div>
          <hr className="text-white pb-6 pt-2" />
          //Footer
          <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-0">
            <div className='ml-14'>
              {' '}
              <div className="text-white mx-auto max-w-sm lg:max-w-none">
                <p className="text-white lg:text-left lg:text-xl md:text-lg dm:text-lg">
                  KSTMise your inbox
                </p>
                <p className="text-sm text-white text-left">
                  New products & perspectives straight to your inbox
                </p>
                <div className='flex'>
                <table className="w-2/5 h-20 mt-5 border-solid border-2 border-white p-5">
                  <tbody>
                    <tr className="border-solid border-2 text-md">
                      <td className="border-solid border-2 mx-2 px-14 pt-2 pb-2">
                        EMAIL
                      </td>
                      <td className="border-solid border-2 mx-2 px-14 pt-2 pb-2">
                        NAME
                      </td>
                    </tr>
                    <tr className="border-solid border-2 text-md">
                      <td
                        colspan="2"
                        className="pt-2 pb-2 mx-auto whitespace-nowrap text-center border-r font-bold"
                      >
                        SUBSCRIBE
                      </td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-0 text-center lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 lg:text-left pb-8">
                <div className="mx-14 mt-5">
                  <strong className="lg:px-6 md:px-6 sm:px-6 text-white lg:text-xl md:text-lg sm:text-xs xs:text-xs mx-5">
                    CUSTOMER
                  </strong>
                  <nav
                    aria-label="Footer Services Nav"
                    className="mt-6 flex flex-col space-y-3 mx-14 lg-text-sm md:text-xs sm:text-xs mx-6"
                  >
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="/"
                    >
                      My Account
                    </a>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="/"
                    >
                      Our Mission
                    </a>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="/"
                    >
                      Transparency
                    </a>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="/"
                    >
                      Size Guide
                    </a>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="/"
                    >
                      Shipping
                    </a>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="/"
                    >
                      FAQs
                    </a>
                  </nav>
                </div>
                <div className="mx-10 mt-5">
                  <strong className="lg:px-8 md:px-8 sm:px-8 text-white lg:text-xl md:text-lg sm:text-xs xs:text-xs mx-6">
                    {' '}
                    KSTM{' '}
                  </strong>
                  <nav
                    aria-label="Footer About Nav"
                    className="mt-6 flex flex-col space-y-3 mx-14 text-sm"
                  >
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="/"
                    >
                      My Account
                    </a>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="/"
                    >
                      Our Mission
                    </a>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="/"
                    >
                      Transparency
                    </a>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="/"
                    >
                      Size Guide
                    </a>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="/"
                    >
                      Shipping
                    </a>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="/"
                    >
                      FAQs
                    </a>
                  </nav>
                </div>
                <div className='mt-5'>
                  <strong className="text-white lg:text-xl md:text-lg sm:text-xs xs:text-xs mx-5">
                    {' '}
                    LEGAL{' '}
                  </strong>
                  <nav
                    aria-label="Footer Support Nav"
                    className="mt-6 flex flex-col space-y-3 mx-5 text-sm"
                  >
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="/"
                    >
                      Terms
                    </a>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="/"
                    >
                      Privacy
                    </a>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="/"
                    >
                      Consent
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <hr className="text-white mt-5" />
          {/* //copy right */}
          <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 gap-0 pt-4 pb-4 mr-14 lg:text-2xl sm:text-sm md:text-xl">
            <div className="mx-14">
              {' '}
              <p className="text-2xl font-bold mt-0 font-heading text-white align-middle">
                @2022{' '}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold mt-0 font-heading text-center mx-auto text-white align-middle">
                KSTM
              </p>
            </div>
            <div className="flex">
            <ul className='flex items-center justify-center social-icon sm:justify-between'>
               <li className='inline-block mr-1 align-middle'><a rel="noreferrer" target="_blank" href="https://www.facebook.com/Damenschofficial/" className='inline-block'><i className='sprite-icon sprite-fb'></i></a></li>
               <li className='inline-block mr-1 align-middle'><a rel="noreferrer" target="_blank" href="https://twitter.com/damensch_in?lang=en" className='inline-block'><i className='sprite-icon sprite-twitter'></i></a></li>
               <li className='inline-block mr-1 align-middle'><a rel="noreferrer" target="_blank" href="https://www.instagram.com/damenschofficial/" className='inline-block'><i className='sprite-icon sprite-insta'></i></a></li>
               <li className='inline-block mr-1 align-middle'><a rel="noreferrer" target="_blank" href="https://www.youtube.com/channel/UCmHTYSGgtCijnH82npTrCJw" className='inline-block'><i className='sprite-icon sprite-tic'></i></a></li>
               <li className='inline-block align-middle'><a rel="noreferrer" target="_blank" href="https://www.linkedin.com/company/damensch" className='inline-block'><i className='sprite-icon sprite-shopify'></i></a></li>
            </ul>
            </div>
          </div>
        </div>
      </footer>
   </>
  )
}
Home.Layout = Layout

export default withDataLayer(Home, PAGE_TYPE)
