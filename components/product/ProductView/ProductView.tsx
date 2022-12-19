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
import { setItem, getItem } from '../../utils/localStorage'
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
  ITEM_TYPE_ADDON_10,
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
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import ProductColors from './ProductColors'

export default function ProductView({
  data = { images: [] },
  snippets,
  setEntities,
  relatedProducts,
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
  //for storing products in local storage for recently viewed
  const dataFromLocalStorage = getItem('Recent-Products') || "";
  const [localState, setLocalState] = useState(dataFromLocalStorage);

  // const [userStorage, setUserStorage] = useState ( () => {
  //   const savedItem:any = localStorage.getItem("Recent-Products");
  //   const parsedItem:any = JSON.parse(savedItem);
  //   return parsedItem || "";
  // });

  const { ProductViewed } = EVENTS_MAP.EVENT_TYPES
  const { Product } = EVENTS_MAP.ENTITY_TYPES
  const fetchProduct = async () => {
    const url = !isPreview ? NEXT_GET_PRODUCT : NEXT_GET_PRODUCT_PREVIEW;;
    const response: any = await axios.post(url, { slug: slug })
    console.log("hello " + JSON.stringify(response?.data))

    // condition to store products in local storage for recently viewed functionality
    if (response?.data?.product) {
      const recentlyViewedProduct = {
        image: response.data.product.image,
        price: response.data.product.listPrice.formatted.withTax,
        name: response.data.product.name,
        link: response.data.product.link,
      }

      setLocalState(recentlyViewedProduct);
      setItem('Recent-Products', recentlyViewedProduct);

      // let oldData = JSON.parse(localStorage.getItem("Recent-Products")  || "")
      // if(oldData){
      //   window.localStorage.setItem("Recent-Products",JSON.stringify([...oldData, recentlyViewedProduct]));
      // }
      // else{
      //   window.localStorage.setItem("Recent-Products",JSON.stringify([recentlyViewedProduct]));
      // }
      // //setting only unique elem in State
      // const key = 'name';
      // const arrayUniqueByKey:any = [...new Map(oldData?.map((item:any) =>
      //   [item[key], item])).values()];
      //     setLocalState(arrayUniqueByKey)
    }

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
  { console.log(product) }
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
    // console.log("related "+JSON.stringify(relatedProducts.relatedProducts))
    const addonProducts = relatedProducts.relatedProducts?.filter(
      (item: any) => item.itemType === ITEM_TYPE_ADDON_10
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

  const isEngravingAvailable = !!relatedProducts.relatedProducts?.filter(
    (item: any) => item.itemType === ITEM_TYPE_ADDON_10
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
  const addonPrice = relatedProducts.relatedProducts?.find((x:any)=> x?.itemType == 10)?.price?.formatted?.withTax;
  return (
    <div className="mx-auto bg-white page-container md:w-5/5 lg:p-0 md:p-0 sm:p-2">
      {/* Mobile menu */}
      <main className="sm:pt-0">
        {/* {JSON.stringify(isEngravingAvailable)} */}
        <div className="lg:w-full ">
          {/* Product */}
          <div className="lg:grid lg:pr-10 lg:grid-cols-12 lg:gap-x-16 lg:items-start">
            {/* Image gallery */}
            <Tab.Group as="div" className="flex flex-col-reverse lg:col-span-6 md:col-span-6 sm:col-span-6 xs:col-span-6 min-mobile-pdp">
              {/* Image selector */}
              <div className="grid sm:grid-cols-12 grid-cols-1-row-3 sm:gap-x-8 w-50">
                <div className='col-span-12 px-4 sm:px-0'>
                  {/*MOBILE PRODUCT IMAGE SLIDER*/}
                  <div className='block w-full pt-6 mx-auto sm:hidden sm:pt-0'>
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
                        className="inline-flex mx-4 space-x-0 sm:mx-0 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-4 lg:gap-x-0"
                      >
                        {content?.map((image: any, idx) => (
                          <SwiperSlide className="px-0" key={`${idx}-slider`}>
                            <div
                              key={idx}
                              className="inline-flex flex-col w-full text-center cursor-pointer lg:w-auto"
                            >
                              <div className="relative group">
                                {image.image ? (
                                  <div className='image-container'>
                                    <Image
                                      priority
                                      src={generateUri(image.image, "h=1800&fm=webp") || IMG_PLACEHOLDER}
                                      //src="/slider-1 - Copy.jpg"
                                      alt={image.name}
                                      className="object-fill object-center w-full h-full image"
                                      layout='responsive'
                                      sizes='320 600 100'
                                      width={1800} height={1400}
                                      blurDataURL={`${image.image}?h=600&w=400&fm=webp` || IMG_PLACEHOLDER}
                                    />
                                  </div>
                                ) : (
                                  <PlayIcon className="object-cover object-center w-full h-full" />
                                )}
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </div>
                    </Swiper>
                  </div>
                  {/*DESKTOP PRODUCT IMAGE SLIDER*/}
                  <div className="w-full mx-auto max-w sm:block lg:max-w-none">
                    <Tab.List className="grid sm:grid-cols-1 md:grid-cols-1 grid-cols-1-row-3 ">
                      {content?.map((image: any, idx) => (

                        <Tab
                          key={`${idx}-tab`}
                        >
                          {() => (
                            <>

                              <span className="sr-only">{image.name}</span>
                              <span className="relative md:w-full sm:w-full">
                                {image.image ? (
                                  <div className='image-container sm:w-full md:w-full'>
                                    {/* <ControlledZoom isZoomed={isZoomedT} onZoomChange={handleZoomChangeT}> */}
                                    <Image
                                      src={generateUri(image.image, "h=1800&fm=webp") || IMG_PLACEHOLDER}
                                      alt={image.name}
                                      priority
                                      className="object-cover object-center w-full h-full image"
                                      layout='responsive'
                                      sizes='320 600 1000'
                                      width={1800} height={1400}
                                    />

                                    {/* <Image
                                      priority
                                      src={generateUri(image.image, "h=1000&fm=webp") || IMG_PLACEHOLDER}
                                      alt={image.name}
                                      className="object-cover object-center w-full h-full image"
                                      layout='responsive'
                                      sizes='320 600 1000'
                                      width={600} height={1000}
                                      onClick={(ev: any) => handleImgLoadT(image.image)}
                                      blurDataURL={`${image.image}?h=600&w=400&fm=webp` || IMG_PLACEHOLDER}
                                    /> */}
                                    {/* </ControlledZoom> */}
                                  </div>
                                ) : (
                                  <>
                                    {/* <PlayIcon className="object-cover object-center w-full h-full" /> */}
                                    <img src="/pdp1.png" className='' />
                                    <img src="/pdp2.png" className='' />
                                  </>
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
            <div className="px-4 sm:mt-10 md:py-10 sm:py-4 sm:px-0 sm:pr-2 sm:pl-2 lg:mt-0 lg:col-span-6">

              {/* <h3 className="mb-2 text-sm font-semibold tracking-tight text-gray-700 uppercase sm:text-md sm:font-bold">
                {selectedAttrData.brand}
              </h3> */}
              <div className="flex justify-between">
                <h1 className="text-sm font-semibold tracking-tight text-black sm:text-2xl">
                  {selectedAttrData.name || selectedAttrData.productName}
                </h1>

                <h2 className="sr-only">{PRODUCT_INFORMATION}</h2>

                {updatedProduct ? (
                  <p className="text-2xl font-bold text-black sm:text-xl">
                    {selectedAttrData.price?.formatted?.withTax}
                    {selectedAttrData.listPrice?.raw.tax > 0 ? (
                      <>
                        <span className="px-2 font-normal text-gray-400 line-through font-xl">
                          {product.listPrice.formatted.withTax}
                        </span>
                        <span className='font-semibold text-red-500 text-md'>{discount}% off</span>
                      </>
                    ) : null}
                  </p>
                ) : (
                  <p className="text-3xl text-gray-900">------</p>
                )}

              </div>

              <label className="text-sm py-100">{selectedAttrData.description}</label>

              <div className="block pt-4 ">

                <div className="w-full ">
                  <AttributesHandler
                    product={product}
                    variant={selectedAttrData}
                    setSelectedAttrData={setSelectedAttrData}
                  />
                </div>



                {/* <div className="container py-0 text-center lg:grid lg:grid-cols-5">
            <div className="w-full mx-auto border border-grey-40 hover:border-black">
                <label className=''>XXL</label>
            </div>
            <div className="w-full border border-grey-40 hover:border-black">
                <label>XL</label>
            </div>
            <div className="border w- border-grey-40 hover:border-black">
                <label>L</label>
            </div>
            <div className="w-full border border-grey-40 hover:border-black">
             <label>M</label>
            </div>
            <div className="w-full border border-grey-40 hover:border-black">
             <label>S</label>
            </div>
        </div> */}

                <div className='flex py-3'>
                  <h3 className="text-sm font-bold ">Fabric : </h3>
                  <h3 className="px-3 py-0 text-sm"> 100% GOTS Organic Cotton in 350gm </h3>
                </div>

                <div className="container grid py-0 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 xsm:grid-cols-3 ">
                  <div className="w-full border h-17 border-grey-40 hover:border-black">
                    <img src='/Untitled-1-fabric.jpg' className='w-full h-16'  ></img>
                  </div>
                  <div className="w-full border h-17 border-grey-40 hover:border-black">
                    <img src='/Untitled-2-fabric.jpg' className='w-full h-16' ></img>
                  </div>
                  <div className="w-full border h-17 border-grey-40 hover:border-black">
                    <img src='/Untitled-3-fabric.jpg' className='w-full h-16' ></img>
                  </div>
                </div>

                {/* <div className='flex justify-between py-8' >
          <div>
            <img src='/KSTMize.jpg' width={100}></img>
            <label className="text-sm">Personalise with custom embroidery</label>
          </div>
          <label className='text-lg font-bold'>+ £20</label>
          </div> */}

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

              {/* <div className="w-full sm:w-6/12">
                <AttributesHandler
                  product={product}
                  variant={selectedAttrData}
                  setSelectedAttrData={setSelectedAttrData}
                />
              </div> */}

              {updatedProduct ? (
                <>
                  {/* { !updatedProduct?.customAttributes[2]?.value && ( */}
                  {!isEngravingAvailable && (
                    <div className="flex sm:flex-col1">
                      <Button
                        title={buttonConfig.title}
                        action={buttonConfig.action}
                        buttonType={buttonConfig.type || 'cart'}
                      />
                      {/* <button
                        type="button"
                        onClick={() => {
                          if (!isInWishList) {
                            handleWishList()
                          }
                        }}
                        className="flex items-center justify-center px-4 py-3 ml-4 text-gray-500 bg-white border border-gray-300 rounded-sm hover:bg-red-50 hover:text-pink sm:px-10 hover:border-pink"
                      >
                        {isInWishList ? (
                          <HeartIcon className="flex-shrink-0 w-6 h-6 text-pink" />
                        ) : (
                          <HeartIcon className="flex-shrink-0 w-6 h-6" />
                        )}
                        <span className="sr-only">{BTN_ADD_TO_FAVORITES}</span>
                      </button> */}
                    </div>
                  )}

                  {isEngravingAvailable && (
                    <>
                      <div className="mt-6 sm:mt-8 sm:col-1">
                        <div className='flex justify-between'>
                          <div>
                            <img
                              src='/KSTMize.jpg'
                              className="w-24 h-4 cursor-pointer"
                              onClick={() => {
                                showEngravingModal(true)
                              }}
                            >
                              {/* <span className="font">KSTMize it</span> */}
                            </img>
                            <label className="text-sm">Personalise with custom embroidery</label>
                          </div>
                          <label className='font-bold'>{addonPrice}</label>
                        </div>
                        <Button
                          className='block py-3 sm:hidden'
                          title={buttonConfig.title}
                          action={buttonConfig.action}
                          buttonType={buttonConfig.type || 'cart'}
                        />
                      </div>

                      <div className="flex mt-6 sm:mt-8 sm:flex-col1">
                        <Button
                          className='hidden sm:block '
                          title={buttonConfig.title}
                          action={buttonConfig.action}
                          buttonType={buttonConfig.type || 'cart'}
                        />
                        {/* <button
                          type="button"
                          onClick={() => {
                            if (!isInWishList) {
                              handleWishList()
                            }
                          }}
                          className="flex items-center justify-center px-4 py-3 ml-4 text-gray-500 bg-white border border-gray-300 rounded-sm hover:bg-red-50 hover:text-pink sm:px-10 hover:border-pink"
                        >
                          {isInWishList ? (
                            <HeartIcon className="flex-shrink-0 w-6 h-6 text-pink" />
                          ) : (
                            <HeartIcon className="flex-shrink-0 w-6 h-6" />
                          )}
                          <span className="sr-only">{BTN_ADD_TO_FAVORITES}</span>
                        </button> */}
                      </div>
                    </>
                  )}

                </>
              ) : null}
              <section
                aria-labelledby="details-heading"
                className="mt-4 sm:mt-6"
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
                <div className="mt-6 sm:mt-10">
                  <p className="text-lg text-gray-900">
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

          <div className='grid mr-0 grid-col-1'>
            <img src="/Banner-pic.jpg" className='h-30' ></img>
          </div>

          <div className='py-2 text-center'>
            <label className='text-lg font-semibold'>Recently viewed</label>

            {/* for recently viewed items */}
            <div className='w-full py-4 h-100 '>
              {/* <Swiper
            // install Swiper modules
            modules={[Navigation]}
            slidesPerView={3}
            spaceBetween={0}
            className="pt-2 external-buttons py-7"
            navigation
            height={6}
          >
        { localState?.map((val:any) => {
        return(
            <SwiperSlide className='py-2 mx-0 border border-grey-40 hover:border-black'>
              <div >
                <a href={val.link}>
                <img src="/slider-1 - Copy.jpg" className=''></img>
                <p>{val.name}</p>
                </a>
              </div>
            </SwiperSlide>
              
        ) 
       }) } */}
              <Swiper
                // install Swiper modules
                modules={[Navigation]}
                slidesPerView={3}
                spaceBetween={0}
                className="external-buttons py-7 "
                navigation
              >
                <SwiperSlide className='w-10 h-10 p-10 border border-grey-40 hover:border-black'><img src='/swiper2.jpg' ></img></SwiperSlide>
                <SwiperSlide className='w-10 h-10 p-10 border border-grey-40 hover:border-black'><img src='/swiper3.jpg' ></img></SwiperSlide>
                <SwiperSlide className='w-10 h-10 p-10 border border-grey-40 hover:border-black'><img src='/swiper3.jpg' ></img></SwiperSlide>
                <SwiperSlide className='w-10 h-10 p-10 border border-grey-40 hover:border-black'><img src='/swiper4.jpg' ></img></SwiperSlide>
              </Swiper>

            </div>
          </div>

          {/* Placeholder for pdp snippet */}
          <div className={`${ELEM_ATTR}${PDP_ELEM_SELECTORS[0]}`}></div>


          {/* <Reviews data={product.reviews} productId={product.recordId} /> */}
          {isEngravingAvailable && (
            // { updatedProduct?.customAttributes[2]?.value && (
            <Engraving
              show={isEngravingOpen}
              submitForm={handleEngravingSubmit}
              onClose={() => showEngravingModal(false)}
              product={product}
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
            <Dialog as="div" className="relative mt-4 z-999 top-4" onClose={handlePreviewClose}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handlePreviewClose} />
              </Transition.Child>

              <div className="fixed top-0 left-0 w-full overflow-y-auto z-9999">
                <div className="flex items-end justify-center h-screen min-h-screen p-4 mx-auto text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <div className="relative px-4 pt-5 pb-4 mx-auto overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-2/6 sm:p-2">
                      <div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="absolute p-2 text-gray-400 hover:text-gray-500 right-2 top-2 z-99"
                            onClick={handlePreviewClose}
                          >
                            <span className="sr-only">{CLOSE_PANEL}</span>
                            <XIcon className="w-6 h-6 text-black" aria-hidden="true" />
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
