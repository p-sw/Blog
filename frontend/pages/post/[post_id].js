import {useRouter} from "next/router";
import {
  Accordion,
  AccordionButton, AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  Heading,
  Spinner,
  Text,
  Tooltip,
  useToast
} from "@chakra-ui/react";
import DefaultLayout from "@/layouts/default";
import {useEffect, useState} from "react";
import Showdown from "showdown";
import {EditIcon, SmallAddIcon, ViewIcon} from "@chakra-ui/icons";

let showdown = new Showdown.Converter({
  strikethrough: true,
});

export default function PostView() {
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


  return <DefaultLayout>
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
        align={"flex-start"}
        justify={"flex-start"}
        w={"90%"}
        maxW={"800px"}
        h={"100%"}
      >
        <style jsx global>{`
          #content img {
            margin: 50px auto;
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
        `}</style>
        {
          post === undefined
            ? <Spinner />
            : post === null
              ? <Text>Post not found.</Text>
              : <>
                <Heading as={"h1"} fontSize={"4xl"} fontWeight={"black"} mb={"30px"}>{post.title}</Heading>
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
                <Divider mt={"30px"} mb={"30px"} />
                <Text fontSize={"xl"} fontWeight={"bold"} mb={"20px"}>{post.description}</Text>
                <Box
                  dangerouslySetInnerHTML={{__html: showdown.makeHtml(post.content)}}
                  id={"content"}
                />
              </>
        }
      </Flex>
    </Flex>
  </DefaultLayout>
}