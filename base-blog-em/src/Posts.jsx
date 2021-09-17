import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  //Prefetch
  const queryClient = useQueryClient();
  useEffect(() => {
    if (currentPage < maxPostPage) {
      let nextPage = currentPage + 1;

      queryClient.prefetchQuery(
        //same query as in useQuery so react query can understand if there is something into the cache
        //https://react-query.tanstack.com/guides/prefetching#_top
        ["posts", nextPage],
        () => fetchPosts(nextPage),
        {
          staleTime: 2000,
          keepPreviousData: true,
        }
      );
    }
  }, [currentPage]);
  // useQuery("name of the query",query function,optiond:{staleTime:how long we tolerate stale data})
  const { data, isError, isLoading, isFetching, error } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 10000,
      cacheTime: 1000 * 60 * 5,
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
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            let tempCurrentpage = 0;
            if (currentPage <= 1) {
              tempCurrentpage = 1;
            } else {
              tempCurrentpage = currentPage - 1;
            }
            setCurrentPage(tempCurrentpage);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            let tempCurrentpage = 0;
            if (currentPage >= maxPostPage) {
              tempCurrentpage = maxPostPage;
            } else {
              tempCurrentpage = currentPage + 1;
            }
            setCurrentPage(tempCurrentpage);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
