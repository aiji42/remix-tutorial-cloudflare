import type { MetaFunction, LoaderFunction } from 'remix'
import { Link, useLoaderData } from 'remix'
import { db } from '~/utils/db.server'
import { timeFormattedStringShort } from '~/utils/fornatter'

type Data = {
  data: {
    name: string
    picture: string
    albums: { id: string; name: string; cover: string; createdAt: string }[]
    songs: {
      id: string
      name: string
      interactions: { playCount: number }[]
      length: number
    }[]
  }
}

export const loader: LoaderFunction = async ({ params: { id } }) => {
  if (!id) throw new Response('Not Found', { status: 404 })

  const data = await db.artist.findUnique({
    where: {
      id
    },
    select: {
      name: true,
      picture: true,
      albums: {
        select: {
          id: true,
          name: true,
          cover: true,
          createdAt: true
        }
      },
      songs: {
        take: 5,
        orderBy: {
          interactions: {
            _count: 'desc'
          }
        },
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

  if (!data) throw new Response('Not Found', { status: 404 })

  return { data }
}

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `${data.data.name} | Artists | Remix Sample`
  }
}

export default function Artist() {
  const { data } = useLoaderData<Data>()
  return (
    <div className="text-gray-300 min-h-screen p-10">
      <div
        className="bg-cover bg-center h-80"
        style={{ backgroundImage: `url(${data.picture})` }}
      >
        <div className="relative w-full h-full bg-opacity-50 bg-gray-800">
          <div className="absolute inset-x-0 bottom-0 pl-8 pb-4 flex flex-col justify-center">
            <h4 className="mt-0 mb-2 uppercase text-white tracking-widest text-xs">
              Artist
            </h4>
            <h1 className="mt-0 mb-2 text-white text-4xl">{data.name}</h1>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <div className="flex">
          <button className="mr-2 bg-green-500 text-green-100 block py-2 px-8 rounded-full">
            Play
          </button>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex text-gray-600">
          <div className="p-2 w-8 flex-shrink-0" />
          <div className="p-2 w-full">Title</div>
          <div className="p-2 w-full">Played</div>
          <div className="p-2 w-12 flex-shrink-0 text-right">⏱</div>
        </div>
        {data.songs.map((song) => (
          <div
            key={song.id}
            className="flex border-b border-gray-800 hover:bg-gray-800"
          >
            <div className="p-3 w-8 flex-shrink-0">▶️</div>
            <div className="p-3 w-full">{song.name}</div>
            <div className="p-3 w-full">
              {song.interactions
                .reduce((res, { playCount }) => res + playCount, 0)
                .toLocaleString()}
            </div>
            <div className="p-3 w-12 flex-shrink-0 text-right">
              {timeFormattedStringShort(song.length)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h3 className="font-semibold text-xl border-b border-gray-900 pb-2">
          Albums
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {data.albums.map((album) => (
            <div className="p-4" key={album.id}>
              <div>
                <Link to={`/album/${album.id}`}>
                  <img src={album.cover} width={250} height={250} />
                </Link>
              </div>

              <div>
                <Link
                  to={`/album/${album.id}`}
                  className="font-semibold block hover:text-white mt-2"
                >
                  {album.name}
                </Link>
                <div className="text-gray-500 mt-2">
                  {album.createdAt.slice(0, 10)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
