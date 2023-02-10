import {extendTheme} from "@chakra-ui/react";
import {mode} from "@chakra-ui/theme-tools";

const theme = extendTheme({
    config: {
        initialColorMode: "light", // IMPORTANT: change initialColorMode to "system" when prod mode
        useSystemColorMode: false
    },
    fonts: {
        "fit-system": `-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", 
        "Pretendard Variable", Pretendard, Roboto, "Noto Sans KR", "Segoe UI", 
        "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", 
        sans-serif`,
        "keep-font": `"Pretendard Variable", Pretendard, -apple-system, 
        BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", 
        "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", 
        "Segoe UI Emoji", "Segoe UI Symbol", sans-serif`
    },
    semanticTokens: {
        colors: {
            navbg: {
                default: "white",
                _light: "white",
                _dark: "#222",
            },
            mainbg: {
                default: "orange.100",
                _light: "orange.100",
                _dark: "#151515",
            },
            secondbg: {
                default: "white",
                _light: "white",
                _dark: "#222",
            },
            mainfont: {
                default: "black",
                _light: "black",
                _dark: "white"
            }
        },
        shadows: {
            undernav: {
                default: "0 5px 5px rgba(255, 255, 255, .6)",
                _dark: "none"
            },
        },
    },
    styles: {
        global: (props) => ({
            "html,body": {
                width: "100%",
                fontSize: "20px",
                fontFamily: "keep-font",
                bgColor: "mainbg",
                color: "mainfont"
            }
        }),
    },
})

export default theme