[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fvercel.com%2Fnew%2Fclone%3Frepository-url%26repo-name%3Dcommerce%26demo-title%3DNext.js%20Commerce%26demo-description%3DAn%20all-in-one%20starter%20kit%20for%20high-performance%20e-commerce%20sites.%26demo-url%3Dhttps%3A%2F%2Fdemo.vercel.store%26demo-image%3Dhttps%3A%2F%2Favatars.githubusercontent.com%2Fu%2F22865887%3Fs%3D400%26u%3D39f1404d7795dcf15ae6b7c1b3499a94d6c8308c%26v%3D4%26integration-ids%3Doac_MuWZiE4jtmQ2ejZQaQ7ncuDT)

## Getting Started

Run the following command to create a new project with this Starter:

```
yarn create next-app [project-name] -e https://github.com/better-commerce/betterstorefront
# or
npx create-next-app [project-name] -e https://github.com/better-commerce/betterstorefront
```

### Run Locally
- In the root folder create an .env file - use .env.template as a reference
- Run command: `yarn` or if you want to use npm use `npm install`
- To run it locally enter the next command `yarn dev` or `npm run dev`
- Visit http://localhost:3000

### Pre-requisites
- Request a sandbox with BetterCommerce platform by getting in touch letstalk@bettercommerce.io 
- Once you have the sandbox, you can login and generate the API Key & Shared Secret.


# BetterCommerce Storefront on Next.js 

BetterCommerce is a **Headless**, **API-First SaaS based**  suite of independent **composable** modules **Ecommerce, PIM, OMS**, **AI Product Recommendations** and **Analytics** that work independently with other platforms as well as it works fully integrated as an end-to-end commerce solution. 

This storefront is an all-in-one storefront based on Next.js, for high-performance e-commerce sites. With a few clicks, developers can clone, deploy and fully customize their own store. The storefront by default works out-of-the-box with BetterCommerce suite of APIs, however can be customized to work with other headless commerce API providers as well. 

Start right now at [bettercommerce.io](https://bettercommerce.io)

LIVE demo at: [demostore.bettercommerce.io](https://demostore.bettercommerce.io/)


## Features

- Performant by default
- SEO Ready
- Responsive
- Shopping Cart
- Wishlist
- Checkout 
- Internationalization
    - Multi-lingual
    - Multi-currency
- CMS driven 
    - Mega menu
    - Home page 
    - Support pages
- Search
    - Typeahead search
    - Search Keyword Redirection
    - Integrated Elastic Search
- Product List Page (PLP)
    - Product Collection Pages
    - Category Landing Pages
    - Brand Landing Pages
    - Lookbooks
- Product Detail Page (PDP)
    - Meta Information
    - Structured Data
    - Media - images & videos
    - Dynamic breadcrumbs
    - Reviews 
    - Variants
    - Bundles & Components
    - Related Products
- My Account
    - Registration / Login 
    - Profile
    - Wishlist
    - Address Book
    - Order History
    - Returns / Cancel
- Integrations - Integrate seamlessly with the most common plugins needed - google analytics, post code locator, marketing platforms, etc. 
- And lot many more features...

## Integrations

Next.js Commerce integrates out-of-the-box with BigCommerce, Shopify, Swell, Saleor and Vendure. We plan to support all major ecommerce backends.

## Request flow
- The client side is making requests to NextJS server.
- NextJS server then fetches from the bettercommerce API and returns the data
- You can observe this by opening network tab, you'll see most of the requests are redirected to hostname/api/REQUEST
- If you inspect the request in pages/api/REQUEST you will see that it is calling a different method from the Bettercommerce API

## Folder Structure
- `assets` - css files used in the application.
- `components` - All the components and utils to use in the app. A general rule of thumb for components design is to use functional components and make them as encapsulated and small as possible.
- `config` - basic store config.
- `framework` - All the functions used to communicate with the API.
- `pages` - This is a special folder used by NextJS. Do not rename this. For every file / folder in page NextJS will create a new page. For example if you put a /hello.tsx in pages, the content will be rendered on hostname/hello. Read more here: https://nextjs.org/docs/basic-features/pages
- `public` - images and other assets used publicly.

## Configuration

### Environment Variables

| Key  |Description   | Default Value   |
|---|---|---|
|COMMERCE_PROVIDER|Identify commerce provider being used in the storefront|Bettercommerce|
|BETTERCOMMERCE_CLIENT_ID|API Key|Available in the Settings > API Token|
|BETTERCOMMERCE_SHARED_SECRET|API Shared Secret|Available in the Settings > API Token|
|BETTERCOMMERCE_BASE_URL|Base URL for the BC API|https://api20.bettercommerce.io|
|BETTERCOMMERCE_AUTH_URL|API Auth URL which provides the API token|https://auth.bettercommerce.io|
|NEXT_PUBLIC_ORG_ID|Unique OrgId created for your org|Provided by your BC Account Manager|
|NEXT_PUBLIC_DOMAIN_ID|Unique Domain Id for domain|Provided by your BC Account Manager|
|NEXT_PUBLIC_API_VERSION|version of the API used|v2|
|NEXT_PUBLIC_ENABLE_INFINITE_SCROLL|Should the infinite scroll be enabled on PLPs or standard paging|TRUE|
|NEXT_PUBLIC_OMNILYTICS_ID|If Omnilytics is enabled for realtime event capture, then this value to be provided|Provided by your BC Account Manager|
|NEXT_PUBLIC_GEO_ENDPOINT|If Omnilytics is enabled for realtime event capture, then this value to be provided|Provided by your BC Account Manager|
|OMS_BASE_URL|OMS API Url which is used for fetching basket delivery plan, split shipment, inventory|https://omsapi20.bettercommerce.io/|

That's it!

## Contribute

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.
2. Create a new branch `git checkout -b MY_BRANCH_NAME`
3. Install yarn: `npm install -g yarn`
4. Install the dependencies: `yarn`
5. Duplicate `.env.template` and rename it to `.env.local`
6. Add proper store values to `.env.local`
7. Run `yarn dev` to build and watch for code changes

## Work in progress

We're using Github Projects to keep track of issues in progress and todo's. Here is our [Board](https://github.com/Better-Commerce/betterstorefront/projects/1)

People actively working on this project: @vikrmsaxena, @Lamperoyge, @JaiswalShailendra, @gagandeep-gingh-bt & @amitkumar1403
