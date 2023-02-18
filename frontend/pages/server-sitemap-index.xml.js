import { getServerSideSitemapIndex } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
  let post_ids = await fetch(`http://127.0.0.1:8000/api/post-ids`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })

  let series_ids = await fetch(`http://127.0.0.1:8000/api/series-ids`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })

  return getServerSideSitemapIndex(ctx, [
    ...(await post_ids.json()).map(id => `/post/${id}`),
    ...(await series_ids.json()).map(id => `/series/${id}`)
  ])
}

export default function SitemapIndex() {}