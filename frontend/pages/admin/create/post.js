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
  useToast, InputRightElement, IconButton, InputGroup, Divider, Stack, Radio, RadioGroup, Image, Text
} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {Search2Icon} from "@chakra-ui/icons";
import {AdminSeriesItem, AdminTagItem} from "@/components/items";

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
  let [body, setBody] = useState({title: "", description: "", content: "", hidden: false, series_id: null, tags: [], thumbnail: ""});
  let [prevBody, setPrevBody] = useState({title: "", description: "", content: "", hidden: false, series_id: null, tags: [], thumbnail: ""});
  let [uniqueTitle, setUniqueT] = useState(true);

  let {isOpen: seriesSelectorOpened, onOpen: seriesSelectorOpen, onClose: seriesSelectorClose} = useDisclosure()
  let seriesOpenerRef = useRef()
  let {isOpen: tagSelectorOpened, onOpen: tagSelectorOpen, onClose: tagSelectorClose} = useDisclosure()
  let tagOpenerRef = useRef()

  let thumbnailSelectorRef = useRef()
  let imageUploaderRef = useRef()

  let [seriesSearchResult, setSeriesSearchResult] = useState([]);
  let [seriesSearchQuery, setSeriesSearchQuery] = useState("");
  let [seriesIdDict, setSeriesIdDict] = useState({});
  let [selectedSeries, setSelectedSeries] = useState("");
  let [tagSearchResult, setTagSearchResult] = useState([]);
  let [tagSearchQuery, setTagSearchQuery] = useState("");
  let [tagIdDict, setTagIdDict] = useState({});
  let [selectedTag, setSelectedTag] = useState("");

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
      setPrevBody(prev => {
        return {...prev, ...data};
      });
      setBody(prev => {
        return {...prev, ...data};
      });
    })
    fetch(`/api/post/${pid}/get-series`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json()).then(data => {
      setPrevBody(prev => {
        return {...prev, series_id: data.id};
      })
      setBody(prev => {
        return {...prev, series_id: data.id};
      })

      if (data.id === null) return;
      fetch(`/api/series/${data.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      }).then(res2 => res2.json()).then(seriesObj => {
        setSeriesIdDict(prev => {
          return {...prev, [data.id]: seriesObj}
        })
      })
    })
    fetch(`/api/post/${pid}/get-tags`, {
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

  function searchSeries() {
    fetch(`/api/series/search-by-name?query=${seriesSearchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": token
      }
    }).then(res => res.json()).then(data => {
      setSeriesSearchResult(data);
      for (let i = 0; i < data.length; i++) {
        setSeriesIdDict(prev => {
          return {...prev, [data[i].id]: data[i]}
        });
      }
    })
  }

  function searchTag() {
    fetch(`/api/tag/search-by-name?query=${tagSearchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": token
      }
    }).then(res => res.json()).then(data => {
      setTagSearchResult(data);
      for (let i = 0; i < data.length; i++) {
        setTagIdDict(prev => {
          return {...prev, [data[i].id]: data[i]}
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
          <Heading fontSize={"3xl"} fontWeight={"black"}>Write Post</Heading>
        </Box>
        <Box>
          <Form action={"/api/post"} method={"POST"} submitHandler={(e) => {
            e.preventDefault();
            let method = "POST";
            let toastTitle = "Added";
            let toastDescription = "Successfully added a post.";
            let failedToastDescription = "Failed to add a post due to unexpected error.";
            if (pid !== undefined) {
              method = "PATCH";
              toastTitle = "Updated";
              toastDescription = "Successfully updated a post.";
              failedToastDescription = "Failed to update a post due to unexpected error.";
            }
            fetch("/api/post", {
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
                await router.push("/admin?t=post")
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
            <FormControl id={"series"} mb={"20px"}>
              <FormLabel>Series</FormLabel>
              <Button onClick={seriesSelectorOpen} ref={seriesOpenerRef} mb={"10px"}>Select Series</Button>
              {
                body.series_id !== null
                  ? seriesIdDict[body.series_id] !== undefined
                    ? <AdminSeriesItem
                      series={seriesIdDict[body.series_id]}
                      token={token}
                      refresh={() => {
                        setBody(prev => {return {...prev, series_id: null}});
                        setSeriesIdDict({});
                      }}
                    />
                    : <FormHelperText>Loading...</FormHelperText>
                  : <FormHelperText>No series selected.</FormHelperText>
              }
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
                    <InputGroup>
                      <Input type={"Text"} value={seriesSearchQuery} onChange={(e) => {setSeriesSearchQuery(e.target.value)}} />
                      <InputRightElement>
                        <IconButton onClick={() => {searchSeries()}} icon={<Search2Icon />} aria-label={"Search"} />
                      </InputRightElement>
                    </InputGroup>
                    <Divider mb={"20px"} mt={"20px"} />
                    <RadioGroup onChange={setSelectedSeries} value={selectedSeries}>
                      <Stack spacing={5} direction={"column"}>
                      {
                        seriesSearchResult
                          ? seriesSearchResult.map((series, index) => <Radio key={index} value={series.id.toString()} colorScheme={"blue"}>{series.name}</Radio>)
                          : null
                      }
                      </Stack>
                    </RadioGroup>
                  </DrawerBody>
                  <DrawerFooter>
                    <Button variant={"outline"} mr={3} onClick={seriesSelectorClose}>Cancel</Button>
                    <Button colorScheme={"blue"} onClick={() => {
                      setBody(prev => {
                        return {...prev, series_id: parseInt(selectedSeries, 10)}
                      });
                      seriesSelectorClose();
                    }}>Save</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
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
                }).then(res => {
                  if (res.status === 200) {
                    return res.json()
                  } else {
                    toast({
                      title: `Error: ${res.status}`,
                      description: `Failed to upload image: ${res.statusText}`,
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    })
                    return null;
                  }
                }).then(data => {
                  if (data === null) return;
                  setBody({...body, thumbnail: `${data.hash}.${e.target.files[0].type.split("/")[1]}`});
                })
              }} />
              <Button colorScheme={"blue"} onClick={() => {
                thumbnailSelectorRef.current.click();
              }}>Upload</Button>
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
              <Textarea
                value={body.content}
                onChange={(e) => setBody({...body, content: e.target.value})}
                resize={"none"} h={"500px"}
                onDrop={(e) => {
                  e.preventDefault();

                  if (e.dataTransfer.items) {
                    for (let i = 0; i < e.dataTransfer.items.length; i++) {
                      if (e.dataTransfer.items[i].kind === "file") {
                        const file = e.dataTransfer.items[i].getAsFile();
                        const formData = new FormData();
                        formData.append("file", file);
                        fetch("/cdn/upload", {
                          method: "POST",
                          body: formData
                        }).then(res => {
                          if (res.status === 200) {
                            return res.json()
                          } else {
                            toast({
                              title: `Error: ${res.status}`,
                              description: `Failed to upload image: ${res.statusText}`,
                              status: "error",
                              duration: 5000,
                              isClosable: true,
                            })
                            return null;
                          }
                        }).then(data => {
                          if (data === null) return;
                          setBody(prev => {
                            return {...prev, content: `${prev.content}\n![](https://cdn.sserve.work/${data.hash}.${file.type.split("/")[1]})`}
                          })
                        })
                      }
                    }
                  } else if (e.dataTransfer.files) {
                    for (let i = 0; i < e.dataTransfer.files.length; i++) {
                      const file = e.dataTransfer.files[i];
                      const formData = new FormData();
                      formData.append("file", file);
                      fetch("/cdn/upload", {
                        method: "POST",
                        body: formData
                      }).then(res => {
                        if (res.status === 200) {
                          return res.json()
                        } else {
                          toast({
                            title: `Error: ${res.status}`,
                            description: `Failed to upload image: ${res.statusText}`,
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                          })
                          return null;
                        }
                      }).then(data => {
                        if (data === null) return;
                        setBody(prev => {
                          return {...prev, content: `${prev.content}\n![](https://cdn.sserve.work/${data.hash}.${file.type.split("/")[1]})`}
                        })
                      })
                    }
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const items = e.clipboardData.items;
                  for (let i = 0; i < items.length; i++) {
                    if (items[i].kind === "file") {
                      const file = items[i].getAsFile();
                      const formData = new FormData();
                      formData.append("file", file);
                      fetch("/cdn/upload", {
                        method: "POST",
                        body: formData
                      }).then(res => {
                        if (res.status === 200) {
                          return res.json()
                        } else {
                          toast({
                            title: `Error: ${res.status}`,
                            description: `Failed to upload image: ${res.statusText}`,
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                          })
                          return null;
                        }
                      }).then(data => {
                        if (data === null) return;
                        setBody(prev => {
                          return {...prev, content: `${prev.content}\n![](https://cdn.sserve.work/${data.hash}.${file.type.split("/")[1]})`}
                        })
                      })
                    }
                  }
                }}
              />
              <Input type={"file"} display={"none"} ref={imageUploaderRef} onChange={(e) => {
                const formData = new FormData();
                formData.append("file", e.target.files[0]);
                fetch("/cdn/upload", {
                  method: "POST",
                  body: formData
                }).then(res => {
                  if (res.status === 200) {
                    return res.json()
                  } else {
                    toast({
                      title: `Error: ${res.status}`,
                      description: `Failed to upload image: ${res.statusText}`,
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    })
                    return null;
                  }
                }).then(data => {
                  if (data === null) return;
                  setBody(prev => {
                    return {...prev, content: `${prev.content}\n![](https://cdn.sserve.work/${data.hash}.${e.target.files[0].type.split("/")[1]})`}
                  });
                })
              }} />
              <Button colorScheme={"blue"} onClick={() => {
                imageUploaderRef.current.click();
              }}>Upload</Button>
            </FormControl>
            <FormControl id={"tags"} mb={"20px"}>
              <FormLabel>Tags</FormLabel>
              <Button ref={tagOpenerRef} onClick={tagSelectorOpen}>Select Tags</Button>
              <FormHelperText>Current Tags</FormHelperText>
              <Stack direction={"column"} spacing={"5px"} display={"inline"} ml={"10px"}>
              {
                body.tags.length !== 0
                  ? body.tags.map((tag_id) => {
                      if (tagIdDict[tag_id]) {
                        return <AdminTagItem
                          key={tag_id}
                          tag={tagIdDict[tag_id]}
                          inseries={true}
                          onDeleteInSeries={() => {
                            let new_tags = body.tags.filter((id) => id !== tag_id);
                            setBody({...body, tags: new_tags});
                          }}
                          token={token}
                          refresh={() => {
                            setTagIdDict(prev => {
                              delete prev[tag_id];
                              return prev;
                            });
                            setBody(prev => {
                              return {...prev, tags: prev.tags.filter((id) => id !== tag_id)}
                            });
                          }}
                        />
                      }
                      return <Text key={tag_id}>Loading..</Text>;
                    })
                  : <Text>No Tags</Text>
              }
              </Stack>
              <Drawer
                isOpen={tagSelectorOpened}
                onClose={tagSelectorClose}
                placement={"left"}
                finalFocusRef={tagOpenerRef}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Select Tags</DrawerHeader>
                  <DrawerBody>
                    <Text fontSize={"sm"} mb={"8px"}>Search for tag</Text>
                    <InputGroup>
                      <Input type={"Text"} value={tagSearchQuery} onChange={(e) => {setTagSearchQuery(e.target.value)}} />
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
                    <Button variant={"outline"} mr={3} onClick={tagSelectorClose}>Cancel</Button>
                    <Button colorScheme={"blue"} onClick={() => {
                      setBody({...body, tags: [...body.tags, parseInt(selectedTag, 10)]});
                      tagSelectorClose();
                    }}>Add</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
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