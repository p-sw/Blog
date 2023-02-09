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
  IconButton
} from "@chakra-ui/react";
import {ChevronDownIcon, Icon} from "@chakra-ui/icons";
import {AiFillDelete} from "react-icons/ai";
import {FaExternalLinkAlt} from "react-icons/fa";

export function AdminPostItem({post, inseries=false}) {
  let router = useRouter();

  return <Card direction={"row"} w={"100%"} h={"250px"} boxSizing={"border-box"}>
    <Skeleton h={"100%"} w={"400px"}></Skeleton>
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
            <MenuItem onClick={async () => {}}>Delete</MenuItem>
          </MenuList>
        </Menu>
        {
          inseries
            ? <IconButton onClick={async () => {}} icon={<Icon as={AiFillDelete} />} aria-label={"delete"} />
            : null
        }
      </CardFooter>
    </Flex>
  </Card>
}

export function AdminSeriesItem({series}) {
  let router = useRouter();

  return <Card direction={"row"} w={"100%"} h={"250px"} boxSizing={"border-box"}>
    <Skeleton h={"100%"} w={"400px"}></Skeleton>
    <Flex direction={"column"} w={"100%"}>
      <CardBody>
        <Heading fontSize={"3xl"} fontWeight={"bold"}>{series.name}</Heading>
        <Text>{series.description}</Text>
      </CardBody>
      <CardFooter gap={"10px"}>
        <Button onClick={async () => await router.push(`/series/${series.id}`)}>View</Button>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>Action</MenuButton>
          <MenuList>
            <MenuItem onClick={async () => {await router.push(`/admin/create/series?pid=${series.id}`)}}>Edit</MenuItem>
            <MenuItem onClick={async () => {}}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </CardFooter>
    </Flex>
  </Card>
}

export function AdminTagItem({tag, inseries=false}) {
  let router = useRouter();

  return <Card direction={"row"} boxSizing={"border-box"} p={"20px"}>
    <Flex direction={"column"} w={"100%"} alignItems={"center"} justifyContent={"center"}>
      <CardBody textAlign={"center"}>
        <Heading fontSize={"3xl"} fontWeight={"bold"}>{tag.name}</Heading>
      </CardBody>
      <CardFooter gap={"10px"}>
        <Menu>
          <MenuButton as={IconButton} icon={<ChevronDownIcon />} />
          <MenuList>
            <MenuItem onClick={async () => {await router.push(`/admin/create/tag?pid=${tag.id}`)}}>Edit</MenuItem>
            <MenuItem onClick={async () => {}}>Delete</MenuItem>
          </MenuList>
        </Menu>
        {
          inseries
            ? <IconButton onClick={async () => {}} icon={<Icon as={AiFillDelete} />} aria-label={"delete"} />
            : null
        }
      </CardFooter>
    </Flex>
  </Card>
}