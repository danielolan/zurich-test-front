import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animación 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="mb-8"
        >
          <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600 mb-4">
            404
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              ¡Oops! Página no encontrada
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              La página que buscas no existe o ha sido movida. 
              No te preocupes, te ayudamos a encontrar lo que necesitas.
            </p>
          </motion.div>
        </motion.div>

        {/* Ilustración */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="relative">
            <div className="text-8xl mb-4">🕵️‍♂️</div>
            <div className="absolute -top-2 -right-2 text-3xl">🔍</div>
          </div>
          <p className="text-sm text-slate-500">
            Nuestro detective de páginas está en el caso...
          </p>
        </motion.div>

        {/* Acciones */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button
                variant="primary"
                size="lg"
                icon={<Home className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                Ir al Dashboard
              </Button>
            </Link>
            
            <Button
              variant="secondary"
              size="lg"
              icon={<ArrowLeft className="w-5 h-5" />}
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              Volver Atrás
            </Button>
          </div>

          {/* Enlaces útiles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Enlaces útiles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Link to="/dashboard" className="group">
                <div className="p-4 bg-white rounded-lg border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all duration-200">
                  <Home className="w-6 h-6 text-primary-500 mb-2 mx-auto" />
                  <h4 className="font-medium text-slate-900 group-hover:text-primary-600">
                    Dashboard
                  </h4>
                  <p className="text-sm text-slate-500">
                    Vista general de tus tareas
                  </p>
                </div>
              </Link>

              <Link to="/tasks" className="group">
                <div className="p-4 bg-white rounded-lg border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all duration-200">
                  <Search className="w-6 h-6 text-primary-500 mb-2 mx-auto" />
                  <h4 className="font-medium text-slate-900 group-hover:text-primary-600">
                    Tareas
                  </h4>
                  <p className="text-sm text-slate-500">
                    Gestiona todas tus tareas
                  </p>
                </div>
              </Link>

              <div className="group cursor-pointer">
                <div className="p-4 bg-white rounded-lg border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all duration-200">
                  <div className="w-6 h-6 text-primary-500 mb-2 mx-auto flex items-center justify-center">
                    💡
                  </div>
                  <h4 className="font-medium text-slate-900 group-hover:text-primary-600">
                    Ayuda
                  </h4>
                  <p className="text-sm text-slate-500">
                    Soporte y documentación
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer divertido */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-slate-400">
            Error 404: Esta página está tan perdida como tus llaves el lunes por la mañana 🗝️
          </p>
        </motion.div>
      </div>

      {/* Elementos decorativos */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default NotFound;