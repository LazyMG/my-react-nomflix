import React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { ISeachResult, searchContents } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";

const Container = styled.div`
  margin: 30px;
  margin-top: 60px;
  height: 100vh;
`;

const Viewer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  gap: 20px;
  padding: 20px;
`;

const Box = styled.div<{ bgphoto: string }>`
  width: 100%;
  height: 100%;
  background-color: white;
  color: black;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
`;

const Search = () => {
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("keyword");
  const { data, isLoading } = useQuery<ISeachResult>("searchedContents", () =>
    searchContents(keyword as string)
  );

  console.log(data);

  return (
    <Container>
      <Viewer>
        {data?.results.map((result) => (
          <Box
            key={result.id}
            bgphoto={makeImagePath(
              result.backdrop_path || result.poster_path,
              "w500"
            )}
          >
            {result.title || result.name}
          </Box>
        ))}
      </Viewer>
    </Container>
  );
};

export default Search;
