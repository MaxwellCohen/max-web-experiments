import { withLeadingSlash, hasProtocol, joinURL, decode } from 'ufo';
import { write } from 'node:fs'
import { negotiate } from "@fastify/accept-negotiator";
import {
  createIPX,
  ipxFSStorage,
  ipxHttpStorage,
} from "ipx";


const ipx = createIPX({
  storage: ipxFSStorage({
    dir: "./picture"
  }),
  httpStorage: ipxHttpStorage({
    domains: ["utfs.io"]
  }),
});

import { type NextRequest, NextResponse } from "next/server";
function safeString(input: unknown) {
  return JSON.stringify(input).replace(/^"|"$/g, "").replace(/\\+/g, "\\").replace(/\\"/g, '"');
}

class MyError extends Error {
  constructor(
    public statusCode: number,
    public statusText: string,
    public message: string,
  ) {
    super(message)
  }
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


function getModifiersFromString (modifiersString: string) {
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
  return modifiers;

}
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
type ipxOptions = Prettify<Parameters<typeof ipx>[1]>


export async function GET(req: NextRequest) {
  const settings: ResponseInit = { headers: {}}
  const [, path = ''] = req.url.split('api/ipx/')
  const [modifiersString = "", ...idSegments] = path.split("/");
  const id = safeString(decode(idSegments.join("/")));
  const modifiers = getModifiersFromString(modifiersString);
    // Create request
    console.log(id)
    console.log(modifiers)
    const img = ipx(id, modifiers);

    // Get image meta from source
    const sourceMeta = await img.getSourceMeta();
    
    // Process image
    const { data, format } = await img.process();
    const response = new NextResponse(data);
    response.headers.set('vary', "Accept") 
    response.headers.set( "content-type", `image/${format}`) 
  return response;
}



