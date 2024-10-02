"use client";

import Link from "next/link";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 align-baseline text-xl font-semibold">
      <Link href={"/"}> Max Web Experiments</Link>
    </nav>
  );
}
