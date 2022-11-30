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
      <footer>
        <div className="bg-black p-2 mt-5">
          <div className="grid grid-cols-2 gap-0 p-4 mt-5">
            <div className="text-white mx-14">
              <h2 className="text-lg mt-3 mb-2">HAVE A QUESTION?</h2>
            </div>
            <div className="text-white">
              <div className="flex justify-center">
                <div className="mb-3 xl:w-96 mt-3">
                  <input
                    type="text"
                    className="form-control block w-full px-3 py-1.5 text-xs font-normal text-center text-white bg-black border border-solid border-gray-300 transition ease-in-out        m-0
        focus:text-white focus:bg-white focus:border-blue-600 focus:outline-none
      "
                    id="exampleText0"
                    placeholder="GET IN TOUCH"
                  />
                </div>
              </div>
            </div>
          </div>
          <hr className="text-white" />
          //Footer
          <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-0">
            <div>
              {' '}
              <div className="text-white mx-auto max-w-sm lg:max-w-none">
                <p className="mx-14 mt-4 text-white lg:text-left lg:text-lg">
                  KSTMise your inbox
                </p>
                <p className="mx-14 text-xs mt-0 text-white text-left">
                  New products & perspectives straight to your inbox
                </p>

                <table className="mx-14 mt-5 border-solid border-2 border-white p-5 text-xs">
                  <tbody>
                    <tr className="border-solid border-2 text-xs">
                      <td className="border-solid border-2 mx-2 px-14 pt-2 pb-2">
                        EMAIL
                      </td>
                      <td className="border-solid border-2 mx-2 px-14 pt-2 pb-2">
                        NAME
                      </td>
                    </tr>
                    <tr className="border-solid border-2 text-xs">
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
            <div>
              <div className="grid grid-cols-1 gap-0 text-center lg:grid-cols-3 md:grid-cols-3 lg:text-left">
                <div className="mx-14">
                  <strong className="font-medium text-white mx-14 mt-5">
                    CUSTOMER
                  </strong>
                  <nav
                    aria-label="Footer Services Nav"
                    className="mt-6 flex flex-col space-y-3 mx-14 text-xs"
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
                <div>
                  <strong className="font-medium text-white mx-14 mt-5">
                    {' '}
                    KSTM{' '}
                  </strong>
                  <nav
                    aria-label="Footer About Nav"
                    className="mt-6 flex flex-col space-y-3 mx-14 text-xs"
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
                <div>
                  <strong className="font-medium text-white mx-5 ">
                    {' '}
                    LEGAL{' '}
                  </strong>
                  <nav
                    aria-label="Footer Support Nav"
                    className="mt-6 flex flex-col space-y-3 mx-5 text-xs"
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
          <hr className="text-white p-1 mt-5" />
          {/* //copy right */}
          <div className="grid grid-cols-3 gap-0">
            <div className="mx-14">
              {' '}
              <p className="text-1xl font-bold mt-0 font-heading mx-14 mx-auto text-white">
                @2022{' '}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold mt-0 font-heading text-center mx-auto text-white">
                KSTM
              </p>
            </div>
            <div className="flex">
              <a
                className="text-white transition hover:text-gray-700/75 mx-5"
                href=""
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only"> Facebook </span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>{' '}
              <a
                className="text-white transition hover:text-gray-700/75"
                href=""
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only"> Twitter </span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                className="text-white transition hover:text-gray-700/75 mx-5"
                href=""
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only"> Instagram </span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <a
                className="text-white transition hover:text-gray-700/75 mx-2"
                href=""
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only"> GitHub </span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <a
                className="text-white transition hover:text-gray-700/75 mx-2"
                href=""
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only"> Dribbble </span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
Home.Layout = Layout

export default withDataLayer(Home, PAGE_TYPE)
