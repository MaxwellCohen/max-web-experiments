import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function ComboBox(props:
  {
   value: string,
   onChange: (arg: string) => void,
   type:string
   items:   {
     value:string;
     label:string;
   }[]
   }) {
 const [open, setOpen] = React.useState(false)
 return (
   <Popover open={open} onOpenChange={setOpen}>
     <PopoverTrigger asChild>
       <Button
         variant="outline"
         role="combobox"
         aria-expanded={open}
         className="min-w-[200px] justify-between"
       >
         {props.value
           ? props.items.find((item) => item.value === props.value)?.label
           :`Set a ${props.type}`}
         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
       </Button>
     </PopoverTrigger>
     <PopoverContent className="min-w-[200px] p-0">
       <Command>
         <CommandInput placeholder={`Search ${props.type.toLocaleLowerCase()}...`} />
         <CommandList>
           <CommandEmpty>No {props.type.toLocaleLowerCase()} found.</CommandEmpty>
           <CommandGroup>
             {props.items.map((item) => (
               <CommandItem
                 key={item.value}
                 value={item.value}
                 onSelect={(currentValue) => {
                   props.onChange(currentValue === props.value ? "" : currentValue)
                   setOpen(false)
                 }}
               >
                 <Check
                   className={cn(
                     "mr-2 h-4 w-4",
                     props.value === item.value ? "opacity-100" : "opacity-0"
                   )}
                 />
                 {item.label}
               </CommandItem>
             ))}
           </CommandGroup>
         </CommandList>
       </Command>
     </PopoverContent>
   </Popover>
 )
}