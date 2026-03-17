import { readdirSync, readFileSync } from "fs";
import path from "path";

import matter from "gray-matter";
import { Metadata } from "next";
import Link from "next/link";

import BlogLayout from "../../../components/BlogLayout";
import Markdown from "../../../components/Markdown";

const notesDirectory = path.join(process.cwd(), "resource", "notes");

interface NoteData {
  fileName: string;
  date: Date;
  content: string;
  heading: string;
  topic: string;
}

function extractHeading(content: string): string {
  // Extract first h1 or h2 heading from markdown
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();

  const h2Match = content.match(/^##\s+(.+)$/m);
  if (h2Match) return h2Match[1].trim();

  return "";
}

function getNoteById(id: string): NoteData | null {
  try {
    const fileName = `${id}.md`;
    const fullPath = path.join(notesDirectory, fileName);
    const fileContents = readFileSync(fullPath, "utf8");
    const meta = matter(fileContents);

    // Parse date from filename (format: 2024-01-01-topicxxx.md)
    const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})-/);
    const date = dateMatch
      ? new Date(dateMatch[1])
      : new Date(meta.data.date || Date.now());

    // Extract topic from filename
    const topic = fileName
      .replace(/^\d{4}-\d{2}-\d{2}-/, "")
      .replace(/\.md$/, "");

    // Extract heading from content
    const heading =
      meta.data.title || extractHeading(meta.content) || topic || "Untitled";

    return {
      fileName,
      date,
      content: meta.content,
      heading,
      topic,
    };
  } catch (error) {
    console.error(`Error reading note ${id}:`, error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const fileNames = readdirSync(notesDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const id = path.parse(fileName).name;
        return { id };
      });
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = getNoteById(id);

  if (!note) {
    return {
      title: "Note Not Found - Warizz",
      robots: "noindex, nofollow",
    };
  }

  return {
    title: `${note.heading} - Notes - Warizz`,
    robots: "index, follow",
  };
}

export default async function NotePage({ params }: Props) {
  const { id } = await params;
  const note = getNoteById(id);

  if (!note) {
    return (
      <BlogLayout
        breadcrumbs={[
          { text: "home", href: "/" },
          { text: "notes", href: "/notes" },
        ]}
        h1={<h1 className="dark:text-white">Note Not Found</h1>}
      >
        <p>The note you're looking for doesn't exist.</p>
        <Link href="/notes" className="text-primary dark:text-primary-invert">
          ← Back to Notes
        </Link>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout
      breadcrumbs={[
        { text: "home", href: "/" },
        { text: "notes", href: "/notes" },
        { text: "current", href: `/notes/${id}` },
      ]}
      h1={<h1 className="!mb-0">{note.heading}</h1>}
      date={note.date}
    >
      <Markdown>{note.content}</Markdown>
      <hr className="!my-8" />
      <div className="flex items-center gap-4">
        <Link
          href="/notes"
          className="text-primary dark:text-primary-invert hover:underline"
        >
          ← Back to Notes
        </Link>
      </div>
    </BlogLayout>
  );
}
