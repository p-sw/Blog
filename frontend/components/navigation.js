import {
  Button,
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

export function PageNavigation({page, maxPage, onPageChange}) {
  let pageArray = Array.from({length: Math.min(10, maxPage)}, (_, i) => i + Math.max(1, page - 5)).filter((i) => i <= maxPage);

  return <Flex
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"60px"}
      m={"40px 0"}
    >
      <Flex
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"10px"}
        width={"90%"}
        maxW={"800px"}
        height={"100%"}
        bgColor={"navbg"}
        borderRadius={"15px"}
      >
        {
          pageArray.map((i) => {
            return <Button
              key={i}
              onClick={async () => {
                onPageChange(i);
              }}
              bgColor={i === page ? "blue.500" : "transparent"}
              size={"sm"}
            >
              {i}
            </Button>
          })
        }
      </Flex>
    </Flex>
}