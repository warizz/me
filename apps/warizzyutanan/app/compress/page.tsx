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
      compressAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-[#111] dark:text-zinc-100 font-mono transition-colors">
      {/* Header */}
      <header className="border-b-4 border-black dark:border-zinc-700 bg-[#ffeb3b] dark:bg-zinc-800 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              className="text-[10px] font-black uppercase opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform inline-block">
                ←
              </span>{" "}
              INDEX
            </Link>
            <h1 className="text-2xl md:text-3xl font-black uppercase font-serif tracking-widest dark:text-primary-invert">
              Compress Images
            </h1>
          </div>
          <ColorSchemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <p className="mb-8 max-w-3xl text-sm font-bold leading-relaxed text-gray-600 dark:text-zinc-400">
          This tool uses{" "}
          <code className="bg-gray-100 dark:bg-zinc-800 px-1 dark:border dark:border-zinc-700 text-black dark:text-white">
            browser-image-compression
          </code>{" "}
          (Quality: 0.75) to process files directly in your browser. No images
          are ever sent to any server.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Settings Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="border-4 border-black dark:border-white bg-white dark:bg-zinc-800 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
              <h2 className="text-2xl font-black mb-6 uppercase flex items-center gap-2 border-b-4 border-black dark:border-white pb-2">
                <Settings2 className="w-6 h-6" strokeWidth={3} /> Settings
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="font-black uppercase text-sm">Format</label>
                  <div className="flex border-2 border-black dark:border-white overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                    <button
                      onClick={() => setFormat("image/jpeg")}
                      className={`px-3 py-1 text-[10px] font-black uppercase transition-all ${
                        format === "image/jpeg"
                          ? "bg-[#ffeb3b] dark:bg-primary-invert text-black"
                          : "bg-white dark:bg-zinc-800 text-gray-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      JPG
                    </button>
                    <button
                      onClick={() => setFormat("image/webp")}
                      className={`px-3 py-1 text-[10px] font-black uppercase transition-all border-l-2 border-black dark:border-white ${
                        format === "image/webp"
                          ? "bg-[#ffeb3b] dark:bg-primary-invert text-black"
                          : "bg-white dark:bg-zinc-800 text-gray-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      WebP
                    </button>
                  </div>
                </div>

                <div>
                  <div
                    onClick={() => setAutoCompress(!autoCompress)}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <span className="font-black uppercase text-sm group-hover:text-[#8b5cf6] dark:group-hover:text-primary-invert transition-colors">
                      Auto-Compress
                    </span>
                    <div
                      className={`w-10 h-5 border-2 border-black dark:border-white relative transition-all duration-300 ease-in-out ${
                        autoCompress
                          ? "bg-[#ffeb3b] dark:bg-primary-invert"
                          : "bg-white dark:bg-zinc-800"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 bottom-0.5 w-4 border-2 border-black dark:border-white transition-transform duration-300 ease-in-out bg-black dark:bg-white ${
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
                  <p className="text-[10px] font-bold mt-2 text-gray-500 uppercase">
                    Process files immediately after upload
                  </p>
                </div>

                <div className="pt-4 border-t-4 border-black dark:border-white">
                  <button
                    onClick={compressAll}
                    disabled={images.length === 0 || isProcessing}
                    className="w-full p-4 border-4 border-black dark:border-white font-black uppercase bg-[#8b5cf6] dark:bg-primary-invert text-white dark:text-black hover:bg-[#7c3aed] dark:hover:bg-amber-400 disabled:bg-gray-300 dark:disabled:bg-zinc-700 disabled:text-gray-500 dark:disabled:text-zinc-500 disabled:cursor-not-allowed shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5" />
                        Compress {images.length > 0 ? `(${images.length})` : ""}
                      </>
                    )}
                  </button>

                  {images.length > 0 && (
                    <button
                      onClick={handleReset}
                      className="w-full mt-4 p-3 border-4 border-black dark:border-white font-black uppercase bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" /> Reset All
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upload & List Area */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Upload Dropzone */}
            <div className="border-4 border-black dark:border-white bg-white dark:bg-zinc-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] relative p-8 flex flex-col items-center justify-center min-h-[200px] group">
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                aria-label="Upload images"
              />
              <Upload className="w-12 h-12 mb-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
              <p className="text-xl font-black uppercase text-center group-hover:text-black dark:group-hover:text-white transition-colors">
                Click or drag to upload images
              </p>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">
                JPEG, PNG, WebP supported
              </p>
            </div>

            {/* Image List */}
            {images.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase border-b-4 border-black dark:border-white pb-2 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span>Queue ({images.length})</span>
                    {images.some((img) => img.status === "completed") && (
                      <button
                        onClick={handleDownloadAll}
                        className="text-xs bg-[#ffeb3b] dark:bg-primary-invert text-black px-3 py-1 border-2 border-black dark:border-zinc-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-1 uppercase"
                      >
                        <Download className="w-3 h-3" /> Download All
                      </button>
                    )}
                  </div>
                  {images.every((img) => img.status === "completed") && (
                    <span className="text-sm bg-green-500 text-white px-2 py-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                      ALL DONE!
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="border-4 border-black dark:border-white bg-white dark:bg-zinc-800 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] flex items-center gap-4 relative"
                    >
                      <div className="w-20 h-20 border-2 border-black dark:border-white bg-gray-100 dark:bg-zinc-700 flex-shrink-0 relative overflow-hidden">
                        {img.compressedUrl ? (
                          <Image
                            src={img.compressedUrl}
                            alt="preview"
                            width={80}
                            height={80}
                            unoptimized
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-300 dark:text-zinc-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-black truncate uppercase text-sm dark:text-zinc-100">
                          {img.originalFile.name}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-xs font-bold bg-gray-200 dark:bg-zinc-700 px-2 py-0.5 border-2 border-black dark:border-zinc-100">
                            {formatBytes(img.originalSize)}
                          </span>
                          {img.status === "completed" && (
                            <>
                              <span className="text-xs font-bold bg-[#ffeb3b] dark:bg-primary-invert dark:text-black px-2 py-0.5 border-2 border-black dark:border-zinc-100">
                                {formatBytes(img.compressedSize)}
                              </span>
                              <span
                                className={`text-xs font-black px-2 py-0.5 border-2 border-black dark:border-zinc-100 ${
                                  img.compressedSize < img.originalSize
                                    ? "bg-green-400 dark:bg-green-600 text-black dark:text-white"
                                    : "bg-gray-300 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400"
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
                          <RefreshCw className="w-6 h-6 animate-spin text-primary dark:text-primary-invert" />
                        )}
                        {img.status === "completed" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDownload(img)}
                              className="p-2 border-2 border-black dark:border-white bg-[#ffeb3b] dark:bg-primary-invert hover:bg-white dark:hover:bg-amber-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all text-black"
                              title="Download"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                            <CheckCircle2 className="w-6 h-6 text-green-500 dark:text-green-400" />
                          </div>
                        )}
                        {img.status === "error" && (
                          <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400" />
                        )}
                        <button
                          onClick={() => handleRemove(img.id)}
                          className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        >
                          <X className="w-6 h-6" />
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
