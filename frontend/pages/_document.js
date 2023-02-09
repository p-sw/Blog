import { Html, Head, Main, NextScript } from 'next/document'
import {ColorModeScript} from "@chakra-ui/react"
import theme from "@/theme"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" as="style" crossOrigin={""} href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/static/pretendard.css"/>
        <link rel="stylesheet" as="style" crossOrigin={""} href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/variable/pretendardvariable-dynamic-subset.css"/>
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
