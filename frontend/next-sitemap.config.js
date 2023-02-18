/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://blog.sserve.work',
  generateRobotsTxt: true,
  exclude: [
    "/admin/*",
    "/api/*",
    "/server-sitemap-index.xml"
  ],
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://blog.sserve.work/server-sitemap-index.xml",
    ]
  }
}