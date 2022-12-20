import Image from 'next/image'
import { useState, useEffect, useLayoutEffect } from 'react'
import { SearchIcon } from '@heroicons/react/outline'
import axios from 'axios'
import { NEXT_SEARCH_PRODUCTS } from '@components/utils/constants'
import Link from 'next/link'
import { XIcon } from '@heroicons/react/outline'
import rangeMap from '@lib/range-map'
import { useRouter } from 'next/router'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { useUI } from '@components/ui/context'
import { BTN_SEARCH, IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'

export default function Search({ closeWrapper = () => {}, keywords }: any) {
  const Router = useRouter()
  const [inputValue, setInputValue] = useState('')
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [path, setCurrentPath] = useState(Router.asPath)
  const SearchEvent = EVENTS_MAP.EVENT_TYPES.Search
  const SearchEntity = EVENTS_MAP.ENTITY_TYPES.Search

  const { basketId, cartItems } = useUI()

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true)
      try {
        const response: any = await axios.post(NEXT_SEARCH_PRODUCTS, {
          value: inputValue,
        })
        setProducts(response?.data?.products)
        setIsLoading(false)
        eventDispatcher(SearchEvent, {
          entity: JSON.stringify({
            FreeText: inputValue,
            ResultCount: response?.data?.products?.length || 0,
          }),
          entityId: inputValue,
          entityName: inputValue,
          entityType: SearchEntity,
          eventType: SearchEvent,
        })
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    }
    if (inputValue.length > 2) fetchItems()
  }, [inputValue])

  const handleEnterPress = (e: any) => {
    const keyword = keywords.find(
      (keyword: any) => keyword.keywords === e.target.value
    )
    if (e.key === 'Enter' && keyword) {
      Router.push(keyword.url)
    } else if (e.key === 'Enter' && !keyword) {
      Router.push('/search?freeText=' + e.target.value)
    }
  }

  useLayoutEffect(() => {
    document.addEventListener('keypress', handleEnterPress)
    return () => document.removeEventListener('keypress', handleEnterPress)
  }, [])

  useEffect(() => {
    if (path !== Router.asPath) {
      closeWrapper()
    }
  }, [Router.asPath])

  return (
    <div className="fixed top-0 w-full h-full bg-white z-9999">
      <div
        className="absolute text-gray-900 cursor-pointer h-9 w-9 right-10 top-10"
        onClick={closeWrapper}
      >
        <XIcon />
      </div>
      <div className="flex flex-col items-center justify-center w-full px-4 py-5 mt-10 sm:px-10">
        <div className="w-full mx-auto mb-4 sm:w-3/5">
          <div className="flex flex-row px-1 rounded-sm">
            <label className="hidden" htmlFor={'search-bar'}>
              {BTN_SEARCH}
            </label>
            <input
              id={'search-bar'}
              autoFocus
              className="w-full min-w-0 px-3 py-4 text-xl text-gray-700 placeholder-gray-500 bg-white border-0 border-b border-gray-300 appearance-none focus:outline-none focus:border-white focus:ring-0 focus:ring-white focus:border-gray-700"
              placeholder={BTN_SEARCH}
              onChange={(e: any) => setInputValue(e.target.value)}
            />
            <div className="relative py-4 text-gray-400 right-10">
              <SearchIcon className="w-6 h-6" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 sm:w-3/5 sm:mx-0 md:grid-cols-3 lg:grid-cols-4 max-panel-search">
          {isLoading &&
            rangeMap(12, (i) => (
              <div
                key={i}
                className="mx-auto mt-20 rounded-md shadow-md w-60 h-72"
              >
                <div className="flex flex-row items-center justify-center h-full space-x-5 animate-pulse">
                  <div className="flex flex-col space-y-3">
                    <div className="w-full h-48 bg-gray-100 rounded-md "></div>
                    <div className="h-6 mt-40 bg-gray-100 rounded-md w-36 "></div>
                  </div>
                </div>
              </div>
            ))}
          {products?.map((product: any, idx: number) => {
            return (
              <div className="border-b border-gray-200" key={idx}>
                <div className="relative p-4 group sm:p-6">
                  <Link passHref href={`/${product.slug}`}>
                    <a href={`/${product.slug}`}>
                      <div className="relative overflow-hidden bg-gray-200 rounded-lg aspect-w-1 aspect-h-1 group-hover:opacity-75">
                        <div className='image-container'>
                           {product.image &&
                              <Image 
                                src={generateUri(product.image, "h=200&fm=webp") || IMG_PLACEHOLDER}                              
                                alt={product.name}
                                layout='fill' 
                                sizes='50vw'
                                className='object-cover object-center w-full h-48 sm:h-72 image'>
                              </Image> 
                            }
                        </div>
                      </div>
                    </a>
                  </Link>

                  <div className="pt-10 pb-4 text-center">
                    <h3 className="text-sm font-medium text-gray-900 min-h-50px">
                      <Link href={`/${product.slug}`}>
                        <a href={`/${product.slug}`}>{product.name}</a>
                      </Link>
                    </h3>

                    <p className="mt-4 font-medium text-gray-900">
                      {product?.price?.formatted?.withTax}
                    </p>

                    <div className="flex flex-col"></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
