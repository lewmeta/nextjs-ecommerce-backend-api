import { ComponentType, SVGProps } from "react";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface Route {
    href: string;
    label: string;
    icon: IconType;
    active: boolean;
}

interface LayoutComponentProps {
    title: string;
    description?: string;
    routes?: Route[];
}

export const Heading = ({
    title,
    description,
    routes
}: LayoutComponentProps) => {
    return (
        <div className="bg-background  flex items-center justify-between p-[20px] py-2">
            <div className="">
                <h2 className="text-3xl font-bold tracking-tight mt-0">{title}</h2>
                {/* <p className="text-sm text-muted-foreground mt-4">{description}</p> */}
            </div>
            {/* <div className="flex items-center gap-2">
                {routes?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 border rounded-lg p-1 px-3 text-sm">
                        {item.icon && <item.icon />}
                        {item.label}
                    </div>
                ))}
            </div> */}
        </div>
    )
}
