import { Helmet } from "@dr.pogodin/react-helmet"

type SeoProps = {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  ogType?: "article" | "website"
  canonical?: string
  noIndex?: boolean
}

export function Seo({
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  canonical,
  noIndex = false,
}: SeoProps) {
  const pageTitle = `${title} | TrackFlow`
  const pageUrl =
    canonical ??
    (typeof window === "undefined"
      ? undefined
      : `${window.location.origin}${window.location.pathname}`)

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta content={description} name="description" />
      {keywords ? <meta content={keywords} name="keywords" /> : null}
      {noIndex ? <meta content="noindex, nofollow" name="robots" /> : null}
      {pageUrl ? <link href={pageUrl} rel="canonical" /> : null}

      <meta content={ogType} property="og:type" />
      {pageUrl ? <meta content={pageUrl} property="og:url" /> : null}
      <meta content={pageTitle} property="og:title" />
      <meta content={description} property="og:description" />
      {ogImage ? <meta content={ogImage} property="og:image" /> : null}

      <meta content="summary_large_image" name="twitter:card" />
      <meta content={pageTitle} name="twitter:title" />
      <meta content={description} name="twitter:description" />
      {ogImage ? <meta content={ogImage} name="twitter:image" /> : null}
    </Helmet>
  )
}
