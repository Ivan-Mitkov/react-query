import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
async function fetchComments(postId) {
  // console.log(postId);
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // replace with useQuery
  const { id } = post;
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);
  const { data, isLoading, isError, error } = useQuery(
    /**
     * https://react-query.tanstack.com/guides/query-keys
     * When a query needs more information to uniquely describe its data, you can use an array with a string and any number of serializable objects to describe it. This is useful for:

      Hierarchical or nested resources
      It's common to pass an ID, index, or other primitive to uniquely identify the item
      Queries with additional parameters
      It's common to pass an object of additional options
     */
    ["comments", id],
    () => fetchComments(id),
    {
      staleTime: 1000,
      cacheTime: 1000,
    }
  );
  //MUTATIONS
  //https://react-query.tanstack.com/guides/mutations
  //NO QUERY KEY, can take argument itself
  const deleteMutation = useMutation((id) => deletePost(id), {
    //CALLBACKS
    // onSuccess: () => setShowMessage(true),
    onError: () => setShowDeleteMessage(true),
    // onMutate: () => setShowDeleteMessage(true),
    onSettled: () => setShowDeleteMessage(true),
  });
  const updateMutation = useMutation((id) => updatePost(id), {
    //CALLBACKS
    // onSuccess: () => setShowMessage(true),
    onError: () => setShowUpdateMessage(true),
    // onMutate: () => setShowUpdateMessage(true),
    onSettled: () => setShowUpdateMessage(true),
  });

  //Show message for only 5 s
  const tempShowMessage = () => {
    if (showDeleteMessage) {
      setTimeout(() => {
        setShowDeleteMessage(false);
      }, 5000);
    }
    if (showUpdateMessage) {
      setTimeout(() => {
        setShowUpdateMessage(false);
      }, 5000);
    }
  };
  useEffect(() => {
    if (showDeleteMessage) {
      tempShowMessage();
    }
    if (showUpdateMessage) {
      tempShowMessage();
    }
    console.log(`useEffect`);
  }, [showDeleteMessage, showUpdateMessage]);

  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  if (isError) {
    return <h3>{error}</h3>;
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>
        Delete
      </button>{" "}
      {
        //MESSAGES
      }
      {showDeleteMessage && deleteMutation.isError && (
        <h3 style={{ color: "red" }}>{deleteMutation.error.message}</h3>
      )}
      {deleteMutation.isLoading && (
        <h3 style={{ color: "blue" }}>Deleteing the post</h3>
      )}
      {showDeleteMessage && deleteMutation.isSuccess && (
        <h3 style={{ color: "green" }}>Post deleted - not really &#128540; </h3>
      )}
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {
        //MESSAGES}
      }
      {showUpdateMessage && updateMutation.isError && (
        <h3 style={{ color: "red" }}>{updateMutation.error.message}</h3>
      )}
      {updateMutation.isLoading && (
        <h3 style={{ color: "blue" }}>Updating the post</h3>
      )}
      {showUpdateMessage && updateMutation.isSuccess && (
        <h3 style={{ color: "green" }}>Post updated- not really &#128561; </h3>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
