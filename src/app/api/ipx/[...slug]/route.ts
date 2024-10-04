// port of the unjs/IPX server for next js source https://github.com/unjs/ipx/blob/main/src/server.ts#L3 

import {  decode } from 'ufo';
import { negotiate } from "@fastify/accept-negotiator";
import {
  createIPX,
  ipxFSStorage,
  ipxHttpStorage,
} from "ipx";
import getEtag from "etag";

const ipx = createIPX({
  storage: ipxFSStorage({
    dir: "./picture"
  }),
  httpStorage: ipxHttpStorage({
    domains: []
  }),
});

import { type NextRequest, NextResponse } from "next/server";
function safeString(input: unknown) {
  return JSON.stringify(input).replace(/^"|"$/g, "").replace(/\\+/g, "\\").replace(/\\"/g, '"');
}

const MODIFIER_SEP = /[&,]/g;
const MODIFIER_VAL_SEP = /[:=_]/;

function autoDetectFormat(acceptHeader: string, animated: boolean) {
  if (animated) {
    const acceptMime = negotiate(acceptHeader, ["image/webp", "image/gif"]);
    return acceptMime?.split("/")[1] ?? "gif";
  }
  const acceptMime = negotiate(acceptHeader, [
    "image/avif",
    "image/webp",
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/heif",
    "image/gif",
  ]);
  return acceptMime?.split("/")[1] ?? "jpeg";
}

function getModifiersFromString(modifiersString: string, acceptHeader: string, headers: Record<string, string>) {
  // Contruct modifiers
  const modifiers: Record<string, string> = Object.create(null) as Record<string, string>;

  // Read modifiers from first segment
  if (modifiersString !== "_") {
    for (const p of modifiersString.split(MODIFIER_SEP)) {
      const [key, ...values] = p.split(MODIFIER_VAL_SEP);
      modifiers[safeString(key)] = values
        .map((v) => safeString(decode(v)))
        .join("_");
    }
  }
  // Auto format
  const mFormat = modifiers.f ?? modifiers.format;
  if (mFormat === "auto") {

    const autoFormat = autoDetectFormat(
      acceptHeader,
      !!(modifiers.a ?? modifiers.animated),
    );
    delete modifiers.f;
    delete modifiers.format;
    if (autoFormat) {
      modifiers.format = autoFormat;
      headers.vary = "Accept";
    }
  }
  return modifiers;
}


export async function GET(req: NextRequest) {
  const settings = { headers: {} as Record<string, string> }
  const [, path = ''] = req.url.split('api/ipx/')
  const [modifiersString = "", ...idSegments] = path.split("/");
  const id = safeString(decode(idSegments.join("/")));

  // Validate
  if (!modifiersString) {
    return new NextResponse(`Modifiers are missing: ${id}`, { status: 400, statusText: `IPX_MISSING_MODIFIERS` });
  }
  if (!id || id === "/") {
    return new NextResponse(`Resource id is missing: ${path}`, { status: 400, statusText: `IPX_MISSING_ID` });
  }
  const modifiers = getModifiersFromString(modifiersString, req.headers.get('accept') ?? '', settings.headers)

  // Create request
  const img = ipx(id, modifiers);

  // Get image meta from source
  const sourceMeta = await img.getSourceMeta();
  // Handle modified time if available
  if (sourceMeta.mtime) {
    // Send Last-Modified header
    settings.headers["last-modified"] = req.headers.get("last-modified") ?? sourceMeta.mtime.toUTCString();

    // Check for last-modified request header
    const _ifModifiedSince = req.headers.get("if-modified-since");
    if (_ifModifiedSince && new Date(_ifModifiedSince) >= sourceMeta.mtime) {
      return new NextResponse(null, { status: 304 })
    }
  }

  // Process image
  const { data, format } = await img.process();
  const response = new NextResponse(data, settings);

  // Send Cache-Control header
  if (typeof sourceMeta.maxAge === "number") {
    response.headers.set("cache-control", req.headers.get("cache-control") ?? `max-age=${+sourceMeta.maxAge}, public, s-maxage=${+sourceMeta.maxAge}`);
  }

  // Generate and send ETag header
  const etag = getEtag(data);
  response.headers.set("etag", req.headers.get("etag") ?? etag);

  // Check for if-none-match request header
  if (etag && req.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304 })
  }


  if (format) {
    response.headers.set("content-type", `image/${format}`);
  }
  response.headers.set("content-security-policy", req.headers.get("content-security-policy") ?? "default-src 'none'");

  return response;
}



