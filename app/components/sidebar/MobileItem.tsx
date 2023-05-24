'use client';

import clsx from 'clsx';
import Link from 'next/link';

interface MobileItemProps {
    label: string;
    href: string;
    icon: any;
    onClick?: () => void;
    active?: boolean;
}
const MobileItem: React.FC<MobileItemProps> = ({
    label,
    href,
    icon: Icon,
    onClick,
    active
}) => {
    const handleClick = () => {
        if (onClick) {
            return onClick();
        }
    };
    return (
        <Link
            href={href}
            onClick={handleClick}
            className={clsx(`
             flex
             w-full
             justify-center
             gap-x-3
             p-4
             text-sm
             leading-6
             font-semibold
             text-gray-500
             hover:text-black
             hover:bg-gray-100
        `,
                active && 'bg-gray-100 text-black')
            }
        >
            <Icon className='h-6 w-6' />
            <span className='sr-only'>{label}</span>
        </Link>
    );
};

export default MobileItem;