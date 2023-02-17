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
  Tooltip,
  useToast
} from "@chakra-ui/react";
import DefaultLayout from "@/layouts/default";
import {useEffect, useState} from "react";
import Showdown from "showdown";
import {EditIcon, SmallAddIcon, ViewIcon} from "@chakra-ui/icons";
import hljs from "highlight.js";
import python from "highlight.js/lib/languages/python";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import jsx from "highlight.js/lib/languages/javascript";
import tsx from "highlight.js/lib/languages/typescript";
import Head from "next/head";

let showdown = new Showdown.Converter({
  strikethrough: true,
});

hljs.registerLanguage("python", python);
hljs.registerLanguage("py", python);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("html", html);
hljs.registerLanguage("css", css);
hljs.registerLanguage("jsx", jsx);
hljs.registerLanguage("tsx", tsx);


export default function PostView() {
  let router = useRouter();
  let toast = useToast();

  let {post_id} = router.query;

  let [post, setPost] = useState(undefined);
  let [dates, setDates] = useState({});

  useEffect(() => {
    hljs.initHighlighting();
  }, [])

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


  return <DefaultLayout>
    <Head>
      <link rel="stylesheet"
      href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/styles/default.min.css" />
    </Head>
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
          }
          #content p{font-size:1rem;line-height:var(--chakra-lineHeights-tall);}
          #content h1,#content h2,#content h3,#content h4,#content h5,#content h6{ 
            font-weight:600; 
            border-bottom:1px solid var(--chakra-colors-chakra-body-text);
            margin-bottom:15px;
            padding-bottom:15px;
            margin-top:30px;
          }
          #content h1{font-size:var(--chakra-fontSizes-4xl);}
          #content h2 {font-size:var(--chakra-fontSizes-3xl);}
          #content h3 {font-size:var(--chakra-fontSizes-2xl);}
          #content h4 {font-size:var(--chakra-fontSizes-xl);}
          #content h5 {font-size:var(--chakra-fontSizes-lg);}
          #content h6 {font-size:var(--chakra-fontSizes-md);}
          #content em {font-style:italic;}
          #content strong {font-weight:var(--chakra-fontWeights-black);}
          #content del {text-decoration:line-through;}
          #content ul,#content ol {list-style-position:inside;margin:20px 0 20px 20px;}
          #content ul {list-style-type:disc;}
          #content ol {list-style-type:decimal;}
          #content li {margin:5px 0;}
          #content pre {margin: 30px 0;font-size:var(--chakra-fontSizes-sm);}
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
                  post.thumbnail !== undefined && post.thumbnail !== null
                    ? <Image
                      src={`https://cdn.sserve.work/${post.thumbnail}`}
                      aria-label={"Post Thumbnail"}
                      h={"100%"} maxH={"200px"} m={"40px 0"} />
                    : <></>
                }
                <Text fontSize={"lg"} fontWeight={"semibold"} mb={"20px"} w={"100%"}>{post.description}</Text>
                <Divider m={"30px 0"} />
                <Box
                  dangerouslySetInnerHTML={{__html: showdown.makeHtml(post.content)}}
                  id={"content"}
                  w={"100%"}
                />
              </>
        }
      </Flex>
    </Flex>
  </DefaultLayout>
}