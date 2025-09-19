# 🎨 Zurich Todo Frontend

Frontend moderno y responsive para la aplicación de gestión de tareas, desarrollado con **React 18**, **TypeScript**, **Tailwind CSS** y **Framer Motion**.

## 📋 Índice

- [🎨 Zurich Todo Frontend](#-zurich-todo-frontend)
  - [📋 Índice](#-índice)
  - [✨ Características Desarrolladas](#-características-desarrolladas)
  - [🏗️ Arquitectura](#️-arquitectura)
  - [📋 Requisitos Previos](#-requisitos-previos)
  - [⚡ Instalación Rápida](#-instalación-rápida)
  - [🔧 Configuración Detallada](#-configuración-detallada)
    - [Variables de Entorno (.env)](#variables-de-entorno-env)
  - [🚀 Ejecución](#-ejecución)
  - [📱 Funcionalidades](#-funcionalidades)
    - [🏠 Dashboard](#-dashboard)
    - [📝 Gestión de Tareas](#-gestión-de-tareas)
    - [🔐 Autenticación](#-autenticación)
  - [🎨 Diseño y UX](#-diseño-y-ux)
  - [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
  - [📁 Estructura del Proyecto](#-estructura-del-proyecto)
  - [🧪 Testing](#-testing)
  - [📚 Componentes Principales](#-componentes-principales)
  - [🔍 Troubleshooting](#-troubleshooting)
  - [📈 Lo Desarrollado Hoy](#-lo-desarrollado-hoy)

## ✨ Características Desarrolladas

- ✅ **Interfaz moderna y responsive** con Tailwind CSS
- ✅ **TypeScript completo** para type safety
- ✅ **Animaciones fluidas** con Framer Motion
- ✅ **Dashboard interactivo** con estadísticas en tiempo real
- ✅ **Gestión completa de tareas** (CRUD + filtros)
- ✅ **Múltiples vistas** (Grid, Lista, Kanban)
- ✅ **Sistema de notificaciones** toast integrado
- ✅ **Hooks personalizados** para gestión de estado
- ✅ **Routing completo** con React Router
- ✅ **Formularios avanzados** con validación en tiempo real
- ✅ **Responsive design** optimizado para móviles
- ✅ **Autenticación mock** lista para integración

## 🏗️ Arquitectura

```
📁 frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # Componentes base reutilizables
│   │   ├── layout/       # Header, Layout, Navigation
│   │   └── tasks/        # Componentes específicos de tareas
│   ├── pages/           # Páginas principales (Dashboard, Tasks, Login)
│   ├── hooks/           # Custom hooks (useTasks, useNotification)
│   ├── services/        # API clients y servicios
│   ├── types/           # Definiciones TypeScript
│   ├── context/         # React Context providers
│   └── styles/          # Estilos globales y configuración
```

## 📋 Requisitos Previos

- **Node.js** >= 16.0.0
- **npm** o **yarn**
- **Backend ejecutándose** en http://localhost:3001

## ⚡ Instalación Rápida

```bash
# 1. Navegar al directorio frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# (Opcional: ajustar configuración)

# 4. Iniciar en modo desarrollo
npm start

# La aplicación se abrirá en http://localhost:3000
```

## 🔧 Configuración Detallada

### Variables de Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto frontend:

```env
# ==============================================
# 🌐 CONFIGURACIÓN DE LA API
# ==============================================
REACT_APP_API_URL=http://localhost:3001/api

# ==============================================
# ⚡ CONFIGURACIÓN DE BUILD
# ==============================================
GENERATE_SOURCEMAP=false
REACT_APP_VERSION=1.0.0

# ==============================================
# 🎨 CONFIGURACIÓN DE TEMA (Futuro)
# ==============================================
REACT_APP_THEME=light
REACT_APP_PRIMARY_COLOR=blue

# ==============================================
# 🔧 CONFIGURACIÓN DE DESARROLLO
# ==============================================
FAST_REFRESH=true
ESLINT_NO_DEV_ERRORS=true
```

## 🚀 Ejecución

```bash
# Desarrollo (con hot reload)
npm start

# Build para producción
npm run build

# Preview del build
npm run serve

# Linting
npm run lint

# Formateo de código
npm run format

# Type checking
npm run type-check
```

## 📱 Funcionalidades

### 🏠 Dashboard

**URL**: `http://localhost:3000/dashboard`

- 📊 **Estadísticas visuales** de productividad
- 📈 **Progreso diario** con barra animada
- ⚠️ **Tareas urgentes** destacadas
- 📅 **Próximos vencimientos** ordenados
- 🎯 **Métricas rápidas** de actividad
- 🚀 **Call-to-action** para nueva tarea

### 📝 Gestión de Tareas

**URL**: `http://localhost:3000/tasks`

#### **Características principales:**
- 📝 **CRUD completo**: Crear, leer, actualizar, eliminar
- 🔍 **Búsqueda en tiempo real** por título y descripción
- 🎯 **Filtros avanzados**: estado, prioridad, fecha
- 📊 **Múltiples vistas**: Grid, Lista, Kanban
- 📄 **Paginación** con metadata completa
- 📈 **Ordenamiento** por cualquier campo
- ⚡ **Toggle rápido** de estado con un click
- 🎨 **Estados visuales**: vencidas, próximas, completadas

#### **Formulario de tareas:**
- ✅ **Validación en tiempo real** con react-hook-form
- 👀 **Vista previa** de la tarea mientras escribes
- 🎨 **Selección visual** de prioridad y estado
- 📅 **Selector de fecha** con validación
- 💾 **Auto-guardado** de borradores (futuro)

### 🔐 Autenticación

**URL**: `http://localhost:3000/login`

- 🎮 **Demo login** configurado
- 🔒 **Rutas protegidas** con redirección
- 👤 **Gestión de sesión** con localStorage
- 🎨 **Interfaz atractiva** con glassmorphism
- 📱 **Responsive** para móviles

**Credenciales demo:**
- **Email**: `demo@zurich.com`
- **Password**: `demo123`

## 🎨 Diseño y UX

### **Paleta de colores:**
- **Primary**: Azul moderno (#3B82F6)
- **Success**: Verde (#22C55E)
- **Warning**: Amarillo (#F59E0B)
- **Error**: Rojo (#EF4444)
- **Secondary**: Grises elegantes

### **Características de diseño:**
- 🌈 **Gradientes suaves** en fondos
- 💫 **Glassmorphism** en componentes
- ✨ **Animaciones fluidas** con Framer Motion
- 📱 **Mobile-first** responsive design
- 🎯 **Microinteracciones** para feedback
- 🌙 **Preparado para modo oscuro**

### **Animaciones:**
- 🔄 **Transiciones** entre páginas
- 📤 **Slide in/out** de modales
- 🎪 **Stagger animations** en listas
- 💫 **Hover effects** sutiles
- ⚡ **Loading states** elegantes

## 🛠️ Tecnologías Utilizadas

### **Core:**
- ⚛️ **React 18** - Framework principal
- 📘 **TypeScript** - Type safety completo
- 🎨 **Tailwind CSS** - Styling utility-first
- 🛣️ **React Router** - Routing SPA

### **Estado y datos:**
- 🎣 **Custom Hooks** - Gestión de estado
- 📡 **Axios** - Cliente HTTP
- 🔄 **React Hook Form** - Formularios
- 🍞 **React Hot Toast** - Notificaciones

### **Animaciones y UX:**
- 💫 **Framer Motion** - Animaciones fluidas
- 🎭 **Lucide React** - Iconos modernos
- 🎨 **Clsx** - Utility classes dinámicas
- 📅 **Date-fns** - Manejo de fechas

### **Desarrollo:**
- 🔧 **Create React App** - Tooling
- 💅 **Prettier** - Formateo de código
- 🔍 **ESLint** - Linting TypeScript
- 🏗️ **PostCSS** - Procesamiento CSS

## 📁 Estructura del Proyecto

```
frontend/
├── 📁 public/
│   ├── 📄 index.html                 # HTML base
│   └── 📄 favicon.ico                # Icono de la app
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 ui/                    # Componentes base
│   │   │   ├── 📄 Button.tsx         # Botón reutilizable
│   │   │   ├── 📄 Input.tsx          # Input con validación
│   │   │   ├── 📄 Modal.tsx          # Modal con animaciones
│   │   │   ├── 📄 Badge.tsx          # Badges de estado
│   │   │   └── 📄 LoadingSpinner.tsx # Spinners de carga
│   │   ├── 📁 layout/                # Layout y navegación
│   │   │   ├── 📄 Layout.tsx         # Layout principal
│   │   │   ├── 📄 Header.tsx         # Header con navegación
│   │   │   └── 📄 NotificationContainer.tsx # Toasts
│   │   └── 📁 tasks/                 # Componentes de tareas
│   │       ├── 📄 TaskCard.tsx       # Card individual de tarea
│   │       ├── 📄 TaskForm.tsx       # Formulario crear/editar
│   │       ├── 📄 TaskList.tsx       # Lista con filtros
│   │       └── 📄 TaskStats.tsx      # Estadísticas visuales
│   ├── 📁 pages/                     # Páginas principales
│   │   ├── 📄 Dashboard.tsx          # Dashboard con métricas
│   │   ├── 📄 Tasks.tsx              # Gestión de tareas
│   │   ├── 📄 Login.tsx              # Autenticación
│   │   └── 📄 NotFound.tsx           # Página 404
│   ├── 📁 hooks/                     # Custom hooks
│   │   ├── 📄 useTasks.ts            # Hook para gestión de tareas
│   │   └── 📄 useNotification.ts     # Hook para notificaciones
│   ├──