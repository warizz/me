import { Metadata } from "next";
import Link from "next/link";
import ToolsBar from "shared/ToolsBar";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `My movies`,
  };
}

export default async function Page() {
  return (
    <>
      <ToolsBar
        className="mb-3 lg:mb-2"
        breadcrumbs={[
          { text: "home", href: "/" },
          { text: "movies", href: "/movies" },
        ]}
      />
      <div>
        <h1>{`My movies`}</h1>
        <div className="font-mono">
          <ul>
            {["2023"].map((item) => {
              return (
                <Link href={`/movies/${item}`} key={item}>
                  {item}
                </Link>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
