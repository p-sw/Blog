import {ChakraProvider} from "@chakra-ui/react";
import theme from "@/theme";
import "@/styles/globals.css";
import {DefaultSeo} from "next-seo";

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <DefaultSeo
        defaultTitle={"SSerVe's Devlog"}
        titleTemplate={"%s | SSerVe's Devlog"}
        twitter={{
          cardType: "summary_large_image",
        }}
        openGraph={{
          type: "website",
        }}
      />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
