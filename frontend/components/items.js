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
  IconButton, Image, Box
} from "@chakra-ui/react";
import {ChevronDownIcon, Icon} from "@chakra-ui/icons";
import {AiFillDelete, AiFillEdit} from "react-icons/ai";
import {FaExternalLinkAlt} from "react-icons/fa";

export function AdminPostItem({post, inseries=false, onDeleteInSeries}) {
  let router = useRouter();

  function deleteThis() {}

  return <Card direction={"row"} boxSizing={"border-box"} w={"90%"} maxW={"800px"} h={"fit-content"}>
    <Box w={"30%"} h={"auto"}>
      <Image src={"https://cdn.sserve.work/"+post.thumbnail} h={"100%"} w={"100%"} alt={""} objectFit={"cover"} />
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

export function AdminSeriesItem({series}) {
  let router = useRouter();

  function deleteThis() {

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

export function AdminTagItem({tag, inseries=false, onDeleteInSeries}) {
  let router = useRouter();

  function deleteThis() {}

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