import {hasToken, ServerSideRedirection, tokenValidate} from "@/components/api";
import DefaultLayout from "@/layouts/default";
import {
  Box,
  Flex,
  FormControl, FormErrorMessage, FormHelperText,
  FormLabel,
  Heading, Input, useToast
} from "@chakra-ui/react";
import {useRouter} from "next/router";
import Form from "@/components/form";
import {useEffect, useState} from "react";

export async function getServerSideProps(context) {
  if (!await hasToken(context.req.cookies)) {
    return ServerSideRedirection("/admin/login", false)
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

export default function TagCreateForm({token}) {
  let [body, setBody] = useState({name: ""});
  let [prevBody, setPrevBody] = useState({name: ""});
  let [uniqueTitle, setUniqueT] = useState(true);

  let toast = useToast();

  let router = useRouter();
  let {pid} = router.query;

  useEffect(function getPrevBody() {
    if (pid === undefined) return;
    fetch(`/api/tag/${pid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json()).then(data => {
      setPrevBody(data);
      setBody(data);
    })
  }, [pid])

  useEffect(function titleUniqueCheck() {
    fetch(`/api/tag/unique-name?query=${body.name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": token
      }
    }).then(res => res.json()).then(data => {
      setUniqueT(data.result);
    })
  }, [body.name, token])


  return <DefaultLayout>
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
          <Heading fontSize={"3xl"} fontWeight={"black"}>Create Tag</Heading>
        </Box>
        <Box>
          <Form action={"/api/tag"} method={"POST"} submitHandler={(e) => {
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
            fetch("/api/tag", {
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
                await router.push("/admin?t=tag")
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
            <FormControl id={"name"} mb={"20px"} isInvalid={!uniqueTitle && prevBody.name !== body.name}>
              <FormLabel>Title</FormLabel>
              <Input type={"text"} value={body.name} onChange={(e) => setBody({...body, name: e.target.value})}/>
              {
                !uniqueTitle && prevBody.name !== body.name
                  ? <FormErrorMessage>다른 태그의 이름과 동일합니다.</FormErrorMessage>
                  : <FormHelperText>다른 포스트의 이름과 겹치지 않아야 합니다.</FormHelperText>
              }
            </FormControl>
            <Input type={"submit"} value={"Save"}/>
          </Form>
        </Box>
      </Box>
    </Flex>
  </DefaultLayout>
}