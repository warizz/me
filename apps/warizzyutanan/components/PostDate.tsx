"use client";

interface Props {
  value: Date;
}

const PostDate = ({ value }: Props) => {
  return (
    <span className="font-serif">
      {new Intl.DateTimeFormat("default", {
        year: "numeric",
        day: "numeric",
        month: "short",
      }).format(value)}
    </span>
  );
};

export default PostDate;
