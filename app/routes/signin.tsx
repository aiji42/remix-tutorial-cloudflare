import { Auth, Typography, Button } from '@supabase/ui'
import { SupabaseClient } from '@supabase/supabase-js'
import { FC } from 'react'
import { LoaderFunction } from 'remix'
import { supabaseUser } from '~/cookie'
import { supabase } from '~/utils/supabase.server'
import { useSupabaseClient } from '~/utils/use-supabase-client'

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await supabaseUser.parse(cookieHeader)) || {}
  if (cookie.token) {
    const user = await supabase().auth.api.getUser(cookie.token)
    console.log(user)
  }

  return null
}

const Container: FC<{ supabaseClient: SupabaseClient }> = (props) => {
  const { user } = Auth.useUser()
  if (user)
    return (
      <>
        <Typography.Text>Signed in: {user.email}</Typography.Text>
        <Button block onClick={() => props.supabaseClient.auth.signOut()}>
          Sign out
        </Button>
      </>
    )
  return <>{props.children}</>
}

export default function AuthBasic() {
  const supabase = useSupabaseClient()

  if (!supabase) return null

  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Container supabaseClient={supabase}>
        <Auth
          supabaseClient={supabase}
          providers={['google']}
          onlyThirdPartyProviders
        />
      </Container>
    </Auth.UserContextProvider>
  )
}
