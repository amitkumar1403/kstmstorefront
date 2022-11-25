import { useRouter } from 'next/router'
import { useEffect } from 'react'
export default function ValidatePage() {
  const router = useRouter()
  useEffect(() => {
    const token = router.query.token
    router.push(`/my-account/forgot-password?token=${token}`)
  }, [])
  return null
}
