import { Inter } from 'next/font/google';

import ToasterContext from './context/ToasterContext';
import './globals.css';
import AuthContext from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Message Clone',
  description: 'Message Clone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {/**使用AuthContext包裹以全局获得用户登录信息 */}
        <AuthContext>
          {/**引入ToasterContext 作为全局提醒 */}
          <ToasterContext />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
