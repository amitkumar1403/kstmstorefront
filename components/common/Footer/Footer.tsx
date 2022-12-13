import { FC } from 'react'
import Link from 'next/link'
import type { Page } from '@commerce/types/page'
import { Logo } from '@components/ui'
import config from './config'
import { useRouter } from 'next/router'
import {
  BTN_SUBSCRIBE,
  COPYRIGHT_FOOTER_INFO,
  GENERAL_EMAIL_ADDRESS,
  GENERAL_FOOOTER,
  SIGN_UP_FOR_NEWSLETTER,
  CUSTOM,
  SIGN_UP_TEXT,
  QUERY,
  NEW_PRODUCT,
  TOUCH,
} from '@components/utils/textVariables'

interface Props {
  config: []
}

const Footer: FC<Props> = ({ config }) => {
  const router = useRouter()

  const handleRedirect = (path: string) => (path ? router.push(path) : {})

  return (
    <footer aria-labelledby="footer-heading" className="bg-black p-2 mt-5">
      <h2 id="footer-heading" className="sr-only">
        {GENERAL_FOOOTER}
      </h2>
      {/* <div className="mt-12 md:mt-0 md:row-start-2 md:col-start-3 md:col-span-8 lg:row-start-1 lg:col-start-7 lg:col-span-6"> */}
      <div className="grid grid-cols-2 gap-0 py-3 mt-4">
        <h1 className="text-white lg:text-xl md:text-lg sm:text-md font-bold xl:text-2xl pt-5 ml-20 uppercase">
          {QUERY}
          {/* {SIGN_UP_TEXT} */}
        </h1>
        <div className="flex justify-center mb-8">
          <div className="my-auto pt-2">
            <form className="mt-2 flex sm:max-w-md">
              <div className="ml-4 flex-shrink-0 border w-48 sm:w-64 md:w-64 lg:w-96 xl:w-96">
                <button
                  type="submit"
                  className="w-full bg-black border border-transparent rounded-sm shadow-sm py-4 uppercase px-6 flex items-center justify-center font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  {TOUCH}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <hr className="text-white pb-6 pt-2" />
      <div className="sm:mx-auto md:mx-auto lg:ml-20 xl:ml-20 w-full sm:w-4/5 px-4 sm:px-0 lg:px-0">
        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-x-12">
          {/* Image section */}
          <div className="mt-2 pb-2">
            <p className="text-left text-white lg:text-xl md:text-lg dm:text-lg">
              {CUSTOM}
            </p>
            <span className="text-sm text-white text-left">{NEW_PRODUCT}</span>
            <form>
              <div className="w-full newsletter-form">
                <div className="w-full py-4">
                  <label htmlFor="email-address" className="sr-only">
                    {GENERAL_EMAIL_ADDRESS}
                  </label>
                </div>
                <div className="flex justify-between">
                  <input
                    id="email-address"
                    type="text"
                    autoComplete="email"
                    required
                    placeholder="Email"
                    className="h-16 sm:h-10 md:h-12 form-control block w-1/2 px-3 py-1.5 text-md font-bold text-start text-white bg-black border border-solid border-gray-300 transition ease-in-out m-0
                focus:text-white focus:border-blue-600 focus:outline-none"
                  />
                  <label htmlFor="email-address" className="sr-only">
                    {GENERAL_EMAIL_ADDRESS}
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Name"
                    className="h-16 sm:h-10 md:h-12 form-control block w-1/2 px-3 py-1.5 text-md font-bold text-start text-white bg-black border border-solid border-gray-300 transition ease-in-out m-0
                focus:text-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div className="w-full">
                  <button
                    type="submit"
                    className="w-full h-16 sm:h-10 md:h-12 bg-black border border-white rounded-sm py-3 uppercase px-6 flex items-center justify-center font-bold text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    {BTN_SUBSCRIBE}
                  </button>
                </div>
              </div>
            </form>
            {/* Sitemap sections */}
          </div>
          <div className="grid grid-cols-1 gap-0 text-center lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 lg:text-left pt-4 pb-8 xl:gap-x-8 lg:gap-x-8 md:gap-x-4">
            {/* {config?.map((item: any, idx: number) => {
              return (
                <div key={`${idx}-footer-item`}>
                  <h3 className="text-md font-medium text-gray-900">
                    {item.caption}
                  </h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {item.navBlocks.map((navBlock: any) => (
                      <li key={navBlock.boxTitle} className="text-sm">
                        <h3 className="text-sm font-medium text-gray-900">
                          {navBlock.boxTitle}
                        </h3>
                        <ul>
                          {navBlock.navItems.map(
                            (navItem: any, navItemIdx: number) => {
                              return (
                                <li
                                  key={navItemIdx + 'navItem'}
                                  className="text-sm"
                                >
                                  <span className="text-gray-500 hover:text-gray-600 cursor-hand">
                                    {navItem.caption}
                                  </span>
                                </li>
                              )
                            }
                          )}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })} */}
            <div className="pt-4 xl:ml-20 lg:ml-10">
              <strong className="lg:px-6 sm:px-6 md:px-6 text-white lg:text-2xl md:text-lg sm:text-xs xs:text-xs">
                CUSTOMER
              </strong>
              <nav
                aria-label="Footer Services Nav"
                className="mt-6 flex flex-col space-y-3 lg-text-md md:text-sm sm:text-xs mx-6 sm:px-2 md:px-2"
              >
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  My Account
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Our Mission
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Transparency
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Size Guide
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Shipping
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  FAQs
                </a>
              </nav>
            </div>
            <div className="pt-4 xl:ml-20 lg:ml-10 md:ml-10">
              <strong className="lg:px-6 sm:px-6 md:px-6 text-white lg:text-2xl md:text-lg sm:text-xs xs:text-xs">
                {' '}
                KSTM{' '}
              </strong>
              <nav
                aria-label="Footer About Nav"
                className="mt-6 flex flex-col space-y-3 lg-text-md md:text-sm sm:text-xs mx-6 sm:px-2 md:px-2"
              >
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  My Account
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Our Mission
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Transparency
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Size Guide
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Shipping
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  FAQs
                </a>
              </nav>
            </div>
            <div className="pt-4 xl:ml-20 lg:ml-10 md:ml-10">
              <strong className="lg:px-6 sm:px-6 md:px-6 text-white lg:text-2xl md:text-lg sm:text-xs xs:text-xs">
                {' '}
                LEGAL{' '}
              </strong>
              <nav
                aria-label="Footer Support Nav"
                className="mt-6 flex flex-col space-y-3 lg-text-md md:text-sm sm:text-xs mx-6"
              >
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Terms
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Privacy
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Consent
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-2 pb-2">
        <div className="grid grid-cols-3 gap-0 mr-14">
          <div className="mx-14">
            {' '}
            <p className="sm:text-md md:text-xl lg:text-2xl xl:text-2xl mt-0 font-heading mx-14 mx-auto text-white">
              &copy; {COPYRIGHT_FOOTER_INFO}
            </p>
          </div>
          <div className="mx-auto">
            <Logo />
          </div>
          <div className="flex flex-wrap mx-auto text-xl sm:text-sm md:text-lg">
            <ul className="flex items-center justify-center social-icon sm:justify-between">
              <li className="inline-block mr-1 align-middle">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://www.facebook.com/Damenschofficial/"
                  className="inline-block"
                >
                  <i className="sprite-icon sprite-fb"></i>
                </a>
              </li>
              <li className="inline-block mr-1 align-middle">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://twitter.com/damensch_in?lang=en"
                  className="inline-block"
                >
                  <i className="sprite-icon sprite-twitter"></i>
                </a>
              </li>
              <li className="inline-block mr-1 align-middle">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://www.instagram.com/damenschofficial/"
                  className="inline-block"
                >
                  <i className="sprite-icon sprite-insta"></i>
                </a>
              </li>
              <li className="inline-block mr-1 align-middle">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://www.youtube.com/channel/UCmHTYSGgtCijnH82npTrCJw"
                  className="inline-block"
                >
                  <i className="sprite-icon sprite-tic"></i>
                </a>
              </li>
              <li className="inline-block align-middle">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://www.linkedin.com/company/damensch"
                  className="inline-block"
                >
                  <i className="sprite-icon sprite-shopify"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
{
  /* <p className="text-sm text-gray-500">&copy; {COPYRIGHT_FOOTER_INFO}</p> */
}
