interface Props {
  value: Date;
}

const PostDate = ({ value }: Props) => {
  return (
    <time dateTime={value.toISOString()} suppressHydrationWarning>
      {new Intl.DateTimeFormat("default", {
        year: "numeric",
        day: "numeric",
        month: "short",
      }).format(value)}
    </time>
  );
};

export default PostDate;
