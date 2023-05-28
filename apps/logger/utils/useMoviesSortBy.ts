import { useState, useEffect } from "react";

type Sorting = "date asc" | "date dsc";
const storageKey = "movies-sort-by";

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
        localStorage.setItem(storageKey, "date");
        return setSortBy("date dsc");
      }

      case "date dsc":
      default: {
        localStorage.setItem(storageKey, "title");
        return setSortBy("date asc");
      }
    }
  };

  useEffect(() => {
    const _sortBy = _mapToSorting(localStorage[storageKey]);
    setSortBy(_sortBy);
  }, []);

  return { sortBy, toggleSorting };
}
