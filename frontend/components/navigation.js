import {
    Flex,
    Heading,
    IconButton,
    Link,
    useColorMode,
    useDisclosure
} from "@chakra-ui/react";
import {
    MoonIcon,
    SunIcon,
    Search2Icon, CloseIcon
} from "@chakra-ui/icons";

export default function Navigation(
  {
      searchBarEnabled=false,
      onSearchBarOpen=()=>{},
      onSearchBarClose=()=>{},
      extraButtons=null
  }) {
    let {colorMode, toggleColorMode} = useColorMode();
    let {isOpen, onOpen, onClose} = useDisclosure();

    return <Flex
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"space-around"}
      width={"100%"}
      height={"navheight"}
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
        <Flex
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"100%"}
            bgColor={"navbg"}
            gap={"5px"}
        >
            {
                colorMode === 'light'
                  ? <IconButton aria-label={"Toggle Color Mode"} icon={<SunIcon />} onClick={toggleColorMode} />
                  : <IconButton aria-label={"Toggle Color Mode"} icon={<MoonIcon />} onClick={toggleColorMode} />
            }
            {
                searchBarEnabled
                  ? isOpen
                    ? <IconButton aria-label={"Close Search Bar"} icon={<CloseIcon />} onClick={() => {
                        onClose();
                        onSearchBarClose();
                    }} />
                    : <IconButton aria-label={"Toggle Search Bar"} icon={<Search2Icon />} onClick={() => {
                        onOpen();
                        onSearchBarOpen();
                    }} />
                  : null
            }
            {extraButtons}
        </Flex>
    </Flex>
}