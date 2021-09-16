import React from "react";
import { useQuery } from "react-query";
async function fetchComments(postId) {
  console.log(postId);
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

  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  if (isError) {
    return <h3>{error.message}</h3>;
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button>Delete</button> <button>Update title</button>
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
