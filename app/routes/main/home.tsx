import type { MetaFunction, LoaderFunction } from 'remix'
import { useLoaderData, Link } from 'remix'
import { userPrefs } from '~/cookie'
import { supabase } from '~/utils/supabase.server'

type IndexData = {
  artists: { id: string; name: string; picture: string }[]
  albums: { id: string; name: string; cover: string }[]
  playlists: { id: string; name: string; cover: string }[]
}

export let loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) ?? {}
  if (cookie.cacheable) {
    const cache = await MY_KV.get('home_v2', 'json')
    if (cache) return cache
  }

  const artistPromise = supabase()
    .from('Artist')
    .select('id, name, picture')
    .limit(5)

  const albumsPromise = supabase()
    .from('Album')
    .select('id, name, cover')
    .limit(5)

  const playlistsPromise = supabase()
    .from('Playlist')
    .select('id, name, cover')
    .limit(10)

  const { data: artists } = await artistPromise
  const { data: albums } = await albumsPromise
  const { data: playlists } = await playlistsPromise

  if (cookie.cacheable)
    await MY_KV.put('home_v2', JSON.stringify({ artists, albums, playlists }), {
      expirationTtl: 60 ** 2 * 24
    })

  return { artists, albums, playlists }
}

export let meta: MetaFunction = () => {
  return {
    title: 'Home | Remix Sample'
  }
}

export default function Home() {
  const data = useLoaderData<IndexData>()
  return (
    <div className="container mx-auto min-h-screen">
      <h2 className="mt-24 text-5xl font-semibold text-white">Home</h2>
      <div className="mt-12">
        <h3 className="font-semibold text-xl border-b border-gray-900 pb-2">
          Featured Artists
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {data.artists.map((artist) => (
            <div className="p-4" key={artist.id}>
              <div>
                <Link to={`/main/artist/${artist.id}`}>
                  <img
                    loading="lazy"
                    src={artist.picture}
                    width={250}
                    height={250}
                  />
                </Link>
              </div>

              <div>
                <Link
                  to={`/main/artist/${artist.id}`}
                  className="font-semibold block hover:text-white mt-2"
                >
                  {artist.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-semibold text-xl border-b border-gray-900 pb-2">
          New Albums
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {data.albums.map((album) => (
            <div className="p-4" key={album.id}>
              <div>
                <Link to={`/main/album/${album.id}`}>
                  <img
                    loading="lazy"
                    src={album.cover}
                    width={250}
                    height={250}
                  />
                </Link>
              </div>

              <div>
                <Link
                  to={`/main/album/${album.id}`}
                  className="font-semibold block hover:text-white mt-2"
                >
                  {album.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-semibold text-xl border-b border-gray-900 pb-2">
          Featured Playlists
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {data.playlists.map((playlist) => (
            <div className="px-4 py-8" key={playlist.id}>
              <div>
                <Link to={`/main/playlist/${playlist.id}`}>
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
                  to={`/main/playlist/${playlist.id}`}
                  className="font-semibold block hover:text-white mt-2"
                >
                  {playlist.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
