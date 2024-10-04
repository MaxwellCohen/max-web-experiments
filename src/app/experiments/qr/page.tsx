import { type Metadata } from "next";
import { QRForm } from "@/components/qrForm";



export const metadata: Metadata = {
  title: "Base 64 Encoder / Decoder",
  description: "fit images into a div regardless of the size of the image",
};


export default function Base64Page() {

  return (
    <>
      <h1 className="text-2xl font-bold">QR generator</h1>
      <p>Qr Generator powered by UnJS&apos;s <a href="https://github.com/unjs/uqr">uqr</a></p>
      <QRForm />
    </>
  );
}

