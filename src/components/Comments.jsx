// import React from 'react'
// import Comment from './Comment'
// import axios from 'axios'
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import {useAuth, useUser} from '@clerk/clerk-react'

// const fetchComments = async (postId) => {
//   const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
//   return res.data;
// };

// const Comments = ({postId}) => {

//   const { user } = useUser();

//   const { getToken } = useAuth();

//   const { isPending, error, data } = useQuery({
//     queryKey: ["comments", postId],
//     queryFn: () => fetchComments(postId),
//   });

//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: async (newComment) => {
//       const token = await getToken();
//       return axios.post(
//         `${import.meta.env.VITE_API_URL}/comments/${postId}`,
//         newComment,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["comments", postId] });
//     },
//     onError: (error) => {
//       toast.error(error.response.data);
//     },
//   });

  

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);

//     const data = {
//       desc: formData.get("desc"),
//     };

//     mutation.mutate(data);
//   };
  

//   return (
//     <div className="flex flex-col gap-8 lg:w-3/5 mb-12">
//          <h1 className="text-xl text-gray-500 underline">Comments</h1>
//          <form onSubmit={handleSubmit}
//         className="flex items-center justify-between gap-8 w-full"
//       >
//         <textarea
//           name="desc"
//           placeholder="Write a comment..."
//           className="w-full p-4 rounded-xl"
//         />
//         <button className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl">
//           Send
//         </button>
//       </form>
//       {isPending ? (
//         "Loading..."
//       ) : error ? (
//         "Error loading comments!"
//       ) : (
//         <>
//           {/* {mutation.isPending && (
//             <Comment
//               comment={{
//                 desc: `${mutation.variables.desc} (Sending...)`,
//                 createdAt: new Date(),
//                 user: {
//                   img: user.imageUrl,
//                   username: user.username,
//                 },
//               }}
//             />
//           )} */}
//          {mutation.isPending && mutation.variables && (
//   <Comment
//     comment={{
//       _id: "temp-id",
//       desc: mutation.variables.desc,
//       createdAt: new Date(),
//       user: {
//         username: user?.username || "Anonymous",
//         img: user?.imageUrl || "",
//       },
//     }}
//   />
// )}



//           {/* {data.map((comment) => (
//             <Comment key={comment._id} comment={comment} postId={postId} />
//           ))} */}
//           {Array.isArray(data) &&
//   data
//     .filter((comment) => comment && comment._id) // filter out undefined/null comments
//     .map((comment) => (
//       <Comment key={comment._id} comment={comment} postId={postId} />
//     ))}



//         </>
//       )}
//     </div>
//   )
// }

// export default Comments

import React from 'react';
import Comment from './Comment';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

const fetchComments = async (postId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
  return res.data;
};

const Comments = ({ postId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const {
    isPending,
    error,
    data: comments,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
  });

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        newComment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data || 'Error posting comment');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const commentData = {
      desc: formData.get('desc'),
    };
    mutation.mutate(commentData);
    e.target.reset(); // Clear form after submit
  };

  return (
    <div className="flex flex-col gap-8 lg:w-3/5 mb-12">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>

      {/* Form to add comment */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between gap-8 w-full"
      >
        <textarea
          name="desc"
          placeholder="Write a comment..."
          className="w-full p-4 rounded-xl"
          required
        />
        <button className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl">
          Send
        </button>
      </form>

      {/* Loading / Error Handling */}
      {isPending ? (
        'Loading...'
      ) : error ? (
        'Error loading comments!'
      ) : (
        <>
          {/* Show temporary comment while mutation is pending */}
          {mutation.isPending && mutation.variables && (
            <Comment
              comment={{
                _id: 'temp-id',
                desc: mutation.variables.desc,
                createdAt: new Date().toISOString(),
                user: {
                  username: user?.username || 'Anonymous',
                  img: user?.imageUrl || '',
                },
              }}
              postId={postId}
            />
          )}

          {/* Render list of comments safely */}
          {Array.isArray(comments) &&
            comments
              .filter((c) => c && c._id && c.user)
              .map((comment) => (
                <Comment key={comment._id} comment={comment} postId={postId} />
              ))}
        </>
      )}
    </div>
  );
};

export default Comments;
