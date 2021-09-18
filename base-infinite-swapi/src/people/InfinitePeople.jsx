import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  //https://react-query.tanstack.com/guides/infinite-queries
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useInfiniteQuery(
    "sw-people",

    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
    }
  );
  if (isLoading) return <h3 className="loading">Loading...</h3>;
  if (isError) return <h3 className="loading">Error: {error.message}</h3>;
  //https://www.npmjs.com/package/react-infinite-scroller
  return (
    <>
      {isFetching && <h3 className="loading">Loading...</h3>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data?.pages.map((pageData) => {
          return pageData.results.map((person) => (
            <Person
              key={person.name}
              name={person.name}
              hairColor={person.hair_color}
              eyeColor={person.eye_color}
            />
          ));
        })}
      </InfiniteScroll>
    </>
  );
}
