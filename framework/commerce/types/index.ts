import * as Cart from './cart'
import * as Checkout from './checkout'
import * as Common from './common'
import * as Customer from './customer'
import * as Login from './login'
import * as Logout from './logout'
import * as Page from './page'
import * as Product from './product'
import * as Signup from './signup'
import * as Site from './site'
import * as Wishlist from './wishlist'

import { Guid } from './guid';
export { Guid };

export type GUIDType = string & { isGuid: true };

export type {
  Cart,
  Checkout,
  Common,
  Customer,
  Login,
  Logout,
  Page,
  Product,
  Signup,
  Site,
  Wishlist,
}
