import prisma from '@/app/libs/prismadb';

import getCurrentUser from './getCurrentUser';

const getConversations = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
        return [];
    }

};