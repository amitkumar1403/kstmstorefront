import * as fs from 'fs';
import path from 'path';
import { v4 as uuid } from "uuid";
import Cookies, { CookieAttributes } from 'js-cookie'
import { FetcherError } from '@commerce/utils/errors'

export const setCookie = (
  name: string,
  token?: string,
  options?: CookieAttributes
) => {
  if (!token) {
    Cookies.remove(name)
  } else {
    Cookies.set(name, token, options ?? { expires: 60 * 60 * 24 * 30 })
  }
}

export const getCookie = (name: string) => Cookies.get(name)

export function getError(errors: any[], status: number) {
  errors = errors ?? [{ message: 'Failed to fetch BetterCommerce API' }]
  return new FetcherError({ errors, status })
}

async function getAsyncError(res: Response) {
  const data = await res.json()
  return getError(data.errors, res.status)
}

export const handleFetchResponse = async (res: Response) => {
  if (res.ok) {
    const { data, errors } = await res.json()

    if (errors && errors.length) {
      throw getError(errors, res.status)
    }

    return data
  }

  throw await getAsyncError(res)
}

export const getToken = () => Cookies.get('betterCommerce.token')
export const setToken = (token?: string, options?: CookieAttributes) => {
  setCookie('betterCommerce.token', token, options)
}
export const setRefreshToken = (token?: string, options?: CookieAttributes) => {
  setCookie('betterCommerce.refreshToken', token, options)
}
export const getRefreshToken = () => Cookies.get('betterCommerce.refreshToken')
export const clearTokens = () => Cookies.remove('betterCommerce.token')

export const writeFetcherLog = (request: any, response: any) => {
  const objectStrigified = (obj: any) => {
    return JSON.stringify(obj, null, "\t");
  }
  const MID = "\\.next\\server\\";
  const workingDir = __dirname;
  const rootDir = workingDir.substring(0, workingDir.indexOf(MID) + MID.length);
  const dirPath = path.resolve(`${rootDir}/api-logs`);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  const filePath = path.resolve(`${dirPath}/${uuid()}-response.log`);
  const contents = `Request:\n${objectStrigified(request)}\n\nResponse:\n${objectStrigified(response)}`;
  fs.writeFile(filePath, contents, function (err) {
    if (!err) {
      console.log(`---API Log: ${filePath}---`);
    }
  });
}
