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
  useToast,
  Image
} from "@chakra-ui/react";
import Form from "@/components/form";
import {Search2Icon} from "@chakra-ui/icons";
import {AdminPostItem, AdminTagItem} from "@/components/items";

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
  let [body, setBody] = useState({name: "", description: "", thumbnail: "", posts: [], tags: [], hidden: false});
  let [prevBody, setPrevBody] = useState({name: "", description: "", thumbnail: "", posts: [], tags: [], hidden: false});
  let [uniqueTitle, setUniqueT] = useState(true);

  let [postIdDict, setPostIdDict] = useState({});
  let [tagIdDict, setTagIdDict] = useState({});

  let [postSelectorText, setPostSelectorText] = useState("");
  let [tagSelectorText, setTagSelectorText] = useState("");
  let [postSearchResult, setPostSearchResult] = useState([]);
  let [tagSearchResult, setTagSearchResult] = useState([]);

  let {isOpen: postSelectorOpened, onOpen: openPostSelector, onClose: closePostSelector} = useDisclosure();
  let {isOpen: tagSelectorOpened, onOpen: openTagSelector, onClose: closeTagSelector} = useDisclosure();
  let postSelectorOpenerRef = useRef();
  let tagSelectorOpenerRef = useRef();
  let [selectedPost, setSelectedPost] = useState("");
  let [selectedTag, setSelectedTag] = useState("");

  let thumbnailSelectorRef = useRef();

  let router = useRouter();
  let {pid} = router.query;

  let toast = useToast();

  useEffect(function getPrevBody() {
    if (!pid) return;
    setPrevBody(prev => {
      return {...prev, id: pid}
    });
    setBody(prev => {
      return {...prev, id: pid}
    });
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

      for (let post of data) {
        fetch(`/api/post/${post}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        }).then(res => res.json()).then(postdata => {
          setPostIdDict(prev => {
            return {...prev, [post]: postdata}
          })
        })
      }
    })

    fetch(`/api/series/${pid}/get-tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json()).then(data => {
      setPrevBody(prev => {
        return {...prev, tags: data}
      });
      setBody(prev => {
        return {...prev, tags: data}
      });
      for (let tag of data) {
        fetch(`/api/tag/${tag}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        }).then(res => res.json()).then(tagdata => {
          setTagIdDict(prev => {
            return {...prev, [tag]: tagdata}
          })
        })
      }
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

  function searchPost() {
    fetch(`/api/post/search-by-title?query=${postSelectorText}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": token
      }
    }).then(res => res.json()).then(data => {
      setPostSearchResult(data);
      for (let i = 0; i < data.length; i++) {
        setPostIdDict(prev => {
          return {...prev, [data[i].id]: data[i]};
        });
      }
    })
  }

  function searchTag() {
    fetch(`/api/tag/search-by-name?query=${tagSelectorText}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": token
      }
    }).then(res => res.json()).then(data => {
      setTagSearchResult(data);
      for (let i = 0; i < data.length; i++) {
        setTagIdDict(prev => {
          return {...prev, [data[i].id]: data[i]};
        });
      }
    })
  }

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
          <Heading fontSize={"3xl"} fontWeight={"black"}>Create Series</Heading>
        </Box>
        <Box>
          <Form action={"/api/series"} method={"POST"} submitHandler={(e) => {
            e.preventDefault();
            let method = "POST";
            let toastTitle = "Added";
            let toastDescription = "Successfully added a series.";
            let failedToastDescription = "Failed to add a series due to unexpected error.";
            if (pid !== undefined) {
              method = "PATCH";
              toastTitle = "Updated";
              toastDescription = "Successfully updated a series.";
              failedToastDescription = "Failed to update a series due to unexpected error.";
            }
            fetch("/api/series", {
              method: method,
              headers: {
                "Content-Type": "application/json",
                "token": token
              },
              body: JSON.stringify(body)
            }).then(async res => {
              if (res.status === 200) {
                toast({
                  title: toastTitle,
                  description: toastDescription,
                  status: "success",
                  isClosable: true,
                  duration: 3000
                })
                await router.push("/admin?t=series")
              } else {
                toast({
                  title: "Failed",
                  description: failedToastDescription,
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
            <FormControl id={"thumbnail"} mb={"20px"}>
              <FormLabel>Thumbnail</FormLabel>
              {
                body.thumbnail !== "" && body.thumbnail !== null
                  ? <Image src={`https://cdn.sserve.work/${body.thumbnail}`} w={"100%"} maxW={"400px"} h={"auto"} mb={"10px"} alt={"Thumbnail"} />
                  : <></>
              }
              <FormHelperText>{body.thumbnail !== "" && body.thumbnail !== null ? body.thumbnail : "Not Set"}</FormHelperText>
              <Input type={"file"} display={"none"} ref={thumbnailSelectorRef} onChange={(e) => {
                const formData = new FormData();
                formData.append("file", e.target.files[0]);
                fetch("/cdn/upload", {
                  method: "POST",
                  body: formData
                }).then(res => res.json()).then(data => {
                  setBody({...body, thumbnail: `${data.hash}.${e.target.files[0].type.split("/")[1]}`});
                })
              }} />
              <Button colorScheme={"blue"} onClick={() => {
                thumbnailSelectorRef.current.click();
              }}>Upload</Button>
            </FormControl>
            <FormControl id={"posts"} mb={"20px"}>
              <FormLabel>Posts</FormLabel>
              <Button ref={postSelectorOpenerRef} onClick={openPostSelector}>Select Posts</Button>
              <FormHelperText>Current Posts</FormHelperText>
              <Stack direction={"column"} spacing={"5px"} display={"inline"} ml={"10px"}>
              {
              body.posts.length !== 0
                ? body.posts.map((post_id) => {
                    if (postIdDict[post_id]) {
                      return <AdminPostItem key={post_id} post={postIdDict[post_id]} inseries={true} onDeleteInSeries={() => {
                        let new_posts = body.posts.filter((id) => id !== post_id);
                        setBody({...body, posts: new_posts});
                      }} />
                    }
                    return <Text key={post_id}>Loading...</Text>;
                  })
                : <Text>No Posts</Text>
              }
              </Stack>
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
                          : null
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
            <FormControl id={"tags"} mb={"20px"}>
              <FormLabel>Tags</FormLabel>
              <Button ref={tagSelectorOpenerRef} onClick={openTagSelector}>Select Tags</Button>
              <FormHelperText>Current Tags</FormHelperText>
              <Stack direction={"column"} spacing={"5px"} display={"inline"} ml={"10px"}>
              {
                body.tags.length !== 0
                  ? body.tags.map((tag_id) => {
                      if (tagIdDict[tag_id]) {
                        return <AdminTagItem key={tag_id} tag={tagIdDict[tag_id]} inseries={true} onDeleteInSeries={() => {
                          let new_tags = body.tags.filter((id) => id !== tag_id);
                          setBody({...body, tags: new_tags});
                        }} />
                      }
                      return <Text key={tag_id}>Loading..</Text>;
                    })
                  : <Text>No Tags</Text>
              }
              </Stack>
              <Drawer
                isOpen={tagSelectorOpened}
                onClose={closeTagSelector}
                placement={"left"}
                finalFocusRef={tagSelectorOpenerRef}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Select Tags</DrawerHeader>
                  <DrawerBody>
                    <Text fontSize={"sm"} mb={"8px"}>Search for tag</Text>
                    <InputGroup>
                      <Input type={"Text"} value={tagSelectorText} onChange={(e) => {setTagSelectorText(e.target.value)}} />
                      <InputRightElement>
                        <IconButton onClick={() => {searchTag()}} icon={<Search2Icon />} aria-label={"Search"} />
                      </InputRightElement>
                    </InputGroup>
                    <Divider mb={"20px"} mt={"20px"} />
                    <RadioGroup onChange={setSelectedTag} value={selectedTag}>
                      <Stack spacing={5} direction={"column"}>
                      {
                        tagSearchResult
                          ? tagSearchResult.map((tag, index) => <Radio key={index} value={tag.id.toString()} colorScheme={"blue"}>{tag.name}</Radio>)
                          : null
                      }
                      </Stack>
                    </RadioGroup>
                  </DrawerBody>
                  <DrawerFooter>
                    <Button variant={"outline"} mr={3} onClick={closeTagSelector}>Cancel</Button>
                    <Button colorScheme={"blue"} onClick={() => {
                      setBody({...body, tags: [...body.tags, parseInt(selectedTag, 10)]});
                      closeTagSelector();
                    }}>Add</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </FormControl>
            <FormControl id={"hidden"} mb={"20px"}>
              <FormLabel>Hidden</FormLabel>
              <Checkbox isChecked={body.hidden} onChange={(e) => {setBody({...body, hidden: e.target.checked})}} />
            </FormControl>
            <Input type={"submit"} value={"Save"}/>
          </Form>
        </Box>
      </Box>
    </Flex>
  </DefaultLayout>
}