import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import React from 'react'
import PostListItem from './PostListItem'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSearchParams } from 'react-router-dom';


const fetchPosts = async (pageParam,searchParams)=>{

  const searchParamsObj = Object.fromEntries([...searchParams]);

  console.log(searchParamsObj);


  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit:10, ...searchParamsObj},
  })
  return res.data;
}


const PostList = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts', searchParams.toString()],
    queryFn: ({ pageParam = 1 })=>fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage.hasMore ? pages.length + 1: undefined,
  })
  console.log(data);

  
  
    if (status === "loading") return 'Loading...'
  
    if (status === "error") return 'Something went wrong!' 
    const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

    console.log(data);
  return (
    <InfiniteScroll
  dataLength={allPosts.length} //This is important field to render the next data
  next={fetchNextPage}
  hasMore={!!hasNextPage}
  loader={<h4>Loading more posts...</h4>}
  endMessage={
    <p style={{ textAlign: 'center' }}>
      <b>Yay! You have seen all posts</b>
    </p>
  }
  
>
{allPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
  
</InfiniteScroll>


        
    
  )
}

export default PostList