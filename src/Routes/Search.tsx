import React from "react";
import { useLocation } from "react-router-dom";

const Search = () => {
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("keyword");

  return <div>Search</div>;
};

export default Search;
