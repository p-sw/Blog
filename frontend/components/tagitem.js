import {
  Heading,
  Card,
  CardBody,
  CardFooter, Button, Flex
} from "@chakra-ui/react";
import {useRouter} from "next/router";

export function AdminTagItem({tag}) {
  let router = useRouter();

  return <Card direction={"row"} boxSizing={"border-box"} p={"20px"}>
    <Flex direction={"column"} w={"100%"}>
      <CardBody textAlign={"center"}>
        <Heading fontSize={"3xl"} fontWeight={"bold"}>{tag.name}</Heading>
      </CardBody>
      <CardFooter gap={"10px"}>
        <Button onClick={async () => {await router.push(`/admin/create/tag?pid=${tag.id}`)}}>Edit</Button>
        <Button onClick={async () => {}}>Delete</Button>
      </CardFooter>
    </Flex>
  </Card>
}