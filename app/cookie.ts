import { createCookie } from 'remix'

export let userPrefs = createCookie('user-prefs', {
  path: '/',
  maxAge: 604_800 // one week
})
