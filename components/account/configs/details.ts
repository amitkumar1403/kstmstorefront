import * as Yup from 'yup'
import {
  GENERAL_EMAIL,
  GENERAL_FIRST_NAME,
  GENERAL_LAST_NAME,
  GENERAL_MOBILE_NUMBER,
  GENERAL_PHONE,
} from '@components/utils/textVariables'
export const formConfig = [
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
    type: 'email',
    name: 'email',
    placeholder: GENERAL_EMAIL,
    label: GENERAL_EMAIL,
  },
  {
    type: 'mobile',
    name: 'mobile',
    placeholder: GENERAL_MOBILE_NUMBER,
    label: GENERAL_MOBILE_NUMBER,
  },
  {
    type: 'phone',
    name: 'phone',
    placeholder: GENERAL_PHONE,
    label: GENERAL_PHONE,
  },
]

export const schema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: Yup.string().email().required(),
  mobile: Yup.string(),
  phone: Yup.string(),
})
