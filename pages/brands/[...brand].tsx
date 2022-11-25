import dynamic from 'next/dynamic'
import { useReducer, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSwr from 'swr'
import { postData } from '@components/utils/clientFetcher'
import { GetServerSideProps } from 'next'
const ProductGrid = dynamic(() => import('@components/product/Grid'))
const ProductSort = dynamic(() => import('@components/product/ProductSort'))
import getBrandBySlug from '@framework/api/endpoints/catalog/getBrandBySlug'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS, KEYS_MAP } from '@components/utils/dataLayer'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
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

function BrandDetailPage({
  query,
  setEntities,
  recordEvent,
  brandDetails,
}: any) {
  const adaptedQuery = { ...query }
  const { BrandViewed, PageViewed } = EVENTS_MAP.EVENT_TYPES

  useAnalytics(BrandViewed, {
    entity: JSON.stringify({
      id: brandDetails?.id,
      name: brandDetails?.name || '',
      manufName: brandDetails?.manufacturerName,
    }),
    entityName: PAGE_TYPE,
    pageTitle: brandDetails?.manufacturerName,
    entityType: 'Brand',
    eventType: 'BrandViewed',
  })

  adaptedQuery.currentPage
    ? (adaptedQuery.currentPage = Number(adaptedQuery.currentPage))
    : false
  adaptedQuery.filters
    ? (adaptedQuery.filters = JSON.parse(adaptedQuery.filters))
    : false

  const initialState = {
    ...DEFAULT_STATE,
    ...{
      filters: [
        {
          Key: 'brandNoAnlz',
          Value: brandDetails?.name,
          IsSelected: true,
        },
      ],
    },
  }

  const [productListMemory, setProductListMemory] = useState({
    products: {
      results: [],
      sortList: [],
      pages: 0,
      total: 0,
      currentPage: 1,
      filters: [],
    },
  })

  const router = useRouter()
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
      },
    },
    error,
  } = useSwr(['/api/catalog/products', state], postData)

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

  const handleSortBy = (payload: any) => {
    dispatch({
      type: SORT_BY,
      payload: payload,
    })
  }

  useEffect(() => {
    const entity = {
      allowFacet: true,
      brand: null,
      brandId: null,
      breadCrumb: null,
      category: null,
      categoryId: null,
      categoryIds: null,
      collection: null,
      collectionId: null,
      currentPage: state.currentPage,
      excludedBrandIds: null,
      excludedCategoryIds: null,
      facet: null,
      facetOnly: false,
      filters: state.filters,
      freeText: '',
      gender: null,
      ignoreDisplayInSerach: false,
      includeExcludedBrand: false,
      page: state.currentPage,
      pageSize: 0,
      promoCode: null,
      resultCount: data?.products?.total,
      sortBy: state?.sortBy,
      sortOrder: state?.sortOrder,
    }
    setEntities({
      [KEYS_MAP.entityId]: '',
      [KEYS_MAP.entityName]: '',
      [KEYS_MAP.entityType]: 'Search',
      [KEYS_MAP.entity]: JSON.stringify(entity),
    })

    recordEvent(EVENTS.FreeText)
  })

  const productDataToPass = IS_INFINITE_SCROLL
    ? productListMemory.products
    : data.products

  // IMPLEMENT HANDLING FOR NULL OBJECT
  if (brandDetails === null) {
    return (
      <div className="container mx-auto py-10 text-center relative top-20">
        <h4 className="text-3xl font-medium text-gray-400 pb-6">
          This is a bad url. please go back to
          <Link href="/brands">
            <a className="text-indigo-500 px-3">all brands</a>
          </Link>
        </h4>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <main className="pb-24">
        <div className="text-center sm:py-16 py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="sm:text-4xl text-2xl font-extrabold tracking-tight text-gray-900">
            {state.filters[0]?.Value}
          </h1>
          <h1 className="sm:text-xl text-lg mt-2 font-medium tracking-tight text-gray-500">
            {data.products.total} results
          </h1>
          <div
            dangerouslySetInnerHTML={{
              __html: brandDetails.description,
            }}
            className="sm:py-10 py-4 px-5 sm:mt-5 mt-2 text-gray-900"
          />
        </div>
        <div className="sm:py-5 py-2 w-full justify-end flex max-w-3xl mx-auto px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
          <ProductSort
            routerSortOption={state.sortBy}
            products={data.products}
            action={handleSortBy}
          />
        </div>
        <ProductGrid
          products={productDataToPass}
          currentPage={state.currentPage}
          handlePageChange={handlePageChange}
          handleInfiniteScroll={handleInfiniteScroll}
        />
      </main>
      <NextSeo
        title={brandDetails.name}
        description={brandDetails.description}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: brandDetails.metaKeywords,
          },
        ]}
        openGraph={{
          type: 'website',
          title: brandDetails.metaTitle,
          description: brandDetails.metaDescription,
          images: [
            {
              url: brandDetails.Image,
              width: 800,
              height: 600,
              alt: brandDetails.name,
            },
          ],
        }}
      />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const response = await getBrandBySlug(
    `brands/${context.query.brand.pop()}`,
    context.req.cookies
  );

  const infraPromise = commerce.getInfra();
  const infra = await infraPromise;
  return {
    props: {
      query: context.query,
      brandDetails: response.result,
      globalSnippets: infra?.snippets ?? [],
      snippets: response?.snippets ?? []
    }, // will be passed to the page component as props
  };
}

const PAGE_TYPE = PAGE_TYPES['Brand']

export default withDataLayer(BrandDetailPage, PAGE_TYPE)
