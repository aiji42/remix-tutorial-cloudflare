import type { MetaFunction, LoaderFunction } from 'remix'
import { useLoaderData, Link } from 'remix'
import { userPrefs } from '~/cookie'
import { supabase } from '~/utils/supabase.server'

type IndexData = {
  albums: { id: string; name: string; cover: string }[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) ?? {}
  if (cookie.cacheable) {
    const cache = await MY_KV.get(`album_v2`, 'json')
    if (cache) return cache
  }

  const { data: albums } = await supabase()
    .from('Album')
    .select('id, name, cover')

  if (cookie.cacheable)
    await MY_KV.put(`album_v2`, JSON.stringify({ albums }), {
      expirationTtl: 60 ** 2 * 24
    })

  return { albums }
}

export let meta: MetaFunction = () => {
  return {
    title: 'Albums | Remix Sample'
  }
}

export default function Index() {
  const data = useLoaderData<IndexData>()
  return (
    <div className="container mx-auto min-h-screen">
      <h2 className="mt-24 text-5xl font-semibold text-white">Albums</h2>
      <div className="mt-12">
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {data.albums.map((album) => (
            <div className="px-4 py-8" key={album.id}>
              <div>
                <Link to={`/album/${album.id}`}>
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
                  to={`/album/${album.id}`}
                  className="font-semibold block hover:text-white mt-2"
                >
                  {album.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
