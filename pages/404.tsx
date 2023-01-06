import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import LayoutError from '../components/common/Layout/LayoutError'
import { Text } from '@components/ui'
import Image from "next/image";
import { isMobile } from 'react-device-detect'
import {
  ERROR_PAGE_NOT_FOUND,
  ERROR_PAGE_NOT_FOUND_MESSAGE,
} from '@components/utils/textVariables'

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
  return <>
    {!isMobile && (
      <>
        <div className="w-full py-14">
          <div className="error-container">
            <div className="img-section w-full text-center mb-8 mt-24">
              <Image
                priority
                width={152}
                height={152}
                src="/assets/icons/error-icon.svg"
                alt="404 Error Image"
                className="inline-block"></Image>
            </div>
            <div className="error-text-section w-full text-center">
              <h1 className="text-black sm:text-2xl font-semibold mb-2">
                404 : Page Not Found
              </h1>
              <p className="text-black">
                Check that you typed the address correctly. Maybe go back to
                your previous page or try using our site search to find
                something specific.
              </p>
            </div>
          </div>
        </div>
      </>
    )}
    {isMobile && (
      <>
        <div className="w-full py-8 px-4">
          <div className="error-container">
            <div className="img-section w-full text-left mb-4">
              <Image
                priority
                width={54}
                height={54}
                src="/assets/icons/error-icon.svg"
                alt="404 Error Image"
                className="inline-block"></Image>
            </div>
            <div className="error-text-section w-full text-left mb-6">
              <h1 className="text-black text-base font-semibold mb-2">
                404 : Page Not Found
              </h1>
              <p className="text-brown-light text-xs">
                Check that you typed the address correctly. Maybe go back to
                your previous page or try using our site search to find
                something specific.
              </p>
            </div>
            <div className="w-full">
              <a
                href="/"
                className="text-white bg-black block p-4 text-center text-sm font-semibold"
              >
                Back to Homepage
              </a>
            </div>
          </div>
        </div>
      </>
    )}
  </>;
}

NotFound.Layout = LayoutError
