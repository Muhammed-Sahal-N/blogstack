import { useUser } from '@clerk/clerk-react'
import React, { useState } from 'react'
import PostList from '../components/PostList'
import SideMenu from '../components/SideMenu'

const PostListPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [open ,setOpen]= useState(false)

  if (isLoaded && !isSignedIn) {
    return <div className="">You should login!</div>;
  }


  return (
    <div>
      <h1 className="mb-8 text-2xl"> Blogs</h1>
      <button onClick={() => setOpen((prev) => !prev)} className="bg-blue-800 text-sm text-white px-4 py-2 rounded-2xl mb-4 md:hidden"
      >
        {open ? "Close" : "Filter or Search"}
      </button>
      <div className="flex flex-col-reverse gap-8 md:flex-row justify-between">
        <div>
          <PostList/>
        </div>
        <div className={`${open ? "block" : "hidden"} md:block`}>
          <SideMenu/>
        </div>
      </div>

    </div>
  )
}

export default PostListPage