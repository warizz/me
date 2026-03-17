import { readdirSync, readFileSync } from "fs";
import path from "path";

import matter from "gray-matter";
import { Metadata } from "next";
import Link from "next/link";

import BlogLayout from "../../components/BlogLayout";
import PostDate from "../../components/PostDate";

import PageSizeSelector from "./PageSizeSelector";

const notesDirectory = path.join(process.cwd(), "resource", "notes");

interface Note {
  fileName: string;
  date: Date;
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

        // Extract topic from filename
        const topic = fileName
          .replace(/^\d{4}-\d{2}-\d{2}-/, "")
          .replace(/\.md$/, "");

        // Extract heading from content
        const heading =
          meta.data.title ||
          extractHeading(meta.content) ||
          topic ||
          "Untitled";

        return {
          fileName,
          date,
          heading,
          topic,
        };
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

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Notes - Warizz",
    robots: "index, follow",
  };
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "20", 10);

  // Validate limit (only allow 10, 20, or 50)
  const validLimits = [10, 20, 50];
  const pageSize = validLimits.includes(limit) ? limit : 20;

  const allNotes = getNotes();
  const totalNotes = allNotes.length;
  const totalPages = Math.ceil(totalNotes / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedNotes = allNotes.slice(startIndex, endIndex);

  return (
    <BlogLayout
      breadcrumbs={[
        { text: "home", href: "/" },
        { text: "notes", href: "/notes" },
      ]}
      h1={<h1 className="dark:text-white">Notes</h1>}
    >
      <div>
        {/* Page size selector */}
        <div className="mb-6 flex items-center gap-4">
          <PageSizeSelector currentLimit={pageSize} />
          <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
            ({totalNotes} total)
          </span>
        </div>

        {paginatedNotes.length === 0 ? (
          <p className="italic">
            No notes yet. Start adding your notes in{" "}
            <code>resource/notes/</code> directory.
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedNotes.map((note) => {
                const noteId = path.parse(note.fileName).name;
                return (
                  <div
                    key={note.fileName}
                    className="border-b border-gray-200 dark:border-gray-700 pb-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="prose-sm font-sans text-gray-600 dark:text-gray-400 shrink-0">
                        <PostDate value={note.date} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/notes/${noteId}`}
                          className="text-primary font-bold dark:text-primary-invert no-underline hover:underline"
                        >
                          <h2 className="!mt-0 !mb-1 prose-lg">
                            {note.heading}
                          </h2>
                        </Link>
                        {note.topic && note.heading !== note.topic && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 !m-0">
                            {note.topic}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 &&
              (() => {
                // Generate page numbers to display
                const getPageNumbers = () => {
                  const delta = 3; // Number of pages to show on each side of current page
                  const pages: (number | string)[] = [];

                  // If total pages is small, show all pages
                  if (totalPages <= 15) {
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                    return pages;
                  }

                  // Always show first page
                  pages.push(1);

                  // Calculate start and end of page range around current page
                  let start = Math.max(2, currentPage - delta);
                  let end = Math.min(totalPages - 1, currentPage + delta);

                  // Adjust if we're near the beginning
                  if (currentPage <= delta + 1) {
                    end = Math.min(totalPages - 1, 2 * delta + 2);
                  }

                  // Adjust if we're near the end
                  if (currentPage >= totalPages - delta) {
                    start = Math.max(2, totalPages - 2 * delta - 1);
                  }

                  // Add ellipsis before page range if needed
                  if (start > 2) {
                    pages.push("...");
                  }

                  // Add page numbers in range
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }

                  // Add ellipsis after page range if needed
                  if (end < totalPages - 1) {
                    pages.push("...");
                  }

                  // Always show last page
                  if (totalPages > 1) {
                    pages.push(totalPages);
                  }

                  return pages;
                };

                const pageNumbers = getPageNumbers();

                return (
                  <div className="mt-8 flex flex-col items-center gap-4 font-sans">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <Link
                        href={`/notes?page=${currentPage - 1}&limit=${pageSize}`}
                        className={`px-4 py-2 transition-colors no-underline ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed pointer-events-none"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        }`}
                        aria-disabled={currentPage === 1}
                      >
                        Previous
                      </Link>

                      {/* List of clickable page numbers */}
                      <div className="flex items-center gap-1 flex-wrap justify-center">
                        {pageNumbers.map((page, index) => {
                          if (page === "...") {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className="px-2 text-gray-500 dark:text-gray-400"
                              >
                                ...
                              </span>
                            );
                          }

                          const pageNum = page as number;
                          const isActive = pageNum === currentPage;

                          return (
                            <Link
                              key={pageNum}
                              href={`/notes?page=${pageNum}&limit=${pageSize}`}
                              className={`px-3 py-2 min-w-[2.5rem] text-center transition-colors cursor-pointer no-underline ${
                                isActive
                                  ? "bg-primary text-white dark:bg-primary-invert dark:text-black font-bold"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-primary dark:text-primary-invert"
                              }`}
                              aria-label={`Go to page ${pageNum}`}
                              aria-current={isActive ? "page" : undefined}
                            >
                              {pageNum}
                            </Link>
                          );
                        })}
                      </div>

                      <Link
                        href={`/notes?page=${currentPage + 1}&limit=${pageSize}`}
                        className={`px-4 py-2 transition-colors no-underline ${
                          currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed pointer-events-none"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        }`}
                        aria-disabled={currentPage === totalPages}
                      >
                        Next
                      </Link>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                );
              })()}
          </>
        )}
      </div>
    </BlogLayout>
  );
}
