"use client"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner"

export function Base64Form() {

   const [encodingString, setEncodingString] = useState("");
   const [decodedString, setDecodedString] = useState("");
   const encode = () => {
     try {
      const str = encodeURIComponent(encodingString);
      console.log(str)
       setDecodedString(btoa(str));
     } catch (e) {
       toast.error('something went wrong try different text' )
     }
   };
   const decode = () => {
     try {
       setEncodingString(decodeURIComponent(atob(decodedString)));
     } catch (e) {
       toast.error('something went wrong try different text')
     }
   };
   return (<div className="grid w-full gap-2">
   <div>
     <label>text to encode</label>
     <Textarea
       onChange={(e) => setEncodingString(e.target.value)}
       value={encodingString}
     />
   </div>
   <div className="flex justify-between w-full">
     <Button type="button" onClick={encode}>
       Encode to base 64
     </Button>
     <Button type="button" onClick={decode}>
       Decode to ANCII Text
     </Button>
   </div>
   <div>
     <label>text to decode</label>
     <Textarea
       onChange={(e) => setDecodedString(e.target.value)}
       value={decodedString}
     />
   </div>
 </div>)
 }