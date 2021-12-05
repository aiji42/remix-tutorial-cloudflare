import { LoaderFunction, redirect, useLoaderData } from 'remix'
import { supabaseUser } from '~/cookie'
import { supabase } from '~/utils/supabase.server'
import { VFC } from 'react'
import { User } from '@supabase/supabase-js'

type Data = {
  googleUrl: string
}

export const loader: LoaderFunction = () => {
  return { googleUrl: supabase().auth.api.getUrlForProvider('google', {}) }
}

const Signin: VFC = () => {
  const { googleUrl } = useLoaderData<Data>()
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: '#181818' }}
    >
      <div className="px-8 py-6 mt-4 text-left bg-black shadow-lg text-white">
        <h3 className="text-2xl font-bold text-center block">
          Login to your account
        </h3>
        <a href={googleUrl} className="mt-2 mb-8 block">
          <button className="w-full h-10 px-6 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">
            Google
          </button>
        </a>

        <form action="">
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">
                Email
              </label>
              <input
                readOnly
                type="text"
                placeholder="Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="mt-4">
              <label className="block">Password</label>
              <input
                readOnly
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button
                disabled
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
              >
                Login
              </button>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signin
