import dynamic from 'next/dynamic'
import { useReducer, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSwr from 'swr'
import { postData } from '@components/utils/clientFetcher'
import { GetServerSideProps } from 'next'
//DYNAMINC COMPONENT CALLS
const ProductGrid = dynamic(() => import('@components/product/Grid'))
const ProductMobileFilters = dynamic(() => import('@components/product/Filters'))
const ProductFilterRight = dynamic(() => import('@components/product/Filters/filtersRight'))
const ProductFiltersTopBar = dynamic(() => import('@components/product/Filters/FilterTopBar'))
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS, KEYS_MAP } from '@components/utils/dataLayer'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { useUI } from '@components/ui/context'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { GENERAL_CATALOG } from '@components/utils/textVariables'
export const ACTION_TYPES = {
  SORT_BY: 'SORT_BY',
  PAGE: 'PAGE',
  SORT_ORDER: 'SORT_ORDER',
  CLEAR: 'CLEAR',
  HANDLE_FILTERS_UI: 'HANDLE_FILTERS_UI',
  ADD_FILTERS: 'ADD_FILTERS',
  REMOVE_FILTERS: 'REMOVE_FILTERS',
  FREE_TEXT: 'FREE_TEXT',
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
  freeText: string
}

const IS_INFINITE_SCROLL =
  process.env.NEXT_PUBLIC_ENABLE_INFINITE_SCROLL === 'true'

const PAGE_TYPE = PAGE_TYPES['Search']

const {
  SORT_BY,
  PAGE,
  SORT_ORDER,
  CLEAR,
  HANDLE_FILTERS_UI,
  ADD_FILTERS,
  REMOVE_FILTERS,
  FREE_TEXT,
} = ACTION_TYPES

const DEFAULT_STATE = {
  sortBy: '',
  sortOrder: 'asc',
  currentPage: 1,
  filters: [],
  freeText: '',
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
    case FREE_TEXT:
      return { ...state, freeText: payload || '' }
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

function Search({ query, setEntities, recordEvent }: any) {
  const adaptedQuery = { ...query }
  adaptedQuery.currentPage
    ? (adaptedQuery.currentPage = Number(adaptedQuery.currentPage))
    : false
  adaptedQuery.filters
    ? (adaptedQuery.filters = JSON.parse(adaptedQuery.filters))
    : false

  const initialState = {
    ...DEFAULT_STATE,
    ...adaptedQuery,
  }

  const { user } = useUI()
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
  const [showModal, setShowModal] = useState(false);
  const [filterClicked, setfilterClicked] = useState(false)
  const {
    data = {
      products: {
        results: [],
        sortList: [],
        pages: 0,
        total: 0,
        currentPage: 1,
        filters: [],
        freeText: query.freeText || '',
      },
    },
    error,
  } = useSwr(['/api/catalog/products', state], postData, {
    revalidateOnFocus: false,
  })

  const { CategoryViewed, FacetSearch } = EVENTS_MAP.EVENT_TYPES

  useEffect(() => {
    if (router.query.freeText !== undefined && router.query.freeText !== state.freeText) {
      dispatch({ type: FREE_TEXT, payload: query.freeText })
    }
  }, [router.query.freeText])

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

  const BrandFilter = state.filters.find(
    (filter: any) => filter.name === 'Brand'
  )
  const CategoryFilter = state.filters.find(
    (filter: any) => filter.name === 'Category'
  )

  useAnalytics(FacetSearch, {
    entity: JSON.stringify({
      FreeText: '',
      Page: state.currentPage,
      SortBy: state.sortBy,
      SortOrder: state.sortOrder,
      Brand: BrandFilter ? BrandFilter.value : null,
      Category: CategoryFilter ? CategoryFilter.value : null,
      Gender: user.gender,
      CurrentPage: state.currentPage,
      PageSize: 20,
      Filters: state.filters,
      AllowFacet: true,
      ResultCount: data.products.total,
    }),
    entityName: PAGE_TYPE,
    pageTitle: 'Catalog',
    entityType: 'Page',
    eventType: 'Search',
  })

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
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        filters: JSON.stringify(state.filters),
      },
    })
  }, [state.filters])

  const handleFilters = (filter: null, type: string) => {
    dispatch({
      type,
      payload: filter,
    })
    dispatch({ type: PAGE, payload: 1 })
  }

  const clearAll = () => dispatch({ type: CLEAR })

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
      resultCount: data.products.total,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
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

  return (
    <div
      className="w-full mx-auto bg-white ">
      {/* Mobile menu */}
      <main className="pb-24">
        <div className="mt-10 px-4 py-4 text-center sm:py-5 sm:px-0 lg:px-0">
          {/* for sticky subnav*/}
          {/* <div className="sticky z-50 px-4 py-4 text-center bg-white border border-red-600 top-16 sm:py-5 sm:px-0 lg:px-0">    */}

          {/* <h4><span className='text-sm font-normal'>Showing {data.products.total} Results for</span></h4> */}
          <h4><span className='text-sm font-normal text-gray-500'>Home | Women | Leggings</span></h4>

          <h1 className="text-xl font-semibold tracking-tight text-black sm:text-2xl">
            {/* {GENERAL_CATALOG}  */}
            WOMEN - LEGGINGS

          </h1>

          <img src='/assets/icons/filter.png'
            alt='filter-icon'
            onClick={() => {
              !showModal ? setShowModal(true) : setShowModal(false)
            }}
            className='absolute hidden w-10 mt-10 mr-6 cursor-pointer sm:block right-16 top-24' />
        </div>
        <div className="grid w-full grid-cols-1 px-4 mx-auto overflow-hidden sm: sm:px-0 lg:px-0">
          {/* {MOBILE FILTER PANEL SHOW ONLY IN MOBILE} */}

          <div className="flex flex-col sm:col-span-2 sm:hidden">
            <ProductMobileFilters
              handleFilters={handleFilters}
              products={data.products}
              routerFilters={state.filters}
              handleSortBy={handleSortBy}
              clearAll={clearAll}
              routerSortOption={state.sortBy}
            />
          </div>

          {/* {FILTER PANEL SHOW ONLY IN DESKTOP VERSION} */}

          {/* <div className="hidden sm:col-span-2 sm:block">
              <ProductFilterRight
              handleFilters={handleFilters}
              products={data.products}
              routerFilters={state.filters}
              />
              </div>   */}
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

            {/* Modal */}

            <ProductGrid
              products={productDataToPass}
              currentPage={state.currentPage}
              handlePageChange={handlePageChange}
              handleInfiniteScroll={handleInfiniteScroll}
            />

            {showModal ? (
              <>
                {/*content*/}
                <div
                  style={{ width: '30rem' }}
                  className='absolute hidden mr-4 bg-gray-100 border-b-2 sm:block right-1 top-40 hover:shadow-2xl ' >

                  <div
                    //  style={{width:'30rem'}}
                    className="hidden sm:block">
                    <ProductFiltersTopBar
                      products={data.products}
                      handleSortBy={handleSortBy}
                      routerFilters={state.filters}
                      clearAll={clearAll}
                      routerSortOption={state.sortBy}
                    />
                  </div>

                  <ProductFilterRight
                    handleFilters={handleFilters}
                    products={data.products}
                    routerFilters={state.filters}
                  />

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


          </div>
          <div></div>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // {console.log(context.query)}
  return {
    props: { query: context.query }, // will be passed to the page component as props
  }
}

export default withDataLayer(Search, PAGE_TYPE)
