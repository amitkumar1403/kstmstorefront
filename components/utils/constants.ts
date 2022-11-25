//BETTERCOMMERCE ENDPOINTS
export const HOMEPAGE_SLUG = `/`
export const OMS_SHIPPING_PLANS = '/api/v1/oms/shipment/plans'
export const OMS_CLICK_AND_COLLECT = '/api/v1/oms/store/clickandcollect'
export const NEXT_CLICK_AND_COLLECT = '/api/shipping-plans/click-collect'
export const NEXT_SHIPPING_PLANS = '/api/shipping-plans/plans'
export const NEXT_UPDATE_DELIVERY_INFO = '/api/shipping-plans/update-delivery'
export const CATEGORY_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/category`
export const XML_FEED = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/content/feed`
export const NAV_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/content/nav`
export const COLLECTIONS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/collection`
export const LOOKBOOK_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/lookbook`
export const SITEVIEW_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/content/siteview`
export const CATALOG_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/brand`
export const SEARCH_MINIMAL_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/search/advanced/minimal`
export const SEARCH_ADVANCED_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/search/advanced`
export const NEXT_SEARCH_ADVANCED_ENDPOINT =
  '/api/catalog/get-category-products'
export const PRODUCT_API_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/product/`
export const PRODUCT_PREVIEW_API_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/product/preview`
export const BASKET_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/basket`
export const REGISTER_CUSTOMER = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/create`
export const AUTHENTICATE_CUSTOMER = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/authenticate`
export const CUSTOMER_BASE_API = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/`
export const CUSTOMER_NEWSLETTER = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/customer/newsletter/subscribe`
export const ORDERS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/order/`
export const ADDRESS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/address/`
export const CREATE_ADDRESS_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/address/create`
export const NEXT_STORE_LOCATOR = '/api/store-locator/get-stores'
export const CATALOG_SEARCH = `api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/search/r`
export const STORE_LOCATOR_API = '/api/v1/oms/store'
export const BASE_SEARCH_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/search`
export const SHIPPING_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/shipping-method`
export const CHECKOUT_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/checkout`
export const PAYMENTS_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/checkout/payment-methods`
export const RETURNS_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/return`
export const INFRA_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/infra/config`
export const KEYWORDS_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/catalog/search/keyword-redirections`
export const LOQATE_ADDRESS = '/api/loqate'
export const RETRIEVE_ADDRESS = '/api/retrieve-address'
//LOCAL ENDPOINTS
export const NEXT_API_PRICE_MATCH_ENDPOINT = `/api/price-match`
export const NEXT_API_KEYWORDS_ENDPOINT = '/api/keywords'
export const NEXT_API_NOTIFY_ME_ENDPOINT = `/api/notify-me/`
export const PRICE_MATCH_ENDPOINT = `/api/${process.env.NEXT_PUBLIC_API_VERSION}/commerce/basket/pricematch/add`
export const NEXT_ADD_TO_CART = `/api/add-item-cart`
export const NEXT_BULK_ADD_TO_CART = `/api/bulk-add-cart`
export const NEXT_UPDATE_CART_INFO = `/api/update-cart-info`
export const NEXT_GET_ORDER_DETAILS = '/api/customer/order-details'
export const NEXT_GET_CART = `/api/get-cart`
export const NEXT_ASSOCIATE_CART = '/api/customer/associate-cart'
export const NEXT_MERGE_CART = '/api/merge-cart'
export const NEXT_GET_USER_CART = '/api/get-user-cart'
export const NEXT_SIGN_UP = `/api/signup`
export const NEXT_VALIDATE_EMAIL = `/api/customer/validate-email`
export const NEXT_AUTHENTICATE = `/api/login`
export const NEXT_UPDATE_DETAILS = `/api/customer/update-details`
export const NEXT_SUBSCRIBE = `/api/customer/subscribe`
export const NEXT_GET_ORDERS = `/api/customer/orders`
export const NEXT_GET_WISHLIST = `/api/customer/get-wishlist`
export const NEXT_CREATE_WISHLIST = `/api/customer/create-wishlist`
export const NEXT_REMOVE_WISHLIST = `/api/customer/remove-item-from-wishlist`
export const NEXT_GET_SINGLE_LOOKBOOK = '/api/get-single-lookbook'
export const NEXT_ADDRESS = `/api/customer/address`
export const NEXT_EDIT_ADDRESS = `/api/customer/edit-address`
export const NEXT_CREATE_ADDRESS = `/api/customer/create-address`
export const NEXT_DELETE_ADDRESS = `/api/customer/delete-address`

export const NEXT_CREATE_REVIEW = `/api/create-review`
export const NEXT_GET_NAVIGATION = `/api/get-navigation`

export const NEXT_APPLY_PROMOTION = `/api/apply-promo`

export const NEXT_SHIPPING_ENDPOINT = '/api/shipping-options'
export const NEXT_UPDATE_CHECKOUT_ADDRESS = '/api/update-checkout-address'
export const NEXT_UPDATE_SHIPPING = '/api/update-shipping'
export const NEXT_GUEST_CHECKOUT = '/api/customer/guest-checkout'
export const NEXT_LOGIN_CHECKOUT = '/api/customer/login-checkout'
export const NEXT_SEARCH_PRODUCTS = `/api/catalog/search`
export const NEXT_GET_PRODUCT = '/api/catalog/get-product'
export const NEXT_GET_PRODUCT_PREVIEW = '/api/catalog/get-product-preview'
export const NEXT_PAYMENT_METHODS = '/api/payment-methods'
export const NEXT_CONFIRM_ORDER = '/api/confirm-order'
export const NEXT_INFRA_ENDPOINT = '/api/infra'
export const NEXT_SET_CONFIG = '/api/set-config'
export const NEXT_POST_PAYMENT_RESPONSE = '/api/payment-response'
export const NEXT_FORGOT_PASSWORD = '/api/customer/forgot-password'
export const NEXT_RESET_PASSWORD = '/api/customer/reset-password'
export const NEXT_VALIDATE_TOKEN = '/api/customer/validate-token'
export const NEXT_GET_RETURN_DATA = '/api/return/get-return-data'
export const NEXT_CREATE_RETURN_DATA = '/api/return/create'
export const NEXT_GET_RETURNS = '/api/return/get-user-returns'
//CONSTANTS

export const DefaultSessionCookieKey: string = `defaultSession`
export const SessionIdCookieKey: string = `sessionId`
export const DeviceIdKey: string = `deviceId`

//SHIPPING ACTION TYPES
export const SHIPPING_ACTION_TYPES_MAP = {
  GET_ALL: 'GET_ALL',
  CLICK_AND_COLLECT: 'CLICK_AND_COLLECT',
  ACTIVE_SHIPPING_METHODS: 'ACTIVE_SHIPPING_METHODS',
}

export const STRIPE_CHECKOUT_SESSION = '/api/payments/stripe-checkout-session'

export const NEXT_GEO_ENDPOINT =
  process.env.NEXT_PUBLIC_GEO_ENDPOINT ||
  'https://omnilytics.bettercommerce.io/api/v1/IpInfo?ipAddress='
export const UPDATE_ORDER_STATUS = '/api/update-order-status'

export const NEXT_PUBLIC_DEFAULT_CACHE_TIME = process.env.NEXT_PUBLIC_DEFAULT_CACHE_TIME_IN_MILLI_SECS;
export const NEXT_PUBLIC_API_CACHING_LOG_ENABLED = process.env.NEXT_PUBLIC_API_CACHING_LOG_ENABLED;

// Default currency, language & country settings.
export const BETTERCOMMERCE_DEFAULT_CURRENCY = process.env.BETTERCOMMERCE_DEFAULT_CURRENCY;
export const BETTERCOMMERCE_DEFAULT_LANGUAGE = process.env.BETTERCOMMERCE_DEFAULT_LANGUAGE;
export const BETTERCOMMERCE_DEFAULT_COUNTRY = process.env.BETTERCOMMERCE_DEFAULT_COUNTRY;

// Override currency, language & country settings ONLY FOR specific storefronts WHEREVER REQUIRED.
export const BETTERCOMMERCE_CURRENCY = process.env.BETTERCOMMERCE_CURRENCY;
export const BETTERCOMMERCE_LANGUAGE = process.env.BETTERCOMMERCE_LANGUAGE;
export const BETTERCOMMERCE_COUNTRY = process.env.BETTERCOMMERCE_COUNTRY;