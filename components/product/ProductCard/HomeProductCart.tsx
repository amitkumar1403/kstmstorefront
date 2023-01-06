import dynamic from 'next/dynamic'
import { FC } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/legacy/image';
const AttributeSelector = dynamic(() => import('./AttributeSelector'))
const Button = dynamic(() => import('@components/ui/IndigoButton'))
import cartHandler from '@components/services/cart'
import { useUI } from '@components/ui/context'
import axios from 'axios'
import { NEXT_CREATE_WISHLIST } from '@components/utils/constants'
import { HeartIcon } from '@heroicons/react/outline'
import { round } from 'lodash'
import {
  ALERT_SUCCESS_WISHLIST_MESSAGE,
  BTN_ADD_TO_WISHLIST,
  BTN_NOTIFY_ME,
  BTN_PRE_ORDER,
  GENERAL_ADD_TO_BASKET,
  GENERAL_PRICE_LABEL_RRP,
  IMG_PLACEHOLDER,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
interface Props {
  product: any
}

const colorKey = 'global.colour'

const WISHLIST_BUTTON_COLOR_SCHEME = {
  bgColor: 'bg-gray-500',
  hoverBgColor: 'bg-gray-400',
  focusRingColor: 'focus-gray-400',
}

interface Attribute {
  fieldName?: string
  fieldCode?: string
  fieldValues?: []
}

const HomeProductCard: FC<Props> = ({ product }) => {
  const [isInWishList, setItemsInWishList] = useState(false)
  const [isEntered, setisEntered] = useState(false)
  const [showColorPrice, setColorPrice] = useState({
    image: '/assets/icons/colors.png',
    price: '£80.00',
    name: 'Leggings Core',
  })
  const [currentProductData, setCurrentProductData] = useState({
    image: product.image,
    link: product.slug,
  })
  const {
    basketId,
    user,
    addToWishlist,
    openWishlist,
    setCartItems,
    openNotifyUser,
  } = useUI()

  const insertToLocalWishlist = () => {
    addToWishlist(product)
    setItemsInWishList(true)
    openWishlist()
  }
  const handleWishList = async () => {
    const accessToken = localStorage.getItem('user')
    if (accessToken) {
      const createWishlist = async () => {
        try {
          await axios.post(NEXT_CREATE_WISHLIST, {
            id: user.userId,
            productId: product.recordId,
            flag: true,
          })
          insertToLocalWishlist()
        } catch (error) {
          console.log(error, 'error')
        }
      }
      createWishlist()
    } else insertToLocalWishlist()
  }

  useEffect(() => {
    setCurrentProductData((prevState): any => {
      if (prevState.link !== product.slug) {
        return { ...prevState, image: product.image, link: product.slug }
      } else return { ...prevState }
    })
  }, [product.slug])

  const productWithColors =
    product.variantProductsAttribute &&
    product.variantProductsAttribute.find(
      (item: Attribute) => item.fieldCode === colorKey
    )

  const hasColorVariation =
    productWithColors && productWithColors.fieldValues.length >= 1

  const handleVariableProduct = (attr: any, type: string = 'enter') => {
    if (type === 'enter') {
      const variatedProduct = product.variantProducts.find((item: any) =>
        item.attributes.find(
          (variant: any) => variant.fieldValue === attr.fieldValue
        )
      )
      if (variatedProduct) {
        setCurrentProductData({
          image: variatedProduct.image,
          link: variatedProduct.slug,
        })
      }
    } else {
      setCurrentProductData({ image: product.image, link: product.slug })
    }
  }

  const secondImage = product.images[1]?.image

  const handleHover = (type: string) => {
    if (type === 'enter' && secondImage)
      setCurrentProductData({ ...currentProductData, image: secondImage })
    if (type === 'leave' && secondImage)
      setCurrentProductData({ ...currentProductData, image: product.image })
  }

  const handleNotification = () => {
    openNotifyUser(product.id)
  }

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: GENERAL_ADD_TO_BASKET,
      action: async () => {
        const item = await cartHandler().addToCart(
          {
            basketId,
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
      },
      shortMessage: '',
    }
    if (!product.currentStock && !product.preOrder.isEnabled) {
      buttonConfig.title = BTN_NOTIFY_ME
      buttonConfig.isNotifyMeEnabled = true
      buttonConfig.action = async () => handleNotification()
      buttonConfig.buttonType = 'button'
    } else if (!product.currentStock && product.preOrder.isEnabled) {
      buttonConfig.title = BTN_PRE_ORDER
      buttonConfig.isPreOrderEnabled = true
      buttonConfig.buttonType = 'button'
      buttonConfig.shortMessage = product.preOrder.shortMessage
    }
    return buttonConfig
  }

  const buttonConfig = buttonTitle()
  const saving = product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax
  const discount = round((saving / product?.listPrice?.raw?.withTax) * 100, 0)
  return (
    <div className="bg-gray-100 border border-gray-300 hover:border-black ">
      <div
        key={product.id}
        className="relative group "
        onMouseEnter={() => setisEntered(true)}
        onMouseLeave={() => {
          setisEntered(false)
        }}
      >
        <Link
          passHref
          href={`/${currentProductData.link}`}
          key={'data-product' + currentProductData.link}
        >
            <div className="relative overflow-hidden bg-gray-100 aspect-w-1 aspect-h-1 group-hover:bg-gray-200 ">
              <Image
                priority
                src={
                  generateUri(currentProductData.image, 'h=800&fm=webp') ||
                  '/assets/icons/newPajama.png'
                }
                // src='/assets/icons/newPajama.png'
                alt={product.name}
                onMouseEnter={() => {
                  handleHover('enter')
                }}
                onMouseLeave={() => {
                  handleHover('leave')
                }}
                className="object-cover object-center w-full h-full sm:h-full"
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }}
                width={800}
                height={800}
              ></Image>

              {buttonConfig.isPreOrderEnabled && (
                <div className="absolute px-1 py-1 bg-yellow-400 rounded-sm top-2">
                  {BTN_PRE_ORDER}
                </div>
              )}
              {buttonConfig.isNotifyMeEnabled && (
                <div className="absolute px-1 py-1 text-white bg-red-400 rounded-sm top-2">
                  {BTN_NOTIFY_ME}
                </div>
              )}
              {isInWishList ? (
                <span className="text-gray-900">
                  {ALERT_SUCCESS_WISHLIST_MESSAGE}
                </span>
              ) : null
              // <button
              //     className="absolute bottom-0 right-2 z-99 add-wishlist"
              //     onClick={handleWishList}
              // >
              //     {/* <HeartIcon
              //         className="z-50 flex-shrink-0 w-8 h-8 p-1 text-gray-800 hover:text-gray-500 rounded-3xl opacity-80"
              //         aria-hidden="true"
              // /> */}
              //     <span className="ml-2 text-sm font-medium text-gray-700 hover:text-red-800"></span>
              //     <span className="sr-only">f</span>
              // </button>
              }
            </div>
        </Link>

        <div className="pt-0 text-center bg-gray-100 group-hover:bg-gray-200">
          {hasColorVariation && isEntered ? (
            <AttributeSelector
              attributes={product.variantProductsAttribute}
              onChange={handleVariableProduct}
              link={currentProductData.link}
            />
          ) : (
            <div className="inline-block w-1 h-10 mt-2 mr-1 sm:h-4 sm:w-1 sm:mr-2" />
          )}

          <h3 className="pb-3 text-xs font-normal text-black truncate sm:text-sm ">
            {/* Product Name */}
            {/* {showColorPrice.name} */}
            <Link href={`/${currentProductData.link}`} className="font-medium">
              {' '}
              {product.name}
            </Link>
          </h3>

          <p className="mt-1 mb-2 font-bold text-gray-500 sm:mt-1 text-md">
            {/* Product Price */}
            {isEntered ? (
              <div className="mt-1 mb-1 font-bold text-gray-500 group-hover:bg-gray-200 sm:mt-1 text-md">
                <p className="text-center text-gray-500 text-bold">
                  {' '}
                  {product?.price?.formatted?.withTax}
                </p>
              </div>
            ) : (
              <div className="h-14"></div>
            )}

            {/* {product?.price?.formatted?.withTax} */}
            {product?.listPrice?.raw?.withTax > 0 &&
              product?.listPrice?.raw?.withTax !=
                product?.price?.raw?.withTax && (
                <>
                  <span className="px-2 text-sm font-normal text-gray-400 line-through">
                    {product?.listPrice?.formatted?.withTax}
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    {discount}% Off
                  </span>
                </>
              )}
          </p>
          <div className="flex flex-col">
            <Button
              className="hidden mt-2"
              title={buttonConfig.title}
              action={buttonConfig.action}
              type="button"
              buttonType={buttonConfig.buttonType || 'cart'}
            />
          </div>
        </div>
        {/* {isEntered && 
      (
        <div className='group-hover:bg-gray-200'>
        <img src={showColorPrice.image}
        className='h-10 m-auto w-50'
        />
        <p className='text-center text-gray-400 text-bold' >{showColorPrice.price}</p>
        </div>
      )
      } */}
      </div>
    </div>
  )
}
export default HomeProductCard
