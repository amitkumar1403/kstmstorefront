import "@assets/css/main.css"
import "@assets/css/chrome-bug.css"
import 'keen-slider/keen-slider.min.css'
import { FC, useEffect, useState, useLayoutEffect } from 'react'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import 'swiper/css/bundle'
import Cookies from 'js-cookie'
import { v4 as uuid_v4 } from 'uuid'
import {
  SessionIdCookieKey,
  DeviceIdKey,
  NEXT_INFRA_ENDPOINT,
  NEXT_API_KEYWORDS_ENDPOINT,
} from '@components/utils/constants'
import DataLayerInstance from '@components/utils/dataLayer'
import { postData } from '@components/utils/clientFetcher'
import geoData from '@components/utils/geographicService'
import TagManager from 'react-gtm-module'
import analytics from '@components/services/analytics/analytics'
import setSessionIdCookie, { createSession, isValidSession } from '@components/utils/setSessionId'
import axios from 'axios'
import { useRouter } from 'next/router'
import { resetSnippetElements } from "@framework/content/use-content-snippet"
import { ContentSnippet } from "@components/common/Content"

const tagManagerArgs: any = {
  gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
}

const Noop: FC = ({ children }) => <>{children}</>

const TEST_GEO_DATA = {
  Ip: '81.196.3.147',
  Country: 'Romania',
  CountryCode: 'RO',
  City: 'Bucharest',
  CityCode: 'B',
  DetailJson: null,
  Message: null,
  IsValid: false,
}

const setDeviceIdCookie = () => {
  if (!Cookies.get(DeviceIdKey)) {
    const deviceId = uuid_v4()
    Cookies.set(DeviceIdKey, deviceId)
    DataLayerInstance.setItemInDataLayer(DeviceIdKey, deviceId)
  } else {
    DataLayerInstance.setItemInDataLayer(DeviceIdKey, Cookies.get(DeviceIdKey))
  }
}

function MyApp({ Component, pageProps, nav, footer, ...props }: any) {
  const [appConfig, setAppConfig] = useState({})
  const [location, setUserLocation] = useState({ Ip: '' })
  const [isAnalyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [keywordsData, setKeywordsData] = useState([])
  const [isAppLoading, setAppIsLoading] = useState(true)
  const [language, setLanguage] = useState('')

  const snippets = [...pageProps?.globalSnippets ?? [], ...pageProps?.snippets ?? []];

  const router = useRouter()
  const Layout = (Component as any).Layout || Noop

  const googleTranslateElementInit = () => {
    const windowClone: any = window
    new windowClone.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        layout:
          windowClone.google.translate.TranslateElement.FloatPosition.TOP_LEFT,
      },
      'google_translate_element'
    )
  }

  useEffect(() => {
    const addScript = document.createElement('script')
    addScript.setAttribute(
      'src',
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    )
    document.body.appendChild(addScript)
      ; (window as any).googleTranslateElementInit = googleTranslateElementInit
  }, []);

  useEffect(() => {
    // Listener for snippet injector reset.
    router.events.on("routeChangeStart", () => {
      resetSnippetElements();
    });

    // Dispose listener.
    return () => {
      router.events.off("routeChangeComplete", () => {
      });
    };
  }, [router.events]);

  const fetchAppConfig = async () => {
    try {
      const response: any = await postData(NEXT_INFRA_ENDPOINT, {
        setHeader: true,
      })
      setAppConfig(response.result)
      Cookies.set('Currency', response.defaultCurrency)
      Cookies.set('Language', response.defaultLanguage)
      Cookies.set('Country', response.defaultCountry)
    } catch (error) {
      console.log(error, 'error')
    }
  }

  const initializeGTM = () => {
    if (process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID)
      TagManager.initialize(tagManagerArgs)
  }

  const fetchKeywords = async function () {
    try {
      const { data }: any = await axios.get(NEXT_API_KEYWORDS_ENDPOINT)
      setKeywordsData(data.result)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    initializeGTM()
    document.body.classList?.remove('loading')
    fetchAppConfig()
    fetchKeywords()
  }, [])

  useLayoutEffect(() => {
    DataLayerInstance.setDataLayer()

    // If browser session is not yet started.
    if (!isValidSession()) {

      // Initiate a new browser session.
      createSession();

      if (!process.env.NEXT_PUBLIC_DEVELOPMENT) {
        geoData()
          .then((response) => {
            DataLayerInstance.setItemInDataLayer('ipAddress', response.Ip)
            DataLayerInstance.setItemInDataLayer('city', response.City)
            DataLayerInstance.setItemInDataLayer('country', response.Country)
            setUserLocation(response)
            setAppIsLoading(false)
          })
          .catch((err) => {
            DataLayerInstance.setItemInDataLayer('ipAddress', '8.8.8.8')
          })
      } else {
        DataLayerInstance.setItemInDataLayer('ipAddress', '8.8.8.8')
        DataLayerInstance.setItemInDataLayer('ipAddress', TEST_GEO_DATA.Ip)
        setUserLocation(TEST_GEO_DATA)
        setAppIsLoading(false)
      }
    } else {
      setAppIsLoading(false)
    }
    let analyticsCb = analytics()
    setAnalyticsEnabled(true)
    setSessionIdCookie()
    setDeviceIdCookie()
    return function cleanup() {
      analyticsCb.removeListeners()
      Cookies.remove(SessionIdCookieKey)
    }
  }, [])

  return (
    <>
      <Head />
      <div id="google_translate_element" />

      <ManagedUIContext>
        {isAppLoading && !location.Ip ? (
          <main className="fit bg-white">
            <div className="fixed top-0 right-0 h-screen w-screen z-50 flex justify-center items-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          </main>
        ) : (
          <>
            {snippets ? (
              <ContentSnippet {...{ snippets }} />
            ) : (
              <></>
            )}

            <Layout
              nav={nav}
              footer={footer}
              config={appConfig}
              pageProps={pageProps}
              keywords={keywordsData}
            >
              <Component
                {...pageProps}
                location={location}
                ipAddress={location.Ip}
                config={appConfig}
              />
            </Layout>
          </>
        )}
      </ManagedUIContext>
    </>
  )
}

export default MyApp
