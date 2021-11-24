import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";
import { useTheme } from '@geist-ui/react'


type IndexData = {
  resources: Array<{ name: string; url: string }>;
  demos: Array<{ name: string; to: string }>;
};

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = () => {
  let data: IndexData = {
    resources: [
      {
        name: "Remix Docs",
        url: "https://remix.run/docs"
      },
      {
        name: "React Router Docs",
        url: "https://reactrouter.com/docs"
      },
      {
        name: "Remix Discord",
        url: "https://discord.gg/VBePs6d"
      }
    ],
    demos: [
      {
        to: "demos/actions",
        name: "Actions"
      },
      {
        to: "demos/about",
        name: "Nested Routes, CSS loading/unloading"
      },
      {
        to: "demos/params",
        name: "URL Params and Error Boundaries"
      }
    ]
  };

  // https://remix.run/api/remix#json
  return json(data);
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!"
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let data = useLoaderData<IndexData>();
  const theme = useTheme()
  const tabbarFixed = false
  const expanded = false

  return (
    <div className="layout">
      <aside className="sidebar">
        aaaaaaaa
      </aside>
      <div className="side-shadow" />
      <main className="main">
        <h2>Welcome to Remix!</h2>
        <p>We're stoked that you're here. 🥳</p>
        <p>
          Feel free to take a look around the code to see how Remix does things,
          it might be a bit different than what you’re used to. When you're
          ready to dive deeper, we've got plenty of resources to get you
          up-and-running quickly.
        </p>
        <p>
          Check out all the demos in this starter, and then just delete the{" "}
          <code>app/routes/demos</code> and <code>app/styles/demos</code>{" "}
          folders when you're ready to turn this into your next project.
        </p>
      </main>
      <style>{`
          .layout {
            min-height: calc(100vh - 108px);
            max-width: ${theme.layout.pageWidthWithMargin};
            margin: 0 auto;
            padding: 0 ${theme.layout.gap};
            display: flex;
            box-sizing: border-box;
          }
          .sidebar {
            width: 200px;
            margin-right: 20px;
            -webkit-overflow-scrolling: touch;
            -webkit-flex-shrink: 0;
            height: calc(100% - 2rem - 140px + ${tabbarFixed ? '60px' : 0});
            position: fixed;
            top: 140px;
            bottom: 2rem;
            transform: translateY(${tabbarFixed ? '-60px' : 0});
            transition: transform 200ms ease-out;
            z-index: 100;
          }
          .side-shadow {
            width: 220px;
            flex-shrink: 0;
            height: 100vh;
          }
          .main {
            display: flex;
            max-width: calc(100% - 220px);
            flex-direction: column;
            padding-left: 20px;
            padding-top: 25px;
            flex: 0 0 100%;
            padding-bottom: 150px;
          }
          @media only screen and (max-width: ${theme.layout.breakpointMobile}) {
            .layout {
              max-width: 100%;
              width: 100%;
              padding: 20px 1rem;
            }
            .sidebar {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              z-index: 10;
              width: 100vw;
              box-sizing: border-box;
              height: ${expanded ? '100vh' : '0'};
              background-color: ${theme.palette.background};
              padding: var(--geist-page-nav-height) 0 0 0;
              overflow: hidden;
              transition: height 250ms ease;
            }
            .main {
              width: 90vw;
              max-width: 90vw;
              padding: 0;
            }
            .side-shadow {
              display: none;
              visibility: hidden;
            }
          }
        `}</style>
    </div>
  );
}
