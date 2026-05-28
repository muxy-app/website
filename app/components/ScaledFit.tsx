"use client";

import { useEffect, useRef, useState } from "react";

// Wraps children rendered at a fixed `naturalWidth` and scales them down
// proportionally to fit the available container width. The reserved
// vertical space shrinks by the same factor so surrounding layout flows
// correctly. Never scales above 1.
export function ScaledFit({
  naturalWidth,
  children,
  className,
}: {
  naturalWidth: number;
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [innerHeight, setInnerHeight] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const recompute = () => {
      const available = container.clientWidth;
      const next = Math.min(1, available / naturalWidth);
      setScale(next);
      setInnerHeight(inner.offsetHeight);
    };

    recompute();

    const ro = new ResizeObserver(recompute);
    ro.observe(container);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [naturalWidth]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: innerHeight != null ? innerHeight * scale : undefined }}
    >
      <div
        ref={innerRef}
        style={{
          width: naturalWidth,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
