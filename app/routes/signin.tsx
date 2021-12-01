import { Auth, Typography, Button } from '@supabase/ui'
import { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { FC } from 'react'

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
  const supabaseClient = createClient(
    process.env.SUPABASE_URL ?? '',
    process.env.SUPABASE_API_KEY ?? ''
  )

  return (
    <Auth.UserContextProvider supabaseClient={supabaseClient}>
      <Container supabaseClient={supabaseClient}>
        <Auth supabaseClient={supabaseClient} providers={['google']} />
      </Container>
    </Auth.UserContextProvider>
  )
}
