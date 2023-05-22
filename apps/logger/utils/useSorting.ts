import { useEffect, useState } from "react";

import mapToSorting from "./mapToSorting";

const storageKey = "sortBy";

export default function useSorting() {
  const [sortBy, setSortBy] = useState<"title" | "date">("title");

  const toggleSorting = () => {
    switch (sortBy) {
      case "title": {
        localStorage.setItem(storageKey, "date");
        return setSortBy("date");
      }

      case "date":
      default: {
        localStorage.setItem(storageKey, "title");
        return setSortBy("title");
      }
    }
  };

  useEffect(() => {
    const _sortBy = mapToSorting(localStorage[storageKey]);
    setSortBy(_sortBy);
  }, []);

  return { sortBy, toggleSorting };
}
