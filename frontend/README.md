# El administrador de VÉRTICE

Este frontend es la herramienta interna para organizar el catálogo y registrar encuentros. No es la web que verá quien entre a consultar fútbol.

El inicio sirve para orientarse. Los formularios de creación y edición del catálogo aparecen cuando los necesitas; las matrículas y los partidos tienen sus propios espacios de trabajo.

## Desarrollo

Usa Node 24. Desde esta carpeta:

```bash
npm ci
npm run dev
```

La API debe estar levantada. Vite reenvía las llamadas a `/api` hacia `http://127.0.0.1:8000`, donde Docker publica la API local. Si necesitas otro destino, añade `API_PROXY_TARGET` a `.env.local`.

En Docker, NGINX sirve la aplicación compilada y hace el mismo trabajo de proxy. `VITE_API_URL` cambia la dirección que se incorpora durante la compilación; su valor por defecto es `/api`.

No pongas claves privadas en variables que empiecen por `VITE_`: terminan dentro del JavaScript que recibe el navegador.

## Dónde tocar cada cosa

| Archivo | Responsabilidad |
| --- | --- |
| `src/Dashboard.jsx` | Sesión, navegación, carga de datos y acciones de administración. |
| `src/AdminUI.jsx` | Identidad, iconos, escudos, estados, formularios y tarjetas de partido. |
| `src/admin.css` | Sistema visual, composición y adaptaciones de escritorio y móvil. |
| `src/adminSummary.js` | Resumen calculado a partir de los datos de la API. |
| `src/catalogFilters.js` | Búsqueda y filtros combinados del catálogo. |
| `src/api.js` | Peticiones con cookie de sesión y errores legibles. |
| `public/art/` | Renders decorativos, uno por sección. |
| `e2e/admin.spec.js` | Recorridos reales de administración en Playwright. |

Las tipografías Barlow Condensed y DM Sans están incluidas en `public/fonts/`, con sus licencias. No se descargan de un CDN. Los escudos del catálogo sí pueden ser remotos; si fallan, aparecen las iniciales de la entidad.

## El criterio visual

Una mesa de control de fútbol, con el ritmo de una publicación deportiva: titulares condensados, navegación numerada, divisiones finas, marcadores y fichas de registro. Verde profundo, papel claro y naranja para orientar la acción.

Cada sección tiene un objeto reconocible: el estadio abre el inicio; trofeo y escudos representan el catálogo; las acreditaciones, las matrículas; balón y silbato, los partidos. Son decoración, no datos. Los textos, cifras y controles son HTML accesible.

Las decisiones de interacción están en [docs/ux.md](../docs/ux.md). La procedencia y los prompts de las ilustraciones están en [public/art/README.md](public/art/README.md).

## Antes de subir un cambio

```bash
npm test
npm run lint
npm run build
```

Revisa también el inicio sin datos, un catálogo con nombres largos, los filtros sin resultados y los formularios en móvil. El resumen no debe inventar actividad ni confundir un registro reciente con un partido próximo: todavía no hay fechas de encuentro.

Los diálogos deben poder cerrarse con Escape, conservar etiquetas asociadas y mantener el foco dentro del formulario mientras están abiertos. Los tabs del catálogo admiten flechas, Home y End. La animación respeta `prefers-reduced-motion`.

### Navegador contra el conjunto real

Las pruebas de Playwright escriben datos. Úsalas solo contra un entorno desechable, configurado con el usuario y contraseña de prueba:

```bash
npx playwright install chromium
SMOKE_BASE_URL=http://localhost:18080 \
SMOKE_DISPOSABLE=1 \
SMOKE_USERNAME=smoke \
SMOKE_PASSWORD='contraseña-de-tu-entorno-de-pruebas' \
npm run test:e2e
```

GitHub Actions prepara ese entorno por separado y lo elimina al terminar. No apuntes estos recorridos a tu instancia personal ni a producción.
