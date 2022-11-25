import * as Yup from 'yup'
import countryList from '@components/utils/countryList'
import {
  GENERAL_TITLE,
  GENERAL_MISS,
  GENERAL_MR,
  GENERAL_MRS,
  GENERAL_FIRST_NAME,
  GENERAL_LAST_NAME,
  GENERAL_ADDRESS_LINE1,
  GENERAL_ADDRESS_LINE2,
  GENERAL_CITY,
  GENERAL_POSTCODE,
  GENERAL_COUNTRY,
  GENERAL_PHONE,
  GENERAL_IS_DEFAULT_DELIVERY_ADDRESS,
  GENERAL_IS_DEFAULT_BILLING_ADDRESS,
} from '@components/utils/textVariables'

export const formConfig = [
  {
    as: 'select',
    name: 'title',
    options: [
      {
        title: GENERAL_TITLE,
        value: GENERAL_TITLE,
      },
      {
        title: GENERAL_MISS,
        value: GENERAL_MISS,
      },
      {
        title: GENERAL_MR,
        value: GENERAL_MR,
      },
      {
        title: GENERAL_MRS,
        value: GENERAL_MRS,
      },
    ],
    label: GENERAL_TITLE,
  },
  {
    type: 'text',
    name: 'firstName',
    placeholder: GENERAL_FIRST_NAME,
    label: GENERAL_FIRST_NAME,
  },
  {
    type: 'text',
    name: 'lastName',
    placeholder: GENERAL_LAST_NAME,
    label: GENERAL_LAST_NAME,
  },
  {
    type: 'text',
    name: 'address1',
    placeholder: GENERAL_ADDRESS_LINE1,
    label: GENERAL_ADDRESS_LINE1,
  },
  {
    type: 'text',
    name: 'address2',
    placeholder: GENERAL_ADDRESS_LINE2,
    label: GENERAL_ADDRESS_LINE2,
  },
  {
    type: 'text',
    name: 'city',
    placeholder: GENERAL_CITY,
    label: GENERAL_CITY,
  },
  {
    type: 'text',
    name: 'postCode',
    placeholder: GENERAL_POSTCODE,
    label: GENERAL_POSTCODE,
  },
  {
    as: 'select',
    name: 'country',
    options: countryList,
    label: GENERAL_COUNTRY,
  },
  {
    type: 'phone',
    name: 'phoneNo',
    placeholder: GENERAL_PHONE,
    label: GENERAL_PHONE,
  },
  {
    customComponent: 'CustomCheckbox',
    name: 'isDefaultDelivery',
    label: GENERAL_IS_DEFAULT_DELIVERY_ADDRESS,
    className: 'flex-inline',
  },
  {
    customComponent: 'CustomCheckbox',
    name: 'isDefaultBilling',
    label: GENERAL_IS_DEFAULT_BILLING_ADDRESS,
    className: 'flex-inline',
  },
]

export const schema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  phoneNo: Yup.string().required(),
  country: Yup.string().required(),
  postCode: Yup.string().required(),
  address1: Yup.string().required(),
  title: Yup.string().nullable(),
  city: Yup.string().required(),
  isDefault: Yup.boolean(),
  isDefaultDelivery: Yup.boolean(),
  isDefaultBilling: Yup.boolean(),
  isDefaultSubscription: Yup.boolean(),
})
