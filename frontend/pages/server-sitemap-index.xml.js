import { getServerSideSitemap } from "next-sitemap";
import loc from "@/globals";

export const getServerSideProps = async (ctx) => {
  let post_ids = await fetch(loc.backend("/api/post-ids"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })

  let series_ids = await fetch(loc.backend("/api/series-ids"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })

  return getServerSideSitemap(ctx, [
    ...(await post_ids.json()).map(id => loc.defaultUrl + `/post/${id}`),
    ...(await series_ids.json()).map(id => loc.defaultUrl + `/series/${id}`)
  ])
}

export default function SitemapIndex() {}