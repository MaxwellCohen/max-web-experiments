/* eslint-disable @next/next/no-img-element */
"use client"
import useResizeObserver from '@react-hook/resize-observer'
import {  type RefObject, useLayoutEffect, useRef, useState } from 'react'

const useSize = (target: RefObject<HTMLDivElement>) => {
  const [size, setSize] = useState({
      height: 0,
      width: 0,
      x: 0,
      y: 0,
  })

  useLayoutEffect(() => {
    if (target.current) {
      setSize(target.current.getBoundingClientRect())
    }
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}

export function ResizeSection({ title, src }: { title: string; src: string }) {
  const target = useRef<HTMLDivElement>(null)
  const size = useSize(target)
  return (
    <>
      <h2 className="text-1xl font-bold">{title}</h2>
      <div>Container size {size.width} x {size.height}</div>
      <div ref={target} className="relative flex h-[500px] max-h-full w-[500px] max-w-full flex-grow resize items-center justify-center overflow-hidden border-2 border-solid border-black">
        <img src={src} className="border-2 border-solid border-red-500" alt={title} />
      </div>
    </>
  );
}