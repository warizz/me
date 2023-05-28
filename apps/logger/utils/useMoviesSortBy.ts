import { useState, useEffect } from "react";

type Sorting = "date asc" | "date dsc";
const STORAGE_KEY = "movies-sort-by";

function _mapToSorting(value: string): Sorting {
  switch (value) {
    case "date asc":
      return "date asc";

    case "date dsc":
    default:
      return "date dsc";
  }
}

export function useMoviesSortBy() {
  const [sortBy, setSortBy] = useState<Sorting>("date dsc");

  const toggleSorting = () => {
    switch (sortBy) {
      case "date asc": {
        localStorage.setItem(STORAGE_KEY, "date dsc");
        return setSortBy("date dsc");
      }

      case "date dsc":
      default: {
        localStorage.setItem(STORAGE_KEY, "date asc");
        return setSortBy("date asc");
      }
    }
  };

  useEffect(() => {
    const _sortBy = _mapToSorting(localStorage[STORAGE_KEY]);
    setSortBy(_sortBy);
  }, []);

  return { sortBy, toggleSorting };
}
