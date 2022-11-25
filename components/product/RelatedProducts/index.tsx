import Link from 'next/link'
import dynamic from 'next/dynamic'
const Engraving = dynamic(() => import('@components/product/Engraving'))
import { useState } from 'react'
import cartHandler from '@components/services/cart'
import { useUI } from '@components/ui/context'
import { GENERAL_ADD_TO_BASKET, GENERAL_ENGRAVING, IMG_PLACEHOLDER, ITEM_TYPE_ADDON } from '@components/utils/textVariables'
import Image from 'next/image'
export default function RelatedProducts({
  relatedProducts = [],
  relatedProductList = [],
}: any) {
  const [isEngravingOpen, showEngravingModal] = useState(false)

  const { basketId, setCartItems, user } = useUI()

  const computeRelatedItems = () => {
    const relatedProductsClone = [...relatedProducts]
    const tempArr: any = {}

    relatedProductList.reduce((acc: any, obj: any) => {
      acc.forEach((item: any) => {
        if (item.stockCode === obj.stockCode) {
          if (!tempArr[item.relatedTypeCode]) {
            tempArr[item.relatedTypeCode] = { relatedProducts: [] }
            tempArr[item.relatedTypeCode] = {
              ...tempArr[item.relatedTypeCode],
              ...item,
            }
          }
          tempArr[item.relatedTypeCode]['relatedProducts'] = [
            ...tempArr[item.relatedTypeCode].relatedProducts,
            obj,
          ]
        }
      })
      return acc
    }, relatedProductsClone)

    return tempArr
  }

  const computedItems = computeRelatedItems()

  const addToCart = (product: any) => {
    const asyncAddToCart = async () => {
      const item = await cartHandler().addToCart(
        {
          basketId: basketId,
          productId: product.recordId,
          qty: 1,
          manualUnitPrice: product.price.raw.withTax,
          stockCode: product.stockCode,
          userId: user.userId,
          isAssociated: user.isAssociated,
        },
        'ADD',
        { product }
      )
      setCartItems(item)
    }
    asyncAddToCart()
  }

  return (
    <section
      aria-labelledby="related-heading"
      className="mt-10 border-t border-gray-200 py-8 px-4 sm:px-0"
    >
      <div>
        {Object.keys(computedItems).map(
          (relatedItem: any, relatedItemIdx: number) => {
            return (
              <div key={`relatedItemIdx-${relatedItemIdx}`}>
                {computedItems[relatedItem].relatedProducts && (
                  <h2
                    id="related-heading"
                    className="text-xl mt-6 font-bold text-gray-900"
                  >
                    {computedItems[relatedItem].name}
                  </h2>
                )}
                <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                  {computedItems[relatedItem].relatedProducts &&
                    computedItems[relatedItem].relatedProducts.map(
                      (product: any) => {
                        const isEngravingAvailable =
                          product.stockCode === ITEM_TYPE_ADDON
                        return (
                          <div key={product.id}>
                            <div className="relative">
                              <div className="relative w-full h-72 rounded-lg overflow-hidden">
                                <Link href={`/${product.slug}`} passHref>
                                  <div className='image-container'>
                                    <Image
                                      layout='fill'
                                      src={product.image || IMG_PLACEHOLDER}
                                      alt={product.name}
                                      className="w-full h-full object-center object-cover image">                                      
                                    </Image>  
                                  </div>
                                </Link>
                              </div>
                              <div className="relative mt-4">
                                <h3 className="min-h-50px text-sm font-medium text-gray-900">
                                  <Link href={`/${product.slug}`} passHref>
                                    <a href={`/${product.slug}`}>
                                      {product.name}
                                    </a>
                                  </Link>
                                </h3>
                              </div>
                              <div className="absolute top-0 inset-x-0 h-72 rounded-lg p-4 flex items-end justify-end overflow-hidden">
                                <div
                                  aria-hidden="true"
                                  className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                                />
                                <p className="relative text-lg font-semibold text-white">
                                  {product.price.formatted.withTax}
                                </p>
                              </div>
                            </div>
                            <div className="mt-6">
                              <button
                                onClick={() => addToCart(product)}
                                type="button"
                                className="w-full relative flex bg-gray-100 border border-transparent rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-gray-900 hover:bg-gray-200"
                              >
                                {GENERAL_ADD_TO_BASKET}
                              </button>
                              <Link href={`/${product.slug}`} passHref>
                                <span className="sr-only">
                                  , {product.name}
                                </span>
                              </Link>
                              {isEngravingAvailable && (
                                <>
                                  <button
                                    className="w-full relative flex bg-gray-400 border border-transparent rounded-md py-2 mt-2 items-center justify-center text-sm font-medium text-white hover:bg-gray-500"
                                    onClick={() => showEngravingModal(true)}
                                  >
                                    <span className="font-bold">{GENERAL_ENGRAVING}</span>
                                  </button>
                                  <Engraving
                                    show={isEngravingOpen}
                                    submitForm={() => addToCart(product)}
                                    onClose={() => showEngravingModal(false)}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        )
                      }
                    )}
                </div>
              </div>
            )
          }
        )}
      </div>
    </section>
  )
}
