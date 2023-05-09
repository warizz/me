import { useCallback, useEffect, useState } from "react";

import mapToSortOrder from "./mapToSortOrder";

const storageKey = "sortOrder";

export default function useSortOrder() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const toggleSortOrder = useCallback(() => {
    switch (sortOrder) {
      case "desc": {
        localStorage.setItem(storageKey, "asc");
        return setSortOrder("asc");
      }

      case "asc":
      default: {
        localStorage.setItem(storageKey, "desc");
        return setSortOrder("desc");
      }
    }
  }, [sortOrder]);

  useEffect(() => {
    const _value = mapToSortOrder(localStorage[storageKey]);
    setSortOrder(_value);
  }, []);

  return { sortOrder, toggleSortOrder };
}
