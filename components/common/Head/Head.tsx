// Base Imports
import { FC } from 'react'
import NextHead from 'next/head'

// Other Imports
import { DefaultSeo } from 'next-seo'
import config from '@framework/seo.json'

const Head: FC = () => {
  return (
    <>
      <DefaultSeo {...config} />
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" key="site-manifest" />
      </NextHead>
    </>
  )
}

export default Head
