interface Props {
  title: string;
  robots: string;
  description?: string;
  ga: { id: string; isDisabled: boolean };
}

export default function DefaultHeadTag({
  title,
  robots,
  description,
  ga,
}: Props) {
  return (
    <>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />

      <meta content="width=device-width, initial-scale=1" name="viewport" />
      {description ? <meta name="description" content={description} /> : null}
      <meta name="robots" content={robots} />

      {!ga.isDisabled && (
        <>
          <script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga.id}`}
            defer
            data-testid="ga_lib"
          />
          <script id="ga_datalayer" defer>
            {`function gtag(){window.dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","${ga.id}");`}
          </script>
        </>
      )}
    </>
  );
}
