import { EVENTS_MAP } from './constants'
import axios from 'axios'
import Cookies from 'js-cookie'

const endpoint = 'https://omnilytics.bettercommerce.io/data'

const publisher = async (data: any, event: string) => {
  const windowClone: any = typeof window !== 'undefined' ? window : {}
  const windowDataLayer = windowClone.dataLayer && windowClone.dataLayer[0]

  const getQueryStringValue = function (n: string) {
    return decodeURIComponent(
      window.location.search.replace(
        new RegExp(
          '^(?:.*[&\\?]' +
            encodeURIComponent(n).replace(/[\.\+\*]/g, '\\$&') +
            '(?:\\=([^&]*))?)?.*$',
          'i'
        ),
        '$1'
      )
    )
  }

  const visitorData: any = JSON.parse(
    windowClone.localStorage.getItem('user')
  ) || {
    email: '',
  }

  const _getOmniImage = function () {
    var t = '',
      n: any = document.getElementsByClassName('omni-img')
    return (
      n && n[0]
        ? (t = n[0].src)
        : ((n = document.getElementsByTagName('img')),
          (t = n.length > 0 ? n[0].src : null)),
      t
    )
  }

  const _cloneNavigator = function () {
    var t = window.navigator,
      i = Object.keys(Object.getPrototypeOf(t))
    return i.reduce(function (n, i) {
      return (windowClone[i] = windowClone[i]), n
    }, {})
  }

  const getBrowserData = () => {
    return {
      cookies: document.cookie,
      dimensions: {
        documentHeight: Math.max(
          document.body.scrollHeight,
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.body.offsetHeight,
          document.body.clientHeight
        ),
        documentWidth: Math.max(
          document.body.scrollWidth,
          document.body.scrollWidth,
          document.body.offsetWidth,
          document.body.offsetWidth,
          document.body.clientWidth
        ),
        screenHeight: screen.height,
        screenWidth: screen.width,
        windowHeight: document.body.clientHeight,
        windowWidth: document.body.clientWidth,
      },
      navigator: _cloneNavigator(),
      referrer: document.referrer,
      timing: window.performance.timing,
    }
  }

  let dataToPublish = {
    dataLayer: {
      ...windowDataLayer,
      utmCampaign: getQueryStringValue('utm_campaign'),
      utmMedium: getQueryStringValue('utm_medium'),
      utmSource: getQueryStringValue('utm_source'),
      utmContent: getQueryStringValue('utm_content'),
      utmTerm: getQueryStringValue('utm_term'),
      pageUrl: window.location.href,
      urlReferrer: document.referrer,
      currency: Cookies.get('Currency'),
      visitorEmail: visitorData.email,
      visitorExistingCustomer: visitorData.userName || '',
      visitorId: visitorData.userId || '',
      visitorLoggedIn: !!visitorData.email,
      dataLayer: JSON.stringify({
        ...JSON.parse(data.entity || '{}'),
        omniImg: data.omniImg || _getOmniImage(),
      }),
      data: JSON.stringify(getBrowserData()),
      pageTitle: document.title,
      ...data,
    },
    deviceType: windowDataLayer.deviceType,
    ipAddress: windowDataLayer.ipAddress,
    event,
    session: windowDataLayer.sessionId,
    trackerId: process.env.NEXT_PUBLIC_OMNILYTICS_ID,
    url: window.location.href,
  }

  try {
    await axios.post(endpoint, { ...dataToPublish })
  } catch (error) {
    console.log(error)
  }
}

export default function AnalyticsService() {
  const addToCart = (payload: any) => {
    publisher(payload, 'addToCart')
  }
  const removedFromCart = (payload: any) => {
    publisher(payload, 'removedFromCart')
  }
  const basketViewed = (payload: any) => {
    publisher(payload, 'basketViewed')
  }

  const brandViewed = (payload: any) => {
    publisher(payload, 'brandViewed')
  }

  const categoryViewed = (payload: any) => {
    console.log('CategoryViewed')
  }

  const checkoutConfirmation = (payload: any) => {
    publisher(payload, 'checkoutConfirmation')
  }

  const checkoutStarted = (payload: any) => {
    publisher(payload, 'checkoutStarted')
  }

  const cmsPageViewed = (payload: any) => {
    console.log('CmsPageViewed')
  }

  const collectionViewed = (payload: any) => {
    console.log('CollectionViewed')
  }

  const customerCreated = (payload: any) => {
    publisher(payload, 'customerCreated')
  }

  const customerProfileViewed = (payload: any) => {
    publisher(payload, 'customerProfileViewed')
  }

  const customerUpdated = (payload: any) => {
    publisher(payload, 'customerUpdated')
  }
  const facetSearch = (payload: any) => {
    publisher(payload, 'facetSearch')
  }
  const faqViewed = (payload: any) => {
    console.log('FaqViewed')
  }
  const freeText = (payload: any) => {
    console.log('FreeText')
  }
  const pageViewed = (payload: any) => {
    publisher(payload, 'pageLoad')
  }
  const productViewed = (payload: any) => {
    publisher(payload, 'productViewed')
  }
  const search = (payload: any) => {
    publisher(payload, 'search')
  }

  const defaultAction = (payload?: any) => {
    return null
  }

  const {
    BasketItemAdded,
    BasketItemRemoved,
    BasketViewed,
    BrandViewed,
    CategoryViewed,
    CheckoutConfirmation,
    CheckoutStarted,
    CmsPageViewed,
    CollectionViewed,
    CustomerCreated,
    CustomerProfileViewed,
    CustomerUpdated,
    FacetSearch,
    FaqViewed,
    FreeText,
    PageViewed,
    ProductViewed,
    Search,
  } = EVENTS_MAP.EVENT_TYPES

  const eventHandler = function (event: any) {
    const action = event.detail.action
    const payload = event.detail.payload
    console.log(action, payload)
    switch (action) {
      case BasketItemAdded:
        addToCart(payload)
        break
      case BasketItemRemoved:
        removedFromCart(payload)
        break

      case BasketViewed:
        basketViewed(payload)
        break

      case BrandViewed:
        brandViewed(payload)
        break

      case CategoryViewed:
        categoryViewed(payload)
        break

      case CheckoutConfirmation:
        checkoutConfirmation(payload)
        break

      case CheckoutStarted:
        checkoutStarted(payload)
        break

      case CmsPageViewed:
        cmsPageViewed(payload)
        break

      case CollectionViewed:
        collectionViewed(payload)
        break

      case CustomerCreated:
        customerCreated(payload)
        break

      case CustomerProfileViewed:
        customerProfileViewed(payload)
        break

      case CustomerUpdated:
        customerUpdated(payload)
        break

      case FacetSearch:
        facetSearch(payload)
        break

      case FaqViewed:
        faqViewed(payload)
        break

      case FreeText:
        freeText(payload)
        break

      case PageViewed:
        pageViewed(payload)
        break

      case ProductViewed:
        productViewed(payload)
        break

      case Search:
        search(payload)
        break

      default:
        defaultAction(payload)
        break
    }
  }
  Object.keys(EVENTS_MAP.EVENT_TYPES).forEach((eventType: string) => {
    console.log('event listener', eventType)
    window.addEventListener(EVENTS_MAP.EVENT_TYPES[eventType], eventHandler)
  })
  return {
    removeListeners: () =>
      Object.keys(EVENTS_MAP.EVENT_TYPES).forEach((eventType: string) => {
        console.log(eventType, '=======remove')
        window.removeEventListener(
          EVENTS_MAP.EVENT_TYPES[eventType],
          eventHandler
        )
      }),
  }
}
