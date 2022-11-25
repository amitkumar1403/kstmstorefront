import { AUTHENTICATE_CUSTOMER } from '@components/utils/constants'
import fetcher from '../fetcher'
import qs from 'qs'

interface Props {
  email: string
  cookies?: any
  password: string
}

export default function useLogin() {
  return async function handler({ email, password, cookies }: Props) {
    const data = {
      username: email,
      password,
    }

    try {
      const response: any = await fetcher({
        url: `${AUTHENTICATE_CUSTOMER}`,
        method: 'post',
        data,
        cookies,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }
}
