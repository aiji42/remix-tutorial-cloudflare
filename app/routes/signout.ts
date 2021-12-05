import { LoaderFunction, redirect } from '@remix-run/server-runtime'
import { supabaseUser } from '~/cookie'

export const loader: LoaderFunction = async () => {
  const cookie = await supabaseUser.serialize({})
  return redirect('/', {
    headers: {
      'Set-Cookie': cookie
    }
  })
}

export default () => null
