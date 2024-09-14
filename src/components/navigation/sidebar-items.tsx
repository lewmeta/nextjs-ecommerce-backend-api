interface SidebarItemsProps {
    icon: unknown;
    lablel: string;
    active: boolean;
    href: string;
}

export const SidebarItems = ({
    icon: Icon,
    lablel,
    href,
    active
}: SidebarItemsProps) => {
    return (
        <div>SidebarItems</div>
    )
}
