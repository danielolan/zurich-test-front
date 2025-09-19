import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useNotification } from '../hooks/useNotification';
import { api } from '../services/api';
import type { LoginCredentials } from '../types';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: 'demo@zurich.com',
      password: 'demo123',
    },
  });

  const handleLogin = async (data: LoginCredentials) => {
    setLoading(true);
    try {
      await api.auth.login(data);
      showNotification('¡Bienvenido! Inicio de sesión exitoso', 'success');
      navigate('/dashboard');
    } catch (error) {
      showNotification('Error al iniciar sesión. Verifica tus credenciales.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Lado izquierdo - Información */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Bienvenido a
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">
                {' '}Zurich Tasks
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              La plataforma de gestión de tareas más intuitiva y poderosa. 
              Organiza tu trabajo, aumenta tu productividad y alcanza tus objetivos.
            </p>

            {/* Características destacadas */}
            <div className="space-y-4">
              {[
                { icon: '⚡', title: 'Súper rápido', desc: 'Interfaz fluida y responsiva' },
                { icon: '🎯', title: 'Enfoque claro', desc: 'Prioriza lo que realmente importa' },
                { icon: '📊', title: 'Análisis visual', desc: 'Seguimiento de tu progreso en tiempo real' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-soft">
                    <span className="text-xl">{feature.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                    <p className="text-slate-600 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Lado derecho - Formulario de login */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="glass-effect rounded-2xl p-8 shadow-strong border border-white/20">
            {/* Header del formulario */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-slate-600">
                Accede a tu panel de control
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
              {/* Email */}
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="demo@zurich.com"
                icon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                {...register('email', {
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Correo electrónico inválido',
                  },
                })}
              />

              {/* Password */}
              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres',
                    },
                  })}
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Botón de submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={!isValid || loading}
                icon={<LogIn className="w-5 h-5" />}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Demo info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <span>🎮</span>
                Demo de la aplicación
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Email:</strong> demo@zurich.com</p>
                <p><strong>Contraseña:</strong> demo123</p>
                <p className="text-xs text-blue-600 mt-2">
                  * Este es un login simulado para la demostración
                </p>
              </div>
            </motion.div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                ¿Problemas para acceder?{' '}
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  Contacta soporte
                </button>
              </p>
            </div>
          </div>

          {/* Información adicional en móvil */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="lg:hidden mt-8 text-center"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Zurich Tasks
            </h3>
            <p className="text-slate-600 text-sm">
              Gestiona tus tareas de manera eficiente y profesional
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/20 to-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Login;