import cn from 'classnames'
import Link from 'next/link'
import { FC } from 'react'
import { useUI } from '@components/ui/context'
import { useEffect, useState, Fragment } from 'react'
import useCart from '@components/services/cart'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon, PlusSmIcon, MinusSmIcon } from '@heroicons/react/outline'
import PromotionInput from '../PromotionInput'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import Image from 'next/image'

import useTranslation, {
  CLOSE_PANEL,
  GENERAL_SHOPPING_CART,
  WISHLIST_SIDEBAR_MESSAGE,
  GENERAL_CATALOG,
  GENERAL_REMOVE,
  GENERAL_DELETE,
  SUBTOTAL_INCLUDING_TAX,
  GENERAL_SHIPPING,
  GENERAL_DISCOUNT,
  GENERAL_TOTAL,
  GENERAL_CHECKOUT,
  GENERAL_CONTINUE_SHOPPING,
  GENERAL_OR_TEXT,
  IMG_PLACEHOLDER,
} from '@components/utils/textVariables'
import products from 'pages/api/catalog/products'

const CartSidebarView: FC = () => {
  const { closeSidebar, setCartItems, cartItems, basketId } = useUI()
  const { getCart, addToCart } = useCart()
  const { BasketViewed } = EVENTS_MAP.EVENT_TYPES
  const { Basket } = EVENTS_MAP.ENTITY_TYPES

  const content = useTranslation()

  useEffect(() => {
    const handleCartitems = async () => {
      const items = await getCart({ basketId })
      setCartItems(items)
    }
    eventDispatcher(BasketViewed, {
      entity: JSON.stringify({
        id: basketId,
        grandTotal: cartItems.grandTotal?.raw.withTax,
        lineItems: cartItems.lineItems,
        promoCode: cartItems.promotionsApplied,
        shipCharge: cartItems.shippingCharge?.raw?.withTax,
        shipTax: cartItems.shippingCharge?.raw?.tax,
        taxPercent: cartItems.taxPercent,
        tax: cartItems.grandTotal?.raw?.tax,
      }),
      entityName: 'Cart',
      entityType: Basket,
      eventType: BasketViewed,
      promoCodes: cartItems.promotionsApplied,
    })
    handleCartitems()
  }, [])

  const handleItem = (product: any, type = 'increase') => {
    const asyncHandleItem = async () => {
      const data: any = {
        basketId,
        productId: product.id,
        parentProductId: product.parentProductId, // added value
        stockCode: product.stockCode,
        manualUnitPrice: product.manualUnitPrice,
        displayOrder: product.displayOrderta,
        qty: -1,
      }
      if (type === 'increase') {
        data.qty = 1
      }
      if (type === 'delete') {
        data.qty = 0
      }
      
      try {
        const item = await addToCart(data, type, { product })
        setCartItems(item)
      } catch (error) {
        console.log(error)
      }
    }
    asyncHandleItem()
  }

  const handleClose = () => closeSidebar()

  const isEmpty: boolean = cartItems?.lineItems?.length === 0

  function getProductVariantDetailsByName(productName: string) {
    const details = {
      name: '',
      color: '',
      size: ''
    }

    if (productName) {
      const productNameArrStr = productName.split(' ')
      details.name = productNameArrStr.slice(0, productNameArrStr.length - 3).join(' ')
      details.color = productNameArrStr[productNameArrStr.length - 3]
      details.size = productNameArrStr[productNameArrStr.length - 2]
    }

    return details
  }

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-999"
        onClose={handleClose}
        >
        <div className="absolute inset-0 overflow-hidden z-999">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0" 
          >
            <Dialog.Overlay className="w-full h-screen" onClick={handleClose} />  
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 flex max-w-md">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
              >
              <div className="w-screen max-w-md bg-white">
                <div className="flex flex-col h-full my-4 overflow-hidden bg-white pl-3 pr-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-md capitalize font-medium text-gray-900">
                        {GENERAL_SHOPPING_CART} ({cartItems?.lineItems?.length || 0})
                      </Dialog.Title>
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="transition text-gray-400 hover:text-gray-500"
                          onClick={handleClose}
                          >
                          <span className="sr-only">{CLOSE_PANEL}</span>
                          <XIcon className="w-5 h-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className='my-3 h-auto max-h-80 overflow-y-scroll'>
                      <div className="flow-root">
                        {isEmpty && (
                          <div className="flex flex-col items-center justify-center w-full h-full text-gray-900">
                            {WISHLIST_SIDEBAR_MESSAGE}
                            <Link href="/search">
                              <a className="font-medium mt-2 text-indigo-600 hover:text-indigo-500" >
                                {GENERAL_CATALOG}
                                <span aria-hidden="true"> &rarr;</span>
                              </a>
                            </Link>
                          </div>
                        )}
                        {!isEmpty && (
                          <ul role="list" className="divide-y divide-gray-200">
                            {cartItems?.lineItems?.map((product: any, idx: number) => (
                              <li key={product.id} className={cn({
                                'pb-4': idx === 0, // if first item
                                'pt-4': idx === cartItems.lineItems.length - 1, // if first item
                                'py-4': idx !== 0 && idx !== cartItems.lineItems.length - 1, // if not first item
                              })}>
                                <div className="flex">
                                  {/* product image */}
                                  <div className="overflow-hidden h-32">
                                    <Link href={`/${product.slug}`}>
                                      <a>
                                        <img
                                          src={product.image}
                                          alt={product.name}
                                          className="object-cover object-top w-full h-full"
                                        />
                                      </a>
                                    </Link>
                                  </div>
                                  <div className="flex flex-col flex-1 px-5">
                                    <div>
                                      <div className="flex justify-between text-gray-900 font-sm">
                                        <Link href={`/${product.slug}`}>
                                          <a className="text-ms">
                                            {getProductVariantDetailsByName(product.name).name}
                                          </a>
                                        </Link>
                                        <p className="text-gray-400 text-ms">
                                          {product.price?.formatted?.withTax}
                                        </p>
                                      </div>
                                      {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-ms">
                                          {getProductVariantDetailsByName(product.name).color}
                                        </p>
                                        <p className="text-gray-400 text-ms">
                                          Size {getProductVariantDetailsByName(product.name).size}
                                        </p>
                                    </div>
                                    <div className="flex items-end justify-between flex-1 text-sm">
                                      {/* <p className="text-gray-500">Qty {product.quantity}</p> */}

                                      <div className="flex justify-between w-full">
                                        <button
                                          type="button"
                                          className="text-gray-400 text-ms hover:text-gray-700"
                                          onClick={() =>
                                            handleItem(product, 'delete')
                                          }
                                          >
                                          {GENERAL_REMOVE}
                                        </button>
                                        <div className="flex flex-row px-4 text-gray-900 border">
                                          <button
                                            type='button'
                                            disabled={product.qty === 1}
                                            className={cn("w-5 text-gray-900 focus:outline-none", {
                                              "opacity-25": product.qty === 1,
                                              "cursor-not-allowed": product.qty === 1,
                                            })}
                                            onClick={() => {
                                              handleItem(product, 'decrease')
                                            }}
                                          >
                                            <MinusSmIcon/>
                                          </button>
                                          <span className="px-2 py-2 text-md">
                                            {product.qty}
                                          </span>
                                          <button
                                            onClick={() =>
                                              handleItem(product, 'increase')
                                            }
                                            className="w-5 text-gray-900 focus:outline-none"
                                          >
                                            <PlusSmIcon/>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {product.children?.map(
                                  (child: any, idx: number) => {
                                    const message = JSON.parse(child.customInfo1);
                                    const personalization = message?.formatted?.data?.Message;
                                    
                                    return (
                                      <div className="flex" key={idx}>
                                        {/* {console.log("check "+JSON.stringify(child))} */}
                                        <div className="justify-between flex-shrink-0 w-24 py-1 ml-1 overflow-hidden">
                                          <div className='image-container'>
                                            <img
                                              // layout='fill'
                                              src='/KSTMize.jpg'
                                              // alt={child.name}
                                              className="object-cover object-center w-full h-full image"
                                            ></img>
                                          </div>
                                        </div>
                                        <div className="flex flex-col flex-1 ml-4">
                                          <div>
                                            <div className="flex justify-between font-medium text-gray-900">
                                              <h3 onClick={handleClose} className="font-bold">
                                                {/* <Link href={`/${child.slug}`}> */}
                                                <label>
                                                  {child.name}
                                                </label>
                                                {/* </Link> */}
                                              </h3>
                                              <p className="ml-4">
                                                {child.price?.formatted?.withTax}
                                              </p>
                                            </div>
                                            {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                                          </div>
                                          <div className='w-full'>
                                            {personalization}
                                          </div>
                                        </div>
                                        <div className="flex items-start flex-1 ml-4 text-sm">
                                          {/* <p className="text-gray-500">Qty {product.quantity}</p> */}

                                          <button
                                            type="button"
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                            onClick={() =>
                                              handleItem(child, GENERAL_DELETE)
                                            }
                                          >
                                            {GENERAL_REMOVE}
                                          </button>
                                        </div>
                                      </div>
                                    )
                                  }
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                  {!isEmpty && (
                    <div className='mt-2'>
                      <PromotionInput />
                      <div className="flex justify-between text-sm text-gray-500">
                        <p>{SUBTOTAL_INCLUDING_TAX}</p>
                        <p>{cartItems.subTotal?.formatted?.withTax}</p>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <p>{GENERAL_SHIPPING}</p>
                        <p>{cartItems.shippingCharge?.formatted?.withTax}</p>
                      </div>

                      {cartItems.promotionsApplied?.length > 0 && (
                        <div className="flex justify-between text-sm text-gray-500">
                          <p>{GENERAL_DISCOUNT}</p>
                          <p className='text-red-500'>{'-'}{cartItems.discount?.formatted?.withTax}</p>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-gray-900">
                        <p>{GENERAL_TOTAL}</p>
                        <p>{cartItems.grandTotal?.formatted?.withTax}</p>
                      </div>
                      <div className="mt-3">
                        <Link href="/cart">
                          <a
                            onClick={handleClose}
                            className="flex items-center justify-center py-3 text-gray-50 capitalize bg-black transition hover:opacity-75"
                          >
                            {content.GENERAL_CHECKOUT}
                          </a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default CartSidebarView
