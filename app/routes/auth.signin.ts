import { ActionFunction } from '@remix-run/server-runtime'
import { supabaseUser } from '~/cookie'
import { supabase } from '../utils/supabase.server'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const token = formData.get('access_token') as string | undefined

  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await supabaseUser.parse(cookieHeader)) || {}

  const user = await supabase().auth.api.getUser(token ?? '')

  if (!user.error)
    return new Response('ok', {
      headers: {
        'Set-Cookie': await supabaseUser.serialize({
          ...cookie,
          token
        })
      }
    })

  return null
}
