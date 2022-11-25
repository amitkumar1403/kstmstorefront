import axios from 'axios'
import {
  NEXT_UPDATE_DETAILS,
  NEXT_SUBSCRIBE,
} from '@components/utils/constants'

const handleError = (setTitle: any) => {
  setTitle('Woops! Something went wrong!')
  window.scrollTo(0, 0)
}

export const URLS = {
  subscribe: NEXT_SUBSCRIBE,
  updateDetails: NEXT_UPDATE_DETAILS,
}

export const handleSubmit = async (
  values: any,
  user: any,
  setUser: any,
  setTitle: any,
  url: string = URLS.updateDetails
) => {
  try {
    const response = await axios.post(url, {
      ...user,
      ...values,
    })
    if (response) {
      setUser({ ...user, ...values })
      setTitle('Success! Your details have been updated!')
      window.scrollTo(0, 0)
    } else {
      handleError(setTitle)
    }
  } catch (error) {
    handleError(setTitle)
  }
}
