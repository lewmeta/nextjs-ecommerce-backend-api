const AuthLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="h-full flex items-center justify-center bg-center bg-no-repeat"
            style={{ backgroundImage: `url(https://wallpaperaccess.com/full/459877.jpg)` }}
        >
            {children}
        </div>
    );
}

export default AuthLayout;