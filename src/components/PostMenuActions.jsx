import { useAuth, useUser } from '@clerk/clerk-react';
import React, { useState } from 'react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom'
import {toast} from "react-toastify"

const PostMenuActions = ({post}) => {

  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate()
  const [isFeatured, setIsFeatured] = useState(post?.featured || false);

  // const {
  //   isPending,
  //   error,
  //   data: savedPosts,
  // } = useQuery({
  //   queryKey: ["savedPosts"],
  //   queryFn: async () => {
  //     const token = await getToken();
  //     return axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //   },
  // });

  const isAdmin = user?.publicMetadata?.role === "admin" || false;

  // const isSaved = savedPosts?.data?.some((p) => p === post._id) || false;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });
  const queryClient = useQueryClient();
  
  // const saveMutation = useMutation({
  //   mutationFn: async () => {
  //     const token = await getToken();
  //     return axios.patch(
  //       `${import.meta.env.VITE_API_URL}/users/save`,
  //       {
  //         postId: post._id,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
  //   },
  //   onError: (error) => {
  //     toast.error(error.response.data);
  //   },
  // });
  const featureMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/feature`,
        {
          postId: post._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      setIsFeatured((prev) => !prev);
      queryClient.invalidateQueries({ queryKey: ["post", post.slug] });
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });


  const handleDelete = () => {
    deleteMutation.mutate();
  };
  const handleFeature = () => {
    featureMutation.mutate();
  };

  // const handleSave = () => {
  //   if (!user) {
  //     return navigate("/login");
  //   }
  //   saveMutation.mutate();
  // };


  return (
    <div>
        <h1 className="mt-8 mb-4 text-sm font-medium">Actions</h1>
       {/* {isPending ? (
        "Loading..."
      ) : error ? (
        "Saved post fetching failed!"
      ) : ( <div className="flex items-center gap-2 py-2 text-sm cursor-pointer" onClick={handleSave}>
        
          <i class='fa-solid fa-save ' style={{fontSize:"18px",color:saveMutation.isPending
                  ? isSaved
                    ? "grey"
                    : "black" : isSaved
                    ? "black"
                    : "grey"}} ></i>
        <span>Save this Post</span>
        {saveMutation.isPending && (
            <span className="text-xs">(in progress)</span>
          )}


        </div>)} */}
        {isAdmin && (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
           onClick={handleFeature}
        >
         <i class='fa-solid fa-star'
         style={{fontSize:"18px",color:featureMutation.isPending
         ?  "grey"
            : isFeatured
           ? "black"
           : "grey"}}
         ></i>
          <span>Feature</span>
          {featureMutation.isPending && (
            <span className="text-xs">(in progress)</span>
          )}
        </div>
        )}          

        
       { user && (post.user.username === user.username || isAdmin) && ( <div className="flex items-center gap-2 py-2 text-sm cursor-pointer"  onClick={handleDelete}>
        
        <i class='fa-solid fa-trash  ' style={{color:"red",fontSize:"18px"}} ></i>
        <span>Delete Post</span>
        {deleteMutation.isPending && (
            <span className="text-xs">(in progress)</span>
          )}


        </div>)}
    </div>
  )
}

export default PostMenuActions