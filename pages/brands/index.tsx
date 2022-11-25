import type { GetStaticPropsContext } from 'next'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { Layout } from '@components/common'
import getBrands from '@framework/api/endpoints/catalog/brands'
import { useState } from 'react'
import Link from 'next/link'
import { SearchIcon } from '@heroicons/react/outline'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'

const ALPHABET = '#abcdefghijklmnopqrstuvwxyz'

const dataNormalizr = (data: any = []) => {
  return data.reduce((acc: any, item: any) => {
    let ref = acc.findIndex(
      (i: any) => i.title.toLowerCase() === item.manufacturerName.charAt(0).toLowerCase()
    )
    if (ref >= 0) {
      acc[ref].results = [...acc[ref].results, item]
      return acc
    } else {
      acc = [
        ...acc,
        {
          title: item.manufacturerName.charAt(0),
          results: [item],
        },
      ]
      return acc
    }
  }, [])
}

function BrandsPage({ brands }: any) {
  const data = dataNormalizr(brands.results)
  const [normalizedBrands, setNormalizedBrands] = useState(data)
  const handleSearch = (value: any) => {
    const filteredData = data.filter((item: any) => {
      const result = item.results.find((brand: any) =>
        brand.manufacturerName.toLowerCase().includes(value.toLowerCase())
      )
      if (result) {
        return {
          title: item.title,
          results: [result],
        }
      }
    })
    setNormalizedBrands(filteredData)
  }
  const { BrandViewed } = EVENTS_MAP.EVENT_TYPES

  useAnalytics(BrandViewed, {
    eventType: BrandViewed,
    pageTitle: 'Brands',
  })
  useEffect(() => {}, [])
  const totalResults = normalizedBrands.map((i: any) => i.results).flat().length

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <main className="pb-24 max-w-7xl mx-auto overflow-hidden sm:px-6 lg:px-8">
        <div className="text-center sm:py-16 py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="sm:text-4xl text-2xl font-extrabold tracking-tight text-gray-900">
            Brands
          </h1>
          <h1 className="sm:text-xl text-md mt-2 font-medium tracking-tight text-gray-500">
            {totalResults} results
          </h1>
          <div className="w-full py-5 flex justify-center items-center flex-wrap">
            {ALPHABET.split('').map((letter: any, key: number) => {
              const brandExists = !!normalizedBrands.find(
                (brand: any) =>
                  brand.title.toUpperCase() === letter.toUpperCase()
              )
              if (brandExists) {
                return (
                  <Link key={key} passHref href={`#${letter.toUpperCase()}`}>
                    <a className="hover:bg-indigo-600 hover:text-white sm:mr-3 sm:mt-5 sm:py-2 sm:px-4 mr-1 mt-2 py-1 px-2 text-gray-900 border font-extrabold sm:text-lg text-sm">
                      {letter.toUpperCase()}
                    </a>
                  </Link>
                )
              }
              return (
                <span
                  key={key}
                  className="sm:mr-3 sm:mt-5 sm:py-2 sm:px-4 mr-1 mt-2 py-1 px-2 text-gray-900 border font-extrabold sm:text-lg text-sm opacity-40 pointer-events-none"
                >
                  {letter.toUpperCase()}
                </span>
              )
            })}
          </div>
          <div className="flex justify-center items-center py-5 w-full">
            <div className="min-w-searchbar flex w-1/3 flex-row border border-gray-300 rounded-md py-2 px-4 shadow-sm ">
              <label className="hidden" htmlFor={'search-bar'}>
                Search
              </label>
              <input
                id={'search-bar'}
                className="text-gray-700 appearance-none min-w-0 w-full bg-white  placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Search..."
                onChange={(e: any) => handleSearch(e.target.value)}
              />
              <div className="text-gray-400">
                <SearchIcon className="w-6 h-6" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
        {normalizedBrands.map((brand: any, idx: number) => {
          return (
            <div
              key={idx}
              className="sm:px-6 lg:px-8 px-4 flex flex-col border-t sm:py-10 py-4"
            >
              <h2
                id={brand.title.toUpperCase()}
                className="text-gray-900 sm:text-4xl text-2xl font-extrabold"
              >
                {brand.title.toUpperCase()}
              </h2>
              <div className="flex justify-between items-center sm:py-2 py-0 flex-wrap">
                {brand.results.map((result: any, key: number) => {
                  return (
                    <div
                      key={key}
                      style={{ flex: '0 0 33.333333%' }}
                      className="text-gray-900 sm:inline-flex flex "
                    >
                      <Link
                        passHref
                        href={{
                          pathname: `/${result.link}`,
                          query: {
                            id: result.id,
                          },
                        }}
                      >
                        <a className="sm:text-lg text-sm sm:py-5 py-2 hover:underline cursor-pointer">
                          {result.manufacturerName}
                        </a>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext) {
  const response = await getBrands({})
  return {
    props: {
      brands: response.result,
      snippets: response.snippets,
    },
    revalidate: 200,
  }
}
/*
export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await getBrands({})
    //CAN WE PUT SOME CODE HERE TO EXEC AFTER GETBRANDS ???
  return {
    props: {
      brands: response.result,
      snippets: response.snippets,
    }, // will be passed to the page component as props
  }
}
*/
BrandsPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES['Brand']

export default withDataLayer(BrandsPage, PAGE_TYPE)
