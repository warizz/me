import BlogLayout from "../../components/BlogLayout";
import {
  fmString,
  getContent,
  getContentFileNames,
} from "../../components/lib/getContent";
import GamesViews from "./GamesViews";
import { parseGamesCsv } from "./parseGamesCsv";

export async function generateMetadata() {
  return {
    title: "Games",
    description: "Games I played",
    robots: "index, follow",
  };
}

export default async function Page() {
  const posts = getContentFileNames("game")
    .map((fileName) => {
      const { data, id, markdownString } = getContent(fileName);
      return {
        date: fmString(data.date),
        id,
        title: fmString(data.title) || id,
        rating: data.rating,
        platinum: data.platinum === true,
        image: /!\[[^\]]*\]\((\/posts\/[^)]+)\)/.exec(markdownString)?.[1],
        isPublished: !!data.publish,
      };
    })
    .filter((post) => post.isPublished);
  const csv = await parseGamesCsv();
  const postedTitles = new Set(posts.map((post) => post.title.toLowerCase()));
  // Sheet rows without a matching post; ZZZ rows roll up into the ZZZ post
  const extraGames = csv.filter((game) => {
    if (game.title.toLowerCase().startsWith("zzz")) return false;
    return !postedTitles.has(game.title.toLowerCase());
  });

  const dateLabel = (iso: string) =>
    new Date(iso).toLocaleDateString("en", { day: "numeric", month: "short" });

  // rows: posts (linked) + sheet-only games, one row per game
  const rowsByYear: Record<string, {
    key: string;
    title: string;
    image: string;
    href?: string;
    platinum: boolean;
    dateLabel: string;
    rating: unknown;
    sortDate: string;
  }[]> = {};
  const push = (year: string, row: (typeof rowsByYear)[string][number]) => {
    (rowsByYear[year] ??= []).push(row);
  };
  for (const post of posts) {
    push(post.date.slice(0, 4), {
      key: post.id,
      title: post.title,
      image: post.image ?? "",
      href: `/posts/${post.id}`,
      platinum: post.platinum,
      dateLabel: dateLabel(post.date),
      rating: post.rating,
      sortDate: post.date,
    });
  }
  for (const game of extraGames) {
    if (!game.finished_at) continue;
    push(game.finished_at.slice(0, 4), {
      key: game.id,
      title: game.title,
      image: game.slug ? `/posts/games/${game.slug}.webp` : "",
      platinum: game.earned_platinum_trophy === "TRUE",
      dateLabel: dateLabel(game.finished_at),
      rating: game.rating,
      sortDate: game.finished_at,
    });
  }
  for (const list of Object.values(rowsByYear)) {
    list.sort((a, b) => (a.sortDate > b.sortDate ? -1 : 1));
  }

  const years = Object.keys(rowsByYear).sort((a, b) => (a < b ? 1 : -1));

  return (
    <BlogLayout
      breadcrumbs={[{ text: "games", href: "/games" }]}
      h1={<h1 className="text-primary dark:text-primary-invert">Games</h1>}
    >
      <GamesViews years={years} rowsByYear={rowsByYear} />
    </BlogLayout>
  );
}
