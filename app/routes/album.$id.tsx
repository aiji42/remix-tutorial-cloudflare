import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import {db} from "~/utils/db.server";

type Data = {
  data: {name: string, cover: string, artists: {id: string, name: string}[], songs: {id: string, name: string, length: number, interactions: {playCount: number}[]}[]}
};

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async ({ params: { id} }) => {
  if (!id) throw new Response("Not Found", { status: 404 });

  const data = await db.album.findUnique({
    where: {
      id
    },
    select: {
      name: true,
      artists: {
        select: {
          id: true,
          name: true
        }
      },
      cover: true,
      songs: {
        select: {
          id: true,
          name: true,
          length: true,
          interactions: {
            select: {
              playCount: true
            }
          }
        }
      }
    }
  })

  if (!data) throw new Response("Not Found", { status: 404 });

  return { data }
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
  const { data } = useLoaderData<Data>()
  return (
    <div className="text-gray-300 min-h-screen p-10">
      <div className="flex">
        <img className="mr-6" src={data.cover} />
        <div className="flex flex-col justify-center">
          <h4 className="mt-0 mb-2 uppercase text-gray-500 tracking-widest text-xs">Albam</h4>
          <h1 className="mt-0 mb-2 text-white text-4xl">{data.name}</h1>

          <p className="text-gray-600 text-sm">Created by {data.artists.map(({ id, name }) => <a key={id}>{name}</a>)} - {data.songs.length} songs, {timeFormattedString(data.songs.reduce((res, { length }) => res + length, 0))}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <div className="flex">
          <button className="mr-2 bg-green-500 text-green-100 block py-2 px-8 rounded-full">Play</button>
          <button className="mr-2 border border-white block p-2 rounded-full"><img
            src="https://image.flaticon.com/icons/svg/2485/2485986.svg" height="25" width="25" /></button>
          <button className="mr-2 border border-white block p-2 rounded-full">...</button>
        </div>
        <div className="text-gray-600 text-sm tracking-widest text-right">
          <h5 className="mb-1">Followers</h5>
          <p>5,055</p>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex text-gray-600">
          <div className="p-2 w-8 flex-shrink-0"></div>
          <div className="p-2 w-8 flex-shrink-0"></div>
          <div className="p-2 w-full">Title</div>
          <div className="p-2 w-full">Played</div>
          <div className="p-2 w-12 flex-shrink-0 text-right">⏱</div>
        </div>
        {data.songs.map((song) => (
          <div key={song.id} className="flex border-b border-gray-800 hover:bg-gray-800">
            <div className="p-3 w-8 flex-shrink-0">▶️</div>
            <div className="p-3 w-8 flex-shrink-0">❤️</div>
            <div className="p-3 w-full">{song.name}</div>
            <div className="p-3 w-full">{song.interactions.reduce((res, { playCount }) => res + playCount, 0).toLocaleString()}</div>
            <div className="p-3 w-12 flex-shrink-0 text-right">{timeFormattedStringShort(song.length)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const timeFormattedString = (inSec: number) => {
  const sec = ('0' + Math.ceil(inSec % 60)).slice(-2);
  const min = ('0' + Math.ceil(inSec / 60)).slice(-2);
  return `${min} min ${sec} sec`;
}

const timeFormattedStringShort = (inSec: number) => {
  const sec = ('0' + Math.ceil(inSec % 60)).slice(-2);
  const min = ('0' + Math.ceil(inSec / 60)).slice(-2);
  return `${min}:${sec}`;
}