import {useRouter} from "next/router";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Menu,
  MenuButton, MenuItem,
  MenuList,
  Skeleton,
  Text,
  IconButton, Image, Box,
  LinkOverlay,
  LinkBox,
  Tag,
  useToast
} from "@chakra-ui/react";
import {ChevronDownIcon, Icon} from "@chakra-ui/icons";
import {AiFillDelete, AiFillEdit} from "react-icons/ai";
import {FaExternalLinkAlt} from "react-icons/fa";
import {useEffect, useState} from "react";

export function AdminPostItem({post, inseries=false, onDeleteInSeries, token, refresh}) {
  let router = useRouter();

  function deleteThis() {
    fetch("/api/post", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "token": token
      },
      body: JSON.stringify({
        id: post.id
      })
    }).then(res => {
      if (res.status === 200) {
        refresh();
        return true;
      } else {
        return res.json();
      }
    }).then(data => {
      console.log(data);
    })
  }

  return <Card direction={"row"} boxSizing={"border-box"} w={"90%"} maxW={"800px"} h={"fit-content"}>
    <Box w={"30%"} h={"auto"}>
      {
        post.thumbnail !== null && post.thumbnail !== ""
          ? <Image src={"https://cdn.sserve.work/"+post.thumbnail} h={"100%"} w={"100%"} alt={""} objectFit={"cover"} />
          : <Skeleton h={"100%"} w={"100%"} />
      }
    </Box>
    <Flex direction={"column"} w={"100%"}>
      <CardBody>
        <Heading fontSize={"3xl"} fontWeight={"bold"}>{post.title}</Heading>
        <Text>{post.description}</Text>
      </CardBody>
      <CardFooter gap={"10px"}>
        <IconButton icon={<Icon as={FaExternalLinkAlt} />} onClick={async () => await router.push(`/post/${post.id}`)} aria-label={"view"} />
        <Menu>
          <MenuButton as={IconButton} icon={<ChevronDownIcon />} />
          <MenuList>
            <MenuItem onClick={async () => {await router.push(`/admin/create/post?pid=${post.id}`)}}>Edit</MenuItem>
            <MenuItem onClick={deleteThis}>Delete</MenuItem>
          </MenuList>
        </Menu>
        {
          inseries
            ? <IconButton icon={<Icon as={AiFillDelete} />} aria-label={"delete"} onClick={onDeleteInSeries} />
            : null
        }
      </CardFooter>
    </Flex>
  </Card>
}

export function AdminSeriesItem({series, token, refresh}) {
  let router = useRouter();

  function deleteThis() {
    fetch("/api/series", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "token": token
      },
      body: JSON.stringify({
        id: series.id
      })
    }).then(res => {
      if (res.status === 200) {
        refresh();
        return true;
      } else {
        return res.json();
      }
    }).then(data => {
      console.log(data);
    })
  }

  return <Card direction={"row"} boxSizing={"border-box"} w={"90%"} maxW={"800px"}>
    <Box w={"30%"} h={"auto"}>
      {
        series.thumbnail !== null && series.thumbnail !== ""
          ? <Image src={"https://cdn.sserve.work/"+series.thumbnail} h={"100%"} w={"100%"} alt={""} objectFit={"cover"} />
          : <Skeleton h={"100%"} w={"100%"} />
      }
    </Box>
    <Flex direction={"column"} w={"100%"}>
      <CardBody>
        <Heading fontSize={"3xl"} fontWeight={"bold"}>{series.name}</Heading>
        <Text>{series.description}</Text>
      </CardBody>
      <CardFooter gap={"10px"}>
        <IconButton onClick={async () => await router.push(`/series/${series.id}`)} icon={<Icon as={FaExternalLinkAlt} />} aria-label={"view"} />
        <Menu>
          <MenuButton as={IconButton} icon={<ChevronDownIcon />} />
          <MenuList>
            <MenuItem onClick={async () => {await router.push(`/admin/create/series?pid=${series.id}`)}}>Edit</MenuItem>
            <MenuItem onClick={deleteThis}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </CardFooter>
    </Flex>
  </Card>
}

export function AdminTagItem({tag, inseries=false, onDeleteInSeries, token, refresh}) {
  let router = useRouter();

  function deleteThis() {
    fetch("/api/tag", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "token": token,
      },
      body: JSON.stringify({
        id: tag.id
      })
    }).then(res => {
      if (res.status === 200) {
        refresh();
        return true;
      } else {
        return res.json();
      }
    }).then(data => {
      console.log(data);
    })
  }

  return <Card direction={"row"} boxSizing={"border-box"} p={"20px"} w={"90%"} maxW={"400px"}>
    <Flex direction={"column"} w={"100%"} alignItems={"center"} justifyContent={"center"}>
      <CardBody textAlign={"center"}>
        <Heading fontSize={"3xl"} fontWeight={"bold"}>{tag.name}</Heading>
      </CardBody>
      <CardFooter gap={"10px"}>
        {
          !inseries
            ? <>
              <IconButton icon={<Icon as={AiFillEdit} />} aria-label={"edit"} onClick={async () => {await router.push(`/admin/create/tag?pid=${tag.id}`)}} />
              <IconButton icon={<Icon as={AiFillDelete} />} aria-label={"delete"} onClick={deleteThis} />
            </>
            : <Menu>
              <MenuButton as={IconButton} icon={<ChevronDownIcon />} />
              <MenuList>
                <MenuItem onClick={async () => {await router.push(`/admin/create/tag?pid=${tag.id}`)}}>Edit</MenuItem>
                <MenuItem onClick={deleteThis}>Delete</MenuItem>
              </MenuList>
            </Menu>
        }
        {
          inseries
            ? <IconButton icon={<Icon as={AiFillDelete} />} aria-label={"delete"} onClick={onDeleteInSeries} />
            : null
        }
      </CardFooter>
    </Flex>
  </Card>
}

function TagItem({id}) {
  let [tagName, setTagName] = useState("");

  let toast = useToast();

  useEffect(() => {
    fetch(`/api/tag/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        toast({
          title: "Error",
          description: `An error occured while fetching tag ${id}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return {name: ""};
      }
    }).then(data => setTagName(data.name))
  }, [])

  return <Tag size={"sm"}>{tagName}</Tag>
}

function DefaultItemObject({type, obj}) {
  let toast = useToast();

  let [tagIds, setTagIds] = useState([]);

  useEffect(() => {
    fetch(`/api/${type}/${obj.id}/get-tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        toast({
          title: "Error",
          description: `An error occured while fetching tags of ${type} ${obj.id}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
        return [];
      }
    }).then(data => setTagIds(data))
  }, [])

  return <LinkBox as={Card} direction={"row"} boxSizing={"border-box"} w={"90%"} maxW={"800px"} h={"fit-content"}>
    <Box w={"30%"} h={"auto"}>
      {
        obj.thumbnail !== undefined && obj.thumbnail !== null && obj.thumbnail !== ""
          ? <Image src={"https://cdn.sserve.work/"+obj.thumbnail} h={"100%"} w={"100%"} alt={""} objectFit={"cover"} />
          : <Skeleton h={"100%"} w={"100%"} />
      }
    </Box>
    <Flex direction={"column"} w={"100%"}>
      <CardBody>
        <Heading fontSize={"3xl"} fontWeight={"bold"}>
          <LinkOverlay href={`/${type}/${obj.id}`}>{obj.title}</LinkOverlay>
        </Heading>
        <Text>{obj.description}</Text>
      </CardBody>
      <CardFooter gap={"10px"}>
        {
          tagIds.map((id, index) => <TagItem key={index} id={id} />)
        }
      </CardFooter>
    </Flex>
  </LinkBox>
}

export function PostItem({post}) {
  return <DefaultItemObject type={"post"} obj={post} />
}

export function SeriesItem({series}) {
  return <DefaultItemObject type={"series"} obj={series} />
}