import dynamic from 'next/dynamic'
import { FC } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

const SearchProductCard: FC<Props> = ({ product }) => {
  const [isInWishList, setItemsInWishList] = useState(false)
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
    product.variantProductsAttributeMinimal &&
    product.variantProductsAttributeMinimal.find(
      (item: Attribute) => item.fieldCode === colorKey
    )

  const hasColorVariation =
    productWithColors && productWithColors.fieldValues.length >= 1

  const handleVariableProduct = (attr: any, type: string = 'enter') => {
    if (type === 'enter') {
      const variatedProduct = product.variantProductsMinimal.find((item: any) =>
        item.variantAttributes.find(
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
  const saving  = product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax;
  const discount  = round((saving / product?.listPrice?.raw?.withTax) * 100, 0);
  return (
    <div className="border-gray-100">
    <div key={product.id} className="relative py-3 sm:py-3">
        
      <Link
        passHref
        href={`/${currentProductData.link}`}
        key={'data-product' + currentProductData.link}
      >
        <a href={currentProductData.link}>
          <div className="relative overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 hover:opacity-75">
              <Image
                priority
                src={generateUri(currentProductData.image, "h=400&fm=webp") || IMG_PLACEHOLDER} 
                alt={product.name}
                onMouseEnter={() => handleHover('enter')}
                onMouseLeave={() => handleHover('leave')}
                className="w-full sm:h-full h-full object-center object-cover"
                layout='responsive'
                width={400}
                height={600}
              ></Image>   
            {buttonConfig.isPreOrderEnabled && (
              <div className="bg-yellow-400 absolute py-1 px-1 rounded-sm top-2">
                {BTN_PRE_ORDER}
              </div>
            )}
            {buttonConfig.isNotifyMeEnabled && (
              <div className="bg-red-400 text-white absolute py-1 px-1 rounded-sm top-2">
                {BTN_NOTIFY_ME}
              </div>
            )}
            {isInWishList ? (
              <span className="text-gray-900">
                {ALERT_SUCCESS_WISHLIST_MESSAGE}
              </span>
            ) : (

              <button
                  className="absolute right-2 bottom-0 z-99 add-wishlist"
                  onClick={handleWishList}
              >
                  <HeartIcon
                      className="flex-shrink-0 h-8 w-8 z-50 text-gray-800 hover:text-gray-500 rounded-3xl p-1 opacity-80"
                      aria-hidden="true"
              />
                  <span className="ml-2 text-sm font-medium text-gray-700 hover:text-red-800"></span>
                  <span className="sr-only">f</span>
              </button>            
            )}   
          </div>
        </a>
      </Link>

      <div className="pt-0 text-left">
        {hasColorVariation ? (
          <AttributeSelector
            attributes={product.variantProductsAttributeMinimal}
            onChange={handleVariableProduct}
            link={currentProductData.link}
          />
        ) : (
          <div className="sm:h-1 sm:w-1 h-1 w-1 sm:mr-2 mr-1 mt-2 inline-block" />
        )}
        
        <h3 className="sm:text-sm text-xs font-normal text-gray-700 truncate">
          <Link href={`/${currentProductData.link}`}>
            <a href={`/${currentProductData.link}`}>{product.name}</a>
          </Link>
        </h3>

        <p className="sm:mt-1 mt-1 font-bold text-md text-gray-900">
          {product?.price?.formatted?.withTax}
          {product?.listPrice?.raw?.withTax > 0 && product?.listPrice?.raw?.withTax != product?.price?.raw?.withTax &&
              <>
                <span className='px-2 text-sm line-through font-normal text-gray-400'>{product?.listPrice?.formatted?.withTax}</span>
                <span className='text-red-600 text-sm font-semibold'>{discount}% Off</span>
              </>
            }
        </p>            
        <div className="flex flex-col">
          <Button
            className="mt-2 hidden"
            title={buttonConfig.title}
            action={buttonConfig.action}
            type="button"
            buttonType={buttonConfig.buttonType || 'cart'}
          />            
        </div>
      </div>
    </div>
  </div>
  )
}

export default SearchProductCard
