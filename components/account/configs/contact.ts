import {
  GENERAL_SMS,
  GENERAL_EMAIL,
  GENERAL_POST,
} from '@components/utils/textVariables'

export const config = [
  {
    key: 'notifyByEmail',
    label: GENERAL_EMAIL,
  },
  {
    key: 'notifyByPost',
    label: GENERAL_POST,
  },
  {
    key: 'notifyBySMS',
    label: GENERAL_SMS,
  },
]
