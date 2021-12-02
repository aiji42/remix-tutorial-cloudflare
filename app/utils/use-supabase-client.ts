import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export const useSupabaseClient = (): SupabaseClient | null => {
  const [client, setClient] = useState<SupabaseClient | null>(null)
  useEffect(() => {
    setClient(
      createClient(window.ENV.SUPABASE_URL, window.ENV.SUPABASE_API_KEY)
    )
  }, [])

  return client
}
