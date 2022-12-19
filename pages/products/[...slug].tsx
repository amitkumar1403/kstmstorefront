import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import {useState} from 'react'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductView } from '@components/product'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { LOADER_LOADING } from '@components/utils/textVariables'
import products from 'pages/api/catalog/products'

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,  
}: GetStaticPropsContext<{ slug: string }>) {
  const productPromise = commerce.getProduct({ query: params!.slug[0] })
  const product = await productPromise

  // GET SELECTED PRODUCT ALL RELATED PRODUCTS
  const relatedProductsPromise = commerce.getRelatedProducts({ query: product?.product?.recordId })
  const relatedProducts = await relatedProductsPromise;

  const infraPromise = commerce.getInfra();
  const infra = await infraPromise;
  return {
    props: {
      data: product,
      slug: params!.slug[0],
      relatedProducts: relatedProducts,
      globalSnippets: infra?.snippets ?? [],
      snippets: product?.snippets
    },
    revalidate: 200,
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const { products } = await commerce.getAllProductPaths()
  let paths = products.map((product: any) => {
    if (!product.slug.includes('products/')) {
      return `/products/${product.slug}`
    } else return `/${product.slug}`
  })
  return {
    paths: paths,
    fallback: 'blocking',
  }
}

function Slug({ data, setEntities, relatedProducts, recordEvent, slug }: any) {
  const router = useRouter()
  {console.log("reeeee "+JSON.stringify(data?.relatedProducts))}

  return router.isFallback ? (
    <h1>{LOADER_LOADING}</h1>
  ) : (
    data && (
      <ProductView
        recordEvent={recordEvent}
        setEntities={setEntities}
        relatedProducts={ relatedProducts }
        data={data.product}
        slug={slug}
        snippets={data.snippets}
      />
    )
  )
}

Slug.Layout = Layout

export default withDataLayer(Slug, PAGE_TYPES.Product)
