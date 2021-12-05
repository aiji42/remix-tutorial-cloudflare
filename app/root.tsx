import React, { VFC } from 'react'
import {
  Link,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData
} from 'remix'
import type { LinksFunction } from 'remix'
import { userPrefs } from '~/cookie'
import styles from '~/tailwind.css'
import { useLogin } from '~/utils/use-handle-auth'
import { getUser } from './utils/supabase-user'
import { User } from '@supabase/gotrue-js'

export let links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600'
    },
    { rel: 'stylesheet', href: styles }
  ]
}

type Data = {
  user: User | null
  isCaching: boolean
}

export const loader: LoaderFunction = async ({ request, context }) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) ?? {}

  const { user } = await getUser(request)

  const path = new URL(request.url).pathname

  if (user && path === '/') return redirect('/main/home')

  return {
    user,
    isCaching: !!cookie.cacheable
  }
}

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

function Document({
  children,
  title
}: {
  children: React.ReactNode
  title?: string
}) {
  useLogin()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

function Layout({ children }: React.PropsWithChildren<{}>) {
  const { isCaching, user } = useLoaderData<Data>()
  const cacheableToggle = async () => {
    document.cookie = await userPrefs.serialize({
      cacheable: !isCaching
    })
    document.location.reload()
  }
  return (
    <div className="bg-black relative">
      {children}
      {!user && <Link to="/signin">Sign in</Link>}
      <button
        onClick={cacheableToggle}
        className="absolute bottom-0 right-0 m-8 rounded-full py-3 px-6 bg-purple-600 text-white"
      >
        {isCaching ? 'Caching' : 'Not Caching'}
      </button>
    </div>
  )
}

export function CatchBoundary() {
  let caught = useCatch()

  console.error(caught.status)
  console.error(caught.data)

  let message
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      )
      break
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      )
      break

    default:
      throw new Error(caught.data || caught.statusText)
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <h1>
        {caught.status}: {caught.statusText}
      </h1>
      {message}
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error.stack)
  console.error(error.message)
  console.error(error.name)
  return (
    <Document title="Error!">
      <div>
        <h1>There was an error</h1>
        <p>{error.message}</p>
        <hr />
        <p>
          Hey, developer, you should replace this with what you want your users
          to see.
        </p>
      </div>
    </Document>
  )
}
