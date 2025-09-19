import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import NotificationContainer from './NotificationContainer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {children}
      </motion.main>

      {/* Notification container */}
      <NotificationContainer />
    </div>
  );
};

export default Layout;