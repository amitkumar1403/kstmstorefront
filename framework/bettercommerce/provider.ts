import fetcher from './fetcher'
import useNavTree from './api/content/getNavTree'
import { handler as useCart } from '../local/cart/use-cart'
import { handler as useAddItem } from '../local/cart/use-add-item'
import { handler as useUpdateItem } from '../local/cart/use-update-item'
import { handler as useRemoveItem } from '../local/cart/use-remove-item'
import { handler as useCustomer } from '../local/customer/use-customer'
import { handler as useSearch } from '../local/product/use-search'
import { handler as useLogin } from '../local/auth/use-login'
import { handler as useLogout } from '../local/auth/use-logout'
import { handler as useSignup } from '../local/auth/use-signup'

export const betterCommerceProvider = {
  locale: 'en-us',
  cartCookie: 'bc_cartId',
  fetcher,
  nav: { useNavTree },
  cart: { useCart, useAddItem, useUpdateItem, useRemoveItem },
  customer: { useCustomer },
  products: { useSearch },
  auth: { useLogin, useLogout, useSignup },
}

export type BetterCommerceProvider = typeof betterCommerceProvider
