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

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        {GENERAL_SHOPPING_CART}
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={handleClose}
                        >
                          <span className="sr-only">{CLOSE_PANEL}</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        {isEmpty && (
                          <div className="text-gray-900 h-full w-full flex flex-col justify-center items-center">
                            {WISHLIST_SIDEBAR_MESSAGE}
                            <Link href="/search">
                              <button
                                type="button"
                                className="text-indigo-600 font-medium hover:text-indigo-500"
                                onClick={handleClose}
                              >
                                {GENERAL_CATALOG}
                                <span aria-hidden="true"> &rarr;</span>
                              </button>
                            </Link>
                          </div>
                        )}
                        <ul
                          role="list"
                          className="-my-6 divide-y divide-gray-200"
                        >
                          {cartItems.lineItems?.map((product: any) => (
                            <li key={product.id} className="">
                              <div className="py-6 flex">
                                <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                  <Image
                                    width={100}
                                    height={100}
                                    layout='fixed'
                                    src={`${product.image}`|| IMG_PLACEHOLDER}
                                    alt={product.name}
                                    className="w-full h-full object-center object-cover"
                                  ></Image>
                                  {/* <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-center object-cover"
                                  /> */}
                                </div>

                                <div className="ml-4 flex-1 flex flex-col">
                                  <div>
                                    <div className="flex justify-between font-sm font-semibold text-gray-900">
                                      <h3 onClick={handleClose}>
                                        <Link href={`/${product.slug}`}>
                                          {product.name}
                                        </Link>
                                      </h3>
                                      <p className="ml-4">
                                        {product.price?.formatted?.withTax}
                                      </p>
                                    </div>
                                    {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                                  </div>
                                  <div className="flex-1 flex items-end justify-between text-sm">
                                    {/* <p className="text-gray-500">Qty {product.quantity}</p> */}

                                    <div className="flex justify-between w-full">
                                      <button
                                        type="button"
                                        className="font-medium text-red-300 hover:text-red-500"
                                        onClick={() =>
                                          handleItem(product, 'delete')
                                        }
                                      >
                                        {GENERAL_REMOVE}
                                      </button>
                                      <div className="border px-4 text-gray-900 flex flex-row">
                                        <MinusSmIcon
                                          onClick={() =>
                                            handleItem(product, 'decrease')
                                          }
                                          className="w-4 cursor-pointer"
                                        />
                                        <span className="text-md px-2 py-2">
                                          {product.qty}
                                        </span>
                                        <PlusSmIcon
                                          className="w-4 cursor-pointer"
                                          onClick={() =>
                                            handleItem(product, 'increase')
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {product.children?.map(
                                (child: any, idx: number) => {
                                  return (
                                    <div className="flex" key={idx}>
                                      <div className="ml-10 flex-shrink-0 w-12 h-12 border border-gray-200 rounded-md overflow-hidden">
                                        <div className='image-container'>
                                          <Image
                                            layout='fill'
                                            src={`${child.image}?w=100&h=100&fm=webp`}
                                            alt={child.name}
                                            className="w-full h-full object-center object-cover image"
                                          ></Image>
                                        </div>
                                      </div>
                                      <div className="ml-4 flex-1 flex flex-col">
                                        <div>
                                          <div className="flex justify-between font-medium text-gray-900">
                                            <h3 onClick={handleClose}>
                                              <Link href={`/${child.slug}`}>
                                                {child.name}
                                              </Link>
                                            </h3>
                                            <p className="ml-4">
                                              {child.price?.formatted?.withTax}
                                            </p>
                                          </div>
                                          {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                                        </div>
                                      </div>
                                      <div className="flex-1 flex items-end justify-end text-sm">
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
                      </div>
                    </div>
                  </div>

                  {!isEmpty && (
                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <PromotionInput />
                      <div className="flex py-2 justify-between font-small text-gray-900">
                        <p className='text-sm'>{SUBTOTAL_INCLUDING_TAX}</p>
                        <p className='font-bold text-black'>{cartItems.subTotal?.formatted?.withTax}</p>
                      </div>
                      <div className="flex py-2 justify-between font-small text-black">
                        <p>{GENERAL_SHIPPING}</p>
                        <p className='font-bold text-black'>{cartItems.shippingCharge?.formatted?.withTax}</p>
                      </div>

                      {cartItems.promotionsApplied?.length > 0 && (
                        <div className="flex py-2 justify-between font-small text-black">
                          <p className='text-sm'>{GENERAL_DISCOUNT}</p>
                          <p className='font-bold text-red-500'>{'-'}{cartItems.discount?.formatted?.withTax}</p>
                        </div>
                      )}
                      <div className="flex justify-between font-medium text-black">
                        <p className='text-xl'>{GENERAL_TOTAL}</p>
                        <p className='font-bold text-xl text-black'>{cartItems.grandTotal?.formatted?.withTax}</p>
                      </div>
                      <div className="mt-6">
                        <Link href="/cart" passHref>
                          <a
                            onClick={handleClose}
                            className="flex justify-center items-center px-6 py-3 border border-transparent rounded-sm uppercase shadow-sm font-medium text-white bg-black hover:bg-gray-900"
                            href="/cart"
                          >
                            {content.GENERAL_CHECKOUT}
                          </a>
                        </Link>
                      </div>
                      <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                        <p>
                          {GENERAL_OR_TEXT}{' '}
                          <button
                            type="button"
                            className="text-black font-medium hover:text-indigo-500"
                            onClick={handleClose}
                          >
                            {GENERAL_CONTINUE_SHOPPING}
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
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
