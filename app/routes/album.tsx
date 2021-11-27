import type { MetaFunction, LoaderFunction } from 'remix'
import { useLoaderData, Link } from 'remix'
import { db } from '~/utils/db.server'

type IndexData = {
  albums: { id: string; name: string; cover: string }[]
}

export let loader: LoaderFunction = async () => {
  const albums = await db.album.findMany({
    select: {
      id: true,
      name: true,
      cover: true
    }
  })

  return { albums }
}

export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!'
  }
}

export default function Index() {
  const data = useLoaderData<IndexData>()
  return (
    <>
      <div className="container mx-auto">
        <h2 className="mt-24 text-5xl font-semibold text-white">Albums</h2>
        <div className="mt-12">
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
            {data.albums.map((album) => (
              <div className="px-4 py-8" key={album.id}>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
