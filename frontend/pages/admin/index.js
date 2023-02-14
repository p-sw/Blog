import {tokenValidate, hasToken, ServerSideRedirection} from "@/components/api"
import {useEffect, useState} from "react";
import DefaultLayout from "@/layouts/default";
import {
  Button,
  Flex, Grid, GridItem, IconButton,
  Menu,
  MenuButton, MenuGroup,
  MenuItem,
  MenuList,
  Text,
  Input, Tag, InputGroup, InputRightElement
} from "@chakra-ui/react";
import {AdminPostItem, AdminSeriesItem, AdminTagItem} from "@/components/items";
import {useRouter} from "next/router";
import {ChevronDownIcon, Search2Icon, AddIcon} from "@chakra-ui/icons";

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

export default function Admin({token}) {
  let router = useRouter();
  let {t} = router.query;

  let [type, setType] = useState("post");

  let [posts, setPosts] = useState(null);
  let [series, setSeries] = useState(null);
  let [tags, setTags] = useState(null);

  let [searchTags, setSearchTags] = useState([]);
  let [searchQuery, setSearchQuery] = useState("");

  let [tagSearchQuery, setTagSearchQuery] = useState("");
  let [tagSearchResult, setTagSearchResult] = useState([]);

  let [tagIdDict, setTagIdDict] = useState({});

  let [searchTriggered, setSearchTrigger] = useState(true);

  let [page, setPage] = useState(1);
  let [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    if (t === undefined || !t) return;
    setType(t);
  }, [t])

  useEffect(() => {
    if (!searchTriggered) return;
    if (type === "post") {
      fetch(`/api/post?p=${page}&${searchQuery ? "qn="+searchQuery+"&" : ""}${searchTags.map(tag => "qt="+tag).join("&")}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": token
        }
      }).then(response => response.json()).then(data => {
        setPosts(data["posts"]);
        setMaxPage(data["max_page"]);
      })
    } else if (type === "series") {
      fetch(`/api/series?p=${page}&${searchQuery ? "qn="+searchQuery+"&" : ""}${searchTags.map(tag => "qt="+tag).join("&")}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": token
        }
      }).then(response => response.json()).then(data => {
        setSeries(data["series"]);
        setMaxPage(data["max_page"]);
      })
    } else if (type === "tag") {
      fetch(`/api/tag?p=${page}&${searchQuery ? "qn="+searchQuery : ""}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": token
        }
      }).then(response => response.json()).then(data => {
        setTags(data["tags"]);
        setMaxPage(data["max_page"]);
      })
    }
    setSearchTrigger(false);
  }, [
    page,
    searchTriggered,
    searchTags,
    searchQuery,
    posts,
    series,
    tags,
    token,
    type
  ])

  function initSearch() {
    setPage(1);
    setSearchTrigger(true);
    setSearchTags([]);
    setSearchQuery("");
    setTagSearchQuery("");
    setTagSearchResult([]);
  }

  function changeTypeAs(t) {
    setType(t);
    initSearch();
  }

  function tagSearch() {
    if (tagSearchQuery === "") {
      setTagSearchResult([]);
      return;
    }
    fetch(`/api/tag/search-by-name?query=${tagSearchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": token
      }
    }).then(res => res.json()).then(data => {
      for (let tag of data) {
        setTagIdDict((prev) => {
          return {...prev, [tag.id]: tag}
        })
      }
      setTagSearchResult(data.map((tag) => tag.id).filter((tag) => !searchTags.includes(tag)));
    })
  }

  return <DefaultLayout>
    <Grid
      gridTemplateColumns={"repeat(2, 1fr)"}
      gridTemplateRows={"repeat(2, 1fr)"}
      position={"sticky"}
      top={"navheight"}
      w={"100%"}
      p={"10px"}
      zIndex={"50"}
      boxSizing={"border-box"}
      rowGap={"10px"}
      bgColor={"secondbg"}
    >
      <GridItem colSpan={2} rowSpan={1}>
        <Flex direction={"row"} w={"100%"} h={"100%"} gap={"8px"}>
          <Menu closeOnSelect={false}>
            <MenuButton as={IconButton} icon={<AddIcon />} aria-label={"Add Tag"} />
            <MenuList p={"10px"}>
              <MenuGroup title={"Selected Tags"}>
                {
                  searchTags.map((tag) => {
                    return <MenuItem key={tag} onClick={() => {
                      setSearchTags(searchTags.filter((t) => t !== tag));
                    }}><Tag size={"sm"} bgColor={"green.500"}>{tagIdDict[tag].name}</Tag></MenuItem>
                  })
                }
              </MenuGroup>
              <MenuGroup title={"Tag Search"}>
                <InputGroup>
                  <Input type={"text"} mb={"10px"} boxSizing={"border-box"} w={"auto"} maxW={"80vw"}
                    value={tagSearchQuery}
                    onChange={(e) => {
                      setTagSearchQuery(e.target.value);
                    }}
                  />
                  <InputRightElement>
                    <IconButton aria-label={"Search"} icon={<Search2Icon />} onClick={tagSearch} />
                  </InputRightElement>
                </InputGroup>
              </MenuGroup>
              <MenuGroup title={"Tag Recommendations"}>
                {
                  tagSearchResult.map((tag) => {
                    if (tagIdDict[tag] === undefined) {
                      return null;
                    }
                    return <MenuItem key={tag} onClick={async () => {
                      setSearchTags([...searchTags, tag]);
                      setTagSearchResult(tagSearchResult.filter((t) => t !== tag));
                    }}>{tagIdDict[tag].name}</MenuItem>
                  })
                }
              </MenuGroup>
            </MenuList>
          </Menu>
          <Input
            placeholder={"Search by title"}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
          <IconButton aria-label={"Search"} icon={<Search2Icon />} onClick={() => {setSearchTrigger(true)}} />
        </Flex>
      </GridItem>
      <GridItem colSpan={1} rowSpan={1} boxSizing={"border-box"}>
        <Flex
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
        >
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>Create</MenuButton>
            <MenuList>
              <MenuItem onClick={async () => {await router.push("/admin/create/post")}}>Post</MenuItem>
              <MenuItem onClick={async () => {await router.push("/admin/create/series")}}>Series</MenuItem>
              <MenuItem onClick={async () => {await router.push("/admin/create/tag")}}>Tag</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </GridItem>
      <GridItem colSpan={1} rowSpan={1} boxSizing={"border-box"}>
        <Flex
          direction={"row"}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>Type</MenuButton>
            <MenuList>
              <MenuItem onClick={async () => {changeTypeAs("post")}}>Post</MenuItem>
              <MenuItem onClick={async () => {changeTypeAs("series")}}>Series</MenuItem>
              <MenuItem onClick={async () => {changeTypeAs("tag")}}>Tag</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </GridItem>
    </Grid>
    <Flex
      flexDirection={"column"}
      justifyContent="flex-start"
      alignItems="center"
      marginTop={"40px"}
      marginBottom={"40px"}
      gap={"20px"}
    >
      {
        type === "post"
          ? posts !== null
            ? posts.length > 0
              ? posts.map(post => <AdminPostItem key={post.id} post={post} token={token} refresh={() => setSearchTrigger(true)} />)
              : <Text>No posts</Text>
            : <Text>Loading posts...</Text>
          : type === "series"
            ? series !== null
              ? series.length > 0
                ? series.map(item => <AdminSeriesItem key={item.id} series={item} token={token} refresh={() => setSearchTrigger(true)} />)
                : <Text>No series</Text>
              : <Text>Loading series...</Text>
            : type === "tag"
              ? tags !== null
                ? tags.length > 0
                  ? tags.map(tag => <AdminTagItem key={tag.id} tag={tag} token={token} refresh={() => setSearchTrigger(true)} />)
                  : <Text>No tags</Text>
                : <Text>Loading tags...</Text>
              : <Text>Unknown type</Text>
      }
    </Flex>
    <Flex
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"60px"}
    >
      <Flex
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"10px"}
        width={"90%"}
        maxW={"800px"}
        height={"100%"}
        bgColor={"navbg"}
        borderRadius={"15px"}
      >
        {
          function (){
            const range = Array.from({length: Math.min(10, maxPage)}, (_, i) => i + Math.max(1, page - 5)).filter((i) => i <= maxPage);
            return range.map((i) => {
              return <Button
                key={i}
                onClick={async () => {
                  setPage(i);
                }}
                bgColor={i === page ? "blue.500" : "transparent"}
                size={"sm"}
              >
                {i}
              </Button>
            })
          }()
        }
      </Flex>
    </Flex>
  </DefaultLayout>
}