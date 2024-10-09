"use client"

import { useState } from "react"

import { Check, ChevronsUpDown, PlusCircle, Store } from "lucide-react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useParams, useRouter } from "next/navigation";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useExpandSlice } from "@/hooks/use-expand-slice";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Record<string, any>[]
}

export const StoreSwitcher = ({
  className,
  items = []
}: StoreSwitcherProps) => {
  const storeModal = useStoreModal();
  const { expandSidebar, toggleSidebar } = useExpandSlice();

  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id
  }));

  const currentStore = formattedItems.find((item) => item.value === params.storeId);

  const [open, setOpen] = useState(false);

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}/vendor`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {expandSidebar ? (
          <Button
            variant="ghost"
            size="sm"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a store"
            className={cn("font-semibold text-sm gap-4 flex items-center justify-start", className)}
          >
            <div className="flex items-center gap-1 font-semibold text-sm">
              <Store className="mr-2 h-5 w-5" />
              {currentStore?.label}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        ) : (
          <div className="w-full flex items-center justify-center">
            <button
              role="combobox"
              aria-expanded={open}
              aria-label="Select a store"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <Store className="h-4 w-4" />
              <span className="sr-only">
                {currentStore?.label}
              </span>
            </button>
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent className="max-w-[300px] w-full ml-4">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <Store className="mr-2 h-4 w-4" />
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create a Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
