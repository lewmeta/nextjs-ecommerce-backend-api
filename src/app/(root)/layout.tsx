import { currentRole, currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function SetupLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await currentUser();

    if (!user) {
        redirect('/auth/login');
    }

    const store = await db.store.findFirst({
        where: {
            userId: user.id
        }
    });

    if (store) {
        if (user?.role === 'ADMIN') {
            redirect(`/${store.id}/admin`);
        } else {
            redirect(`/${store.id}/vendor`);
        }
    }
    // if (store) {
    //     redirect(`/${store.id}`);
    // };

    return (
        <>
            {children}
        </>
    );
};