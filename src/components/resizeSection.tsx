"use client";
/* eslint-disable @next/next/no-img-element */
import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const useSize = (target: RefObject<HTMLDivElement>) => {
  const [size, setSize] = useState({
    height: 0,
    width: 0,
  });

  useLayoutEffect(() => {
    if (target.current) {
      const { height, width } = target.current.getBoundingClientRect();
      setSize({ height, width });
    }
  }, [target]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!target.current) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(target.current);

    // Cleanup function
    return () => {
      observer?.disconnect?.();
    };
  }, [target]);

  // Where the magic happens
  return size;
};

export default function ResizeSection({
  title,
  src,
}: {
  title: string;
  src: string;
}) {
  const target = useRef<HTMLDivElement>(null);
  const size = useSize(target);
  return (
    <>
      <h2 className="text-1xl font-bold">{title}</h2>
      <div>
        Container size {size.width} x {size.height}
      </div>
      <div
        ref={target}
        className="relative flex h-[500px] max-h-full w-[500px] max-w-full flex-grow resize items-center justify-center overflow-hidden border-2 border-solid border-black"
      >
        <img
          src={src}
          className="border-2 border-solid border-red-500"
          alt={title}
        />
      </div>
    </>
  );
}
