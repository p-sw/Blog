import {hasToken, ServerSideRedirection, tokenValidate} from "@/components/api";
import DefaultLayout from "@/layouts/default";
import Form from "@/components/form";
import {useEffect, useRef, useState} from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  Flex,
  Checkbox,
  FormErrorMessage,
  FormHelperText,
  useDisclosure,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerBody,
  DrawerCloseButton,
  DrawerHeader, DrawerContent, DrawerFooter,
  useToast
} from "@chakra-ui/react";
import {useRouter} from "next/router";

export async function getServerSideProps(context) {
  if (!await hasToken(context.req.cookies)) {
    return
  }

  if (!await tokenValidate(context.req.cookies.token)) {
    return ServerSideRedirection("/admin/login", false)
  } else {
    return {
      props: {
        token: context.req.cookies.token
      }
    }
  }
}

export default function PostCreateForm({token}) {
  let [body, setBody] = useState({title: "", description: "", content: "", hidden: false, series_id: null, tags: null, thumbnail: null});
  let [prevBody, setPrevBody] = useState({title: "", description: "", content: "", hidden: false});
  let [uniqueTitle, setUniqueT] = useState(true);
  let [seriesName, setSeriesName] = useState("");
  let [tags, setTags] = useState([]);

  let {isOpen: seriesSelectorOpened, onOpen: seriesSelectorOpen, onClose: seriesSelectorClose} = useDisclosure()
  let seriesOpenerRef = useRef()
  let {isOpen: tagSelectorOpened, onOpen: tagSelectorOpen, onClose: tagSelectorClose} = useDisclosure()

  let router = useRouter();
  let {pid} = router.query;

  let toast = useToast();

  useEffect(function getPrevBody() {
    if (pid === undefined) return;
    fetch(`/api/post/${pid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json()).then(data => {
      setPrevBody(data);
      setBody(data);
    })
  }, [pid])

  useEffect(function titleUniqueCheck() {
    fetch(`/api/post/unique-title?query=${body.title}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": token
      }
    }).then(res => res.json()).then(data => {
      setUniqueT(data.result);
    })
  }, [body.title, token])


  return <DefaultLayout>
    <style jsx global>{`
    body {
    overflow-x: hidden;
    }
    `}</style>
    <Flex
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      w={"100%"}
      h={"100%"}
      boxSizing={"border-box"}
      pt={"50px"}
      pb={"50px"}
    >
      <Box bgColor={"secondbg"} p={"20px"} borderRadius={"15px"} w={"90%"} maxW={"1000px"} boxSizing={"border-box"}>
        <Box textAlign={"center"} mb={"50px"}>
          <Heading fontSize={"3xl"} fontWeight={"black"}>Write Post</Heading>
        </Box>
        <Box>
          <Form action={"/api/post"} method={"POST"} submitHandler={(e) => {
            e.preventDefault();
            fetch("/api/post", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "token": token
              },
              body: JSON.stringify(body)
            }).then(async res => {
              if (res.status === 200) {
                toast({
                  title: "Added",
                  description: "Successfully added a post.",
                  status: "success",
                  isClosable: true,
                  duration: 3000
                })
                await router.push("/admin?t=tag")
              } else {
                toast({
                  title: "Failed",
                  description: "Failed to add a tag due to unexpected error.",
                  status: "error",
                  isClosable: true,
                  duration: 3000
                })
              }
            })
          }}>
            <FormControl id={"series"} mb={"20px"}>
              <FormLabel>Series</FormLabel>
              <Button onClick={seriesSelectorOpen} ref={seriesOpenerRef}>Select Series</Button>
              <Drawer
                isOpen={seriesSelectorOpened}
                onClose={seriesSelectorClose}
                placement={"right"}
                finalFocusRef={seriesOpenerRef}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerHeader>
                    Select series
                  </DrawerHeader>
                  <DrawerBody>
                    <DrawerCloseButton />
                    <Input type={"text"} value={seriesName} onChange={(e) => setSeriesName(e.target.value)}/>
                  </DrawerBody>
                  <DrawerFooter>
                    <Button variant={"outline"} mr={3} onClick={seriesSelectorClose}>Cancel</Button>
                    <Button colorScheme={"blue"}>Save</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </FormControl>
            <FormControl id={"title"} mb={"20px"} isInvalid={!uniqueTitle && prevBody.title !== body.title}>
              <FormLabel>Title</FormLabel>
              <Input type={"text"} value={body.title} onChange={(e) => setBody({...body, title: e.target.value})}/>
              {
                !uniqueTitle && prevBody.title !== body.title
                  ? <FormErrorMessage>제목이 다른 포스트의 제목과 동일합니다.</FormErrorMessage>
                  : <FormHelperText>제목은 다른 포스트와 겹치지 않아야 합니다. </FormHelperText>
              }
            </FormControl>
            <FormControl id={"description"} mb={"20px"}>
              <FormLabel>Description</FormLabel>
              <Input type={"text"} value={body.description} onChange={(e) => setBody({...body, description: e.target.value})}/>
            </FormControl>
            <FormControl id={"content"} mb={"20px"}>
              <FormLabel>Content</FormLabel>
              <Textarea value={body.content} onChange={(e) => setBody({...body, content: e.target.value})} resize={"none"} h={"500px"} />
            </FormControl>
            <FormControl id={"hidden"} mb={"20px"}>
              <FormLabel>Hidden</FormLabel>
              <Checkbox isChecked={body.hidden} onChange={(e) => setBody({...body, hidden: e.target.checked})} />
            </FormControl>
            <Input type={"submit"} value={"Add"}/>
          </Form>
        </Box>
      </Box>
    </Flex>
  </DefaultLayout>
}