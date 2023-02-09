import {Flex, useColorMode} from "@chakra-ui/react";
import DefaultLayout from "@/layouts/default";


export default function Index() {
  let {colorMode, toggleColorMode} = useColorMode();

  return <DefaultLayout>
    <Flex
      flexWrap={"wrap"}
      flexDirection={"column"}
      overflowY={"auto"}
    >

    </Flex>
  </DefaultLayout>
}
