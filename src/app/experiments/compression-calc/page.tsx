import { type Metadata } from "next";
import { CompressionForm } from "@/components/compressionForm";



export const metadata: Metadata = {
  title: "Base 64 Encoder / Decoder",
  description: "fit images into a div regardless of the size of the image",
};


export default function Base64Page() {

  return (
    <>
      <h1 className="text-2xl font-bold">Compression calculator</h1>
      <p>See the power of compression </p>
      <CompressionForm />
      
    </>
  );
}

