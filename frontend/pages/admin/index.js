import {tokenValidate, hasToken, ServerSideRedirection} from "@/components/api"
import {useEffect, useState} from "react";
import DefaultLayout from "@/layouts/default";
import {Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react";
import {AdminPostItem, AdminSeriesItem, AdminTagItem} from "@/components/items";
import {useRouter} from "next/router";
import {ChevronDownIcon} from "@chakra-ui/icons";

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

  useEffect(() => {
    if (t === undefined || !t) return;
    setType(t);
  }, [t])

  useEffect(() => {
    if (type === "post" && posts === null) {
      fetch("/api/post", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": token
        }
      }).then(response => response.json()).then(data => {
        setPosts(data);
      })
    } else if (type === "series" && series === null) {
      fetch("/api/series", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": token
        }
      }).then(response => response.json()).then(data => {
        setSeries(data);
      })
    } else if (type === "tag" && tags === null) {
      fetch("/api/tag", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": token
        }
      }).then(response => response.json()).then(data => {
        setTags(data);
      })
    }
  }, [posts, series, tags, token, type])

  return <DefaultLayout>
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      position={"sticky"}
      top={"0"}
      w={"100vw"}
      p={"10px"}
      zIndex={"50"}
    >
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>Create</MenuButton>
        <MenuList>
          <MenuItem onClick={async () => {await router.push("/admin/create/post")}}>Post</MenuItem>
          <MenuItem onClick={async () => {await router.push("/admin/create/series")}}>Series</MenuItem>
          <MenuItem onClick={async () => {await router.push("/admin/create/tag")}}>Tag</MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>Type</MenuButton>
        <MenuList>
          <MenuItem onClick={async () => {setType("post")}}>Post</MenuItem>
          <MenuItem onClick={async () => {setType("series")}}>Series</MenuItem>
          <MenuItem onClick={async () => {setType("tag")}}>Tag</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
    <Flex
      flexDirection={"column"}
      justifyContent="flex-start"
      alignItems="center"
      marginTop={"40px"}
      p={"50px"}
      gap={"20px"}
    >
      {
        type === "post"
          ? posts !== null
            ? posts.length > 0
              ? posts.map(post => <AdminPostItem key={post.id} post={post}/>)
              : <Text>No posts</Text>
            : <Text>Loading posts...</Text>
          : type === "series"
            ? series !== null
              ? series.length > 0
                ? series.map(item => <AdminSeriesItem key={item.id} series={item}/>)
                : <Text>No series</Text>
              : <Text>Loading series...</Text>
            : type === "tag"
              ? tags !== null
                ? tags.length > 0
                  ? tags.map(tag => <AdminTagItem key={tag.id} tag={tag} />)
                  : <Text>No tags</Text>
                : <Text>Loading tags...</Text>
              : <Text>Unknown type</Text>
      }
    </Flex>
  </DefaultLayout>
}