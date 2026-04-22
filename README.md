# AI Sales Supernova Chat

Sistema de chat inteligente para consultas de ventas, productos y clientes, potenciado por IA y RAG (Retrieval-Augmented Generation).

## 🚀 Características

- 💬 Chat en tiempo real con IA especializada en ventas
- 📊 Consultas sobre productos, clientes y métricas de ventas
- 🔒 Protección contra inyección de prompts y contenido inapropiado
- 💾 Historial de conversaciones persistente
- 🎨 Interfaz moderna y responsiva con Quasar Framework

## 📋 Requisitos Previos

- Node.js (v22.12 o superior)
- npm (>= 6.13.4) o yarn (>= 1.21.1) o pnpm (>= 10.0.0)
- Cuenta de OpenAI con API Key

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/jguardia19/ai-sales-supernova-chatbot.git
cd ai-sales-supernova-chatbot
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn
# o
pnpm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```bash
OPENAI_API_KEY=tu-api-key-de-openai-aqui
```

⚠️ **IMPORTANTE:** Nunca subas tu API key al repositorio. El archivo `.env` está incluido en `.gitignore`.

## 🏃 Ejecutar el Proyecto

### Modo Desarrollo
```bash
npm run dev
# o
quasar dev
```

La aplicación se abrirá automáticamente en `http://localhost:9000`

### Build para Producción
```bash
npm run build
# o
quasar build
```

## 🛠️ Tecnologías Utilizadas

- **Vue 3** - Framework JavaScript progresivo
- **Quasar Framework** - Framework de componentes UI
- **TypeScript** - Tipado estático
- **Pinia** - State management
- **OpenAI API** - Modelo de lenguaje GPT
- **Axios** - Cliente HTTP
- **Vite** - Build tool

## 📁 Estructura del Proyecto

```
src/
├── assets/          # Imágenes y recursos estáticos
├── boot/            # Archivos de inicialización (axios)
├── components/      # Componentes reutilizables
├── css/             # Estilos globales
├── layouts/         # Layouts de la aplicación
├── pages/           # Páginas/Vistas
│   ├── HomePage.vue     # Página principal
│   ├── ChatPage.vue     # Interfaz de chat
│   └── LoginPage.vue    # Página de login
├── router/          # Configuración de rutas
├── stores/          # Stores de Pinia
│   ├── chat-store.ts    # Gestión de conversaciones
│   └── user-store.ts    # Datos del usuario
└── services/        # Servicios (OpenAI, API)
```

## 🔐 Seguridad

El sistema incluye protecciones contra:
- Inyección de prompts
- Lenguaje inapropiado
- Consultas fuera del dominio de negocio

## 📝 Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Build para producción
npm run lint         # Ejecuta el linter
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👤 Autor

**Jose Guardia**
- Email: jguardia19@gmail.com

## 📄 Licencia

Este proyecto es privado y de uso interno.

## 🐛 Reportar Problemas

Si encuentras algún bug o tienes sugerencias, por favor abre un issue en el repositorio.

