import { useLoaderData, Link, MetaFunction, LoaderFunction } from 'remix'
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
    _AlbumToArtist: {
      Artist: { id: string; name: string }
    }[]
    Song: {
      id: string
      name: string
      length: number
      Interaction: { playCount: number }[]
    }[]
  }
}

export const loader: LoaderFunction = async ({ request, params: { id } }) => {
  if (!id) throw new Response('Not Found', { status: 404 })

  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) ?? {}
  if (cookie.cacheable) {
    const cache = await MY_KV.get(`album_${id}_v2`, 'json')
    if (cache) return cache
  }

  const { data } = await supabase()
    .from('Album')
    .select(
      'name, cover, Song (id, name, length, Interaction (playCount)), _AlbumToArtist (Artist (id, name)))'
    )
    .match({ id })
    .limit(1)
    .single()

  if (!data) throw new Response('Not Found', { status: 404 })

  if (cookie.cacheable)
    await MY_KV.put(`album_${id}_v2`, JSON.stringify({ data }), {
      expirationTtl: 60 ** 2 * 24
    })

  return { data }
}

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `${data.data.name} | Albums | Remix Sample`
  }
}

export default function Album() {
  const { data } = useLoaderData<Data>()
  return (
    <div className="text-gray-300 min-h-screen p-10">
      <div className="flex">
        <img className="mr-6" src={data.cover} width={300} height={300} />
        <div className="flex flex-col justify-center">
          <h4 className="mt-0 mb-2 uppercase text-gray-500 tracking-widest text-xs">
            Album
          </h4>
          <h1 className="mt-0 mb-2 text-white text-4xl">{data.name}</h1>

          <p className="text-gray-600 text-sm">
            Created by{' '}
            {data._AlbumToArtist.map(({ Artist: { id, name } }) => (
              <Link
                to={`/main/artist/${id}`}
                key={id}
                className="hover:underline"
              >
                {name}
              </Link>
            ))}{' '}
            - {data.Song.length} songs,{' '}
            {timeFormattedString(
              data.Song.reduce((res, { length }) => res + length, 0)
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
          <div className="p-2 w-full">Played</div>
          <div className="p-2 w-12 flex-shrink-0 text-right">???</div>
        </div>
        {data.Song.map((song) => (
          <div
            key={song.id}
            className="flex border-b border-gray-800 hover:bg-gray-800"
          >
            <div className="p-3 w-8 flex-shrink-0">??????</div>
            <div className="p-3 w-full">{song.name}</div>
            <div className="p-3 w-full">
              {song.Interaction.reduce(
                (res, { playCount }) => res + playCount,
                0
              ).toLocaleString()}
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
