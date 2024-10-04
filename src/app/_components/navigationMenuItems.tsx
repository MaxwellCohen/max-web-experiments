import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const experiments = [
  {
    href: "/experiments/dynamic-images",
    title: "Dynamic Images",
    text: "Handle images of all sizes with basic css",
  },
  {
    href: "/experiments/base64",
    title: "Base 64 Encoder / Decoder",
    text: "Encode and decode to base 64",
  },
  {
    href: "/experiments/compression-calc",
    title: "Compression Calculator",
    text: "See the power of compression",
  },
  {
    href: "/experiments/qr",
    title: "QR generator",
    text: "Simple QR generator",
  },
];

export function NavigationMenuItems() {
  return (
    <NavigationMenu className="p-4">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" className="">
            <span className="font-bold">Max Web Experiments</span>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/experiments" className="">
            <NavigationMenuTrigger>Experiments</NavigationMenuTrigger>
          </Link>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              {experiments.map((experiment) => (
                <ListItem
                  key={experiment.href}
                  href={experiment.href}
                  title={experiment.title}
                >
                  {experiment.text}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
