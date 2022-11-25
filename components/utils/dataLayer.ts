import Cookies from 'js-cookie'
import { SessionIdCookieKey } from '@components/utils/constants'
import geoData from '@components/utils/geographicService'
export const ACTIONS = {
  DynamicPage: 'DynamicPage',
  SearchFull: 'SearchFull',
  ProductDetail: 'ProductDetail',
  index: 'index',
}

export const EVENTS = {
  BasketItemAdded: 'BasketItemAdded',
  BasketItemRemoved: 'BasketItemRemoved',
  BasketViewed: 'BasketViewed',
  BlogViewed: 'BlogViewed',
  BrandViewed: 'BrandViewed',
  CategoryViewed: 'CategoryViewed',
  CheckoutConfirmation: 'CheckoutConfirmation',
  CheckoutStarted: 'CheckoutStarted',
  CmsPageViewed: 'CmsPageViewed',
  CollectionViewed: 'CollectionViewed',
  CustomerCreated: 'CustomerCreated',
  CustomerProfileViewed: 'CustomerProfileViewed',
  CustomerUpdate: 'CustomerUpdated',
  FacetSearch: 'FacetSearch',
  FaqViewed: 'FaqViewed',
  FreeText: 'FreeText',
  PageViewed: 'PageViewed',
  ProductViewed: 'ProductViewed',
  Search: 'Search',
}

export const KEYS_MAP = {
  entityId: 'entityId',
  entityName: 'entityName',
  entityType: 'entityType',
  entity: 'entity',
  eventType: 'eventType',
}

const getIpAddress = async () => {
  try {
    const response = await geoData()
    return response.Ip
  } catch (error) {
    return '81.196.3.222'
  }
}

const DataLayerSingleton = function () {
  const windowObject: any = window
  const navigator: any = windowObject.navigator
  const isTablet =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
      navigator.userAgent.toLowerCase()
    )

  const isMobile =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      navigator.userAgent.toLowerCase()
    )

  const deviceDetection = (function (n, t) {
    function s() {
      var n = !!navigator.userAgent.match(/iPhone|iPod/i)
      return n && (i.deviceOS = 'iOS (iPhone)'), n
    }
    function h() {
      var n = !!navigator.userAgent.match(/iPad/i)
      return n && (i.deviceOS = 'iOS (iPad)'), n
    }
    function c() {
      var n = !!navigator.userAgent.match(/Kindle/i)
      return n && (i.deviceOS = 'Kindle'), n
    }
    function l() {
      return !!(
        navigator.userAgent.match(
          /^(?=.*?(Android))((?!Kindle).)((?!Mobile).)*$/i
        ) ||
        h() ||
        ((n = !!navigator.userAgent.match(/(MSIE 10\.0).*(Touch)/i)),
        n && (i.deviceOS = 'Windows 8 Tablet'),
        n) ||
        c()
      )
      var n
    }
    var deviceVersion: any
    var lpMTagConfig: any
    var r = !1,
      u = !1,
      f: any = !1,
      i: any = {
        isIPhone: !1,
        isIPad: !1,
        isMobile: !1,
        isTablet: !1,
        deviceOS: '',
      },
      e = navigator.appVersion,
      o: any = /\s(\d)_\d/,
      a = /\s[(](\w+\s?\w*)[;]\s/
    return l()
      ? 3
      : (function () {
          var n, v, y, p
          o.exec(e) && a.exec(e) && (deviceVersion = o.exec(e)[1])
          u = !!(
            s() ||
            ((p = !1),
            c() ||
              ((p = !!navigator.userAgent.match(
                /^(?=.*?(Android))(?=.*?(Mobile)).*$/i
              )) &&
                (i.deviceOS = 'Android')),
            p) ||
            ((y = !!navigator.userAgent.match(/BlackBerry/i)),
            y && (i.deviceOS = 'Blackberry'),
            y) ||
            ((v = !!navigator.userAgent.match(/Opera Mini/i)),
            v && (i.deviceOS = 'Opera'),
            v) ||
            ((n = !!navigator.userAgent.match(/IEMobile/i)),
            n && (i.deviceOS = 'Windows'),
            n)
          )
          f = l()
          r = f || u
          i.isIPhone = s()
          i.isIPad = h()
          i.isMobile = u
          i.isTablet = f
          i.userAgent = navigator.appVersion
          '' === i.deviceOS &&
            navigator.userAgent.match(/(;\s).*;\s/i) &&
            (i.deviceOS = navigator.userAgent
              .match(/(;\s).*;\s/i)[0]
              .replace(';', ''))
          try {
            void 0 === lpMTagConfig.sessionVar && (lpMTagConfig.sessionVar = [])
            r && lpMTagConfig
              ? ((lpMTagConfig.sessionVar[lpMTagConfig.sessionVar.length] =
                  'mobileDevice=' + r),
                (lpMTagConfig.sessionVar[lpMTagConfig.sessionVar.length] =
                  'mobilePhone=' + u),
                (lpMTagConfig.sessionVar[lpMTagConfig.sessionVar.length] =
                  'mobileTablet=' + f),
                (lpMTagConfig.sessionVar[lpMTagConfig.sessionVar.length] =
                  'deviceOS=' + i.deviceOS.replace(/^\s+|\s+$/g, '')),
                (lpMTagConfig.sessionVar[lpMTagConfig.sessionVar.length] =
                  'deviceUserAgent=' + navigator.userAgent),
                t.innerWidth &&
                  ((lpMTagConfig.sessionVar[lpMTagConfig.sessionVar.length] =
                    'mobileDevice-VisualViewport-Width=' + t.innerWidth),
                  (lpMTagConfig.sessionVar[lpMTagConfig.sessionVar.length] =
                    'mobileDevice-VisualViewport-Height=' + t.innerHeight)))
              : lpMTagConfig &&
                !1 === r &&
                (lpMTagConfig.sessionVar[lpMTagConfig.sessionVar.length] =
                  'mobileDevice=' + r)
          } catch (n) {}
          return r
        })()
      ? 2
      : 1
  })(document, window)

  let deviceType = deviceDetection
  // if (isTablet) deviceType = 'tablet'
  // if (isMobile) deviceType = 'mobile'

  const setDataLayer = () => {
    const dataLayer = {
      sessionId: Cookies.get(SessionIdCookieKey),
      browserInfo: navigator.userAgent,
      deviceType: deviceType,
      channel: 'Web',
      lang: 'en-GB',
      domainId: process.env.NEXT_PUBLIC_DOMAIN_ID || '',
      appId: process.env.NEXT_PUBLIC_DOMAIN_ID || '',
      ipAddress: '',
      orgId: process.env.NEXT_PUBLIC_ORG_ID,
      server: 'x.x.x.29',
      visitorAffiliate: '',
      visitorEmail: null,
      visitorExistingCustomer: false,
      visitorId: '',
      visitorLoggedIn: false,
      visitorSegment: '',
    }
    if (!windowObject.dataLayer) {
      windowObject.dataLayer = [dataLayer]
    }
  }

  const getItemFromDataLayer = (item: any) => windowObject.dataLayer[0][item]

  const setItemInDataLayer = (item: any, value: any) => {
    setDataLayer()
    windowObject.dataLayer[0][item] = value
  }

  const setEntities = (entities: any) => {
    setDataLayer()
    Object.keys(entities).forEach((item: string) => {
      windowObject.dataLayer[0][item] = entities[item]
    })
  }

  return {
    setItemInDataLayer,
    getItemFromDataLayer,
    setDataLayer,
    setEntities,
    dataLayer: windowObject.dataLayer,
  }
}

let DataLayerInstance: any = null

if (typeof window !== 'undefined') {
  DataLayerInstance = DataLayerSingleton()
  Object.freeze(DataLayerInstance)
}

export default DataLayerInstance
