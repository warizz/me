"use client";

import imageCompression from "browser-image-compression";
import {
  Upload,
  Download,
  Settings2,
  Image as ImageIcon,
  RotateCcw,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, ChangeEvent, useEffect } from "react";

import ColorSchemeToggle from "../../components/ColorSchemeToggle";

interface CompressedImage {
  id: string;
  originalFile: File;
  compressedFile: File | null;
  compressedUrl: string | null;
  status: "pending" | "compressing" | "completed" | "error";
  originalSize: number;
  compressedSize: number;
}

export default function CompressApp() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [format, setFormat] = useState<"image/jpeg" | "image/webp">(
    "image/jpeg",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoCompress, setAutoCompress] = useState(true);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: CompressedImage[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      originalFile: file,
      compressedFile: null,
      compressedUrl: null,
      status: "pending",
      originalSize: file.size,
      compressedSize: 0,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const compressAll = async () => {
    if (images.length === 0 || isProcessing) return;

    setIsProcessing(true);

    // Process images sequentially or in parallel? Parallel with a limit might be better but sequential is safer for browser resources.
    // Let's go with sequential for simplicity and stability.

    const updatedImages = [...images];

    for (let i = 0; i < updatedImages.length; i++) {
      if (updatedImages[i].status === "completed") continue;

      updatedImages[i].status = "compressing";
      setImages([...updatedImages]);

      try {
        const options = {
          useWebWorker: true,
          fileType: format,
          initialQuality: 0.75,
        };

        const compressedFile = await imageCompression(
          updatedImages[i].originalFile,
          options,
        );

        if (compressedFile.size > updatedImages[i].originalSize) {
          // Keep original if compressed is larger
          updatedImages[i].compressedFile = updatedImages[i].originalFile;
          updatedImages[i].compressedUrl = URL.createObjectURL(
            updatedImages[i].originalFile,
          );
          updatedImages[i].compressedSize = updatedImages[i].originalSize;
        } else {
          updatedImages[i].compressedFile = compressedFile;
          updatedImages[i].compressedUrl = URL.createObjectURL(compressedFile);
          updatedImages[i].compressedSize = compressedFile.size;
        }
        updatedImages[i].status = "completed";
      } catch (error) {
        console.error("Compression error:", error);
        updatedImages[i].status = "error";
      }
      setImages([...updatedImages]);
    }

    setIsProcessing(false);
  };

  useEffect(() => {
    if (
      autoCompress &&
      images.some((img) => img.status === "pending") &&
      !isProcessing
    ) {
      void compressAll();
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [images, autoCompress, isProcessing]);

  const handleDownload = (img: CompressedImage) => {
    if (!img.compressedUrl) return;
    const extension = format === "image/webp" ? "webp" : "jpg";
    const originalName = img.originalFile.name.substring(
      0,
      img.originalFile.name.lastIndexOf("."),
    );
    const link = document.createElement("a");
    link.href = img.compressedUrl;
    link.download = `${originalName}-compressed.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    const completedImages = images.filter((img) => img.status === "completed");
    completedImages.forEach((img, index) => {
      // Small delay between downloads to prevent browser blocking
      setTimeout(() => {
        handleDownload(img);
      }, index * 200);
    });
  };

  const handleRemove = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      // Revoke URLs to free memory
      const removed = prev.find((img) => img.id === id);
      if (removed?.compressedUrl) {
        URL.revokeObjectURL(removed.compressedUrl);
      }
      return filtered;
    });
  };

  const handleReset = () => {
    images.forEach((img) => {
      if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
    });
    setImages([]);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-mono text-[#111] transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b-4 border-black bg-[#ffeb3b] p-6 lg:p-8 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              className="group flex items-center gap-1 text-[10px] font-black uppercase opacity-60 transition-opacity hover:opacity-100"
            >
              <span className="inline-block transition-transform group-hover:-translate-x-1">
                ←
              </span>{" "}
              INDEX
            </Link>
            <h1 className="font-serif text-2xl font-black tracking-widest uppercase md:text-3xl dark:text-primary-invert">
              Compress Images
            </h1>
          </div>
          <ColorSchemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-8">
        <p className="mb-8 max-w-3xl text-sm leading-relaxed font-bold text-gray-600 dark:text-zinc-400">
          This tool uses{" "}
          <code className="bg-gray-100 px-1 text-black dark:border dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
            browser-image-compression
          </code>{" "}
          (Quality: 0.75) to process files directly in your browser. No images
          are ever sent to any server.
        </p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Settings Sidebar */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-zinc-800 dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
              <h2 className="mb-6 flex items-center gap-2 border-b-4 border-black pb-2 text-2xl font-black uppercase dark:border-white">
                <Settings2 className="h-6 w-6" strokeWidth={3} /> Settings
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black uppercase">Format</label>
                  <div className="flex overflow-hidden border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                    <button
                      onClick={() => setFormat("image/jpeg")}
                      className={`px-3 py-1 text-[10px] font-black uppercase transition-all ${
                        format === "image/jpeg"
                          ? "bg-[#ffeb3b] text-black dark:bg-primary-invert"
                          : "bg-white text-gray-400 hover:text-black dark:bg-zinc-800 dark:hover:text-white"
                      }`}
                    >
                      JPG
                    </button>
                    <button
                      onClick={() => setFormat("image/webp")}
                      className={`border-l-2 border-black px-3 py-1 text-[10px] font-black uppercase transition-all dark:border-white ${
                        format === "image/webp"
                          ? "bg-[#ffeb3b] text-black dark:bg-primary-invert"
                          : "bg-white text-gray-400 hover:text-black dark:bg-zinc-800 dark:hover:text-white"
                      }`}
                    >
                      WebP
                    </button>
                  </div>
                </div>

                <div>
                  <div
                    onClick={() => setAutoCompress(!autoCompress)}
                    className="group flex cursor-pointer items-center justify-between"
                  >
                    <span className="text-sm font-black uppercase transition-colors group-hover:text-[#8b5cf6] dark:group-hover:text-primary-invert">
                      Auto-Compress
                    </span>
                    <div
                      className={`relative h-5 w-10 border-2 border-black transition-all duration-300 ease-in-out dark:border-white ${
                        autoCompress
                          ? "bg-[#ffeb3b] dark:bg-primary-invert"
                          : "bg-white dark:bg-zinc-800"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 bottom-0.5 left-0.5 w-4 border-2 border-black bg-black transition-transform duration-300 ease-in-out dark:border-white dark:bg-white ${
                          autoCompress ? "translate-x-4.5" : "translate-x-0"
                        }`}
                        style={{
                          transform: autoCompress
                            ? "translateX(20px)"
                            : "translateX(0)",
                        }}
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] font-bold text-gray-500 uppercase">
                    Process files immediately after upload
                  </p>
                </div>

                <div className="border-t-4 border-black pt-4 dark:border-white">
                  <button
                    onClick={() => void compressAll()}
                    disabled={images.length === 0 || isProcessing}
                    className="flex w-full items-center justify-center gap-2 border-4 border-black bg-[#8b5cf6] p-4 font-black text-white uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-[#7c3aed] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:border-white dark:bg-primary-invert dark:text-black dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] dark:hover:bg-amber-400 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-5 w-5" />
                        Compress {images.length > 0 ? `(${images.length})` : ""}
                      </>
                    )}
                  </button>

                  {images.length > 0 && (
                    <button
                      onClick={handleReset}
                      className="mt-4 flex w-full items-center justify-center gap-2 border-4 border-black bg-white p-3 font-black text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-gray-50 active:translate-x-1 active:translate-y-1 active:shadow-none dark:border-white dark:bg-zinc-800 dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] dark:hover:bg-zinc-700"
                    >
                      <RotateCcw className="h-4 w-4" /> Reset All
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upload & List Area */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            {/* Upload Dropzone */}
            <div className="group relative flex min-h-[200px] flex-col items-center justify-center border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-zinc-800 dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                aria-label="Upload images"
              />
              <Upload className="mb-4 h-12 w-12 text-gray-400 transition-colors group-hover:text-black dark:group-hover:text-white" />
              <p className="text-center text-xl font-black uppercase transition-colors group-hover:text-black dark:group-hover:text-white">
                Click or drag to upload images
              </p>
              <p className="mt-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                JPEG, PNG, WebP supported
              </p>
            </div>

            {/* Image List */}
            {images.length > 0 && (
              <div className="space-y-4">
                <h3 className="flex items-center justify-between border-b-4 border-black pb-2 text-xl font-black uppercase dark:border-white">
                  <div className="flex items-center gap-4">
                    <span>Queue ({images.length})</span>
                    {images.some((img) => img.status === "completed") && (
                      <button
                        onClick={handleDownloadAll}
                        className="flex items-center gap-1 border-2 border-black bg-[#ffeb3b] px-3 py-1 text-xs text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none dark:border-zinc-100 dark:bg-primary-invert dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                      >
                        <Download className="h-3 w-3" /> Download All
                      </button>
                    )}
                  </div>
                  {images.every((img) => img.status === "completed") && (
                    <span className="border-2 border-black bg-green-500 px-2 py-1 text-sm text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                      ALL DONE!
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="relative flex items-center gap-4 border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-zinc-800 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden border-2 border-black bg-gray-100 dark:border-white dark:bg-zinc-700">
                        {img.compressedUrl ? (
                          <Image
                            src={img.compressedUrl}
                            alt="preview"
                            width={80}
                            height={80}
                            unoptimized
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-300 dark:text-zinc-600" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black uppercase dark:text-zinc-100">
                          {img.originalFile.name}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className="border-2 border-black bg-gray-200 px-2 py-0.5 text-xs font-bold dark:border-zinc-100 dark:bg-zinc-700">
                            {formatBytes(img.originalSize)}
                          </span>
                          {img.status === "completed" && (
                            <>
                              <span className="border-2 border-black bg-[#ffeb3b] px-2 py-0.5 text-xs font-bold dark:border-zinc-100 dark:bg-primary-invert dark:text-black">
                                {formatBytes(img.compressedSize)}
                              </span>
                              <span
                                className={`border-2 border-black px-2 py-0.5 text-xs font-black dark:border-zinc-100 ${
                                  img.compressedSize < img.originalSize
                                    ? "bg-green-400 text-black dark:bg-green-600 dark:text-white"
                                    : "bg-gray-300 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400"
                                }`}
                              >
                                {img.compressedSize < img.originalSize ? (
                                  <>
                                    -
                                    {Math.round(
                                      (1 -
                                        img.compressedSize / img.originalSize) *
                                        100,
                                    )}
                                    %
                                  </>
                                ) : (
                                  "NO REDUCTION"
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {img.status === "compressing" && (
                          <RefreshCw className="h-6 w-6 animate-spin text-primary dark:text-primary-invert" />
                        )}
                        {img.status === "completed" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDownload(img)}
                              className="border-2 border-black bg-[#ffeb3b] p-2 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border-white dark:bg-primary-invert dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] dark:hover:bg-amber-400"
                              title="Download"
                            >
                              <Download className="h-5 w-5" />
                            </button>
                            <CheckCircle2 className="h-6 w-6 text-green-500 dark:text-green-400" />
                          </div>
                        )}
                        {img.status === "error" && (
                          <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
                        )}
                        <button
                          onClick={() => handleRemove(img.id)}
                          className="p-2 text-gray-400 transition-colors hover:text-black dark:hover:text-white"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
