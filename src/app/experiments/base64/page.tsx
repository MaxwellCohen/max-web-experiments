import { type Metadata } from "next";
import { Base64Form } from "@/components/base64form";



export const metadata: Metadata = {
  title: "Base 64 Encoder / Decoder",
  description: "fit images into a div regardless of the size of the image",
};


export default function Base64Page() {

  return (
    <>
      <h1 className="text-2xl font-bold">Base 64 Encoder / Decoder</h1>
      <p> Encode and decode to base 64 </p>
      <Base64Form />
    </>
  );
}

