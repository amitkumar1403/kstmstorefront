const axios = require('axios')
require('dotenv').config()

const path = require('path')
const fs = require('fs')
const { v4 } = require("uuid");

const CLIENT_ID = process.env.BETTERCOMMERCE_CLIENT_ID
const SHARED_SECRET = process.env.BETTERCOMMERCE_SHARED_SECRET
const BASE_URL = process.env.BETTERCOMMERCE_BASE_URL
const AUTH_URL = process.env.BETTERCOMMERCE_AUTH_URL
const INFRA_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/infra/config`
const NEXT_PUBLIC_API_CACHING_LOG_ENABLED = process.env.NEXT_PUBLIC_API_CACHING_LOG_ENABLED

/**
 * Logs fetch request/response.
 * @param {*} request 
 * @param {*} response 
 */
const writeFetcherLog = (request, response) => {
  const objectStrigified = (obj) => {
    return JSON.stringify(obj, null, "\t");
  }
 
  const workingDir = __dirname;
  const dirPath = path.resolve(`${workingDir}/.next/server/api-logs`);

  if (!fs.existsSync(`${workingDir}/.next`)) {
    fs.mkdirSync(`${workingDir}/.next`);
  }

  if (!fs.existsSync(`${workingDir}/.next/server`)) {
    fs.mkdirSync(`${workingDir}/.next/server`);
  }

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  const filePath = path.resolve(`${dirPath}/${v4()}-response.log`);
  const contents = `Request:\n${objectStrigified(request)}\n\nResponse:\n${objectStrigified(response)}`;
  fs.writeFile(filePath, contents, function (err) {
    if (!err) {
      console.log(`---API Log: ${filePath}---`);
    }
  });
}

const getToken = async () => {
  const url = new URL('oAuth/token', AUTH_URL)
  try {
    const response = await axios({
      url: url.href,
      method: 'post',
      data: `client_id=${CLIENT_ID}&client_secret=${SHARED_SECRET}&grant_type=client_credentials`,
    })
    return response.data.access_token
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

const getMicrosites = () => {
  const microSitesHandler = async () => {
    const token = await getToken()
    const url = new URL('/api/v2/content/microsite/all', BASE_URL).href
    const req = {
      method: 'get',
      url: url,
      headers: {
        DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        Authorization: 'Bearer ' + token,
      },
    }
    const { data } = await axios(req)

    if (NEXT_PUBLIC_API_CACHING_LOG_ENABLED) { // If global setting for logging is TURNED ON
      writeFetcherLog(req, data);
    }

    let locales = {
      locales: [...new Set(data.result.map((i) => i.defaultLangCulture))],
      defaultLocale: 'en-US',
    }
    // fs.writeFileSync(__dirname.join('/'))
    fs.writeFileSync(
      __dirname + '/framework/bettercommerce/locales.json',
      JSON.stringify(locales),
      (e) => console.log(e)
    )
  }
  microSitesHandler()
}

const getSeoConfig = async function () {
  try {
    const INFRA_URL = new URL(INFRA_ENDPOINT, BASE_URL).href
    const token = await getToken()
    const infra = await axios({
      url: `${INFRA_URL}`,
      method: 'get',
      headers: {
        DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        Authorization: 'Bearer ' + token,
      },
    })
    const seoConfig = infra.data.result.configSettings
      .find((i) => i.configType === 'SeoSettings')
      ?.configKeys.reduce((acc, obj) => {
        if (obj.key === 'SeoSettings.DefaultTitle')
          acc['title'] = obj.value || JSON.stringify(obj.value)
        if (obj.key === 'SeoSettings.DefaultMetaDescription')
          acc['description'] = obj.value || JSON.stringify(obj.value)
        if (obj.key === 'SeoSettings.DefaultMetaKeywords')
          acc['keywords'] = obj.value || JSON.stringify(obj.value)
        return acc
      }, {})
    fs.writeFileSync(
      path.join(__dirname, '/framework/bettercommerce/seo.json'),
      JSON.stringify(seoConfig),
      (err) => console.log(err)
    )
  } catch (error) {
    console.log(error)
  }
}

getSeoConfig()
getMicrosites()
