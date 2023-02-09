import {hasToken, ServerSideRedirection, tokenValidate} from "@/components/api";
import DefaultLayout from "@/layouts/default";
import {useRouter} from "next/router";
import {useEffect, useRef, useState} from "react";
import {
  Box,
  Button, Checkbox,
  Drawer, DrawerBody, DrawerCloseButton,
  DrawerContent, DrawerFooter,
  DrawerHeader,
  DrawerOverlay, Flex,
  FormControl, FormErrorMessage, FormHelperText,
  FormLabel,
  Heading, Input, useDisclosure,
  Text, Divider,
  RadioGroup, Radio, InputRightElement,
  InputGroup,
  IconButton, Stack,
  useToast
} from "@chakra-ui/react";
import Form from "@/components/form";
import {Search2Icon} from "@chakra-ui/icons";

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

export default function SeriesCreateForm({token}) {
  let [body, setBody] = useState({name: "", description: "", thumbnail: null, posts: [], hidden: false});
  let [prevBody, setPrevBody] = useState({name: "", description: "", thumbnail: null, posts: [], hidden: false});
  let [uniqueTitle, setUniqueT] = useState(true);

  let [postIdTitleDict, setPostIdTitleDict] = useState({});

  let [postSelectorText, setPostSelectorText] = useState("");
  let [postSearchResult, setPostSearchResult] = useState([]);

  let {isOpen: postSelectorOpened, onOpen: openPostSelector, onClose: closePostSelector} = useDisclosure();
  let postSelectorOpenerRef = useRef();
  let [selectedPost, setSelectedPost] = useState("");

  let router = useRouter();
  let {pid} = router.query;

  let toast = useToast();

  useEffect(function getPrevBody() {
    if (pid === undefined) return;
    fetch(`/api/series/${pid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json()).then(data => {
      setPrevBody(prev => {
        return {...prev, ...data}
      });
      setBody(prev => {
        return {...prev, ...data}
      });
    })
    fetch(`/api/series/${pid}/get-posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json()).then(data => {
      setPrevBody(prev => {
        return {...prev, posts: data}
      });
      setBody(prev => {
        return {...prev, posts: data}
      });

      let idTitleDict = {};

      for (let post of data) {
        fetch(`/api/post/${post}/light`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        }).then(res => res.json()).then(data => {
          idTitleDict[post] = data.title;
        })
      }

      setPostIdTitleDict(idTitleDict);
    })
  }, [pid]);

  useEffect(function titleUniqueCheck() {
    fetch(`/api/series/unique-name?query=${body.name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": token
      }
    }).then(res => res.json()).then(data => {
      setUniqueT(data.result);
    })
  }, [body.name, token]);

  useEffect(function initPostSelector() {
    setPostSelectorText("");
  }, [postSelectorOpened]);

  function searchPost() {
    fetch(`/api/post/search-by-title?query=${postSelectorText}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": token
      }
    }).then(res => res.json()).then(data => {
      setPostSearchResult(data);
      let data_id_title = {}
      for (let i = 0; i < data.length; i++) {
        data_id_title[data[i].id] = data[i].title;
      }
      setPostIdTitleDict({...postIdTitleDict, ...data_id_title})
    })
  }

  return <DefaultLayout>
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
          <Heading fontSize={"3xl"} fontWeight={"black"}>Create Series</Heading>
        </Box>
        <Box>
          <Form action={"/api/series"} method={"POST"} submitHandler={(e) => {
            e.preventDefault();
            console.log(body);
            fetch("/api/series", {
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
                  description: "Successfully added a series.",
                  status: "success",
                  isClosable: true,
                  duration: 3000
                })
                await router.push("/admin?t=series")
              } else {
                toast({
                  title: "Failed",
                  description: "Failed to add a series due to unexpected error.",
                  status: "error",
                  isClosable: true,
                  duration: 3000
                })
              }
            })
          }}>
            <FormControl id={"name"} mb={"20px"} isInvalid={!uniqueTitle && prevBody.name !== body.name}>
              <FormLabel>Title</FormLabel>
              <Input type={"text"} value={body.name} onChange={(e) => {setBody({...body, name: e.target.value})}} />
              {
                !uniqueTitle && prevBody.name !== body.name
                  ? <FormErrorMessage>제목이 다른 시리즈의 제목과 동일합니다.</FormErrorMessage>
                  : <FormHelperText>제목은 다른 시리즈와 겹치지 않아야 합니다. </FormHelperText>
              }
            </FormControl>
            <FormControl id={"description"} mb={"20px"}>
              <FormLabel>Description</FormLabel>
              <Input type={"text"} value={body.description} onChange={(e) => {setBody({...body, description: e.target.value})}} />
            </FormControl>
            <FormControl id={"posts"} mb={"20px"}>
              <FormLabel>Posts</FormLabel>
              <Button ref={postSelectorOpenerRef} onClick={openPostSelector}>Select Posts</Button>
              <FormHelperText>Current Posts
                <Stack direction={"row"} spacing={"5px"} display={"inline"} ml={"10px"}>
                {
                body.posts
                  ? body.posts.map((post_id) => {
                      return <Button key={post_id} display={"inline"} p={"7px"} h={"fit-content"}
                      _hover={{bgColor: "red.900"}}>{postIdTitleDict[post_id]}</Button>
                    })
                  : ""
                }
                </Stack>
              </FormHelperText>
              <Drawer
                isOpen={postSelectorOpened}
                onClose={closePostSelector}
                placement={"right"}
                finalFocusRef={postSelectorOpenerRef}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Select Posts</DrawerHeader>
                  <DrawerBody>
                    <Text fontSize={"sm"} mb={"8px"}>Search for post</Text>
                    <InputGroup>
                      <Input type={"Text"} value={postSelectorText} onChange={(e) => {setPostSelectorText(e.target.value)}} />
                      <InputRightElement>
                        <IconButton onClick={() => {searchPost()}} icon={<Search2Icon />} aria-label={"Search"} />
                      </InputRightElement>
                    </InputGroup>
                    <Divider mb={"20px"} mt={"20px"} />
                    <RadioGroup onChange={setSelectedPost} value={selectedPost}>
                      <Stack spacing={5} direction={"column"}>
                      {
                        postSearchResult
                          ? postSearchResult.map((post, index) => <Radio key={index} value={post.id.toString()} colorScheme={"blue"}>{post.title}</Radio>)
                          : ""
                      }
                      </Stack>
                    </RadioGroup>
                  </DrawerBody>
                  <DrawerFooter>
                    <Button variant={"outline"} mr={3} onClick={closePostSelector}>Cancel</Button>
                    <Button colorScheme={"blue"} onClick={() => {
                      setBody({...body, posts: [...body.posts, parseInt(selectedPost, 10)]});
                      closePostSelector();
                    }}>Add</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </FormControl>
            <FormControl id={"hidden"} mb={"20px"}>
              <FormLabel>Hidden</FormLabel>
              <Checkbox isChecked={body.hidden} onChange={(e) => {setBody({...body, hidden: e.target.checked})}} />
            </FormControl>
            <Input type={"submit"} value={"Add"}/>
          </Form>
        </Box>
      </Box>
    </Flex>
  </DefaultLayout>
}