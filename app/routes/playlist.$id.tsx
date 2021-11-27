import type { MetaFunction, LoaderFunction } from 'remix'
import { Link, useLoaderData } from 'remix'
import { db } from '~/utils/db.server'
import {
  timeFormattedString,
  timeFormattedStringShort
} from '~/utils/fornatter'

type Data = {
  data: {
    name: string
    user: {
      name: string
    }
    songs: {
      id: string
      name: string
      length: number
      album: {
        id: string
        name: string
      } | null
      artist: {
        id: string
        name: string
      }
    }[]
  }
}

export const loader: LoaderFunction = async ({ params: { id } }) => {
  if (!id) throw new Response('Not Found', { status: 404 })

  const data = await db.playlist.findUnique({
    where: {
      id
    },
    select: {
      name: true,
      user: {
        select: {
          name: true
        }
      },
      songs: {
        select: {
          id: true,
          name: true,
          length: true,
          album: {
            select: {
              id: true,
              name: true
            }
          },
          artist: {
            select: {
              id: true,
              name: true
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
    title: `${data.data.name} | Playlists | Remix Sample`
  }
}

export default function Playlist() {
  const { data } = useLoaderData<Data>()
  return (
    <div className="text-gray-300 min-h-screen p-10">
      <div className="flex">
        <img
          loading="lazy"
          className="mr-6"
          src="https://placekitten.com/g/200/200"
        />
        <div className="flex flex-col justify-center">
          <h4 className="mt-0 mb-2 uppercase text-gray-500 tracking-widest text-xs">
            Playlist
          </h4>
          <h1 className="mt-0 mb-2 text-white text-4xl">{data.name}</h1>

          <p className="text-gray-600 text-sm">
            Created by <a>{data.user.name}</a> - {data.songs.length} songs,{' '}
            {timeFormattedString(
              data.songs.reduce((res, { length }) => res + length, 0)
            )}
          </p>
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
          <div className="p-2 w-full">Artist</div>
          <div className="p-2 w-full">Album</div>
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
              <Link
                to={`/artist/${song.artist.id}`}
                className="hover:underline"
              >
                {song.artist.name}
              </Link>
            </div>
            <div className="p-3 w-full">
              <Link to={`/album/${song.album?.id}`} className="hover:underline">
                {song.album?.name}
              </Link>
            </div>
            <div className="p-3 w-12 flex-shrink-0 text-right">
              {timeFormattedStringShort(song.length)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
