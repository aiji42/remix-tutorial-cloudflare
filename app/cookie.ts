import { createCookie } from 'remix'

export let userPrefs = createCookie('user-prefs', {
  path: '/',
  maxAge: 604_800 // one week
})

export const supabaseUser = createCookie('supabase-user', {
  path: '/',
  maxAge: 60 ** 2 * 24,
  httpOnly: true
})
