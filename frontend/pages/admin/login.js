import DefaultLayout from "@/layouts/default";
import {Heading, FormControl, Input, FormLabel, Flex, Box, Text} from "@chakra-ui/react";
import Form from "@/components/form";
import {useState, useRef} from "react";
import {useRouter} from "next/router";
import {tokenValidate, hasToken, ServerSideRedirection} from "@/components/api"

export async function getServerSideProps(context) {
  if (await hasToken(context.req.cookies) && await tokenValidate(context.req.cookies.token)) {
    return ServerSideRedirection("/admin", false)
  }
  return {
    props: {}
  }
}

export default function AdminLogin() {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");

  let errorRef = useRef(null);

  let router = useRouter();

  return <DefaultLayout>
    <Flex
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      w={"100%"}
      h={"93vh"}
    >
      <Box bgColor={"secondbg"} p={"40px"} borderRadius={"15px"} maxW={"90%"}>
        <Box textAlign={"center"} mb={"50px"}>
          <Heading fontSize={"3xl"} fontWeight={"black"}>Log in</Heading>
          <Text fontSize={"xl"} fontWeight={"bold"}>Log in to admin page</Text>
        </Box>
        <Text ref={errorRef} color={"red"} mb={"20px"}></Text>
        <Box>
          <Form action={"/api/auth/login"} method={"POST"} submitHandler={(e) => {
            e.preventDefault();
            fetch("/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                username: username,
                password: password
              })
            }).then(async (res) => {
              if (res.status === 200) {
                return res.json()
              } else {
                let rbody = await res.json()
                throw new Error(rbody.hasOwnProperty("detail") ? rbody.detail.error : rbody.error);
              }
            }).then(async (res) => {
              document.cookie = `token=${res.token};path=/;max-age=${60 * 60 * 24 * 7};`
              await router.push("/admin")
            }).catch((err) => {
              errorRef.current.innerText = err.message;
            })
          }}>
            <FormControl id={"username"} mb={"20px"} isRequired={true}>
              <FormLabel>Username</FormLabel>
              <Input type={"text"} onChange={(e) => {setUsername(e.target.value)}} />
            </FormControl>
            <FormControl id={"password"} mb={"20px"} isRequired={true}>
              <FormLabel>Password</FormLabel>
              <Input type={"password"} onChange={(e) => {setPassword(e.target.value)}} />
            </FormControl>
            <Input type={"submit"} value={"Log in"} />
          </Form>
        </Box>
      </Box>
    </Flex>
  </DefaultLayout>
}