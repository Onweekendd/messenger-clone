import getUsers from '../action/getUsers';
import Sidebar from '../components/sidebar/Sidebar';

import ConversationList from './components/ConversationList';


export default async function ConversationLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const users = await getUsers();
    return (
        // @ts-expect-error Server Component
        <Sidebar>
            <div className='h-full'>
                <ConversationList
                    initialiItems={[]}
                />
                {children}
            </div>
        </Sidebar>
    );
}