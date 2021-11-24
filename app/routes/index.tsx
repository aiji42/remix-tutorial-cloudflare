import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";


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
  return (
    <>
      <div className="container mx-auto"><h2 className="mt-24 text-5xl font-semibold text-white">Home</h2>
        <div className="mt-12"><h3 className="font-semibold text-xl border-b border-gray-900 pb-2">Recently Played</h3>
          <div className="flex items-center mt-4 -mx-4">
            <div className="w-1/5 px-4">
              <div><a href="#"><img src="https://tailwind-v1-examples.netlify.app/albumcover02.jpg" alt="album cover" /></a></div>
              <div><a href="#" className="font-semibold block hover:text-white mt-2">Acoustic Pop Covers 2019</a>
                <div className="text-gray-500 mt-2">Amazing Acoustic Covers updated every week.</div>
                <div className="uppercase tracking-widest text-xs text-gray-500 mt-2">6679 Followers</div>
              </div>
            </div>
            <div className="w-1/5 px-4">
              <div><a href="#"><img src="https://tailwind-v1-examples.netlify.app/albumcover03.jpg" alt="album cover" /></a></div>
              <div><a href="#" className="font-semibold block hover:text-white mt-2">Acoustic Christmas</a>
                <div className="text-gray-500 mt-2">Amazing Acoustic Covers updated every week.</div>
                <div className="uppercase tracking-widest text-xs text-gray-500 mt-2">6679 Followers</div>
              </div>
            </div>
            <div className="w-1/5 px-4">
              <div><a href="#"><img src="https://tailwind-v1-examples.netlify.app/albumcover04.jpg" alt="album cover" /></a></div>
              <div><a href="#" className="font-semibold block hover:text-white mt-2">Acoustic Pop Covers 2019</a>
                <div className="text-gray-500 mt-2">Amazing Acoustic Covers updated every week.</div>
                <div className="uppercase tracking-widest text-xs text-gray-500 mt-2">6679 Followers</div>
              </div>
            </div>
            <div className="w-1/5 px-4">
              <div><a href="#"><img src="https://tailwind-v1-examples.netlify.app/albumcover05.jpg" alt="album cover" /></a></div>
              <div><a href="#" className="font-semibold block hover:text-white mt-2">Acoustic Pop Covers 2019</a>
                <div className="text-gray-500 mt-2">Amazing Acoustic Covers updated every week.</div>
                <div className="uppercase tracking-widest text-xs text-gray-500 mt-2">6679 Followers</div>
              </div>
            </div>
            <div className="w-1/5 px-4">
              <div><a href="#"><img src="https://tailwind-v1-examples.netlify.app/albumcover06.jpg" alt="album cover" /></a></div>
              <div><a href="#" className="font-semibold block hover:text-white mt-2">Acoustic Pop Covers 2019</a>
                <div className="text-gray-500 mt-2">Amazing Acoustic Covers updated every week.</div>
                <div className="uppercase tracking-widest text-xs text-gray-500 mt-2">6679 Followers</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12"><h3 className="font-semibold text-xl border-b border-gray-900 pb-2">Your Heavy
          Rotation</h3>
          <div className="flex items-center mt-4 -mx-4">
            <div className="w-1/5 px-4">
              <div><a href="#"><img src="https://tailwind-v1-examples.netlify.app/albumcover06.jpg" alt="album cover" /></a></div>
              <div><a href="#" className="font-semibold block hover:text-white mt-2">Acoustic Pop Covers 2019</a>
                <div className="text-gray-500 mt-2">Amazing Acoustic Covers updated every week.</div>
                <div className="uppercase tracking-widest text-xs text-gray-500 mt-2">6679 Followers</div>
              </div>
            </div>
            <div className="w-1/5 px-4">
              <div><a href="#"><img src="https://tailwind-v1-examples.netlify.app/albumcover05.jpg" alt="album cover" /></a></div>
              <div><a href="#" className="font-semibold block hover:text-white mt-2">Acoustic Pop Covers 2019</a>
                <div className="text-gray-500 mt-2">Amazing Acoustic Covers updated every week.</div>
                <div className="uppercase tracking-widest text-xs text-gray-500 mt-2">6679 Followers</div>
              </div>
            </div>
            <div className="w-1/5 px-4">
              <div><a href="#"><img src="https://tailwind-v1-examples.netlify.app/albumcover04.jpg" alt="album cover" /></a></div>
              <div><a href="#" className="font-semibold block hover:text-white mt-2">Acoustic Pop Covers 2019</a>
                <div className="text-gray-500 mt-2">Amazing Acoustic Covers updated every week.</div>
                <div className="uppercase tracking-widest text-xs text-gray-500 mt-2">6679 Followers</div>
              </div>
            </div>
            <div className="w-1/5 px-4">
              <div><a href="#"><img src="https://tailwind-v1-examples.netlify.app/albumcover03.jpg" alt="album cover" /></a></div>
              <div><a href="#" className="font-semibold block hover:text-white mt-2">Acoustic Pop Covers 2019</a>
                <div className="text-gray-500 mt-2">Amazing Acoustic Covers updated every week.</div>
                <div className="uppercase tracking-widest text-xs text-gray-500 mt-2">6679 Followers</div>
              </div>
            </div>
            <div className="w-1/5 px-4">
              <div><a href="#"><img src="https://tailwind-v1-examples.netlify.app/albumcover02.jpg" alt="album cover" /></a></div>
              <div><a href="#" className="font-semibold block hover:text-white mt-2">Acoustic Pop Covers 2019</a>
                <div className="text-gray-500 mt-2">Amazing Acoustic Covers updated every week.</div>
                <div className="uppercase tracking-widest text-xs text-gray-500 mt-2">6679 Followers</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 mb-12"><h3 className="font-semibold text-xl border-b border-gray-900 pb-2">Chill</h3>
          <div className="flex items-center mt-4 -mx-4">
            <div className="w-1/5 px-4">
              <div><a href="#"><img src="https://tailwind-v1-examples.netlify.app/albumcover02.jpg" alt="album cover" /></a></div>
              <div><a href="#" className="font-semibold block hover:text-white mt-2">Acoustic Pop Covers 2019</a>
                <div className="text-gray-500 mt-2">Amazing Acoustic Covers updated every week.</div>
                <div className="uppercase tracking-widest text-xs text-gray-500 mt-2">6679 Followers</div>
              </div>
            </div>
            <div className="w-1/5 px-4">
              <div><a href="#"><img src="https://tailwind-v1-examples.netlify.app/albumcover03.jpg" alt="album cover" /></a></div>
              <div><a href="#" className="font-semibold block hover:text-white mt-2">Acoustic Pop Covers 2019</a>
                <div className="text-gray-500 mt-2">Amazing Acoustic Covers updated every week.</div>
                <div className="uppercase tracking-widest text-xs text-gray-500 mt-2">6679 Followers</div>
              </div>
            </div>
            <div className="w-1/5 px-4">
              <div><a href="#"><img src="https://tailwind-v1-examples.netlify.app/albumcover04.jpg" alt="album cover" /></a></div>
              <div><a href="#" className="font-semibold block hover:text-white mt-2">Acoustic Pop Covers 2019</a>
                <div className="text-gray-500 mt-2">Amazing Acoustic Covers updated every week.</div>
                <div className="uppercase tracking-widest text-xs text-gray-500 mt-2">6679 Followers</div>
              </div>
            </div>
            <div className="w-1/5 px-4">
              <div><a href="#"><img src="https://tailwind-v1-examples.netlify.app/albumcover05.jpg" alt="album cover" /></a></div>
              <div><a href="#" className="font-semibold block hover:text-white mt-2">Acoustic Pop Covers 2019</a>
                <div className="text-gray-500 mt-2">Amazing Acoustic Covers updated every week.</div>
                <div className="uppercase tracking-widest text-xs text-gray-500 mt-2">6679 Followers</div>
              </div>
            </div>
            <div className="w-1/5 px-4">
              <div><a href="#"><img src="https://tailwind-v1-examples.netlify.app/albumcover06.jpg" alt="album cover" /></a></div>
              <div><a href="#" className="font-semibold block hover:text-white mt-2">Acoustic Pop Covers 2019</a>
                <div className="text-gray-500 mt-2">Amazing Acoustic Covers updated every week.</div>
                <div className="uppercase tracking-widest text-xs text-gray-500 mt-2">6679 Followers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
