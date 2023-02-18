import {useRouter} from "next/router";
import DefaultLayout from "@/layouts/default";
import {Flex, Spinner, useToast, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {PostItem} from "@/components/items";
import {NextSeo} from "next-seo";

export async function getServerSideProps(context) {
  let req = fetch(`http://127.0.0.1:8000/api/series/${context.params["series_id"]}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then(res => {
    if (res.status === 200) {
      return res.json();
    } else {
      return null;
    }
  })

  let res = await req;
  if (res === null) {
    return {
      props: {
        notFound: true
      }
    }
  } else {
    return {
      props: {
        svsseries: res
      }
    }
  }
}

export default function SeriesView({notFound=false, svsseries=null}) {
  let router = useRouter();
  let toast = useToast();

  let {series_id} = router.query;

  let [posts, setPosts] = useState(undefined);
  let [postDict, setPostDict] = useState({});

  useEffect(() => {
    if (series_id === undefined) return;
    fetch(`/api/series/${series_id}/get-posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        toast({
          title: "Error",
          description: "An error occurred while fetching series.",
          status: "error",
          duration: 5000,
          isClosable: false,
        })
        return null;
      }
    }).then(data => {
      if (data === null) {
        setPosts(null);
        return;
      }
      setPosts(data);
    })
  }, [series_id])

  useEffect(() => {
    if (posts === undefined || posts === null || posts.length === 0) return;
    for (let post_id of posts) {
      fetch(`/api/post/${post_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      }).then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          toast({
            title: "Error",
            description: "An error occurred while fetching post datas.",
            status: "error",
            duration: 5000,
            isClosable: false,
          })
          return null;
        }
      }).then(data => {
        setPostDict(prev => {
          return {
            ...prev,
            [post_id]: data
          }
        })
      })
    }
  }, [posts])

  return <DefaultLayout>
    <NextSeo
      title={!notFound ? svsseries.name : "404"}
      description={!notFound ? svsseries.description : "Series Not Found"}
      openGraph={{
        title: !notFound ? svsseries.name : "404",
        description: !notFound ? svsseries.description : "Series Not Found",
        images: !notFound && svsseries.thumbnail !== null && svsseries.thumbnail !== undefined && svsseries.thumbnail !== "" ? [
          {
            url: `https://cdn.sserve.work/${svsseries.thumbnail}`,
            width: 800,
            height: 600,
            alt: svsseries.name,
          }
        ] : []
      }}
    />
    <Flex
      direction={"column"}
      alignItems={"center"}
      justifyContent={"flex-start"}
      mt={"40px"}
      mb={"40px"}
      gap={"20px"}
    >
      {
        posts === undefined
          ? <Spinner />
          : posts === null
            ? <Text>An error occurred while fetching series.<br />Please reload the page.</Text>
            : posts.length === 0
              ? <Text>No posts found.</Text>
              : posts.map((post_id,index) => {
                if (postDict[post_id] === undefined) return null;
                return <PostItem key={index} post={postDict[post_id]} />
              })
      }
    </Flex>
  </DefaultLayout>
}