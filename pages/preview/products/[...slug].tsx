import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductView } from '@components/product'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { LOADER_LOADING } from '@components/utils/textVariables'

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext<{ slug: string }>) {
  const productPromise = commerce.getProductPreview({ query: params!.slug[0] })
  const product = await productPromise

  const infraPromise = commerce.getInfra();
  const infra = await infraPromise;
  return {
    props: {
      data: product,
      slug: params!.slug[0],
      globalSnippets: infra?.snippets ?? [],
      snippets: product?.snippets ?? []
    },
    revalidate: 200,
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const { products } = await commerce.getAllProductPaths()
  let paths = products.map((product: any) => {
    if (!product.slug.includes('preview/products/')) {
      return `/preview/products/${product.slug}`
    } else return `/preview/products/${product.slug}`
  })
  return {
    paths: paths,
    fallback: 'blocking',
  }
}

function Slug({ data, setEntities, recordEvent, slug }: any) {
  const router = useRouter()
  return router.isFallback ? (
    <h1>{LOADER_LOADING}</h1>
  ) : (
    data && (
      <ProductView
        recordEvent={recordEvent}
        setEntities={setEntities}
        data={data.product}
        slug={slug}
        snippets={data.snippets}
        isPreview={true}
      />
    )
  )
}

Slug.Layout = Layout

export default withDataLayer(Slug, PAGE_TYPES.Product)
