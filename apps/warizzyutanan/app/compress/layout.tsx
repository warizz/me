import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress Images | Warizz Yutanan",
  description:
    "High-performance browser-based image compression. Batch process JPG and WebP images securely without uploading to any server.",
};

export default function CompressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
