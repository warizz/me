import Markdown from "../../components/Markdown";

type Block =
  | { kind: "lead"; body: string }
  | { kind: "section"; heading: string; body: string }
  | { kind: "node"; heading: string; body: string };

function parseBlocks(markdownString: string): Block[] {
  const blocks: Block[] = [];
  let current: Block | null = null;

  for (const line of markdownString.split("\n")) {
    const h2 = line.match(/^## (.+)$/);
    const h3 = line.match(/^### (.+)$/);
    if (h2) {
      current = { kind: "section", heading: h2[1], body: "" };
      blocks.push(current);
    } else if (h3) {
      current = { kind: "node", heading: h3[1], body: "" };
      blocks.push(current);
    } else if (current) {
      current.body += `${line}\n`;
    } else if (line.trim() || blocks.at(-1)?.kind === "lead") {
      const lead = blocks.at(-1);
      if (lead?.kind === "lead") {
        lead.body += `${line}\n`;
      } else {
        current = { kind: "lead", body: `${line}\n` };
        blocks.push(current);
        current = null;
      }
    }
  }
  return blocks;
}

const bodyClass = "prose prose-sm dark:prose-invert font-sans max-w-none";

function withPhotoStamps(body: string) {
  return body.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g,
    (_match, alt: string, src: string, stamp?: string) => {
      const fileName = src.split("/").pop() ?? src;
      const id = fileName.replace(/\.[^.]+$/, "");
      const label = stamp ? `${id} · ${stamp}` : id;
      return `<span class="tc-photo"><img src="${src}" alt="${alt}" loading="lazy" /><span class="tc-photo-id">${label}</span></span>`;
    },
  );
}
const accentText = "text-rose-600 dark:text-amber-400";
const cardClass = `rounded-lg border border-black/10 dark:border-white/15 border-t-2 border-t-rose-500/70 dark:border-t-amber-400/70 shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.6)] bg-white dark:bg-black`;

export default function EventTimeline({
  markdownString,
}: {
  markdownString: string;
}) {
  const blocks = parseBlocks(markdownString);
  const nodeIndexes = blocks
    .map((block, index) => (block.kind === "node" ? index : -1))
    .filter((index) => index >= 0);
  const lastNodeIndex = nodeIndexes.at(-1);

  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        if (block.kind === "lead") {
          return (
            <div key={index} className={bodyClass}>
              <Markdown>{withPhotoStamps(block.body)}</Markdown>
            </div>
          );
        }

        if (block.kind === "section") {
          return (
            <section key={index} className={`${cardClass} p-4 md:p-5`}>
              <h2
                className={`font-mono uppercase text-[11px] font-bold tracking-widest ${accentText} mb-3`}
              >
                {block.heading}
              </h2>
              <div className={bodyClass}>
                <Markdown>{withPhotoStamps(block.body)}</Markdown>
              </div>
            </section>
          );
        }

        const [when, what] = block.heading.split(/\s+—\s+/);
        return (
          <div
            key={index}
            className={`relative ml-1 pl-6 pb-2 ${
              index === lastNodeIndex
                ? ""
                : "border-l border-rose-500/25 dark:border-amber-400/25 pb-8"
            }`}
          >
            <span className="absolute -left-[5px] top-[7px] w-[9px] h-[9px] rounded-full bg-gradient-to-r from-rose-500 to-orange-400 dark:from-amber-400 dark:to-orange-500" />
            <div className={`${cardClass} p-4 md:p-5`}>
              {what ? (
                <div className="mb-2">
                  <span
                    className={`font-mono uppercase text-[11px] tracking-widest ${accentText}`}
                  >
                    {when}
                  </span>
                  <h3 className="text-lg font-bold tracking-tight m-0!">
                    {what}
                  </h3>
                </div>
              ) : (
                <h3 className="text-lg font-bold tracking-tight mb-2 m-0!">
                  {block.heading}
                </h3>
              )}
              <div className={bodyClass}>
                <Markdown>{withPhotoStamps(block.body)}</Markdown>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
