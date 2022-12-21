import {
  GENERAL_MY_ORDERS,
  GENERAL_MY_RETURNS,
  WISHLIST_TITLE,
  GENERAL_MY_DETAILS,
  ADDRESS_BOOK_TITLE,
  GENERAL_CONTACT_PREFERENCES
} from '@components/utils/textVariables'

export const config: any = [
  {
    type: 'tab',
    text: GENERAL_MY_ORDERS,
    mtext: GENERAL_MY_ORDERS,
    props: 'orders',
    href:"/my-account/orders"
  },
  {
    type: 'tab',
    text: GENERAL_MY_RETURNS,
    mtext: GENERAL_MY_RETURNS,
    props: 'returns',
   href:"/my-account/MyReturns"
  },
  {
    type: 'tab',
    text: WISHLIST_TITLE,
    mtext: WISHLIST_TITLE,
    props: 'wishlist',
    href:"/my-account/wishlist"
  },
  {
    type: 'tab',
    text: GENERAL_MY_DETAILS,
    mtext: GENERAL_MY_DETAILS,
    props: 'details',
    href:"/my-account"
  },
  {
    type: 'tab',
    text: 'My Saved Address',
    mtext: 'My Saved Address',
    props: 'address-book',
    href:"/my-account/address-book"
  },

  {
    type: 'tab',
    text: GENERAL_CONTACT_PREFERENCES,
    mtext:GENERAL_CONTACT_PREFERENCES,
    props: 'contact',
   href:"/my-account/contact"
  },
]



// export const config: any = [
//   {
   
//   {
    
//   },
//   // {
//   //   type: 'tab',
//   //   text: GENERAL_MY_RETURNS,
//   //   props: 'returns',
//   // },
//   {
    
//   },
//   {
//     type: 'tab',
//     text: 'My Saved Address',
//     mtext: 'My Saved Address',
//     props: 'address-book',
//     href:"/my-account/address-book"
//   },
//   {
//     type: 'tab',
//     text: WISHLIST_TITLE,
//     mtext: WISHLIST_TITLE,
//     props: 'wishlist',
//     href:"/my-account/wishlist"
//   },
//   // {
//   //   type: 'tab',
//   //   text: GENERAL_CONTACT_PREFERENCES,
//   //   props: 'contact',
//   // },
// ]
