import getCurrentUser from '@/app/action/getCurrentUser';

import DesktopSidebar from './DesktopSidebar';
import MoblieFooter from './MoblieFooter';

async function Sidebar({
    children
}: {
    children: React.ReactNode;
}) {
    //获取当前用户
    const currentUser = await getCurrentUser();

    return (
        <div className='h-full'>
            <DesktopSidebar currentUser={currentUser!!} />
            <MoblieFooter />
            <main className='lg:pl-20 h-full'>
                {children}
            </main>
        </div>
    );
}

export default Sidebar;