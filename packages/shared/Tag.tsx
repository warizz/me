import Link from "next/link";

interface Props {
  txt: string;
}

const Tag = ({ txt }: Props) => {
  return (
    <Link
      href={`/posts?tag=${txt}`}
      className="text-black hover:text-gray-800 dark:text-gray-50 dark:hover:text-gray-300"
    >
      #{txt}
    </Link>
  );
};

export default Tag;
