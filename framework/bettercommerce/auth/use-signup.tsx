import { REGISTER_CUSTOMER } from '@components/utils/constants'
import fetcher from '../fetcher'
import qs from 'qs'

interface Props {
  Email: string
  Password: string
  confirmPassword: string
  firstName: string
  lastName: string
  cookies?: any
}

export default function useSignup() {
  return async function handler({
    Email,
    Password,
    confirmPassword,
    firstName,
    lastName,
    cookies,
  }: Props) {
    const data = {
      email: Email,
      password: Password,
      firstName,
      lastName,
      confirmPassword,
    }

    try {
      const response: any = await fetcher({
        url: `${REGISTER_CUSTOMER}`,
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
