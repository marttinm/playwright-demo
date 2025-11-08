# Playwright Auto Heal Demo - SauceDemo Login Tests

Este proyecto contiene tests automatizados con Playwright para validar la funcionalidad de login del sitio web de prueba **SauceDemo** (https://www.saucedemo.com/).

## 🚀 Configuración inicial

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Instalar navegadores de Playwright:
```bash
npx playwright install
```

## 🧪 Ejecutar tests

### Comandos básicos

```bash
# Ejecutar todos los tests en modo headless
npm test

# Ejecutar tests con interfaz gráfica (headed mode)
npm run test:headed

# Ejecutar tests con UI mode (interfaz interactiva)
npm run test:ui

# Ejecutar tests en modo debug
npm run test:debug

# Mostrar reporte HTML
npm run show-report
```

### Ejecutar tests específicos

```bash
# Ejecutar solo tests de login básico
npx playwright test login.spec.ts

# Ejecutar solo tests con Page Object Model
npx playwright test login-pom.spec.ts

# Ejecutar en un navegador específico
npx playwright test --project=chromium

# Ejecutar con patrones específicos
npx playwright test --grep "should login successfully"
```

## 📁 Estructura del proyecto

```
playwright-auto-heal-demo/
├── tests/
│   ├── pages/
│   │   ├── LoginPage.ts          # Page Object para la página de login
│   │   └── InventoryPage.ts      # Page Object para la página de productos
│   ├── login.spec.ts             # Tests de login básicos
│   └── login-pom.spec.ts         # Tests usando Page Object Model
├── playwright.config.ts          # Configuración de Playwright
├── package.json                  # Dependencias y scripts
└── README.md                     # Este archivo
```

## 🔐 Credenciales de prueba

SauceDemo proporciona las siguientes credenciales de prueba:

### Usuarios válidos:
- **standard_user** / secret_sauce - Usuario estándar
- **problem_user** / secret_sauce - Usuario con problemas en imágenes
- **performance_glitch_user** / secret_sauce - Usuario con problemas de rendimiento

### Usuario bloqueado:
- **locked_out_user** / secret_sauce - Usuario bloqueado

## 🧪 Casos de prueba incluidos

### Tests básicos (`login.spec.ts`):
1. ✅ Verificar elementos del formulario de login
2. ✅ Login exitoso con credenciales válidas
3. ✅ Manejo de credenciales inválidas
4. ✅ Manejo de usuario bloqueado
5. ✅ Validación de campos requeridos (username/password)
6. ✅ Funcionalidad de cerrar mensajes de error
7. ✅ Limpiar formulario después de error

### Tests con Page Object Model (`login-pom.spec.ts`):
1. ✅ Elementos del formulario de login
2. ✅ Login con diferentes tipos de usuarios
3. ✅ Flujo completo login/logout
4. ✅ Manejo de errores y validaciones
5. ✅ Tests con usuarios especiales (problem_user, performance_glitch_user)

## 🛠️ Características de los tests

- **Múltiples navegadores**: Tests en Chrome, Firefox y Safari
- **Page Object Model**: Organización modular y reutilizable
- **Reportes HTML**: Reportes detallados con screenshots y videos
- **Retry automático**: Reintentos en caso de fallos
- **Trazabilidad**: Trace viewer para debugging
- **Configuración flexible**: Fácil personalización de configuraciones

## 📊 Reportes y debugging

Después de ejecutar los tests, puedes:

1. **Ver reportes HTML**:
```bash
npm run show-report
```

2. **Analizar traces** (en caso de fallos):
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

3. **Ver screenshots** y videos en la carpeta `test-results/`

## 🔧 Configuración avanzada

### Modificar configuración de Playwright

Edita `playwright.config.ts` para:
- Cambiar navegadores de prueba
- Ajustar timeouts
- Configurar reportes
- Personalizar screenshots/videos

### Variables de entorno

Puedes usar variables de entorno para diferentes configuraciones:

```bash
# Ejecutar en modo CI
CI=true npm test

# Cambiar número de workers
WORKERS=2 npm test
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas

- Los tests están configurados para ejecutarse contra https://www.saucedemo.com
- Se incluyen screenshots y videos solo en caso de fallos para optimizar espacio
- Los tests son independientes y pueden ejecutarse en paralelo
- Se utiliza retry automático para manejar flakiness de red

## 🐛 Solución de problemas

### Error: "Cannot find module '@playwright/test'"
```bash
npm install
npx playwright install
```

### Tests lentos o timeout
- Aumenta el timeout en `playwright.config.ts`
- Reduce el número de workers
- Verifica conexión a internet

### Problemas con navegadores
```bash
npx playwright install --force
```