import { useRouter } from 'next/router'

const withAuth = (WrappedComponent: any, redirect = true) => {
  return (props: any) => {
    // checks whether we are on client / browser or server.
    if (typeof window !== 'undefined') {
      const Router = useRouter()

      const accessToken = localStorage.getItem('user')

      // If there is no access token we redirect to "/" page.
      if (!accessToken && redirect) {
        Router.replace('/')
        return null
      }

      // If this is an accessToken we just render the component that was passed with all its props

      return <WrappedComponent isLoggedIn={true} {...props} />
    }

    // If we are on server, return null
    return null
  }
}

export default withAuth
