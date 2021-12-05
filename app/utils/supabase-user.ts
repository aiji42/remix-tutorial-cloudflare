import { supabase } from './supabase.server'
import { ApiError, User } from '@supabase/gotrue-js'
import { supabaseUser } from '~/cookie'

export const getUser = async (
  request: Request
): Promise<{
  user: User | null
  data: User | null
  error: ApiError | null
}> => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await supabaseUser.parse(cookieHeader)) || {}
  const { token } = cookie

  return await supabase().auth.api.getUser(token ?? '')
}
