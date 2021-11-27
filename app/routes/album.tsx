import type { MetaFunction, LoaderFunction } from 'remix'
import { useLoaderData, Link, json } from 'remix'
import { db } from '~/utils/db.server'
import { userPrefs } from '~/cookie'

type IndexData = {
  albums: { id: string; name: string; cover: string }[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) ?? {}
  if (cookie.cacheable) {
    const cache = await MY_KV.get(request.url, 'json')
    if (cache) return cache
  }

  const albums = await db.album.findMany({
    select: {
      id: true,
      name: true,
      cover: true
    }
  })

  if (cookie.cacheable)
    await MY_KV.put(request.url, JSON.stringify({ albums }), {
      expirationTtl: 60 ** 2 * 24
    })

  return json(
    { albums },
    {
      headers: {
        'Set-Cookie': await userPrefs.serialize({
          ...cookie,
          cacheable: true
        })
      }
    }
  )
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
