import { readdirSync, readFileSync } from "fs";
import path from "path";

import matter from "gray-matter";
import { Metadata } from "next";
import Link from "next/link";

import BlogLayout from "../../components/BlogLayout";
import PostDate from "../../components/PostDate";

const notesDirectory = path.join(process.cwd(), "resource", "notes");

interface Note {
  fileName: string;
  date: Date;
  heading: string;
  tldr: string;
}

function extractHeading(content: string): string {
  // Extract first h1 or h2 heading from markdown
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();

  const h2Match = content.match(/^##\s+(.+)$/m);
  if (h2Match) return h2Match[1].trim();

  return "";
}

function getNotes(): Note[] {
  try {
    const fileNames = readdirSync(notesDirectory);

    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const fullPath = path.join(notesDirectory, fileName);
        const fileContents = readFileSync(fullPath, "utf8");
        const meta = matter(fileContents);

        // Parse date from filename (format: 2024-01-01-topicxxx.md)
        const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})-/);
        const date = dateMatch
          ? new Date(dateMatch[1])
          : new Date(meta.data.date || Date.now());

        // Extract heading from content
        const heading =
          meta.data.title ||
          extractHeading(meta.content) ||
          fileName.replace(/\.md$/, "") ||
          "Untitled";

        const tldr = String(meta.data.tldr || "");

        return { fileName, date, heading, tldr };
      })
      .sort((a, b) => {
        // Sort by date, newest first
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        // If same date, sort by filename (alphabetical)
        return a.fileName.localeCompare(b.fileName);
      });
  } catch (error) {
    console.error("Error reading notes:", error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Notes - Warizz",
    robots: "index, follow",
  };
}

export default async function Page() {
  const notes = getNotes();

  return (
    <BlogLayout
      breadcrumbs={[{ text: "notes", href: "/notes" }]}
      h1={<h1 className="dark:text-white">Notes</h1>}
    >
      {notes.length === 0 ? (
        <p className="italic">
          No notes yet. Start adding your notes in <code>resource/notes/</code>{" "}
          directory.
        </p>
      ) : (
        <div data-testid="notes">
          <p className="prose-sm font-sans text-gray-600 dark:text-gray-400">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </p>
          {notes.map((note) => {
            const noteId = path.parse(note.fileName).name;
            return (
              <div
                key={note.fileName}
                className="py-4 border-b border-gray-100 dark:border-gray-800"
              >
                <Link
                  href={`/notes/${noteId}`}
                  className="text-primary font-bold dark:text-primary-invert no-underline hover:underline"
                >
                  {note.heading}
                </Link>
                {note.tldr && (
                  <p className="m-0! prose-base italic">{note.tldr}</p>
                )}
                <div className="prose-sm font-sans text-gray-600 dark:text-gray-400">
                  <PostDate value={note.date} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </BlogLayout>
  );
}
