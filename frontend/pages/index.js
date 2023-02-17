import {
  Flex,
  useDisclosure,
  Collapse, Box
} from "@chakra-ui/react";
import DefaultLayout from "@/layouts/default";
import SearchBar from "@/components/searchbar";
import {useState} from "react";


export default function Index() {
  let {isOpen: isSearchBarOpen, onOpen: onSearchBarOpen, onClose: onSearchBarClose} = useDisclosure();

  let [searchTags, setSearchTags] = useState([]);
  let [searchQuery, setSearchQuery] = useState("");
  let [tagIdDict, setTagIdDict] = useState({});

  let [searchTriggered, setSearchTrigger] = useState(true);

  return <DefaultLayout
    searchBarEnabled={true}
    onSearchBarOpen={onSearchBarOpen}
    onSearchBarClose={onSearchBarClose}
  >
    <Flex
      direction={"column"}
      justifyContent={"flex-start"}
      alignItems={"center"}
      position={"sticky"}
      top={"navheight"}
      w={"100%"}
      p={"10px"}
      zIndex={"50"}
      boxSizing={"border-box"}
      rowGap={"10px"}
      bgColor={"secondbg"}
    >
      <Collapse in={isSearchBarOpen}>
        <Box w={"100%"}>
          <SearchBar
            searchTags={searchTags}
            setSearchTags={setSearchTags}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            tagIdDict={tagIdDict}
            setTagIdDict={setTagIdDict}
            searchHandler={() => {setSearchTrigger(true)}}
          />
        </Box>
      </Collapse>
    </Flex>
    <Flex
      flexWrap={"wrap"}
      flexDirection={"column"}
      overflowY={"auto"}
    >
      
    </Flex>
  </DefaultLayout>
}
