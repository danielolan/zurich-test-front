import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  CheckSquare, 
  User, 
  LogOut, 
  Menu, 
  X,
  Settings,
  Bell
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { clsx } from 'clsx';
import { api } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Navegación principal
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Tareas', href: '/tasks', icon: CheckSquare },
  ];

  // Verificar si una ruta está activa
  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  // Manejar logout
  const handleLogout = async () => {
    try {
      await api.auth.logout();
      showNotification('Sesión cerrada exitosamente', 'success');
      navigate('/login');
    } catch (error) {
      showNotification('Error al cerrar sesión', 'error');
    }
  };

  return (
    <header className="glass-effect border-b border-white/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-900">Zurich Tasks</h1>
              <p className="text-xs text-slate-500">Gestión de tareas</p>
            </div>
          </motion.div>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    'flex items-center gap-2',
                    isActive
                      ? 'text-primary-700 bg-primary-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary-100 rounded-lg -z-10"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Acciones del usuario */}
          <div className="flex items-center gap-3">
            {/* Notificaciones */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                icon={<Bell className="w-4 h-4" />}
                className="relative"
              >
                <Badge
                  variant="error"
                  size="xs"
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center p-0"
                >
                  3
                </Badge>
              </Button>
            </div>

            {/* Perfil de usuario */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-900">Usuario Demo</p>
                  <p className="text-xs text-slate-500">demo@zurich.com</p>
                </div>
              </button>

              {/* Dropdown del perfil */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-strong border border-slate-200 py-1 z-50"
                  >
                    <div className="px-3 py-2 border-b border-slate-200">
                      <p className="text-sm font-medium text-slate-900">Usuario Demo</p>
                      <p className="text-xs text-slate-500">demo@zurich.com</p>
                    </div>
                    
                    <button className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Configuración
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-left text-sm text-error-600 hover:bg-error-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Botón de menú móvil */}
            <Button
              variant="ghost"
              size="sm"
              icon={isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            />
          </div>
        </div>

        {/* Menú móvil */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200 py-4"
            >
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={clsx(
                        'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                        'flex items-center gap-3',
                        isActive
                          ? 'text-primary-700 bg-primary-100'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;