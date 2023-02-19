import {useRouter} from "next/router";
import {
  Accordion,
  AccordionButton, AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  Heading, Image,
  Spinner,
  Text,
  Tooltip, useColorMode,
  useToast
} from "@chakra-ui/react";
import DefaultLayout from "@/layouts/default";
import {useEffect, useState} from "react";
import {EditIcon, SmallAddIcon, ViewIcon} from "@chakra-ui/icons";
import ReactMarkdown from 'react-markdown';
import RemarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {materialDark, oneLight} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {NextSeo} from "next-seo";
import loc from "@/globals";


export async function getServerSideProps(context) {
  // for seo
  let req = fetch(loc.backend(`/api/post/${context.params["post_id"]}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then(res => {
    if (res.status === 200) {
      return res.json();
    } else {
      return null;
    }
  })

  let res = await req;
  if (res === null) {
    return {
      props: {
        notFound: true
      }
    }
  } else {
    return {
      props: {
        svspost: res
      }
    }
  }
}


export default function PostView({notFound = false, svspost = null}) {
  let router = useRouter();
  let toast = useToast();

  let {post_id} = router.query;

  let [post, setPost] = useState(undefined);
  let [dates, setDates] = useState({});

  useEffect(() => {
    if (post_id === undefined) return;
    fetch(`/api/post/${post_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        toast({
          title: "Error",
          description: "An error occurred while fetching post.",
          status: "error",
          duration: 5000,
          isClosable: false,
        })
        return null;
      }
    }).then(data => {
      if (data === null) {
        setPost(null);
        return;
      }
      setPost(data);
    })
  }, [post_id])

  useEffect(() => {
    setDates({});
    if (post === undefined) return;
    if (post === null) return;
    const m = /^(\d{4})-(\d{2})-(\d{2})/;
    const created_at_m = m.exec(post["created_at"])
    const edited_at_m = m.exec(post["edited_at"])
    const created_at = `${created_at_m[1]} / ${created_at_m[2]} / ${created_at_m[3]}`
    const edited_at = `${edited_at_m[1]} / ${edited_at_m[2]} / ${edited_at_m[3]}`
    setDates({
      created_at: created_at,
      edited_at: edited_at
    })
  }, [post])


  function PostInfo({icon, label, children}) {
    return <Heading as={"h3"} fontSize={"sm"} fontWeight={"bold"} mb={"5px"}>
      <Tooltip label={label}>{icon}</Tooltip>
      {children}
    </Heading>
  }

  function Code({node, inline, className, children, ...props}) {
    let {colorMode} = useColorMode();
    const match = /language-(\w+)/.exec(className || '')
    return <Box p={"10px"} id={colorMode}>{
      !inline && match ? (
        <SyntaxHighlighter
          style={colorMode === "light" ? oneLight : materialDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }</Box>
  }


  return <DefaultLayout>
    <NextSeo
      title={!notFound ? svspost.title : "404"}
      description={!notFound ? svspost.description : "Post Not Found"}
      openGraph={{
        title: !notFound ? svspost.title : "404",
        description: !notFound ? svspost.description : "Post Not Found",
        images: !notFound && svspost.thumbnail !== undefined && svspost.thumbnail !== null && svspost.thumbnail !== "" ? [
          {
            url: loc.cdn(svspost.thumbnail),
            width: 800,
            height: 600,
            alt: svspost.title,
          }
        ] : []
      }}
    />
    <Flex
      direction={"column"}
      align={"center"}
      justify={"center"}
      w={"100%"}
      h={"100%"}
      pt={"30px"}
      pb={"30px"}
    >
      <Flex
        direction={"column"}
        align={"center"}
        justify={"flex-start"}
        w={"90%"}
        maxW={"800px"}
        h={"100%"}
      >
        <style jsx global>{`
          #content img {
            margin: 50px auto;
            max-width: 400px;
            max-height: 400px;
            width: 100%;
          }

          #content p {
            font-size: 1rem;
            line-height: var(--chakra-lineHeights-tall);
            margin: 30px;
          }

          #content h1, #content h2, #content h3, #content h4, #content h5, #content h6 {
            font-weight: 600;
            border-bottom: 1px solid var(--chakra-colors-chakra-body-text);
            margin-bottom: 15px;
            padding-bottom: 15px;
            margin-top: 30px;
          }

          #content h1 {
            font-size: var(--chakra-fontSizes-4xl);
          }

          #content h2 {
            font-size: var(--chakra-fontSizes-3xl);
          }

          #content h3 {
            font-size: var(--chakra-fontSizes-2xl);
          }

          #content h4 {
            font-size: var(--chakra-fontSizes-xl);
          }

          #content h5 {
            font-size: var(--chakra-fontSizes-lg);
          }

          #content h6 {
            font-size: var(--chakra-fontSizes-md);
          }

          #content em {
            font-style: italic;
          }

          #content strong {
            font-weight: var(--chakra-fontWeights-black);
          }

          #content del {
            text-decoration: line-through;
          }

          #content ul, #content ol {
            list-style-position: inside;
            margin: 20px 0 20px 20px;
          }

          #content ul {
            list-style-type: disc;
          }

          #content ol {
            list-style-type: decimal;
          }

          #content li {
            margin: 5px 0;
          }

          #content pre {
            margin: 30px 0;
            font-size: var(--chakra-fontSizes-sm);
          }

          #content div:has(> code) {
            font-size: var(--chakra-fontSizes-sm);
            border-radius: 15px;
          }

          #content div:has(> code)::-webkit-scrollbar {
            width: 10px;
            height: 10px;
            margin-bottom: 10px;
          }

          #content div:has(> code)::-webkit-scrollbar-track {
            background: var(--chakra-colors-scrollbar-track);
            border-radius: 10px;
          }

          #content div:has(> code)::-webkit-scrollbar-thumb {
            background: var(--chakra-colors-scrollbar-thumb);
            border-radius: 10px;
            transition: 0.2s;
          }

          #content div:has(> code)::-webkit-scrollbar-thumb:hover {
            background: var(--chakra-colors-scrollbar-thumb-hover);
            transition: 0.2s;
          }
          
          #content span.katex-html[aria-hidden="true"] {
            display: none;
          }
          
          #content div.math-display {
            margin: 30px 0;
            width: 100%;
            overflow-y: hidden;
            overflow-x: auto;
          }
          
          #content div.math-display::-webkit-scrollbar {
            width: 10px;
            height: 10px;
            margin-bottom: 10px;
          }
          
          #content div.math-display::-webkit-scrollbar-track {
            background: var(--chakra-colors-scrollbar-track);
            border-radius: 10px;
          }
          
          #content div.math-display::-webkit-scrollbar-thumb {
            background: var(--chakra-colors-scrollbar-thumb);
            border-radius: 10px;
            transition: 0.2s;
          }

          #content div.math-display::-webkit-scrollbar-thumb:hover {
            background: var(--chakra-colors-scrollbar-thumb-hover);
            transition: 0.2s;
          }
          
          #content a {
            color: var(--chakra-colors-scrollbar-thumb-hover);
          }
        `}</style>
        {
          post === undefined
            ? <Spinner />
            : post === null
              ? <Text>Post not found.</Text>
              : <>
                <Heading as={"h1"} fontSize={"4xl"} fontWeight={"black"} mb={"30px"} w={"100%"}>{post.title}</Heading>
                <Accordion allowToggle w={"100%"}>
                  <AccordionItem>
                    <AccordionButton>
                      <Box as={"span"} flex={"1"} textAlign={"left"}>
                        Additional Info
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      <PostInfo icon={<SmallAddIcon mr={"10px"} />} label={"Created Date"}>{dates?.created_at}</PostInfo>
                      <PostInfo icon={<EditIcon mr={"10px"} />} label={"Last Edited Date"}>{dates?.edited_at}</PostInfo>
                      <PostInfo icon={<ViewIcon mr={"10px"} />} label={"Views"}>{post["views"]}</PostInfo>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
                <Divider m={"30px 0"} />
                {
                  post.thumbnail !== undefined && post.thumbnail !== null && post.thumbnail !== ""
                    ? <Image
                      src={loc.cdn(post.thumbnail)}
                      aria-label={"Post Thumbnail"}
                      h={"100%"} maxH={"200px"} m={"40px 0"} />
                    : <></>
                }
                <Text fontSize={"md"} fontWeight={"semibold"} mb={"20px"} w={"100%"}>{post.description}</Text>
                <Divider m={"30px 0"} />
                <Box id={"content"} w={"100%"}>
                  <ReactMarkdown
                    remarkPlugins={[[RemarkGfm, {singleTilde: false}], [remarkMath]]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      code: Code
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </Box>
              </>
        }
      </Flex>
    </Flex>
  </DefaultLayout>
}