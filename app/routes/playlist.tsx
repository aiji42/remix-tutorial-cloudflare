import type { MetaFunction, LoaderFunction } from 'remix'
import { useLoaderData, Link } from 'remix'
import { userPrefs } from '~/cookie'
import { supabase } from '~/utils/supabase.server'

type IndexData = {
  playlists: {
    id: string
    name: string
    cover: string
    User: { name: string }
  }[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) ?? {}
  if (cookie.cacheable) {
    const cache = await MY_KV.get(`playlist_v2`, 'json')
    if (cache) return cache
  }

  const { data: playlists } = await supabase()
    .from('Playlist')
    .select('id, name, cover, User (name)')

  if (cookie.cacheable)
    await MY_KV.put('playlist_v2', JSON.stringify({ playlists }), {
      expirationTtl: 60 ** 2 * 24
    })

  return { playlists }
}

export let meta: MetaFunction = () => {
  return {
    title: 'Playlists | Remix Sample'
  }
}

export default function Index() {
  const data = useLoaderData<IndexData>()
  return (
    <div className="container mx-auto min-h-screen">
      <h2 className="mt-24 text-5xl font-semibold text-white">Playlists</h2>
      <div className="mt-12">
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {data.playlists.map((playlist) => (
            <div className="px-4 py-8" key={playlist.id}>
              <div>
                <Link to={`/playlist/${playlist.id}`}>
                  <img
                    loading="lazy"
                    src={playlist.cover}
                    width={250}
                    height={250}
                  />
                </Link>
              </div>

              <div>
                <Link
                  to={`/playlist/${playlist.id}`}
                  className="font-semibold block hover:text-white mt-2"
                >
                  {playlist.name}
                </Link>
                <div>Created by {playlist.User.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
