import dynamic from 'next/dynamic'
import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import getCollections from '@framework/api/content/getCollections'
import { Layout } from '@components/common'
import Link from 'next/link'
import getCollectionBySlug from '@framework/api/content/getCollectionBySlug'
//DYNAMINC COMPONENT CALLS
const ProductFilterRight = dynamic(() => import('@components/product/Filters/filtersRight'))
const ProductMobileFilters = dynamic(() => import('@components/product/Filters'))
const ProductFiltersTopBar = dynamic(() => import('@components/product/Filters/FilterTopBar'))
const ProductGridWithFacet = dynamic(() => import('@components/product/Grid'))
const ProductGrid = dynamic(() => import('@components/product/Grid/ProductGrid'))
const BreadCrumbs = dynamic(() => import('@components/ui/BreadCrumbs'))
import { useReducer, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSwr from 'swr'
import Image from "next/legacy/image";
import { NextSeo } from 'next-seo'
import { postData } from '@components/utils/clientFetcher'
import { IMG_PLACEHOLDER, RESULTS } from '@components/utils/textVariables'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ArrowLeftIcon, ChevronLeftIcon } from '@heroicons/react/outline'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

import SwiperCore, { Navigation } from 'swiper'
import commerce from '@lib/api/commerce'
export const ACTION_TYPES = {
  SORT_BY: 'SORT_BY',
  PAGE: 'PAGE',
  SORT_ORDER: 'SORT_ORDER',
  CLEAR: 'CLEAR',
  HANDLE_FILTERS_UI: 'HANDLE_FILTERS_UI',
  ADD_FILTERS: 'ADD_FILTERS',
  REMOVE_FILTERS: 'REMOVE_FILTERS',
}

interface actionInterface {
  type?: string
  payload?: object | any
}

interface stateInterface {
  sortBy?: string
  currentPage?: string | number
  sortOrder?: string
  filters: any
}

const IS_INFINITE_SCROLL =
  process.env.NEXT_PUBLIC_ENABLE_INFINITE_SCROLL === 'true'

const {
  SORT_BY,
  PAGE,
  SORT_ORDER,
  CLEAR,
  HANDLE_FILTERS_UI,
  ADD_FILTERS,
  REMOVE_FILTERS,
} = ACTION_TYPES

const DEFAULT_STATE = {
  sortBy: '',
  sortOrder: 'asc',
  currentPage: 1,
  filters: [],
}

function reducer(state: stateInterface, { type, payload }: actionInterface) {
  switch (type) {
    case SORT_BY:
      return { ...state, sortBy: payload }
    case PAGE:
      return { ...state, currentPage: payload }
    case SORT_ORDER:
      return { ...state, sortOrder: payload }
    case CLEAR:
      return { ...state, filters: [] }
    case HANDLE_FILTERS_UI:
      return { ...state, areFiltersOpen: payload }
    case ADD_FILTERS:
      return { ...state, filters: [...state.filters, payload] }
    case REMOVE_FILTERS:
      return {
        ...state,
        filters: state.filters.filter(
          (item: any) => item.Value !== payload.Value
        ),
      }
    default:
      return { ...state }
  }
}

export default function CollectionPage(props: any) {
  const router = useRouter()
  const adaptedQuery: any = { ...router.query }

  adaptedQuery.currentPage
    ? (adaptedQuery.currentPage = Number(adaptedQuery.currentPage))
    : false
  adaptedQuery.filters
    ? (adaptedQuery.filters = JSON.parse(adaptedQuery.filters))
    : false

  const initialState = {
    ...DEFAULT_STATE,
    filters: adaptedQuery.filters || [],
    collectionId: props.id,
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    data = {
      products: {
        results: [],
        sortList: [],
        pages: 0,
        total: 0,
        currentPage: 1,
        filters: [],
        collectionId: props.id,
      },
    },
    error,
  } = useSwr(['/api/catalog/products', state], postData)

  const [showModal, setShowModal] = useState(false);
  const [productListMemory, setProductListMemory] = useState({
    products: {
      results: [],
      sortList: [],
      pages: 0,
      total: 0,
      currentPage: 1,
      filters: [],
      collectionId: props.id,
    },
  })

  const productDataToPass = IS_INFINITE_SCROLL
    ? productListMemory.products
    : props.products

  useEffect(() => {
    if (IS_INFINITE_SCROLL) {
      if (
        data.products.currentPage !== productListMemory.products.currentPage ||
        data.products.total !== productListMemory.products.total
      ) {
        setProductListMemory((prevData: any) => {
          let dataClone = { ...data }
          if (state.currentPage > 1) {
            dataClone.products.results = [
              ...prevData.products.results,
              ...dataClone.products.results,
            ]
          }
          return dataClone
        })
      }
    }
  }, [data.products.results.length])

  const handlePageChange = (page: any) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, currentPage: page.selected + 1 },
      },
      undefined,
      { shallow: true }
    )
    dispatch({ type: PAGE, payload: page.selected + 1 })
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  const handleInfiniteScroll = () => {
    if (
      data.products.pages &&
      data.products.currentPage < data.products.pages
    ) {
      dispatch({ type: PAGE, payload: data.products.currentPage + 1 })
    }
  }

  const handleFilters = (filter: null, type: string) => {
    dispatch({
      type,
      payload: filter,
    })
    dispatch({ type: PAGE, payload: 1 })
  }

  const handleSortBy = (payload: any) => {
    dispatch({
      type: SORT_BY,
      payload: payload,
    })
  }
  const clearAll = () => dispatch({ type: CLEAR })

  return (
    <main className="pb-0 mx-auto">
      <img src='/assets/icons/filter.png'
        alt='filter-icon'
        onClick={() => {
          !showModal ? setShowModal(true) : setShowModal(false)
        }}
        className='absolute top-0 z-50 hidden w-10 mt-8 mr-4 cursor-pointer sm:block right-7' />
      <div className="pt-2 sm:pt-4">
        {props.breadCrumbs && (
          <BreadCrumbs items={props.breadCrumbs} currentProduct={props} />
        )}
      </div>
      {props.images.length > 0 &&
        <div className="flex items-center justify-center w-full mx-auto mt-0 sm:px-0 sm:mt-4">
          <Swiper navigation={true} loop={true} className="mySwiper">
            {props.images.map((img: any, idx: number) => {
              return (
                <SwiperSlide key={idx}>
                  <Link href={img.link || '#'}>
                    <Image
                      layout='fixed'
                      width={1920}
                      height={460}
                      src={img.url || IMG_PLACEHOLDER}
                      alt={props.name}
                      className="object-cover object-center w-full h-48 cursor-pointer sm:h-96 sm:max-h-96"
                    ></Image>
                  </Link>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      }
      <div className="px-4 py-2 sm:py-3 sm:px-0 ">
        <h4 className='text-center'><span className='text-sm font-normal text-gray-500 '>Showing {props.products.total} {' '} {RESULTS}</span></h4>
        <h1 className="text-xl font-semibold tracking-tight text-center text-black sm:text-xl">
          {props.name}
        </h1>
        <h2 className='text-center'>{props.description}</h2>

        <span className='absolute z-50 -mt-12 right-10 '>

          <img src='/assets/icons/filter.png'
            alt='filter-icon'
            onClick={() => {
              !showModal ? setShowModal(true) : setShowModal(false)
            }}
            className='w-10 h-10 cursor-pointer sm:block right-7' />
        </span>

        {/* @nd div */}

      </div>

      {props.products.total > 0 &&
        <div className="">
          {props.allowFacets && (
            <>
              {/* {MOBILE FILTER PANEL SHOW ONLY IN MOBILE} */}

              <div className="flex flex-col sm:col-span-2 sm:hidden">
                <ProductMobileFilters
                  handleFilters={handleFilters}
                  products={props.products}
                  routerFilters={state.filters}
                  handleSortBy={handleSortBy}
                  clearAll={clearAll}
                  routerSortOption={state.sortBy}
                />
              </div>
              {/* <div className="hidden sm:col-span-2 sm:block">
              <ProductFilterRight
                handleFilters={handleFilters}
                products={props.products}
                routerFilters={state.filters}
              />
            </div> */}
              <div className="sm:col-span-4 ">
                {/* {HIDE FILTER TOP BAR IN MOBILE} */}

                {/* <div className="flex-1 hidden sm:block">
                <ProductFiltersTopBar
                  products={data.products}
                  handleSortBy={handleSortBy}
                  routerFilters={state.filters}
                  clearAll={clearAll}
                  routerSortOption={state.sortBy}
                />
              </div> */}

                {showModal ? (
                  <>
                    {/*content*/}
                    <div
                      style={{ width: '30rem' }}
                      className='absolute right-0 z-50 hidden mt-0 bg-gray-100 border-b-2 sm:block hover:shadow-2xl ' >

                      {/* <div
                    //  style={{width:'30rem'}}
                    className="hidden sm:block"> */}
                      <div className='relative flex flex-col w-full px-6 overflow-y-scroll border-r max-h-40R'>

                        <ProductFiltersTopBar
                          products={data.products}
                          handleSortBy={handleSortBy}
                          routerFilters={state.filters}
                          clearAll={clearAll}
                          routerSortOption={state.sortBy}
                        />
                        {/* </div> */}

                        <ProductFilterRight
                          handleFilters={handleFilters}
                          products={data.products}
                          routerFilters={state.filters}

                        />

                      </div>

                      {/*footer*/}
                      <div className="grid grid-cols-2 border-b-2 py-7 px-7">
                        <button
                          className="col-span-1 px-6 py-6 text-lg font-bold text-gray-700 border border-gray-200 hover:text-black hover:border-black"
                          type="button"
                          onClick={() => { setShowModal(false), clearAll() }}
                        >
                          Clear All
                        </button>
                        <button
                          className="col-span-1 px-6 py-6 text-lg font-bold text-white bg-black border border-black hover:border-white hover:text-gray-200"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                          Apply
                        </button>
                      </div>


                    </div>
                    {/* <div className="fixed inset-0 z-40 bg-black opacity-25"></div> */}
                  </>
                ) : null}

                <ProductGridWithFacet
                  products={productDataToPass}
                  currentPage={props.currentPage}
                  handlePageChange={handlePageChange}
                  handleInfiniteScroll={handleInfiniteScroll}
                />



              </div>
            </>
          )}
          {!props.allowFacets && (
            <>
              <div className="col-span-12">
                <ProductGrid
                  products={productDataToPass}
                  currentPage={props.currentPage}
                  handlePageChange={handlePageChange}
                  handleInfiniteScroll={handleInfiniteScroll}
                />
              </div>
            </>
          )}
          <div></div>
        </div>
      }
      {props.products.total == 0 &&
        <div className='w-full py-32 mx-auto text-center'>
          <h3 className='py-3 text-3xl font-semibold text-gray-200'>No Item Availabe in {props.name} Collection!</h3>
          <Link href="/collection" className='text-lg font-semibold text-indigo-500'><ChevronLeftIcon className='relative top-0 inline-block w-4 h-4'></ChevronLeftIcon> Back to collections
          </Link>
        </div>
      }
      <NextSeo
        title={props.name}
        description={props.description}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: props.metaKeywords,
          },
        ]}
        openGraph={{
          type: 'website',
          title: props.metaTitle,
          description: props.metaDescription,
          images: [
            {
              url: props.image,
              width: 800,
              height: 600,
              alt: props.name,
            },
          ],
        }}
      />
    </main>
  )
}

CollectionPage.Layout = Layout

export async function getStaticProps({ params, ...context }: any) {
  const slug: any = params!.collection
  const data = await getCollectionBySlug(slug[0]);

  const infraPromise = commerce.getInfra();
  const infra = await infraPromise;

  //console.log(context)
  return {
    props: {
      ...data,
      query: context,
      slug: params!.collection[0],
      globalSnippets: infra?.snippets ?? [],
      snippets: data?.snippets
    },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const data = await getCollections()
  return {
    paths: data
      .map((col: any) => {
        if (col.slug) {
          let collectionSlug =
            col.slug[0] === '/'
              ? `/collection${col.slug}`
              : `/collection/${col.slug}`
          return collectionSlug
        }
      })
      .filter((i: any) => !!i),
    fallback: 'blocking',
  }
}
