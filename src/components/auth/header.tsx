import { Poppins } from "next/font/google"

import { cn } from "@/lib/utils";
import { BoltIcon } from "../icons/bolt-icon";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
});

interface HeaderProps {
    label: string;
}

export const Header = ({
    label
}: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <BoltIcon className="text-blue-500" />
            </div>
            <p className={cn("text-3xl font-semibold", font.className)}>
                {label}
            </p>
        </div>
    )
}
