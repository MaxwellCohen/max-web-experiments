/* eslint-disable @next/next/no-img-element */
"use client";
import { useMemo } from "react";
import { renderSVG } from "uqr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComboBox } from "./comboBox";
import { Checkbox } from "@/components/ui/checkbox";
import { useQueryState, parseAsStringLiteral, parseAsString, parseAsInteger, parseAsNumberLiteral, parseAsBoolean } from 'nuqs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const errorOptions = [
  { value: "L", label: "L - Allows recovery of up to 7% data loss" },
  { value: "M", label: "M - Allows recovery of up to 15% data loss" },
  { value: "Q", label: "Q - Allows recovery of up to 25% data loss" },
  { value: "H", label: "H - Allows recovery of up to 30% data loss" },
];


function svgToBase64(svgString: string ) {
  // Encode the SVG string to base64
  const base64String = btoa(decodeURIComponent(encodeURIComponent(svgString)));

  // Return the base64-encoded string
  return `data:image/svg+xml;base64,${base64String}`;
}

type ErrorCorrecting = "L" | "M" | "Q" | "H"

function range(start: number ,stop: number ,step = 1 ) {
  const arr = [];
  for (let i = start; i <= stop; i += step ) {
    arr.push(i)
  }
  return arr;
} 

const urlOptions = {
  history:'replace',
  shallow: false,
  throttleMs: 1000,
  clearOnDefault: true
}as const;

export const QRForm = () => {
  
  const [url, setUrl] = useQueryState("url", parseAsString.withDefault('').withOptions(urlOptions));
  const [ecc, setEcc] = useQueryState("ecc",
    parseAsStringLiteral<ErrorCorrecting>(["L" , "M" , "Q" , "H"]).withDefault("L").withOptions(urlOptions)
  );

  const maskRange = useMemo(()=> range(-1, 7), [])
  const [maskPattern, setMaskPattern] = useQueryState('mp', parseAsNumberLiteral(maskRange).withDefault(-1).withOptions(urlOptions));
  const [boostEcc, setBoostEcc] = useQueryState('be', parseAsBoolean.withDefault(false).withOptions(urlOptions))
  const versionRange = useMemo(()=> range(1, 40), [])
  const [minVersion, setMinVersion] = useQueryState('min', parseAsNumberLiteral(versionRange).withDefault(1).withOptions(urlOptions));
  const [maxVersion, setMaxVersion] = useQueryState('max', parseAsNumberLiteral(versionRange).withDefault(40).withOptions(urlOptions));
  const [border, setBorder] = useQueryState('b', parseAsInteger.withDefault(1).withOptions(urlOptions));
  const [invert, setInvert] = useQueryState('i', parseAsBoolean.withDefault(false).withOptions(urlOptions));

  const svg = svgToBase64(renderSVG(url, {
    ecc,
    maskPattern,
    boostEcc,
    minVersion:
      minVersion >= 1 &&
      minVersion <= 40 &&
      minVersion <= maxVersion
        ? minVersion
        : 1,
    maxVersion:
      maxVersion >= 1 &&
      maxVersion <= 40 &&
      minVersion <= maxVersion
        ? maxVersion
        : 40,
    border: border >= 0 ? border : 1,
    invert,
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[400px,1fr]">
      <img
        className="w-[400px] max-w-[400px]"
        src={svg}
        alt={`QR code for ${url}`}
      />
      <div className="">
        <div>
          <Label htmlFor="link">Qr Code Link</Label>
          <Input
            type="text"
            id="link"
            placeholder=""
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Additional Options</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <ComboBox
                    value={ecc}
                    type="Error Correcting"
                    items={errorOptions}
                    onChange={(e) => setEcc(e as ErrorCorrecting)}
                  />
                </div>
                <div>
                  <Label htmlFor="maskPattern">
                    Mask pattern -1 is auto or manually set 0-7
                  </Label>
                  <Input
                    type="number"
                    min="-1"
                    max="7"
                    id="link"
                    placeholder=""
                    value={maskPattern}
                    onChange={(e) => setMaskPattern(+e.target.value)}
                  />
                </div>
                <div className="items-top flex space-x-2">
                  <Checkbox
                    id="boostEcc"
                    checked={boostEcc}
                    onCheckedChange={(e) => setBoostEcc(!!e)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="boostEcc"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Boost the error correction level to the maximum allowed by
                      the version and size
                    </label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="minVersion">
                    Minimum version of the QR code (1-40)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max={maxVersion}
                    id="link"
                    placeholder=""
                    value={minVersion}
                    onChange={(e) => setMinVersion(+e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxVersion">
                    Maximum version of the QR code (1-40)
                  </Label>
                  <Input
                    type="number"
                    min={minVersion}
                    max="40"
                    id="link"
                    placeholder=""
                    value={maxVersion}
                    onChange={(e) => setMaxVersion(+e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="border">Border size</Label>
                  <Input
                    type="number"
                    min="0"
                    id="border"
                    placeholder=""
                    value={border}
                    onChange={(e) => setBorder(+e.target.value)}
                  />
                </div>
                <div className="items-top flex space-x-2">
                  <Checkbox
                    id="boostEcc"
                    checked={invert}
                    onCheckedChange={(e) => setInvert(!!e)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="boostEcc"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Invert black and white
                    </label>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
