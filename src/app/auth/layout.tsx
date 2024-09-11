const AuthLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800"
            style={{ backgroundImage: `url(https://wallpaperaccess.com/full/459877.jpg)` }}
        >
            {children}
        </div>
    );
}

export default AuthLayout;