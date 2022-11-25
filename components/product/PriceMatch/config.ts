import { 
  PRICEMATCH_COST_OF_PRODUCT, 
  PRICEMATCH_DELIVERY_COST, 
  PRICEMATCH_PRODUCT_LINK, 
  PRICEMATCH_TOTAL_COST, 
  PRICEMATCH_USER_EMAIL, 
  PRICEMATCH_USER_NAME, 
  PRICEMATCH_USER_TELEPHONE, 
  PRICEMATCH_WEBSITE_NAME 
} from "@components/utils/textVariables";

export const config = [
  {
    key: 'websiteName',
    placeholder: PRICEMATCH_WEBSITE_NAME,
    type: 'text',
  },
  {
    key: 'websiteLink',
    placeholder: PRICEMATCH_PRODUCT_LINK,
    type: 'text',
  },
  {
    key: 'costOfProduct',
    placeholder: PRICEMATCH_COST_OF_PRODUCT,
    type: 'number',
  },
  {
    key: 'deliveryCost',
    placeholder: PRICEMATCH_DELIVERY_COST,
    type: 'number',
  },
  {
    key: 'totalCost',
    placeholder: PRICEMATCH_TOTAL_COST,
    type: 'number',
  },
  {
    key: 'name',
    placeholder: PRICEMATCH_USER_NAME,
    type: 'string',
  },
  {
    key: 'email',
    placeholder: PRICEMATCH_USER_EMAIL,
    type: 'email',
  },
  {
    key: 'phone',
    placeholder: PRICEMATCH_USER_TELEPHONE,
    type: ':tel',
  },
]
