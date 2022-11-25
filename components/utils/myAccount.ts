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
    props: 'orders',
  },
  {
    type: 'tab',
    text: GENERAL_MY_RETURNS,
    props: 'returns',
  },
  {
    type: 'tab',
    text: WISHLIST_TITLE,
    props: 'wishlist',
  },
  {
    type: 'tab',
    text: GENERAL_MY_DETAILS,
    props: 'details',
  },
  {
    type: 'tab',
    text: ADDRESS_BOOK_TITLE,
    props: 'address-book',
  },

  {
    type: 'tab',
    text: GENERAL_CONTACT_PREFERENCES,
    props: 'contact',
  },
]
