import { INFRA_ENDPOINT } from '@components/utils/constants'
import { setGeneralParams } from '../../fetcher'
import { cachedGetData } from '../utils/cached-fetch';

export default function useInfra(req: any) {
  //TODO change based on location
  return async function handler(setHeader = false) {
    const headers = {
      DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
    };
    
    try {
      const response: any = await cachedGetData(INFRA_ENDPOINT, req.cookies, headers);

      const languageCookie =
        req.cookies.Language === 'undefined' ? '' : req.cookies.Language

      const currencyCookie =
        req.cookies.Currency === 'undefined' ? '' : req.cookies.Currency

      const countryCookie =
        req.cookies.Country === 'undefined' ? '' : req.cookies.Country

      const defaultCurrency =
        currencyCookie ||
        response.result.configSettings
          .find((setting: any) => setting.configType === 'RegionalSettings')
          .configKeys.find(
            (item: any) => item.key === 'RegionalSettings.DefaultCurrencyCode'
          ).value ||
        'GBP'

      const defaultCountry =
        countryCookie ||
        response.result.configSettings
          .find((setting: any) => setting.configType === 'RegionalSettings')
          .configKeys.find(
            (item: any) => item.key === 'RegionalSettings.DefaultCountry'
          ).value ||
        'US'

      const defaultLanguage =
        languageCookie ||
        response.result.configSettings
          .find((setting: any) => setting.configType === 'RegionalSettings')
          .configKeys.find(
            (item: any) => item.key === 'RegionalSettings.DefaultLanguageCode'
          ).value ||
        'en-GB'

      console.log(defaultCurrency)
      console.log(defaultLanguage)
      console.log(defaultCountry)
      if (setHeader) {
        setGeneralParams('Currency', defaultCurrency)
        setGeneralParams('Language', defaultLanguage)
        setGeneralParams('Country', defaultCountry)
      }

      return {
        result: response.result,
        defaultCurrency,
        defaultLanguage,
        defaultCountry,
      }
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
