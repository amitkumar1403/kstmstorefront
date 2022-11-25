import Cookies from 'js-cookie'

export const setCookie = (key: string, val: any) => Cookies.set(key, val)
