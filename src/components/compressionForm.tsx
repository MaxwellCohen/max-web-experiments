"use client";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { CompressionComboBox } from "./compressionComboBox";
import { useQuery } from "@tanstack/react-query";

async function getCompressInfo(string: string, encoding: CompressionFormat) {
    const byteArray = new TextEncoder().encode(string);
    const cs = new CompressionStream(encoding);
    const writer = cs.writable.getWriter();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    writer.write(byteArray);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    writer.close();
    const arrayBuffer = await new Response(cs.readable).arrayBuffer();
    const compressedLength = arrayBuffer.byteLength;
    // convert from bytes to bits
    const originalSize = byteArray.buffer.byteLength * 8;
    console.log({ compressedLength, originalSize })
    return { compressedLength, originalSize };
}

const compressionOptions = ["deflate", "deflate-raw", "gzip"];
const isCompressionFormat = (x: string): x is CompressionFormat =>
  compressionOptions.includes(x);

export const CompressionForm = () => {
  const [text, setText] = useState("");
  const [debouncedTextValue, setDebouncedTextValue] = useState("");

  const [compressionFormat, setCompressionFormat] =
    useState<CompressionFormat>("gzip");
  const runCompression = function runCompression(newCompressionFormat: string) {
    if (!newCompressionFormat || !isCompressionFormat(newCompressionFormat)) {
      return;
    }
    setCompressionFormat(newCompressionFormat);
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedTextValue(text);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [text]);
  
  
  const { data } = useQuery({
    queryKey: ["compression", debouncedTextValue, compressionFormat],
    queryFn: () => getCompressInfo(debouncedTextValue, compressionFormat),
  });
  const savings = data?.originalSize
    ? `${Math.floor(100 - ((data?.compressedLength ?? 0) / (data?.originalSize ?? 1)) * 100)}%`
    : "";
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
      {text === debouncedTextValue ? 
        <div className="grid grid-cols-[200px,1fr]">
          <div className="col-span-2"><h2 className="text-xl font-bold col-span-2"> Compression Stats:</h2></div>

          <div className="contents">
            <div><strong>String Length:</strong></div>
             <div className="tabular-nums">{debouncedTextValue.length}</div>
          </div>
          <div className="contents">
            <div> <strong>Original Size:</strong></div>
            <div> <span className="tabular-nums inline-block ">{data?.originalSize.toString().padStart(10, '0') ?? ""}</span> bites</div>
          </div>
          <div className="contents">
            <div><strong>Compressed Size:</strong></div>
            <div><span className="tabular-nums inline-block">{data?.compressedLength.toString().padStart(10, '0') ?? ""}</span> bites</div>
          </div>
          <div className="contents">
            <div><strong>Savings:</strong> </div>
            <div><span className="tabular-nums inline-block">{savings ?? ''}</span></div>
          </div> 
        </div>: ("Calculating...")}
    </div>
  );
};
