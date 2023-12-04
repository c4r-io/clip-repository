import { Inter } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ['latin'] });
import Sidebar from '@/components/Sidebar.jsx';
import Link from 'next/link'
export const metadata = {
  title: 'Nextjs app',
  description: 'Nextjs app description',
};
export default function RootLayout({ children }) {
  return (
    <div className="bg-gray-700">
      <>
        <Sidebar />
        <div className="p-4 sm:ml-64 bg-gray-700 min-h-screen">
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-600">
            {children}
          </div>
        </div>
      </>
    </div>
  );
}
