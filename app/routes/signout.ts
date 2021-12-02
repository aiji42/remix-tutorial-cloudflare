import {
  ActionFunction,
  LoaderFunction,
  redirect
} from '@remix-run/server-runtime'
import { supabaseUser } from '~/cookie'

export const loader: LoaderFunction = async () => {
  return redirect('/', {
    headers: {
      'Set-Cookie': await supabaseUser.serialize({})
    }
  })
}
