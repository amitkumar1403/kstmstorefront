import MyAccount from './MyAccount'
import MyOrders from './MyOrders'
import AddressBook from './Address/AddressBook'
import ContactPreferences from './ContactPreferences'
import MyDetails from './MyDetails'
import MyReturns from './MyReturns'
import Wishlist from './Wishlist'
const COMPONENTS_MAP: any = {
  orders: MyOrders,
  details: MyDetails,
  returns: MyReturns,
  'address-book': AddressBook,
  contact: ContactPreferences,
  wishlist: Wishlist,
}

export default COMPONENTS_MAP
