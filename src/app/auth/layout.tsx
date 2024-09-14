const AuthLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="h-full flex items-center justify-center w-full"
            style={{ backgroundImage: `url(https://wallpaperaccess.com/full/371625.jpg)`, backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
            {children}
        </div>
    );
}

export default AuthLayout;