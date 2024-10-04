"use client"
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner"

export function Base64Form() {

   const [asciiStr, setAsciiStr] = useState("");
   const [base64Str, setBase64Str] = useState("");

  function updateASCIIText (s: string) {
    try {
      setAsciiStr(s)
      const str = encodeURIComponent(s);
       setBase64Str(btoa(str));
     } catch (e) {
       toast.error('something went wrong try different text' )
     }
  } 

   function updateBase64Text(s: string) {
     try {
      setBase64Str(s)
       setAsciiStr(decodeURIComponent(atob(s)));
     } catch (e) {
       toast.error('something went wrong try different text')
     }
   };
   return (<div className="grid w-full gap-2">
   <div>
     <label>ANCII Text
     <Textarea
       onChange={(e) => updateASCIIText(e.target.value)}
       value={asciiStr}
       className="h-96"
     />
     </label>
   </div>
   <div>
     <label>base64 Text
     <Textarea
       onChange={(e) => updateBase64Text(e.target.value)}
       value={base64Str}
       className="h-96"
     />
     </label>
   </div>
 </div>)
 }