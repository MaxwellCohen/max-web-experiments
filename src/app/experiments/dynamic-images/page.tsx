import { type Metadata } from "next";
import dynamic from 'next/dynamic'


const ResizeSection = dynamic(
  () => import("@/components/ResizeSection"),
  { ssr: false }
)

export const metadata: Metadata = {
  title: "Responsive Images",
  description: "fit images into a div regardless of the size of the image",
};

export default function ResizeImage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Dynamic Images</h1>
      <p> Fit images into a div regardless of the size of the image </p>
      <pre>
        {`
      img {
        max-width: 100%;
        max-height: 100%;
        height: auto;
        vertical-align: middle;
        font-style: italic;
        background-repeat: no-repeat;
        background-size: cover;
        shape-margin: 0.75rem;
      }

      .responsive-container {
        display: flex;
        flex: 1 0 auto;
        max-height: 100%;
        max-width: 100%;
        overflow: hidden;
        position: relative;
        align-items: center;
        justify-content: center;
      }`}
      </pre>
      <ResizeSection
        title="Long Image"
        src="https://placehold.co/100x1200.png?text=10x120"
      />
      <ResizeSection
        title="Wide Image"
        src="https://placehold.co/1200x100.png?text=1200x100"
      />
      <ResizeSection
        title="Square Image"
        src="https://placehold.co/1000x1000.png?text=1000x1000"
      />
    </>
  );
}
