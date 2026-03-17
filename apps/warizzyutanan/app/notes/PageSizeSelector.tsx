"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function PageSizeSelector({
  currentLimit,
}: {
  currentLimit: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const validLimits = [10, 20, 50];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit);
    params.set("page", "1");
    router.push(`/notes?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex items-center gap-4">
      <label htmlFor="pageSize" className="text-sm font-sans">
        Show:
      </label>
      <select
        id="pageSize"
        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-black text-primary dark:text-primary-invert font-sans"
        value={currentLimit}
        onChange={handleChange}
      >
        {validLimits.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
