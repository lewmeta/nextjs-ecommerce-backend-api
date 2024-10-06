'use client'

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { useState } from "react"

export const SearchInput = () => {
    const [value, setValue] = useState('');

    return (
        <div className="relative">
            <Search className="h-4 w-4 top-2.5 absolute left-3 " />
            <Input
                onChange={(e) => setValue(e.target.value)}
                value={value}
                className="w-full md:w-[300px] pl-9 rounded-full"
                placeholder="Search for inventory"
            />
        </div>
    )
}
