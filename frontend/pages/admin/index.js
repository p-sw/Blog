import {tokenValidate, hasToken, ServerSideRedirection} from "@/components/api"
import {useEffect, useState} from "react";
import DefaultLayout from "@/layouts/default";
import {
  Button,
  Flex, IconButton,
  Menu,
  MenuButton, MenuGroup,
  MenuItem,
  MenuList,
  Text,
  Box,
  useToast,
  useDisclosure,
  Collapse
} from "@chakra-ui/react";
import {AdminPostItem, AdminSeriesItem, AdminTagItem} from "@/components/items";
import {useRouter} from "next/router";
import {AddIcon, ViewIcon} from "@chakra-ui/icons";
import SearchBar from "@/components/searchbar";

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

  let [tagIdDict, setTagIdDict] = useState({});

  let [searchTriggered, setSearchTrigger] = useState(true);

  let [page, setPage] = useState(1);
  let [maxPage, setMaxPage] = useState(1);

  let toast = useToast();

  let {isOpen: isSearchBarOpen, onOpen: onSearchBarOpen, onClose: onSearchBarClose} = useDisclosure();

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
      }).then(response => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          toast({
            title: "Unauthorized",
            description: "You are not authorized to access this page.",
            status: "error",
            duration: 5000,
            isClosable: false,
          })
          router.push("/admin/login");
          return null;
        } else {
          toast({
            title: `Error: ${response.status}`,
            description: `An error has occurred - ${response.statusText}`,
            status: "error",
            duration: 5000,
            isClosable: false,
          })
          return null;
        }
      }).then(data => {
        if (data === null) return;
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
      }).then(response => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          toast({
            title: "Unauthorized",
            description: "You are not authorized to access this page.",
            status: "error",
            duration: 5000,
            isClosable: false,
          })
          router.push("/admin/login");
          return null;
        } else {
          toast({
            title: `Error: ${response.status}`,
            description: `An error has occurred - ${response.statusText}`,
            status: "error",
            duration: 5000,
            isClosable: false,
          })
          return null;
        }
      }).then(data => {
        if (data === null) return;
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
      }).then(response => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          toast({
            title: "Unauthorized",
            description: "You are not authorized to access this page.",
            status: "error",
            duration: 5000,
            isClosable: false,
          })
          router.push("/admin/login");
          return null;
        } else {
          toast({
            title: `Error: ${response.status}`,
            description: `An error has occurred - ${response.statusText}`,
            status: "error",
            duration: 5000,
            isClosable: false,
          })
          return null;
        }
      }).then(data => {
        if (data === null) return;
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
  }

  function changeTypeAs(t) {
    setType(t);
    initSearch();
  }

  return <DefaultLayout
    searchBarEnabled={true}
    onSearchBarOpen={onSearchBarOpen}
    onSearchBarClose={onSearchBarClose}
  >
    <Flex
      direction={"column"}
      justifyContent={"flex-start"}
      alignItems={"center"}
      position={"sticky"}
      top={"navheight"}
      w={"100%"}
      p={"10px"}
      zIndex={"50"}
      boxSizing={"border-box"}
      rowGap={"10px"}
      bgColor={"secondbg"}
    >
      <Collapse in={isSearchBarOpen}>
        <Box w={"100%"}>
          <SearchBar
            searchTags={searchTags}
            setSearchTags={setSearchTags}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            tagIdDict={tagIdDict}
            setTagIdDict={setTagIdDict}
            searchHandler={() => {setSearchTrigger(true)}}
          />
        </Box>
      </Collapse>
      <Flex
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        w={"100%"}
      >
        <Menu>
          <MenuButton as={IconButton} icon={<AddIcon />} />
          <MenuList>
            <MenuGroup title={"Create"}>
              <MenuItem onClick={async () => {await router.push("/admin/create/post")}}>Post</MenuItem>
              <MenuItem onClick={async () => {await router.push("/admin/create/series")}}>Series</MenuItem>
              <MenuItem onClick={async () => {await router.push("/admin/create/tag")}}>Tag</MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={IconButton} icon={<ViewIcon />} />
          <MenuList>
            <MenuGroup title={"View"}>
              <MenuItem onClick={async () => {changeTypeAs("post")}}>Post</MenuItem>
              <MenuItem onClick={async () => {changeTypeAs("series")}}>Series</MenuItem>
              <MenuItem onClick={async () => {changeTypeAs("tag")}}>Tag</MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
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