interface Props {
  title: string;
  robots: string;
  description?: string;
  ga: { id: string; isDisabled: boolean };
}

export default function DefaultHeadTag({ title, robots, description }: Props) {
  return (
    <>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />

      <meta content="width=device-width, initial-scale=1" name="viewport" />
      {description ? <meta name="description" content={description} /> : null}
      <meta name="robots" content={robots} />
    </>
  );
}
