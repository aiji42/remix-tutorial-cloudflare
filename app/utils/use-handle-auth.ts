import { useFetcher } from '@remix-run/react'
import { useEffect } from 'react'

export const useLogin = () => {
  const fetcher = useFetcher()
  useEffect(() => {
    if (location.hash.startsWith('#access_token='))
      fetcher.submit(new URLSearchParams(location.hash.replace(/^#/, '?')), {
        action: '/auth/signin',
        method: 'post'
      })
  }, [fetcher.submit])

  useEffect(() => {
    if (fetcher.type === 'actionReload') location.hash = ''
  }, [fetcher])
}
