import {
  Heading,
  Text,
  Card,
  Skeleton,
  CardBody,
  CardFooter, Button, Menu, MenuButton, MenuList, Flex, MenuItem
} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {ChevronDownIcon} from "@chakra-ui/icons";

export function AdminPostItem({post}) {
  let router = useRouter();

  return <Card direction={"row"} w={"100%"} h={"250px"} boxSizing={"border-box"}>
    <Skeleton h={"100%"} w={"400px"}></Skeleton>
    <Flex direction={"column"} w={"100%"}>
      <CardBody>
        <Heading fontSize={"3xl"} fontWeight={"bold"}>{post.title}</Heading>
        <Text>{post.description}</Text>
      </CardBody>
      <CardFooter gap={"10px"}>
        <Button onClick={async () => await router.push(`/post/${post.id}`)}>View</Button>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>Action</MenuButton>
          <MenuList>
            <MenuItem onClick={async () => {await router.push(`/admin/create/post?pid=${post.id}`)}}>Edit</MenuItem>
            <MenuItem onClick={async () => {}}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </CardFooter>
    </Flex>
  </Card>
}