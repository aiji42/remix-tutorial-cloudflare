import type { MetaFunction, LoaderFunction } from 'remix'
import { useLoaderData, Link } from 'remix'
import { db } from '~/utils/db.server'
import { userPrefs } from '~/cookie'

type IndexData = {
  artists: { id: string; name: string; picture: string }[]
}

export let loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) ?? {}
  if (cookie.cacheable) {
    const cache = await MY_KV.get(request.url, 'json')
    if (cache) return cache
  }

  const artists = await db.artist.findMany({
    select: {
      id: true,
      name: true,
      picture: true
    }
  })

  if (cookie.cacheable)
    await MY_KV.put(request.url, JSON.stringify({ artists }), {
      expirationTtl: 60 ** 2 * 24
    })

  return { artists }
}

export let meta: MetaFunction = () => {
  return {
    title: 'Artists | Remix Sample'
  }
}

export default function Index() {
  const data = useLoaderData<IndexData>()
  return (
    <>
      <div className="container mx-auto min-h-screen">
        <h2 className="mt-24 text-5xl font-semibold text-white">Artists</h2>
        <div className="mt-12">
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
            {data.artists.map((artist) => (
              <div className="px-4 py-8" key={artist.id}>
                <div>
                  <Link to={`/artist/${artist.id}`}>
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
                    to={`/artist/${artist.id}`}
                    className="font-semibold block hover:text-white mt-2"
                  >
                    {artist.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
