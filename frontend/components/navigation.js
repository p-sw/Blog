import {
    Flex,
    Heading,
    IconButton,
    Link,
    useColorMode
} from "@chakra-ui/react";
import {
    MoonIcon,
    SunIcon
} from "@chakra-ui/icons";

export default function Navigation() {
    let {colorMode, toggleColorMode} = useColorMode();

    return <Flex
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"space-around"}
      width={"100vw"}
      height={"7vh"}
      bgColor={"navbg"}
      boxShadow={"undernav"}
      position={"fixed"}
      top={0}
      zIndex={99}
    >
        <Link href={"/"} _hover={{underline: "none"}}>
            <Heading fontSize={"2xl"}>
                SV Devlog
            </Heading>
        </Link>
        {
            colorMode === 'light'
              ? <IconButton aria-label={"Toggle Color Mode"} icon={<SunIcon />} onClick={toggleColorMode} />
              : <IconButton aria-label={"Toggle Color Mode"} icon={<MoonIcon />} onClick={toggleColorMode} />
        }
    </Flex>
}