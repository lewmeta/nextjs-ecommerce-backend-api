
import { UserButton } from "@/components/auth/user-button";
import { LayoutComponent } from "@/components/layout-component";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Home() {
  // const user = useCurrentUser();

  return (
    <LayoutComponent>
      <div >
        {/* somthing */}
        {/* {user?.name} */}
        <UserButton />
      </div>
    </LayoutComponent>
  );
}
