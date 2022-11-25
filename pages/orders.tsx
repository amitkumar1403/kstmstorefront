import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Bag } from '@components/icons'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import { 
  GENERAL_MY_ORDERS, 
  MESSAGE_NO_ORDER_FOUND, 
  MESSAGE_NO_ORDER_FOUND_TEXT 
} from '@components/utils/textVariables'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise

  return {
    props: { pages, categories },
  }
}

export default function Orders() {
  return (
    <Container>
      <Text variant="pageHeading">{GENERAL_MY_ORDERS}</Text>
      <div className="flex-1 p-24 flex flex-col justify-center items-center ">
        <span className="border border-dashed border-secondary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-primary text-primary">
          <Bag className="absolute" />
        </span>
        <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
          {MESSAGE_NO_ORDER_FOUND}
        </h2>
        <p className="text-accent-6 px-10 text-center pt-2">
          {MESSAGE_NO_ORDER_FOUND_TEXT}
        </p>
      </div>
    </Container>
  )
}

Orders.Layout = Layout
