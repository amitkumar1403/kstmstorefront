//@TODO TBD on links
import { 
  GENERAL_ACCESSORIES, 
  GENERAL_BAGS, 
  GENERAL_CAREERS, 
  GENERAL_CONTACT, 
  GENERAL_FAQ, 
  GENERAL_FIND_A_STORE, 
  GENERAL_HOME_GOODS, 
  GENERAL_OBJECTS, 
  GENERAL_PRESS, 
  GENERAL_PRIVACY, 
  GENERAL_RETURNS, 
  GENERAL_SECURE_PAYMENT,
  GENERAL_SHIPPING, 
  GENERAL_SUSTAINABILITY, 
  GENERAL_TEES, 
  GENERAL_TERMS_AND_CONDITIONS, 
  GENERAL_WARRANTY, 
  GENERAL_WHO_WE_ARE 
} from '@components/utils/textVariables'

const footerNavigation = {
  products: [
    { name: GENERAL_BAGS, href: '#' },
    { name: GENERAL_TEES, href: '#' },
    { name: GENERAL_OBJECTS, href: '#' },
    { name: GENERAL_HOME_GOODS, href: '#' },
    { name: GENERAL_ACCESSORIES, href: '#' },
  ],
  company: [
    { name: GENERAL_WHO_WE_ARE, href: '#' },
    { name: GENERAL_SUSTAINABILITY, href: '#' },
    { name: GENERAL_PRESS, href: '#' },
    { name: GENERAL_CAREERS, href: '#' },
    { name: GENERAL_TERMS_AND_CONDITIONS, href: '#' },
    { name: GENERAL_PRIVACY, href: '#' },
  ],
  customerService: [
    { name: GENERAL_CONTACT, href: '#' },
    { name: GENERAL_SHIPPING, href: '#' },
    { name: GENERAL_RETURNS, href: '#' },
    { name: GENERAL_WARRANTY, href: '#' },
    { name: GENERAL_SECURE_PAYMENT, href: '#' },
    { name: GENERAL_FAQ, href: '#' },
    { name: GENERAL_FIND_A_STORE, href: '#' },
  ],
}

export default footerNavigation;
