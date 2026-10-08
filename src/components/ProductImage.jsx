"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductImage({
  src,
  alt = "পণ্য",
  icon = "🛒",
  className = "",
}) {
  const [hasError, setHasError] = useState(false);

  const showImage = src && !hasError;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-[#f1f3f0] ${className}`}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-contain p-4"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="text-5xl" aria-hidden="true">
          {icon}
        </span>
      )}
    </div>
  );
}