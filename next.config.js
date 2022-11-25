const commerce = require('./commerce.config.json')
const {
  withCommerceConfig,
  getProviderName,
} = require('./framework/commerce/config')

const provider = commerce.provider || getProviderName()
const isBC = provider === 'bigcommerce'
const isBetterCommerce = provider === 'bettercommerce'

module.exports = withCommerceConfig({
  commerce,
  images: {
    domains: ['liveocxcdn.azureedge.net', 'cdnbs.bettercommerce.io', 'cdn.shopify.com', 'liveocx.imgix.net', 'devocxblob.blob.core.windows.net','img.ffx.co.uk'],
    // for trident need to add domain ('res.cloudinary.com', '99yrs.co.in') for images
  },
  i18n: {
    locales: ['en-US', 'es'],
    defaultLocale: 'en-US',
  },
  rewrites() {
    return [
      (isBC) && {
        source: '/checkout',
        destination: '/api/checkout',
      },
      // The logout is also an action so this route is not required, but it's also another way
      // you can allow a logout!
      isBC && {
        source: '/logout',
        destination: '/api/logout?redirect_to=/',
      },
      // For Vendure, rewrite the local api url to the remote (external) api url. This is required
      // to make the session cookies work.

    ].filter(Boolean)
  },
  env: {
    BETTERCOMMERCE_AUTH_URL: process.env.BETTERCOMMERCE_AUTH_URL,
    BETTERCOMMERCE_BASE_URL: process.env.BETTERCOMMERCE_BASE_URL,
    BETTERCOMMERCE_CLIENT_ID: process.env.BETTERCOMMERCE_CLIENT_ID,
    BETTERCOMMERCE_SHARED_SECRET: process.env.BETTERCOMMERCE_SHARED_SECRET,
    OMS_BASE_URL: process.env.OMS_BASE_URL,
    BETTERCOMMERCE_DEFAULT_CURRENCY: process.env.BETTERCOMMERCE_DEFAULT_CURRENCY,
    BETTERCOMMERCE_DEFAULT_LANGUAGE: process.env.BETTERCOMMERCE_DEFAULT_LANGUAGE,
    BETTERCOMMERCE_DEFAULT_COUNTRY: process.env.BETTERCOMMERCE_DEFAULT_COUNTRY,
    BETTERCOMMERCE_CURRENCY: process.env.BETTERCOMMERCE_CURRENCY,
    BETTERCOMMERCE_LANGUAGE: process.env.BETTERCOMMERCE_LANGUAGE,
    BETTERCOMMERCE_COUNTRY: process.env.BETTERCOMMERCE_COUNTRY,
  },
})

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
