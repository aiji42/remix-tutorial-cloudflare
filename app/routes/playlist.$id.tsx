import type { MetaFunction, LoaderFunction } from 'remix'
import { Link, useLoaderData } from 'remix'
import {
  timeFormattedString,
  timeFormattedStringShort
} from '~/utils/fornatter'
import { userPrefs } from '~/cookie'
import { supabase } from '~/utils/supabase.server'

type Data = {
  data: {
    name: string
    cover: string
    User: {
      name: string
    }
    _PlaylistToSong: {
      Song: {
        id: string
        name: string
        length: number
        Album?: {
          id: string
          name: string
        } | null
        Artist: {
          id: string
          name: string
        }
      }
    }[]
  }
}

export const loader: LoaderFunction = async ({ request, params: { id } }) => {
  if (!id) throw new Response('Not Found', { status: 404 })

  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) ?? {}
  if (cookie.cacheable) {
    const cache = await MY_KV.get(`playlist_${id}_v2`, 'json')
    if (cache) return cache
  }

  const { data } = await supabase()
    .from('Playlist')
    .select(
      'name, cover, User (name), _PlaylistToSong (Song (id, name, length, Album (id, name), Artist (id, name))))'
    )
    .match({ id })
    .limit(1)

  if (!data || !data[0]) throw new Response('Not Found', { status: 404 })

  if (cookie.cacheable)
    await MY_KV.put(`playlist_${id}_v2`, JSON.stringify({ data: data[0] }), {
      expirationTtl: 60 ** 2 * 24
    })

  return { data: data[0] }
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
          src={data.cover}
          height={300}
          width={300}
        />
        <div className="flex flex-col justify-center">
          <h4 className="mt-0 mb-2 uppercase text-gray-500 tracking-widest text-xs">
            Playlist
          </h4>
          <h1 className="mt-0 mb-2 text-white text-4xl">{data.name}</h1>

          <p className="text-gray-600 text-sm">
            Created by <a>{data.User.name}</a> - {data._PlaylistToSong.length}{' '}
            songs,{' '}
            {timeFormattedString(
              data._PlaylistToSong.reduce(
                (res, { Song: { length } }) => res + length,
                0
              )
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
        {data._PlaylistToSong.map(({ Song: song }) => (
          <div
            key={song.id}
            className="flex border-b border-gray-800 hover:bg-gray-800"
          >
            <div className="p-3 w-8 flex-shrink-0">▶️</div>
            <div className="p-3 w-full">{song.name}</div>
            <div className="p-3 w-full">
              <Link
                to={`/artist/${song.Artist.id}`}
                className="hover:underline"
              >
                {song.Artist.name}
              </Link>
            </div>
            <div className="p-3 w-full">
              <Link to={`/album/${song.Album?.id}`} className="hover:underline">
                {song.Album?.name}
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
