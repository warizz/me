"use client";

import { useState, useRef, useEffect, ChangeEvent, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { Upload, Download, Settings2, Image as ImageIcon, RotateCcw, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

export default function WatermarkApp() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  
  // Settings
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [angle, setAngle] = useState(-30);
  const [textColor, setTextColor] = useState("#000000");
  const [textOpacity, setTextOpacity] = useState(0.2);
  const [overlayColor, setOverlayColor] = useState("#ffffff");
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [fontSize, setFontSize] = useState(60);
  const [gapY, setGapY] = useState(150);
  const [gapX, setGapX] = useState(150);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  // Load image when file changes
  useEffect(() => {
    if (originalImage) {
      const url = URL.createObjectURL(originalImage);
      setOriginalImageUrl(url);
      
      const img = new Image();
      img.onload = () => {
        imageElementRef.current = img;
        drawWatermark();
      };
      img.src = url;

      return () => URL.revokeObjectURL(url);
    }
  }, [originalImage]);

  // Redraw when settings change
  useEffect(() => {
    if (imageElementRef.current) {
      drawWatermark();
    }
  }, [watermarkText, angle, textColor, textOpacity, overlayColor, overlayOpacity, fontSize, gapX, gapY]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const compressorOptions = {
        maxSizeMB: 2,
        maxWidthOrHeight: 2048,
        useWebWorker: true,
      };
      setOriginalSize(file.size);
      const compressedFile = await imageCompression(file, compressorOptions);
      setOriginalImage(compressedFile);
    } catch (error) {
      console.error("Error compressing image:", error);
      alert("Failed to compress image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const drawWatermark = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageElementRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw original image
    ctx.drawImage(img, 0, 0);

    // Draw overlay if opacity > 0
    if (overlayOpacity > 0) {
      const overHex = overlayColor.replace('#', '');
      const or = parseInt(overHex.substring(0, 2), 16);
      const og = parseInt(overHex.substring(2, 4), 16);
      const ob = parseInt(overHex.substring(4, 6), 16);
      ctx.fillStyle = `rgba(${or}, ${og}, ${ob}, ${overlayOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Prepare text styling
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
    
    // Hex to RGBA
    const hex = textColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${textOpacity})`;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Rotation angle in radians
    const angleRadians = (angle * Math.PI) / 180;

    // Diagonal length to cover entire image regardless of rotation
    const diagonal = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2));

    // Center of canvas
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.save();
    
    // Move to center, rotate, move back
    ctx.translate(cx, cy);
    ctx.rotate(angleRadians);
    
    // Calculate actual spacing based on text width
    const textMetrics = ctx.measureText(watermarkText);
    const actualGapX = Math.max(textMetrics.width + gapX, 50); // Ensure minimum gap
    
    // Draw text repeatedly
    const startX = -diagonal / 2;
    const endX = diagonal / 2;
    const startY = -diagonal / 2;
    const endY = diagonal / 2;

    for (let y = startY; y < endY; y += gapY) {
      // Offset alternate rows for a staggered look
      const isOffset = Math.abs(Math.round((y - startY) / gapY)) % 2 !== 0;
      const xOffset = isOffset ? actualGapX / 2 : 0;
      
      for (let x = startX - xOffset; x < endX; x += actualGapX) {
        ctx.fillText(watermarkText, x, y);
      }
    }

    ctx.restore();

    // Generate output URL
    setWatermarkedUrl(canvas.toDataURL("image/jpeg", 0.9));
  }, [watermarkText, angle, textColor, textOpacity, overlayColor, overlayOpacity, fontSize, gapX, gapY]);

  const handleDownload = () => {
    if (!watermarkedUrl) return;
    
    const link = document.createElement('a');
    link.href = watermarkedUrl;
    link.download = `watermark-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setOriginalImageUrl(null);
    setOriginalSize(0);
    setWatermarkedUrl(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111] font-mono">
      {/* Header - Retro/Brutalist style */}
      <header className="border-b-4 border-black bg-[#ffeb3b] p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-black uppercase font-serif tracking-widest">
          Watermark Image
        </h1>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Settings Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black mb-6 uppercase flex items-center gap-2 border-b-4 border-black pb-2">
              <Settings2 className="w-6 h-6" strokeWidth={3} /> Settings
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block font-black uppercase mb-1">Watermark Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full border-4 border-black p-3 font-bold bg-white focus:outline-none focus:bg-[#ffeb3b] transition-colors"
                />
              </div>

              <button 
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="w-full mt-4 p-3 border-4 border-black font-black uppercase bg-white text-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex flex-col items-center justify-center focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5" />
                  <span>{showAdvancedSettings ? "Hide Advanced Settings" : "Show Advanced Settings"}</span>
                </div>
              </button>

              {showAdvancedSettings && (
                <div className="space-y-5 pt-2 border-t-4 border-black mt-4">
                  <div>
                    <label className="block font-black uppercase mb-1 flex justify-between">
                      <span>Angle</span>
                      <span>{angle}°</span>
                    </label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="w-full accent-black h-4 cursor-pointer"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block font-black uppercase mb-1 flex justify-between">
                        <span>Text Opacity</span>
                        <span>{Math.round(textOpacity * 100)}%</span>
                      </label>
                      <input
                        type="range"
                        min="0.05"
                        max="1"
                        step="0.05"
                        value={textOpacity}
                        onChange={(e) => setTextOpacity(Number(e.target.value))}
                        className="w-full accent-black h-4 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block font-black uppercase mb-1">Text Color</label>
                      <div className="relative border-4 border-black h-12 cursor-pointer w-full overflow-hidden">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="absolute -top-2 -left-2 w-[150%] h-[150%] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block font-black uppercase mb-1 flex justify-between">
                        <span>Overlay Opacity</span>
                        <span>{Math.round(overlayOpacity * 100)}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={overlayOpacity}
                        onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                        className="w-full accent-black h-4 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block font-black uppercase mb-1">Overlay Color</label>
                      <div className="relative border-4 border-black h-12 cursor-pointer w-full overflow-hidden">
                        <input
                          type="color"
                          value={overlayColor}
                          onChange={(e) => setOverlayColor(e.target.value)}
                          className="absolute -top-2 -left-2 w-[150%] h-[150%] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-black uppercase mb-1">Font Size</label>
                    <input
                      type="number"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full border-4 border-black h-12 px-3 font-bold focus:outline-none focus:bg-[#ffeb3b]"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block font-black uppercase mb-1">X Spacing</label>
                      <input
                        type="number"
                        value={gapX}
                        onChange={(e) => setGapX(Number(e.target.value))}
                        className="w-full border-4 border-black h-12 px-3 font-bold focus:outline-none focus:bg-[#ffeb3b]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block font-black uppercase mb-1">Y Spacing</label>
                      <input
                        type="number"
                        value={gapY}
                        onChange={(e) => setGapY(Number(e.target.value))}
                        className="w-full border-4 border-black h-12 px-3 font-bold focus:outline-none focus:bg-[#ffeb3b]"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-8">
          <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full min-h-[600px] overflow-hidden relative">
            
            {/* Window controls styling (fake) */}
            <div className="border-b-4 border-black bg-gray-100 p-3 flex justify-between items-center">
              <div className="font-bold flex-1 text-center font-mono text-sm tracking-wider uppercase flex items-center justify-center gap-2">
                <ImageIcon className="w-4 h-4" /> Preview
              </div>
            </div>

            {/* Compression Stats Banner */}
            {originalImage && originalSize > 0 && (() => {
              const reductionDec = 1 - (originalImage.size / originalSize);
              const reductionPct = Math.round(reductionDec * 100);
              
              let bgColor = "bg-[#ef4444]"; // Red for low compression
              let textColor = "text-white";
              
              if (reductionDec > 0.5) {
                bgColor = "bg-[#22c55e]"; // Green for high compression
                textColor = "text-black";
              } else if (reductionDec >= 0.2) {
                bgColor = "bg-[#eab308]"; // Yellow for medium compression
                textColor = "text-black";
              }

              return (
                <div className={`${bgColor} border-b-4 border-black p-2 flex justify-between items-center text-xs md:text-sm font-bold ${textColor} uppercase tracking-wider transition-colors`}>
                  <span>{formatBytes(originalSize)} &rarr; {formatBytes(originalImage.size)}</span>
                  <span>-{reductionPct}%</span>
                </div>
              );
            })()}

            <div className="flex-1 bg-[#111] p-4 flex items-center justify-center relative overflow-hidden group">
              
              {!originalImage ? (
                <div className="text-gray-500 font-bold flex flex-col items-center justify-center w-full h-full border-4 border-dashed border-gray-700 hover:border-gray-500 transition-colors relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {isProcessing ? (
                    <RefreshCw className="w-16 h-16 animate-spin mb-4 text-gray-400" />
                  ) : (
                    <Upload className="w-16 h-16 mb-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
                  )}
                  <p className="text-2xl text-center text-gray-400 group-hover:text-gray-300 transition-colors">
                    {isProcessing ? "Compressing Image..." : "Click or drag to upload"}
                  </p>
                  <p className="text-sm text-center font-semibold text-gray-600 mt-2">JPEG, PNG, WebP supported</p>
                </div>
              ) : (
                <>
                  {/* Hidden canvas for actual drawing */}
                  <canvas ref={canvasRef} className="hidden"></canvas>
                  
                  {/* Display the generated data URL */}
                  {watermarkedUrl && (
                    <img 
                      src={watermarkedUrl} 
                      alt="Watermarked Preview" 
                      className="max-w-full max-h-[800px] object-contain border-4 border-white shadow-2xl"
                    />
                  )}

                  {/* Always visible overlay buttons */}
                  <div className="absolute top-0 left-0 flex flex-col md:flex-row items-stretch md:items-start justify-start gap-4 p-4 z-20 pointer-events-none w-full">
                    <button 
                      onClick={handleReset}
                      className="pointer-events-auto font-black text-sm uppercase border-4 border-black px-4 py-3 bg-[#ffeb3b] text-black hover:bg-white flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all md:w-auto w-full"
                    >
                      <RotateCcw className="w-4 h-4 shrink-0" strokeWidth={3} /> Choose Another Image
                    </button>
                    <button 
                      onClick={handleDownload}
                      disabled={!watermarkedUrl}
                      className="pointer-events-auto font-black text-sm uppercase border-4 border-black px-4 py-3 bg-[#8b5cf6] text-white hover:bg-[#7c3aed] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:shadow-[4px_4px_0px_0px_rgba(156,163,175,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:translate-x-0 disabled:translate-y-0 md:w-auto w-full"
                    >
                      <Download className="w-4 h-4 shrink-0" strokeWidth={3} /> Download Result
                    </button>
                  </div>
                </>
              )}
            </div>
            
          </div>
        </div>

      </main>
    </div>
  );
}
