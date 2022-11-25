import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Text } from '@components/ui'
import { ERROR_PAGE_NOT_FOUND, ERROR_PAGE_NOT_FOUND_MESSAGE } from '@components/utils/textVariables'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const { pages } = await commerce.getAllPages({ config, preview })
  const { categories, brands } = await commerce.getSiteInfo({ config, preview })
  return {
    props: {
      pages,
      categories,
      brands,
    },
    revalidate: 200,
  }
}

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-8 sm:mx-auto py-20 flex flex-col items-center justify-center fit">
      <Text variant="heading">{ERROR_PAGE_NOT_FOUND}</Text>
      <Text className="">
        {ERROR_PAGE_NOT_FOUND_MESSAGE}
      </Text>
    </div>
  )
}

NotFound.Layout = Layout
