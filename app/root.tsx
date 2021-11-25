import * as React from "react";
import {
  Link,
  Links,
  LiveReload, LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch, useLoaderData,
  useLocation
} from "remix";
import type { LinksFunction } from "remix";
import { db } from '~/utils/db.server'
import { Playlist } from '@prisma/client'
import {VFC} from "react";

/**
 * The `links` export is a function that returns an array of objects that map to
 * the attributes for an HTML `<link>` element. These will load `<link>` tags on
 * every route in the app, but individual routes can include their own links
 * that are automatically unloaded when a user navigates away from the route.
 *
 * https://remix.run/api/app#links
 */
export let links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600'
    },
    { href: 'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css', rel: 'stylesheet' }
  ];
};

export const loader: LoaderFunction = async () => {
  const user = await db.user.findFirst({
    select: {
      name: true,
      playlists: true
    }
  })

  return { user }
}

/**
 * The root module's default export is a component that renders the current
 * route via the `<Outlet />` component. Think of this as the global layout
 * component for your app.
 */
export default function App() {
  const data = useLoaderData<{ user: {name: string, playlists: Playlist[]} | null }>();
  return (
    <Document>
      <Layout playlists={data.user?.playlists ?? []}>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title
}: {
  children: React.ReactNode;
  title?: string;
}) {
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
        <RouteChangeAnnouncement />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children, playlists }: React.PropsWithChildren<{ playlists: Playlist[] }>) {
  return (
    <div className="bg-black">
      <div className="flex flex-col h-screen text-sm text-gray-400">
        <div className="flex-1 flex overflow-y-hidden">
          <SideBar playlists={playlists} />
          <div className="bg-gray-800-spotify flex-1 flex flex-col">
            <TopBar />
            <div className="content-spotify overflow-y-auto" style={{ backgroundColor: '#181818' }}>
              <div className="container mx-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout playlists={[]}>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout playlists={[]}>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  );
}

function RemixLogo(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      viewBox="0 0 659 165"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-labelledby="remix-run-logo-title"
      role="img"
      width="106"
      height="30"
      fill="currentColor"
      {...props}
    >
      <title id="remix-run-logo-title">Remix Logo</title>
      <path d="M0 161V136H45.5416C53.1486 136 54.8003 141.638 54.8003 145V161H0Z M133.85 124.16C135.3 142.762 135.3 151.482 135.3 161H92.2283C92.2283 158.927 92.2653 157.03 92.3028 155.107C92.4195 149.128 92.5411 142.894 91.5717 130.304C90.2905 111.872 82.3473 107.776 67.7419 107.776H54.8021H0V74.24H69.7918C88.2407 74.24 97.4651 68.632 97.4651 53.784C97.4651 40.728 88.2407 32.816 69.7918 32.816H0V0H77.4788C119.245 0 140 19.712 140 51.2C140 74.752 125.395 90.112 105.665 92.672C122.32 96 132.057 105.472 133.85 124.16Z" />
      <path d="M229.43 120.576C225.59 129.536 218.422 133.376 207.158 133.376C194.614 133.376 184.374 126.72 183.35 112.64H263.478V101.12C263.478 70.1437 243.254 44.0317 205.11 44.0317C169.526 44.0317 142.902 69.8877 142.902 105.984C142.902 142.336 169.014 164.352 205.622 164.352C235.83 164.352 256.822 149.76 262.71 123.648L229.43 120.576ZM183.862 92.6717C185.398 81.9197 191.286 73.7277 204.598 73.7277C216.886 73.7277 223.542 82.4317 224.054 92.6717H183.862Z" />
      <path d="M385.256 66.5597C380.392 53.2477 369.896 44.0317 349.672 44.0317C332.52 44.0317 320.232 51.7117 314.088 64.2557V47.1037H272.616V161.28H314.088V105.216C314.088 88.0638 318.952 76.7997 332.52 76.7997C345.064 76.7997 348.136 84.9917 348.136 100.608V161.28H389.608V105.216C389.608 88.0638 394.216 76.7997 408.04 76.7997C420.584 76.7997 423.4 84.9917 423.4 100.608V161.28H464.872V89.5997C464.872 65.7917 455.656 44.0317 424.168 44.0317C404.968 44.0317 391.4 53.7597 385.256 66.5597Z" />
      <path d="M478.436 47.104V161.28H519.908V47.104H478.436ZM478.18 36.352H520.164V0H478.18V36.352Z" />
      <path d="M654.54 47.1035H611.788L592.332 74.2395L573.388 47.1035H527.564L568.78 103.168L523.98 161.28H566.732L589.516 130.304L612.3 161.28H658.124L613.068 101.376L654.54 47.1035Z" />
    </svg>
  );
}

/**
 * Provides an alert for screen reader users when the route changes.
 */
const RouteChangeAnnouncement = React.memo(() => {
  let [hydrated, setHydrated] = React.useState(false);
  let [innerHtml, setInnerHtml] = React.useState("");
  let location = useLocation();

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  let firstRenderRef = React.useRef(true);
  React.useEffect(() => {
    // Skip the first render because we don't want an announcement on the
    // initial page load.
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    let pageTitle = location.pathname === "/" ? "Home page" : document.title;
    setInnerHtml(`Navigated to ${pageTitle}`);
  }, [location.pathname]);

  // Render nothing on the server. The live region provides no value unless
  // scripts are loaded and the browser takes over normal routing.
  if (!hydrated) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      aria-atomic
      id="route-change-region"
      style={{
        border: "0",
        clipPath: "inset(100%)",
        clip: "rect(0 0 0 0)",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        padding: "0",
        position: "absolute",
        width: "1px",
        whiteSpace: "nowrap",
        wordWrap: "normal"
      }}
    >
      {innerHtml}
    </div>
  );
});

const SideBar: VFC<{ playlists: Playlist[] }> = ({ playlists }) => {
  return (
    <div className="sidebar bg-gray-900-spotify w-48 flex-none flex flex-col justify-between font-semibold">
      <ul className="py-6">
        <li className="border-l-4 border-green-600"><a href="#" className="flex items-center mx-4 mt-4 group">
          <svg viewBox="0 0 24 24" width="24" height="24"
               className="fill-current text-white group-hover:text-white h-6 w-6">
            <path
              d="M13 20v-5h-2v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-7.59l-.3.3a1 1 0 11-1.4-1.42l9-9a1 1 0 011.4 0l9 9a1 1 0 01-1.4 1.42l-.3-.3V20a2 2 0 01-2 2h-3a2 2 0 01-2-2zm5 0v-9.59l-6-6-6 6V20h3v-5c0-1.1.9-2 2-2h2a2 2 0 012 2v5h3z" />
          </svg>
          <span className="ml-2 text-white group-hover:text-white">Home</span></a></li>
        <li className="border-l-4 border-transparent"><a href="#"
                                                         className="flex items-center hover:text-white mx-4 mt-4 group">
          <svg width="24" height="24" className="fill-current text-gray-400 h-6 w-6 group-hover:text-white">
            <path fill="none" d="M15 5.414V7h1.586z" />
            <path fill="none" d="M14 9a1 1 0 01-1-1V4H9v12h9V9h-4z" />
            <path
              d="M20 17V8h-.009a.996.996 0 00-.284-.707l-5-5A.99.99 0 0014 2.01V2H8a1 1 0 00-1 1v14a1 1 0 001 1h11a1 1 0 001-1zM15 5.414L16.586 7H15V5.414zM9 16V4h4v4a1 1 0 001 1h4v7H9z" />
            <path d="M3 8v13a1 1 0 001 1h12v-2H5V8H3z" />
          </svg>
          <span className="ml-2 group-hover:text-white">Browse</span></a></li>
        <li className="border-l-4 border-transparent"><a href="#"
                                                         className="flex items-center hover:text-white mx-4 mt-4 group">
          <svg viewBox="0 0 24 24" className="fill-current text-gray-400 h-6 w-6 group-hover:text-white">
            <g data-name="Layer 2">
              <g data-name="radio">
                <path
                  d="M12 8a3 3 0 00-1 5.83 1 1 0 000 .17v6a1 1 0 002 0v-6a1 1 0 000-.17A3 3 0 0012 8zm0 4a1 1 0 111-1 1 1 0 01-1 1zM3.5 11a6.87 6.87 0 012.64-5.23 1 1 0 10-1.28-1.54A8.84 8.84 0 001.5 11a8.84 8.84 0 003.36 6.77 1 1 0 101.28-1.54A6.87 6.87 0 013.5 11z" />
                <path
                  d="M16.64 6.24a1 1 0 00-1.28 1.52A4.28 4.28 0 0117 11a4.28 4.28 0 01-1.64 3.24A1 1 0 0016 16a1 1 0 00.64-.24A6.2 6.2 0 0019 11a6.2 6.2 0 00-2.36-4.76zM8.76 6.36a1 1 0 00-1.4-.12A6.2 6.2 0 005 11a6.2 6.2 0 002.36 4.76 1 1 0 001.4-.12 1 1 0 00-.12-1.4A4.28 4.28 0 017 11a4.28 4.28 0 011.64-3.24 1 1 0 00.12-1.4z" />
                <path
                  d="M19.14 4.23a1 1 0 10-1.28 1.54A6.87 6.87 0 0120.5 11a6.87 6.87 0 01-2.64 5.23 1 1 0 001.28 1.54A8.84 8.84 0 0022.5 11a8.84 8.84 0 00-3.36-6.77z" />
              </g>
            </g>
          </svg>
          <span className="ml-2 group-hover:text-white2">Radio</span></a></li>
      </ul>
      <div className="sidebar-spotify overflow-y-auto px-5 mt-2"><h3
        className="uppercase tracking-widest text-gray-500 font-normal text-xs">Your Library</h3>
        <ul className="leading-extra-loose">
          <li className="truncate"><a href="#" className="hover:text-white">Made For You</a></li>
          <li className="truncate"><a href="#" className="hover:text-white">Recently Played</a></li>
          <li className="truncate"><a href="#" className="hover:text-white">Liked Songs</a></li>
          <li className="truncate"><a href="#" className="hover:text-white">Albums</a></li>
          <li className="truncate"><a href="#" className="hover:text-white">Artists</a></li>
          <li className="truncate"><a href="#" className="hover:text-white">Podcasts</a></li>
        </ul>
        <h3 className="uppercase tracking-widest text-gray-500 font-normal text-xs mt-6">Playlists</h3>
        <ul className="leading-extra-loose mb-6">
          {playlists.map(({ id, name }) => (
            <li className="truncate" key={id}>
              <a href="#" className="hover:text-white">{name}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-800 h-16 px-4 py-2 flex items-center group">
        <svg viewBox="0 0 24 24" width="24" height="24"
             className="fill-current text-gray-600 w-8 h-8 group-hover:text-white">
          <path
            d="M12 22a10 10 0 110-20 10 10 0 010 20zm0-2a8 8 0 100-16 8 8 0 000 16zm1-9h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2H9a1 1 0 010-2h2V9a1 1 0 012 0v2z"
            className="heroicon-ui" />
        </svg>
        <a href="#" className="font-normal text-gray-500 ml-2 group-hover:text-white">New Playlist</a></div>
    </div>
  )
}

const TopBar = () => {
  return (
    <div className="top-bar flex items-center justify-between px-4 py-2">
      <div className="flex items-center">
        <button>
          <svg viewBox="0 0 24 24" width="24" height="24"
               className="fill-current text-gray-400 hover:text-white h-10 w-10">
            <path d="M14.7 15.3a1 1 0 01-1.4 1.4l-4-4a1 1 0 010-1.4l4-4a1 1 0 011.4 1.4L11.42 12l3.3 3.3z" />
          </svg>
        </button>
        <button className="ml-1">
          <svg viewBox="0 0 24 24" width="24" height="24"
               className="fill-current text-gray-400 hover:text-white h-10 w-10">
            <path d="M9.3 8.7a1 1 0 011.4-1.4l4 4a1 1 0 010 1.4l-4 4a1 1 0 01-1.4-1.4l3.29-3.3-3.3-3.3z"
                  className="heroicon-ui" />
          </svg>
        </button>
        <div className="ml-4 relative"><input placeholder="Search"
                                              className="bg-white text-gray-800 placeholder-gray-800 rounded-full px-3 pl-8 py-1" />
          <div className="absolute top-0">
            <svg viewBox="0 0 24 24" width="24" height="24" className="fill-current text-gray-800 h-6 w-6 pt-1 pl-2">
              <path
                d="M16.32 14.9l5.39 5.4a1 1 0 01-1.42 1.4l-5.38-5.38a8 8 0 111.41-1.41zM10 16a6 6 0 100-12 6 6 0 000 12z"
                className="heroicon-ui"></path>
            </svg>
          </div></div>
      </div>
      <div className="flex items-center">
        <button>
          <svg viewBox="0 0 496 512" className="fill-current text-gray-400 hover:text-white w-6 h-6">
            <path
              d="M248 104c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 144c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm0-240C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-49.7 0-95.1-18.3-130.1-48.4 14.9-23 40.4-38.6 69.6-39.5 20.8 6.4 40.6 9.6 60.5 9.6s39.7-3.1 60.5-9.6c29.2 1 54.7 16.5 69.6 39.5-35 30.1-80.4 48.4-130.1 48.4zm162.7-84.1c-24.4-31.4-62.1-51.9-105.1-51.9-10.2 0-26 9.6-57.6 9.6-31.5 0-47.4-9.6-57.6-9.6-42.9 0-80.6 20.5-105.1 51.9C61.9 339.2 48 299.2 48 256c0-110.3 89.7-200 200-200s200 89.7 200 200c0 43.2-13.9 83.2-37.3 115.9z"></path>
          </svg>
        </button>
        <a href="#" className="ml-2 hover:underline hover:text-white">dredrehimself</a>
        <button className="ml-4">
          <svg viewBox="0 0 24 24" width="24" height="24"
               className="fill-current text-gray-400 hover:text-white w-6 h-6">
            <path d="M15.3 9.3a1 1 0 011.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4l3.3 3.29 3.3-3.3z"
                  className="heroicon-ui"></path>
          </svg>
        </button>
      </div>
    </div>
  )
}