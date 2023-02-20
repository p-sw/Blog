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
  useToast, Grid, GridItem
} from "@chakra-ui/react";
import {ChevronDownIcon, Icon} from "@chakra-ui/icons";
import {AiFillDelete, AiFillEdit} from "react-icons/ai";
import {FaExternalLinkAlt} from "react-icons/fa";
import {useEffect, useState} from "react";
import loc from "@/globals";

function DefaultAdminItem({obj, type, token, refresh, inseries=false, onDeleteInSeries=()=>{}}) {
  let router = useRouter();

  function deleteThis() {
    fetch(`/api/${type}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "token": token
      },
      body: JSON.stringify({
        id: obj.id
      })
    }).then(res => {
      if (res.status === 200) {
        refresh();
        return true;
      } else {
        return res.json()
      }
    }).then(data => {
      console.log(data);
    })
  }

  return <Flex direction={["column", "row"]} boxSizing={"border-box"} w={"90%"} maxW={"800px"} h={["20rem", "10rem"]} bgColor={"itembg"} borderRadius={"base"}>
    <Grid
      templateColumns={"repeat(4, 1fr)"}
      templateRows={"repeat(8, 1fr)"}
      w={"100%"} h={"100%"}
      rowGap={"10px"} columnGap={"10px"}
      p={"10px"}
    >
      <GridItem rowSpan={[4, 8]} colSpan={[4, 1]}>
        {
          obj.thumbnail !== undefined && obj.thumbnail !== null && obj.thumbnail !== ""
            ? <Image src={loc.cdn(obj.thumbnail)} h={"100%"} w={"100%"} alt={""} objectFit={"cover"} borderRadius={"base"} />
            : <Skeleton h={"100%"} w={"100%"} borderLeftRadius={"base"} />
        }
      </GridItem>
      <GridItem rowSpan={1} colSpan={[4, 3]}>
        <Heading fontSize={["xl", "2xl", null, "3xl"]} fontWeight={"bold"}>
          {obj.title !== undefined ? obj.title : obj.name}
        </Heading>
      </GridItem>
      <GridItem rowSpan={[3, 5]} colSpan={[4, 3]}>
        <Text
          fontSize={["sm", null, "md"]}
          overflow={"hidden"} h={"100%"} w={"100%"}
        >{obj.description}</Text>
      </GridItem>
      <GridItem as={Flex} rowSpan={[1, 2]} colSpan={[4, 3]} gap={"10px"} direction={"row"}>
        <IconButton icon={<Icon as={FaExternalLinkAlt} />} onClick={async () => await router.push(`/${type}/${obj.id}`)} aria-label={"view"} />
        <Menu>
          <MenuButton as={IconButton} icon={<ChevronDownIcon />} />
          <MenuList>
            <MenuItem onClick={async () => {await router.push(`/admin/create/${type}?pid=${obj.id}`)}}>Edit</MenuItem>
            <MenuItem onClick={deleteThis}>Delete</MenuItem>
          </MenuList>
        </Menu>
        {
          type === "post" && inseries
            ? <IconButton icon={<Icon as={AiFillDelete} />} aria-label={"delete"} onClick={onDeleteInSeries} />
            : null
        }
      </GridItem>
    </Grid>
  </Flex>
}

export function AdminPostItem({post, inseries=false, onDeleteInSeries, token, refresh}) {
  return <DefaultAdminItem obj={post} token={token} refresh={refresh} type={"post"} inseries={inseries} onDeleteInSeries={onDeleteInSeries} />
}

export function AdminSeriesItem({series, token, refresh}) {
  return <DefaultAdminItem obj={series} token={token} refresh={refresh} type={"series"} />
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

  return <LinkBox direction={["column", "row"]} boxSizing={"border-box"} w={"90%"} maxW={"800px"} h={["20rem", "10rem"]} bgColor={"itembg"} borderRadius={"base"}>
    <Grid
      templateColumns={"repeat(4, 1fr)"}
      templateRows={"repeat(8, 1fr)"}
      w={"100%"} h={"100%"}
      rowGap={"10px"} columnGap={"10px"}
      p={"10px"}
    >
      <GridItem rowSpan={[4, 8]} colSpan={[4, 1]}>
        {
          obj.thumbnail !== undefined && obj.thumbnail !== null && obj.thumbnail !== ""
            ? <Image src={loc.cdn(obj.thumbnail)} h={"100%"} w={"100%"} alt={""} objectFit={"cover"} borderRadius={"base"} />
            : <Skeleton h={"100%"} w={"100%"} borderLeftRadius={"base"} />
        }
      </GridItem>
      <GridItem rowSpan={1} colSpan={[4, 3]}>
        <Heading fontSize={["xl", "2xl", null, "3xl"]} fontWeight={"bold"}>
          <LinkOverlay href={`/${type}/${obj.id}`}>{obj.title !== undefined ? obj.title : obj.name}</LinkOverlay>
        </Heading>
      </GridItem>
      <GridItem rowSpan={[3, 5]} colSpan={[4, 3]}>
        <Text
          fontSize={["sm", null, "md"]}
          overflow={"hidden"} h={"100%"} w={"100%"}
        >{obj.description}</Text>
      </GridItem>
      <GridItem as={Flex} rowSpan={[1, 2]} colSpan={[4, 3]} gap={"10px"} direction={"row"}>
        {
          tagIds.map((id, index) => <TagItem key={index} id={id} />)
        }
      </GridItem>
    </Grid>
  </LinkBox>
}

export function PostItem({post}) {
  return <DefaultItemObject type={"post"} obj={post} />
}

export function SeriesItem({series}) {
  return <DefaultItemObject type={"series"} obj={series} />
}