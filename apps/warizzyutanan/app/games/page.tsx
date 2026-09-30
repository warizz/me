import { Trophy } from "lucide-react";
import Link from "next/link";

import BlogLayout from "../../components/BlogLayout";
import { getContentFileNames } from "../../components/lib/getContent";
import getPostData from "../../components/lib/getPostData";
import PostDate from "../../components/PostDate";

function getPlatinumGames() {
  return getContentFileNames("post")
    .map(getPostData)
    .filter(
      (post) => post.isPublished && post.platinum && post.tags.includes("game"),
    );
}

function firstImage(markdownString: string) {
  return /!\[[^\]]*\]\((\/posts\/[^)]+)\)/.exec(markdownString)?.[1];
}

export async function generateMetadata() {
  return {
    title: "Games platinum",
    description: "Games I platinumed",
    robots: "index, follow",
  };
}

async function GamesPage() {
  const games = getPlatinumGames().sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    if (aDate > bDate) return -1;
    return 1;
  });
  return (
    <BlogLayout
      breadcrumbs={[{ text: "games", href: "/games" }]}
      h1={<h1 className="dark:text-white">Games</h1>}
    >
      <div data-testid="games" className="not-prose font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => {
            const image = firstImage(game.markdownString);
            return (
              <Link
                key={game.id}
                href={`/posts/${game.id}`}
                className="no-underline block border border-black/10 dark:border-white/10 hover:border-primary dark:hover:border-primary-invert transition-colors"
              >
                <div className="relative">
                  {image ? (
                    <img
                      src={image}
                      alt={game.title}
                      className="w-full aspect-video object-cover"
                    />
                  ) : null}
                  <span className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5 text-yellow-300">
                    <Trophy size={18} aria-label="Platinum trophy" />
                  </span>
                </div>
                <div className="p-2">
                  <div className="text-primary dark:text-primary-invert font-bold">
                    {game.title}
                  </div>
                  <div className="prose-sm text-black/60 dark:text-white/60">
                    <PostDate value={new Date(game.date)} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </BlogLayout>
  );
}

export default GamesPage;
