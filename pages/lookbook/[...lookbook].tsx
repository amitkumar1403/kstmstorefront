import dynamic from 'next/dynamic'
import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import getLookbooks from '@framework/api/content/lookbook'
import getSingleLookbook from '@framework/api/content/singleLookbook'
import { useRouter } from 'next/router'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { Layout } from '@components/common'
const ProductGrid = dynamic(() => import('@components/product/Grid'))
import { useUI } from '@components/ui/context'
import axios from 'axios'
import {
  NEXT_BULK_ADD_TO_CART,
  NEXT_GET_SINGLE_LOOKBOOK,
} from '@components/utils/constants'
import { useEffect, useState } from 'react'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import {IMG_PLACEHOLDER, SHOP_THE_LOOK} from '@components/utils/textVariables'
import commerce from '@lib/api/commerce'
function LookbookDetailPage({ data, slug }: any) {
  const router = useRouter()
  const { basketId, openCart, setCartItems } = useUI()
  const [products, setProducts] = useState(data.products)
  const loadProducts = async () => {
    const response: any = await axios.post(NEXT_GET_SINGLE_LOOKBOOK, { slug })
    setProducts(response.data.products)
  }

  const { PageViewed } = EVENTS_MAP.EVENT_TYPES

  useAnalytics(PageViewed, {
    eventType: PageViewed,
    pageCategory: 'Lookbook',
    omniImg: data.mainImage,
  })

  useEffect(() => {
    if (slug) loadProducts()
  }, [])

  if (router.isFallback && !data.id) return null

  const handleBulk = async () => {
    const computedProducts = products.results.reduce((acc: any, obj: any) => {
      acc.push({
        ProductId: obj.recordId || obj.productId,
        BasketId: basketId,
        ParentProductId: obj.parentProductId || null,
        Qty: 1,
        DisplayOrder: obj.displayOrder || 0,
        StockCode: obj.stockCode,
        ItemType: obj.itemType || 0,

        ProductName: obj.name,

        ManualUnitPrice: obj.manualUnitPrice || 0.0,

        PostCode: obj.postCode || null,

        IsSubscription: obj.subscriptionEnabled || false,

        IsMembership: obj.hasMembership || false,

        SubscriptionPlanId: obj.subscriptionPlanId || null,

        SubscriptionTermId: obj.subscriptionTermId || null,

        UserSubscriptionPricing: obj.userSubscriptionPricing || 0,

        GiftWrapId: obj.giftWrapConfig || null,

        IsGiftWrapApplied: obj.isGiftWrapApplied || false,

        ItemGroupId: obj.itemGroupId || 0,

        PriceMatchReqId:
          obj.priceMatchReqId || '00000000-0000-0000-0000-000000000000',
      })
      return acc
    }, [])
    const newCart = await axios.post(NEXT_BULK_ADD_TO_CART, {
      basketId,
      products: computedProducts,
    })
    if (newCart.data) {
      setCartItems(newCart.data)
      openCart()
    }
  }

  return (
    <div className="bg-white w-full mx-auto">
      {/* Mobile menu */}
      <main className="pb-24">
        <div className="text-left py-0 px-4 sm:px-0 lg:px-0 flex items-center flex-col">
          <div className="w-full bg-gray-200 rounded-sm overflow-hidden">
              <div className='image-container lookbook-image'>
                <Image
                  layout='fill'
                  src={data.mainImage || IMG_PLACEHOLDER}
                  alt={data.name}
                  className="w-full h-screen min-h-screen object-center object-cover image"
                />
                <div className='lookbook-data'>
                    <h1 className="py-1 text-4xl font-semibold tracking-tight text-white">
                      {data.name}
                    </h1>
                    <h2 className="pt-4 text-md sm:w-1/3 font-normal tracking-tight text-white">{data.description}</h2>
                    <button
                      onClick={handleBulk}
                      className="font-semibold uppercase bg-black hover:bg-gray-900 text-lg py-3 px-10 mt-5 text-white"
                    >
                      {SHOP_THE_LOOK}
                    </button>
                </div>
              </div>            
          </div>
          <div className="mt-5 sm:w-4/5 mx-auto">
            <ProductGrid
              products={products}
              currentPage={products.currentpage}
              handlePageChange={() => {}}
              handleInfiniteScroll={() => {}}
            />
          </div>
        </div>
      </main>
      <NextSeo
        title={data.name}
        description={data.description}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: data.metaKeywords,
          },
        ]}
        openGraph={{
          type: 'website',
          title: data.metaTitle,
          description: data.metaDescription,
          images: [
            {
              url: data.mainImage,
              width: 800,
              height: 600,
              alt: data.name,
            },
          ],
        }}
      />
    </div>
  )
}

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext) {
  const slug: any = params!.lookbook;
  const response = await getSingleLookbook(slug[0]);

  const infraPromise = commerce.getInfra();
  const infra = await infraPromise;
  return {
    props: {
      data: response,
      slug: slug[0],
      globalSnippets: infra?.snippets ?? [],
      snippets: response?.snippets
    },
    revalidate: 200,
  }
}

LookbookDetailPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES['Page']

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const data = await getLookbooks()
  let paths = data.map((lookbook: any) => {
    if (!lookbook.slug.includes('lookbook/')) {
      return `/lookbook/${lookbook.slug}`
    } else return `/${lookbook.slug}`
  })

  return {
    paths: paths,
    fallback: 'blocking',
  }
}

export default withDataLayer(LookbookDetailPage, PAGE_TYPE)
