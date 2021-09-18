import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Species } from "./Species";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery(
    "sw-species",
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
    }
  );

  if (isError) return <h3>Error: {error.message}</h3>;
  if (isLoading) return <h3 className="loading">Loading...</h3>;
  return (
    <>
      {isFetching && <h3 className="loading">Loading...</h3>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data?.pages.map((pageData) => {
          return pageData.results.map((specie) => (
            <Species
              key={specie.name + specie.language + specie.averageLifespan}
              name={specie.name}
              language={specie.language}
              averageLifespan={specie.average_lifespan}
            ></Species>
          ));
        })}
      </InfiniteScroll>
    </>
  );
}
