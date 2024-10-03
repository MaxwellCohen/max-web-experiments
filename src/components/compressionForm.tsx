"use client";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { CompressionComboBox } from "./compressionComboBox";
import { useQuery } from "@tanstack/react-query";


async function getCompressInfo(string: string, encoding: CompressionFormat) {
  console.log("hi");
  try {
    const byteArray = new TextEncoder().encode(string);
    const cs = new CompressionStream(encoding);
    const writer = cs.writable.getWriter();
    console.log("hi1");
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    writer.write(byteArray);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    writer.close();
    const arrayBuffer = await new Response(cs.readable).arrayBuffer();
    console.log({ arrayBuffer, byteArray });
    const compressedLength = arrayBuffer.byteLength;
    // convert from bytes to bits
    const originalSize = byteArray.buffer.byteLength * 8;

    return { compressedLength, originalSize };
  } catch (e) {
    console.log(e);
  }
}

const compressionOptions = ["deflate", "deflate-raw", "gzip"];
const isCompressionFormat = (x: string): x is CompressionFormat =>
  compressionOptions.includes(x);

export const CompressionForm = () => {
  const [text, setText] = useState("");
  const [compressionFormat, setCompressionFormat] =
    useState<CompressionFormat>("gzip");
  function runCompression(newCompressionFormat: string) {
    if (!newCompressionFormat || !isCompressionFormat(newCompressionFormat)) {
      return;
    }

    setCompressionFormat(newCompressionFormat);
  }

  const { data, isLoading } = useQuery({
    queryKey: ["compression", text, compressionFormat],
    queryFn: () => getCompressInfo(text, compressionFormat),
  });
  const savings = data?.originalSize
    ? `${Math.floor(100 - ((data?.compressedLength ?? 0) / (data?.originalSize ?? 1)) * 100)}%`
    : "unknown";
  return (
    <div className="grid grid-cols-1 gap-4 pt-4">
      <label className="grid grid-cols-1 gap-0">
        Select Compression Format:
        <CompressionComboBox
          value={compressionFormat}
          onChange={runCompression}
        />
      </label>
      <label>
        Text to Compress:
        <Textarea
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="h-60"
        />
      </label>

      {isLoading ? (
        "calculating"
      ) : (
        <div>
          <h2 className="text-xl font-bold"> Compression Stats:</h2>
          <p>
            <strong>String Length:</strong> {text.length}
          </p>
          <p>
            <strong>Original Size:</strong> {data?.originalSize ?? "unknown"}{" "}
            bites
          </p>
          <p>
            <strong>Compressed Size:</strong>{" "}
            {data?.compressedLength ?? "unknown"} bites
          </p>
          <p>
            <strong>Savings:</strong> {savings}
          </p>
        </div>
      )}
    </div>
  );
};
