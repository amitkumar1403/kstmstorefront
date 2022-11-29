import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useState, useEffect, Fragment, useCallback } from 'react'
import { Tab } from '@headlessui/react'
import { HeartIcon } from '@heroicons/react/outline'
import { StarIcon, PlayIcon } from '@heroicons/react/solid'
import { NextSeo } from 'next-seo'
import classNames from '@components/utils/classNames'
import { useUI } from '@components/ui/context'
import { KEYS_MAP, EVENTS } from '@components/utils/dataLayer'
import cartHandler from '@components/services/cart'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/navigation'
import SwiperCore, { Navigation } from 'swiper'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon, PlusSmIcon, MinusSmIcon } from '@heroicons/react/outline'
import {
  NEXT_CREATE_WISHLIST,
  NEXT_BULK_ADD_TO_CART,
  NEXT_UPDATE_CART_INFO,
  NEXT_GET_PRODUCT,
  NEXT_GET_PRODUCT_PREVIEW,
} from '@components/utils/constants'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import {
  ALERT_SUCCESS_WISHLIST_MESSAGE,
  BTN_ADD_TO_FAVORITES,
  BTN_NOTIFY_ME,
  BTN_PRE_ORDER,
  CLOSE_PANEL,
  GENERAL_ADD_TO_BASKET,
  GENERAL_ENGRAVING,
  GENERAL_PRICE_LABEL_RRP,
  GENERAL_REFERENCE,
  GENERAL_REVIEWS,
  GENERAL_REVIEW_OUT_OF_FIVE,
  IMG_PLACEHOLDER,
  ITEM_TYPE_ADDON,
  PRICEMATCH_ADDITIONAL_DETAILS,
  PRICEMATCH_BEST_PRICE,
  PRICEMATCH_SEEN_IT_CHEAPER,
  PRODUCT_AVAILABILITY,
  PRODUCT_INFORMATION,
  PRODUCT_IN_STOCK,
  PRODUCT_OUT_OF_STOCK,
  SLUG_TYPE_MANUFACTURER,
  YOUTUBE_VIDEO_PLAYER,
} from '@components/utils/textVariables'
import { ELEM_ATTR, PDP_ELEM_SELECTORS } from '@framework/content/use-content-snippet'
import { generateUri } from '@commerce/utils/uri-util'
import { round } from 'lodash'
import ImageZoom from "react-image-zooom";

//DYNAMIC COMPONENT LOAD IN PRODUCT DETAIL
const AttributesHandler = dynamic(() => import('./AttributesHandler'));
const BreadCrumbs = dynamic(() => import('@components/ui/BreadCrumbs'));
const RelatedProducts = dynamic(() => import('@components/product/RelatedProducts'));
const Bundles = dynamic(() => import('@components/product/Bundles'));
const Reviews = dynamic(() => import('@components/product/Reviews'));
const PriceMatch = dynamic(() => import('@components/product/PriceMatch'));
const Engraving = dynamic(() => import('@components/product/Engraving'));
const ProductDetails = dynamic(() => import('@components/product/ProductDetails'));
const Button = dynamic(() => import('@components/ui/IndigoButton'));
const PLACEMENTS_MAP: any = {
  Head: {
    element: 'head',
    position: 'beforeend',
  },
  PageContainerAfter: {
    element: '.page-container',
    position: 'afterend',
  },
  PageContainerBefore: {
    element: '.page-container',
    position: 'beforebegin',
  },
}

export default function ProductView({
  data = { images: [] },
  snippets,
  setEntities,
  recordEvent,
  slug,
  isPreview = false
}: any) {
  const {
    openNotifyUser,
    addToWishlist,
    openWishlist,
    basketId,
    cartItems,
    setCartItems,
    user,
    openCart,
  } = useUI()

  const [updatedProduct, setUpdatedProduct] = useState<any>(null)
  const [isPriceMatchModalShown, showPriceMatchModal] = useState(false)
  const [isEngravingOpen, showEngravingModal] = useState(false)
  const [isInWishList, setItemsInWishList] = useState(false)
  const [previewImg, setPreviewImg] = useState<any>();

  const product = updatedProduct || data

  const [selectedAttrData, setSelectedAttrData] = useState({
    productId: product?.recordId,
    stockCode: product?.stockCode,
    ...product,
  })

  const { ProductViewed } = EVENTS_MAP.EVENT_TYPES

  const { Product } = EVENTS_MAP.ENTITY_TYPES
  const fetchProduct = async () => {
    const url = !isPreview ? NEXT_GET_PRODUCT : NEXT_GET_PRODUCT_PREVIEW;;
    const response: any = await axios.post(url, { slug: slug })
    //console.log(JSON.stringify(response?.data))
    if (response?.data?.product) {
      eventDispatcher(ProductViewed, {
        entity: JSON.stringify({
          id: response.data.product.recordId,
          sku: response.data.product.sku,
          name: response.data.product.name,
          stockCode: response.data.product.stockCode,
          img: response.data.product.image,
        }),
        entityId: response.data.product.recordId,
        entityName: response.data.product.name,
        entityType: Product,
        eventType: ProductViewed,
        omniImg: response.data.product.image,
      })
      setUpdatedProduct(response.data.product)
      setSelectedAttrData({
        productId: response.data.product.recordId,
        stockCode: response.data.product.stockCode,
        ...response.data.product,
      })
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [slug])

  useEffect(() => {
    const { entityId, entityName, entityType, entity } = KEYS_MAP

    recordEvent(EVENTS.ProductViewed)
    if (snippets) {
      snippets.forEach((snippet: any) => {
        const domElement = document.querySelector(
          PLACEMENTS_MAP[snippet.placement]?.element
        )
        if (domElement) {
          domElement.insertAdjacentHTML(
            PLACEMENTS_MAP[snippet.placement].position,
            snippet.content
          )
        }
      })
    }
    //this function is triggered when the component is unmounted. here we clean the injected scripts
    return function cleanup() {
      snippets.forEach((snippet: any) => {
        document
          .getElementsByName(snippet.name)
          .forEach((node: any) => node.remove())
      })
    }
  }, [])

  if (!product) {
    return null
  }

  const handleNotification = () => {
    openNotifyUser(product.recordId)
  }

  let content = [{ image: selectedAttrData.image }, ...product.images].filter(
    (value: any, index: number, self: any) =>
      index === self.findIndex((t: any) => t.image === value.image)
  )

  if (product.videos && product.videos.length > 0) {
    content = [...product.images, ...product.videos].filter(
      (value: any, index: number, self: any) =>
        index === self.findIndex((t: any) => t.image === value.image)
    )
  }

  const handleImgLoadT = (image: any) => {
    setPreviewImg(image);
  }


  const handlePreviewClose = () => {
    setPreviewImg(undefined);
  }
  const buttonTitle = () => {
    let buttonConfig: any = {
      title: GENERAL_ADD_TO_BASKET,
      action: async () => {
        const item = await cartHandler().addToCart(
          {
            basketId: basketId,
            productId: selectedAttrData.productId,
            qty: 1,
            manualUnitPrice: product.price.raw.withTax,
            stockCode: selectedAttrData.stockCode,
            userId: user.userId,
            isAssociated: user.isAssociated,
          },
          'ADD',
          { product: selectedAttrData }
        )
        setCartItems(item)
      },
      shortMessage: '',
    }
    if (selectedAttrData.currentStock <= 0 && !product.preOrder.isEnabled) {
      if (
        !product.flags.sellWithoutInventory ||
        !selectedAttrData.sellWithoutInventory
      ) {
        buttonConfig.title = BTN_NOTIFY_ME
        buttonConfig.action = async () => handleNotification()
        buttonConfig.type = 'button'
      }
    } else if (
      product.preOrder.isEnabled &&
      selectedAttrData.currentStock <= 0
    ) {
      if (
        product.preOrder.currentStock < product.preOrder.maxStock &&
        (!product.flags.sellWithoutInventory ||
          selectedAttrData.sellWithoutInventory)
      ) {
        buttonConfig.title = BTN_PRE_ORDER
        buttonConfig.shortMessage = product.preOrder.shortMessage
        return buttonConfig
      } else if (
        product.flags.sellWithoutInventory ||
        selectedAttrData.sellWithoutInventory
      ) {
        buttonConfig = {
          title: GENERAL_ADD_TO_BASKET,
          action: async () => {
            const item = await cartHandler().addToCart(
              {
                basketId: basketId,
                productId: selectedAttrData.productId,
                qty: 1,
                manualUnitPrice: product.price.raw.withTax,
                stockCode: selectedAttrData.stockCode,
                userId: user.userId,
                isAssociated: user.isAssociated,
              },
              'ADD',
              { product: selectedAttrData }
            )
            setCartItems(item)
          },
          shortMessage: '',
        }
      } else {
        buttonConfig.title = BTN_NOTIFY_ME
        buttonConfig.action = async () => handleNotification()
        buttonConfig.type = 'button'
        return buttonConfig
      }
    }
    return buttonConfig
  }

  const buttonConfig = buttonTitle()

  const handleEngravingSubmit = (values: any) => {
    const updatedProduct = {
      ...product,
      ...{
        recordId: selectedAttrData.productId,
        stockCode: selectedAttrData.stockCode,
      },
    }
    const addonProducts = product.relatedProducts?.filter(
      (item: any) => item.stockCode === ITEM_TYPE_ADDON
    )
    const addonProductsWithParentProduct = addonProducts.map((item: any) => {
      item.parentProductId = product.recordId
      return item
    })
    const computedProducts = [
      ...addonProductsWithParentProduct,
      updatedProduct,
    ].reduce((acc: any, obj: any) => {
      acc.push({
        ProductId: obj.recordId || obj.productId,
        BasketId: basketId,
        ParentProductId: obj.parentProductId || null,
        Qty: 1,
        DisplayOrder: obj.displayOrder || 0,
        StockCode: obj.stockCode,
        ItemType: obj.itemType || 0,
        CustomInfo1: values.line1 || null,

        CustomInfo2: values.line2 || null,

        CustomInfo3: values.line3 || null,

        CustomInfo4: values.line4 || null,

        CustomInfo5: values.line5 || null,

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

    const asyncHandler = async () => {
      try {
        const newCart = await axios.post(NEXT_BULK_ADD_TO_CART, {
          basketId,
          products: computedProducts,
        })
        await axios.post(NEXT_UPDATE_CART_INFO, {
          basketId,
          info: [...Object.values(values)],
          lineInfo: computedProducts,
        })

        setCartItems(newCart.data)
        showEngravingModal(false)
      } catch (error) {
        console.log(error, 'err')
      }
    }
    asyncHandler()
  }

  const isEngravingAvailable = !!product.relatedProducts?.filter(
    (item: any) => item.stockCode === ITEM_TYPE_ADDON
  ).length

  //TODO no additionalProperties key found on product object
  const insertToLocalWishlist = () => {
    addToWishlist(product)
    setItemsInWishList(true)
    openWishlist()
  }
  const handleWishList = () => {
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

  const filteredRelatedProducts = product.relatedProducts?.filter(
    (item: any) => item.stockCode !== ITEM_TYPE_ADDON
  )

  const filteredRelatedProductList = product.relatedProductList?.filter(
    (item: any) => item.stockCode !== ITEM_TYPE_ADDON
  )


  const handleProductBundleUpdate = (bundledProduct: any) => {
    //debugger;
    if (bundledProduct && bundledProduct.id) {
      let clonedProduct = Object.assign({}, updatedProduct);
      if (clonedProduct && clonedProduct.componentProducts) {
        setUpdatedProduct(clonedProduct);
      }
    }
  }
  /*if (product === null) {
    return {
      notFound: true,
    }
  }*/


  SwiperCore.use([Navigation])
  var settings = {
    fade: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    centerMode: false,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  const saving = product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax;
  const discount = round((saving / product?.listPrice?.raw?.withTax) * 100, 0);
  return (
    <div className="bg-white page-container md:w-4/5 mx-auto">
      {/* Mobile menu */}
      <main className="sm:pt-8">
        <div className="lg:max-w-none">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:items-start">
            {/* Image gallery */}
            <Tab.Group as="div" className="flex flex-col-reverse lg:col-span-7 min-mobile-pdp">
              {/* Image selector */}
              <div className="grid sm:grid-cols-12 grid-cols-1-row-3 sm:gap-x-8">
                <div className='col-span-12 px-4 sm:px-0'>
                  {/*MOBILE PRODUCT IMAGE SLIDER*/}
                  <div className='block sm:hidden w-full mx-auto pt-6 sm:pt-0'>
                    <Swiper
                      slidesPerView={1}
                      spaceBetween={10}
                      navigation={true}
                      loop={true}

                      breakpoints={{
                        640: {
                          slidesPerView: 1,
                        },
                        768: {
                          slidesPerView: 4,
                        },
                        1024: {
                          slidesPerView: 4,
                        },
                      }}
                    >
                      <div
                        role="list"
                        className="mx-4 inline-flex space-x-0 sm:mx-0 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-4 lg:gap-x-0"
                      >
                        {content?.map((image: any, idx) => (
                          <SwiperSlide className="px-0" key={`${idx}-slider`}>
                            <div
                              key={idx}
                              className="cursor-pointer w-full inline-flex flex-col text-center lg:w-auto"
                            >
                              <div className="group relative">
                                {image.image ? (
                                  <div className='image-container'>
                                    <Image
                                      priority
                                      src={generateUri(image.image, "h=1000&fm=webp") || IMG_PLACEHOLDER}
                                      alt={image.name}
                                      className="w-full h-full object-center object-cover image"
                                      layout='responsive'
                                      sizes='320 600 100'
                                      width={600} height={1000}
                                      blurDataURL={`${image.image}?h=600&w=400&fm=webp` || IMG_PLACEHOLDER}
                                    />
                                  </div>
                                ) : (
                                  <PlayIcon className="h-full w-full object-center object-cover" />
                                )}
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </div>
                    </Swiper>
                  </div>
                  {/*DESKTOP PRODUCT IMAGE SLIDER*/}
                  <div className="hidden w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                    <Tab.List className="grid sm:grid-cols-1 grid-cols-1-row-3 gap-2">
                      {content?.map((image: any, idx) => (
                        <Tab
                          key={`${idx}-tab`}
                        >
                          {() => (
                            <>
                              <span className="sr-only">{image.name}</span>
                              <span className="relative">
                                {image.image ? (
                                  <div className='image-container'>
                                    {/* <ControlledZoom isZoomed={isZoomedT} onZoomChange={handleZoomChangeT}> */}
                                    <ImageZoom src={generateUri(image.image, "h=1000&fm=webp") || IMG_PLACEHOLDER}  alt={image.name} 
                                     priority
                                     className="w-full h-full object-center object-cover image"
                                     layout='responsive'
                                     sizes='320 600 1000'
                                     width={600} height={1000}
                                    />
                                    {/* <Image
                                      priority
                                      src={generateUri(image.image, "h=1000&fm=webp") || IMG_PLACEHOLDER}
                                      alt={image.name}
                                      className="w-full h-full object-center object-cover image"
                                      layout='responsive'
                                      sizes='320 600 1000'
                                      width={600} height={1000}
                                      onClick={(ev: any) => handleImgLoadT(image.image)}
                                      blurDataURL={`${image.image}?h=600&w=400&fm=webp` || IMG_PLACEHOLDER}
                                    /> */}
                                    {/* </ControlledZoom> */}
                                  </div>
                                ) : (
                                  <PlayIcon className="h-full w-full object-center object-cover" />
                                )}
                              </span>
                            </>
                          )}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                </div>
              </div>
            </Tab.Group>
            
            

            {/* Product info */}
            <div className="sm:mt-10 mt-2 px-4 sm:px-0 sm:mt-16 lg:mt-0 lg:col-span-5">
              
              {/* <h3 className="sm:text-md text-sm uppercase font-semibold sm:font-bold tracking-tight text-gray-700 mb-2">
                {selectedAttrData.brand}
              </h3> */}
              <div className="flex justify-between">
                <h1 className="sm:text-2xl text-sm tracking-tight text-black">
                  {selectedAttrData.name || selectedAttrData.productName}
                </h1>

                <h2 className="sr-only">{PRODUCT_INFORMATION}</h2>
                
                {updatedProduct ? (
                    <p className="sm:text-xl text-2xl font-bold text-black">
                      {selectedAttrData.price?.formatted?.withTax}
                      {selectedAttrData.listPrice?.raw.tax > 0 ? (
                        <>
                          <span className="px-2 font-xl line-through font-normal text-gray-400">
                            {product.listPrice.formatted.withTax}
                          </span>
                          <span className='text-md text-red-500 font-semibold'>{discount}% off</span>
                        </>
                      ) : null}
                    </p>
                  ) : (
                    <p className="text-3xl text-gray-900">------</p>
                  )}
                  
                </div>
                  
              <label className="py-100 text-sm">{selectedAttrData.description}</label>

        <div className="block pt-4">
        
        <label className="font-sm">Colour:ButterCup</label>

        <div className="container py-3 space-y-2 lg:space-y-0 lg:grid lg:grid-cols-9 sm:grid-cols-9 border-style: solid">
          
          <div className='border border-grey-40 hover:border-black'>
            <img src='/Untitled-1-colour.jpg'></img>
          </div>
          
          <div className='border border-grey-40 hover:border-black'>
            <img src='/Untitled-2-colour.jpg'></img>
          </div>

          <div className='border border-grey-40 hover:border-black'>
            <img src='/Untitled-3-colour.jpg'></img>
          </div>

          <div className='border border-grey-40 hover:border-black'>
            <img src='/Untitled-4-colour.jpg'></img>
          </div>

          <div className='border border-grey-40 hover:border-black' >
            <img src='/Untitled-5-colour.jpg'></img>
          </div>

          <div className='border border-grey-40 hover:border-black'>
            <img src='/Untitled-6-colour.jpg'></img>
          </div>

          <div className='border border-grey-40 hover:border-black'>
            <img src='/Untitled-7-colour.jpg'></img>
          </div>

          <div className='border border-grey-40 hover:border-black'>
            <img src='/Untitled-8-colour.jpg'></img>
          </div>

          <div className='border border-grey-40 hover:border-black'>
            <img src='/Untitled-9-colour.jpg' ></img>
          </div>

            {/* <div className="w-full rounded hover:shadow-2xl border-2">
                <img layout='fill' src="https://5.imimg.com/data5/NY/NQ/MY-23375112/59-250x250.jpg"
                    alt="image" />
            </div>
            <div className="w-full rounded hover:opacity-50 border-2">
                <img layout='fill' src="data:image/jpeg;base64,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"
                    alt="image"/>
            </div>
            <div className="w-full rounded hover:shadow-2xl border-2">
                <img layout='fill' src="https://png.pngitem.com/pimgs/s/2-27655_white-t-shirt-png-image-plain-white-t.png"
                    alt="image"/>
            </div>
            <div className="w-full rounded hover:shadow-2xl border-2">
                <img layout='fill' src="https://png.pngitem.com/pimgs/s/2-27490_plain-black-t-shirt-png-transparent-png.png"
                    alt="image"/>
            </div>
            <div className="w-full rounded hover:shadow-2xl border-2">
                <img layout='fill' src="data:image/png;base64,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"
                    alt="image"/>
            </div> */}
        </div>
          
        <div className='flex justify-between py-2'>
          <label className="text-lg">Size</label>
          <label className="text-sm">Size guide</label>
        </div>
 
        <div className="container py-0 lg:grid lg:grid-cols-6 text-center">
            <div className="w-full border border-grey-40 hover:border-black mx-auto">
                <label className=''>XXL</label>
            </div>
            <div className="w-full border border-grey-40 hover:border-black">
                <label>XL</label>
            </div>
            <div className="w- border border-grey-40 hover:border-black">
            <label>L</label>
            </div>
            <div className="w-full border border-grey-40 hover:border-black">
            <label>M</label>
            </div>
            <div className="w-full border border-grey-40 hover:border-black">
            <label>S</label>
            </div>
        </div>

        <div className='flex py-3'>
          <label className="text-lg">Fabric : </label>
          <label className="text-sm py-1 px-3"> 100% GOTS Organic Cotton in 350gm </label>
        </div>
 
        <div className="container py-0 lg:grid lg:grid-cols-3">
            <div className="w-full border border-grey-40 hover:border-black">
                <img src='/Untitled-1-fabric.jpg'  className=''  ></img>
            </div>
            <div className="w-full border border-grey-40 hover:border-black ">
                <img src='/Untitled-2-fabric.jpg' className='' ></img>
            </div>
            <div className="w-full border border-grey-40 hover:border-black ">
            <img src='/Untitled-3-fabric.jpg' className='' ></img>
            </div>
        </div>

         <div className='flex py-8 justify-between' >
          <div>
            <img src='/KSTMize.jpg' width={100}></img>
            <label className="text-sm">Personalise with custom embroidery</label>
          </div>
          <label className='text-lg font-bold'>+ £20</label>
          </div>
       
       </div>
              {/* Reviews */}
              <div className="mt-3">
                <h3 className="sr-only">{GENERAL_REVIEWS}</h3>
                <div className="flex items-center xs:flex-col">
                  <div className="flex items-center xs:text-center align-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          product.rating > rating
                            ? 'text-yellow-600 h-5 w-5'
                            : 'text-white h-1 w-1',
                          'flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">
                    {product.rating} {GENERAL_REVIEW_OUT_OF_FIVE}
                  </p>
                </div>
              </div>
      
              <div className="w-full sm:w-6/12">
                <AttributesHandler
                  product={product}
                  variant={selectedAttrData}
                  setSelectedAttrData={setSelectedAttrData}
                />
              </div>
       
              {updatedProduct ? (
                <>
                  {!isEngravingAvailable && (
                    <div className=" flex sm:flex-col1">
                      <Button
                        title={buttonConfig.title}
                        action={buttonConfig.action}
                        buttonType={buttonConfig.type || 'cart'}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!isInWishList) {
                            handleWishList()
                          }
                        }}
                        className="ml-4 py-3 px-4 rounded-sm bg-white border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-pink sm:px-10 hover:border-pink"
                      >
                        {isInWishList ? (
                          <HeartIcon className="h-6 w-6 flex-shrink-0 text-pink" />
                        ) : (
                          <HeartIcon className="h-6 w-6 flex-shrink-0" />
                        )}
                        <span className="sr-only">{BTN_ADD_TO_FAVORITES}</span>
                      </button>
                    </div>
                  )}

                  {isEngravingAvailable && (
                    <>
                      <div className="sm:mt-8 mt-6 flex sm:flex-col1">
                        <Button
                          className='block sm:hidden py-3'
                          title={buttonConfig.title}
                          action={buttonConfig.action}
                          buttonType={buttonConfig.type || 'cart'}
                        />
                      </div>
                      
                      <div className="sm:mt-8 mt-6 flex sm:flex-col1">
                        <Button
                          className='hidden sm:block '
                          title={buttonConfig.title}
                          action={buttonConfig.action}
                          buttonType={buttonConfig.type || 'cart'}
                        />
                        <button
                          className="sm:ml-4 max-w-xs flex-1 bg-gray-400 border border-transparent rounded-sm uppercase py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:w-full"
                          onClick={() => showEngravingModal(true)}
                        >
                          <span className="font-bold">{GENERAL_ENGRAVING}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!isInWishList) {
                              handleWishList()
                            }
                          }}
                          className="ml-4 py-3 px-4 rounded-sm bg-white border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-pink sm:px-10 hover:border-pink"
                        >
                          {isInWishList ? (
                            <HeartIcon className="h-6 w-6 flex-shrink-0 text-pink" />
                          ) : (
                            <HeartIcon className="h-6 w-6 flex-shrink-0" />
                          )}
                          <span className="sr-only">{BTN_ADD_TO_FAVORITES}</span>
                        </button>
                      </div>
                    </>
                  )}

                </>
              ) : null}
              <section
                aria-labelledby="details-heading"
                className="sm:mt-6 mt-4"
              >
                 
                <h2 id="details-heading" className="sr-only">
                  {PRICEMATCH_ADDITIONAL_DETAILS}
                </h2>
                <ProductDetails
                  product={product}
                  description={
                    product.description || product.shortDescription
                  }
                />
                <div className="sm:mt-10 mt-6">
                  <p className="text-gray-900 text-lg">
                    {selectedAttrData.currentStock > 0
                      ? product.deliveryMessage
                      : product.stockAvailabilityMessage}
                  </p>
                </div>
              </section>
            </div>
          </div>

          {product.componentProducts && (
            <Bundles
              price={product.price.formatted.withTax}
              products={product.componentProducts}
              productBundleUpdate={handleProductBundleUpdate}
            />
          )}
          {filteredRelatedProducts ? (
            <RelatedProducts
              relatedProducts={filteredRelatedProducts}
              relatedProductList={filteredRelatedProductList}
            />
          ) : null}

          <div className='bg-black'>
            
            <div className='grid grid-col-1 mr-0'>
              <img src="/Banner-pic.jpg" className='h-30' ></img>
            </div>

          </div>

          <div className='text-center py-2'>
            <label className='text-lg font-dark'>Recently viewed</label>
       
       {/* for recently viewed items */}
          <Swiper
            // install Swiper modules
              slidesPerView={3}
              spaceBetween={0}
              modules={[Navigation]}
            >

            <SwiperSlide className='h-full border border-grey-40 hover:border-black'><img src='/Untitled-1-swiper.jpg'></img></SwiperSlide>
            <SwiperSlide className='w-full border border-grey-40 hover:border-black'><img src='/Untitled-2-swiper.jpg'></img></SwiperSlide>
            <SwiperSlide className='w-full border border-grey-40 hover:border-black'><img src='/Untitled-3-swiper.jpg'></img></SwiperSlide>
            <SwiperSlide className='border border-grey-40 hover:border-black'><img src='/Untitled-4-swiper.jpg'></img></SwiperSlide>
          </Swiper>
          </div>


          {/* Placeholder for pdp snippet */}
          <div className={`${ELEM_ATTR}${PDP_ELEM_SELECTORS[0]}`}></div>


          <Reviews data={product.reviews} productId={product.recordId} />
          {isEngravingAvailable && (
            <Engraving
              show={isEngravingOpen}
              submitForm={handleEngravingSubmit}
              onClose={() => showEngravingModal(false)}
            />
          )}

          <PriceMatch
            show={isPriceMatchModalShown}
            onClose={showPriceMatchModal}
            productName={product.name}
            productImage={product.images[0]?.image}
            productId={product.id}
            stockCode={product.stockCode}
            ourCost={product.price.raw.withTax}
            rrp={product.listPrice.raw.withTax}
            ourDeliveryCost={product.price.raw.tax} //TBD
          />
        </div>
        <NextSeo
          title={product.name}
          description={product.metaDescription}
          additionalMetaTags={[
            {
              name: 'keywords',
              content: product.metaKeywords,
            },
          ]}
          openGraph={{
            type: 'website',
            title: product.metaTitle,
            description: product.metaDescription,
            images: [
              {
                url: product.image,
                width: 800,
                height: 600,
                alt: product.name,
              },
            ],
          }}
        />
      </main>
    
      {
        previewImg ? (
          <Transition.Root show={previewImg != undefined} as={Fragment} >
            <Dialog as="div" className="relative z-999 top-4 mt-4" onClose={handlePreviewClose}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handlePreviewClose} />
              </Transition.Child>

              <div className="fixed z-9999 top-0 left-0 w-full overflow-y-auto">
                <div className="flex items-end sm:items-center justify-center min-h-screen h-screen p-4 text-center sm:p-0 mx-auto">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:w-2/6 sm:p-2 mx-auto">
                      <div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="p-2 text-gray-400 hover:text-gray-500 absolute right-2 top-2 z-99"
                            onClick={handlePreviewClose}
                          >
                            <span className="sr-only">{CLOSE_PANEL}</span>
                            <XIcon className="h-6 w-6 text-black" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="text-center">
                          {
                            previewImg && (
                              <div key={previewImg.name + 'tab-panel'}>
                                <ImageZoom src={previewImg} alt={previewImg.name} />
                              </div>
                            )
                          }
                        </div>
                      </div>

                    </div>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        ) : (
          <></>
        )
      }
    </div>
  )
}
