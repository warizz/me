import Link from "next/link";

interface Props {
  txt: string;
}

const Tag = ({ txt }: Props) => {
  return (
    <Link
      href={`/posts?tag=${txt}`}
      className="rounded-full border border-gray-300 px-2.5 py-0.5 text-gray-600 no-underline transition-colors hover:border-gray-400 hover:text-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-200"
    >
      #{txt}
    </Link>
  );
};

export default Tag;
