import {
  Flex,
  IconButton,
  Input,
  InputGroup, InputRightElement,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Tag,
  useToast
} from "@chakra-ui/react";
import {Icon, Search2Icon} from "@chakra-ui/icons";
import {FaSlidersH} from "react-icons/fa";
import {useState} from "react";

export default function SearchBar(
  {
    searchTags, // Required: Array of tag ids that are currently selected
    setSearchTags, // Required: Function to set searchTags
    searchQuery, // Required: String of the current search query
    setSearchQuery, // Required: Function to set searchQuery
    tagIdDict, // Required: Dictionary of tag ids to tag objects
    setTagIdDict, // Required: Function to set tagIdDict
    searchHandler, // Required: Function to handle search
  }) {

  let toast = useToast();

  let [tagSearchQuery, setTagSearchQuery] = useState("");
  let [tagSearchResult, setTagSearchResult] = useState([]);

  function tagSearch() {
    if (tagSearchQuery === "") {
      setTagSearchResult([]);
      return;
    }
    fetch(`/api/tag/search-by-name?query=${tagSearchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        toast({
          title: `Error: ${res.status}`,
          description: `An error has occurred - ${res.statusText}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
        return null;
      }
    }).then(data => {
      if (data === null) return;
      for (let tag of data) {
        setTagIdDict((prev) => {
          return {...prev, [tag.id]: tag}
        })
      }
      setTagSearchResult(data.map((tag) => tag.id).filter((tag) => !searchTags.includes(tag)));
    })
  }

  return <Flex direction={"row"} w={"100%"} h={"100%"} gap={"8px"}>
    <Menu closeOnSelect={false}>
      <MenuButton as={IconButton} icon={<Icon as={FaSlidersH} />} aria-label={"Add Tag"} />
      <MenuList p={"10px"}>
        <MenuGroup title={"Selected Tags"}>
          {
            searchTags.map((tag) => {
              return <MenuItem key={tag} onClick={() => {
                setSearchTags(searchTags.filter((t) => t !== tag));
                setTagSearchResult([...tagSearchResult, tag]);
              }}><Tag size={"sm"} bgColor={"green.500"}>{tagIdDict[tag].name}</Tag></MenuItem>
            })
          }
        </MenuGroup>
        <MenuGroup title={"Tag Search"}>
          <InputGroup>
            <Input
              type={"text"}
              mb={"10px"}
              boxSizing={"border-box"}
              w={"auto"}
              maxW={"80vw"}
              value={tagSearchQuery}
              onChange={(e) => {setTagSearchQuery(e.target.value);}}
            />
            <InputRightElement>
              <IconButton aria-label={"Search"} icon={<Search2Icon />} onClick={tagSearch} />
            </InputRightElement>
          </InputGroup>
        </MenuGroup>
        <MenuGroup title={"Tag Recommendations"}>
          {
            tagSearchResult.map((tag) => {
              if (tagIdDict[tag] === undefined) {
                return null;
              }
              return <MenuItem key={tag} onClick={async () => {
                setSearchTags([...searchTags, tag]);
                setTagSearchResult(tagSearchResult.filter((t) => t !== tag));
              }}>{tagIdDict[tag].name}</MenuItem>
            })
          }
        </MenuGroup>
      </MenuList>
    </Menu>
    <Input
      placeholder={"Search by title"}
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
      }}
    />
    <IconButton aria-label={"Search"} icon={<Search2Icon />} onClick={searchHandler} />
  </Flex>
}