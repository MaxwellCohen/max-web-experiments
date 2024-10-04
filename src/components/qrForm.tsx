"use client";
import { useState } from "react";
import { renderSVG } from "uqr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComboBox } from "./comboBox";
import { Checkbox } from "@/components/ui/checkbox";
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

export const QRForm = () => {
  const [link, setLink] = useState("");
  const [ecc, setEcc] = useState<"L" | "M" | "Q" | "H">("L");
  const [maskPattern, setMaskPattern] = useState<number>(-1);
  const [boostEcc, setBoostEcc] = useState<boolean>(false);
  const [minVersion, setMinVersion] = useState<number>(1);
  const [maxVersion, setMaxVersion] = useState<number>(40);
  const [border, setBorder] = useState<number>(1);
  const [invert, setInvert] = useState<boolean>(false);

  const svg = renderSVG(link, {
    ecc: errorOptions.find((i) => i.value === ecc) ? ecc : "L",
    maskPattern: maskPattern >= -1 && maskPattern <= 7 ? maskPattern : -1,
    boostEcc: !!boostEcc,
    minVersion:
      Number.isFinite(minVersion) &&
      minVersion >= 1 &&
      minVersion <= 40 &&
      minVersion <= maxVersion
        ? minVersion
        : 1,
    maxVersion:
      Number.isFinite(maxVersion) &&
      maxVersion >= 1 &&
      maxVersion <= 40 &&
      minVersion <= maxVersion
        ? maxVersion
        : 40,
    border: border >= 0 ? border : 1,
    invert: !!invert,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[400px,1fr]">
      <div
        className="w-[400px] max-w-[400px]"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className="">
        <div>
          <Label htmlFor="link">Qr Code Link</Label>
          <Input
            type="text"
            id="link"
            placeholder=""
            value={link}
            onChange={(e) => setLink(e.target.value)}
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
                    onChange={(e) => setEcc(e as "L" | "M" | "Q" | "H")}
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
