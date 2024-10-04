"use client";

import * as React from "react";
import { ComboBox } from "./comboBox";

const compressions = [
  {
    value: "deflate",
    label: "deflate",
  },
  {
    value: "deflate-raw",
    label: "Deflate Raw",
  },
  {
    value: "gzip",
    label: "gzip",
  },
];

export function CompressionComboBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (arg: string) => void;
}) {
  return (
    <div className="w-[200px]">
      <ComboBox
        value={value}
        type="Compression Format"
        items={compressions}
        onChange={onChange}
      />
    </div>
  );
}
