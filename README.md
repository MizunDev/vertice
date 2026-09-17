# VÉRTICE

Plataforma web de exploración, resultados y estadísticas de fútbol.

> **La interfaz muestra poco. VÉRTICE sabe mucho.**

## 🎯 Qué es VÉRTICE

VÉRTICE nace como un proyecto personal para explorar el fútbol a través de sus datos.

La idea no es simplemente mostrar resultados o llenar una pantalla de estadísticas, sino crear una experiencia en la que el usuario pueda comenzar consultando un partido y terminar descubriendo equipos, jugadores, competiciones, estadísticas e historias relacionadas.

La navegación debe sentirse natural:

```text
PARTIDO
   ↓
EQUIPOS / JUGADORES / ESTADÍSTICAS
   ↓
OTRO PARTIDO
   ↓
OTRO EQUIPO
   ↓
OTRO JUGADOR
   ↓
🐇 MADRIGUERA FUTBOLÍSTICA
```

La información debe aparecer progresivamente según el contexto y el interés del usuario, evitando interfaces saturadas.

## 🧭 Objetivo

Construir una plataforma de información futbolística que sea:

* clara para alguien que apenas empieza a seguir fútbol;
* profunda para quien quiere investigar;
* agradable para navegar;
* basada en datos estructurados y confiables;
* capaz de crecer a medida que el proyecto evoluciona.

VÉRTICE no busca copiar la experiencia de otras plataformas deportivas. Busca construir su propia forma de explorar el fútbol.

## 🏆 Competiciones iniciales

El proyecto comenzará centrado en:

* Liga BetPlay Dimayor
* Torneo BetPlay Dimayor
* Copa BetPlay Dimayor
* CONMEBOL Libertadores
* CONMEBOL Sudamericana

La estructura del proyecto debe permitir incorporar otras competiciones posteriormente.

## 🚧 Estado actual

🟡 **MVP en desarrollo**

Ya incluye un panel de administración en React, una API FastAPI con PostgreSQL,
catálogos de confederaciones, competiciones y equipos, matrículas, partidos y
estadísticas. El acceso del administrador utiliza una contraseña con hash y
una cookie de sesión HttpOnly con caducidad.

Las matrículas y los partidos validan tipo de equipo, país y confederación.
Ambos equipos deben estar matriculados en el torneo. Borrar un partido también
borra sus estadísticas, sin afectar a otros encuentros.

La experiencia pública de exploración, las fechas de los encuentros y la ingesta
de proveedores siguen siendo próximos pasos del producto.

El proyecto se desarrolla progresivamente. Las decisiones técnicas pueden cambiar a medida que aparezcan necesidades reales.

## 🎯 MVP

El primer objetivo funcional de VÉRTICE es permitir:

* consultar partidos;
* consultar partidos pasados, actuales y próximos;
* consultar el resultado y estado de un partido;
* consultar equipos y jugadores;
* consultar alineaciones;
* consultar goles, tarjetas y otros eventos;
* consultar estadísticas disponibles;
* explorar otros partidos relacionados;
* navegar entre competiciones.

El MVP debe comenzar pequeño y crecer a partir de datos y problemas reales, evitando construir infraestructura innecesaria antes de necesitarla.

## 📊 Datos

VÉRTICE debe trabajar con datos estructurados provenientes de fuentes confiables.

La prioridad será utilizar:

1. organizadores oficiales de las competiciones;
2. federaciones y ligas oficiales;
3. proveedores especializados de datos deportivos;
4. otras fuentes cuando aporten información útil y verificable.

Las estadísticas disponibles dependerán de cada competición y de las fuentes utilizadas.

Algunas categorías que VÉRTICE puede manejar incluyen:

* resultados;
* posesión;
* tiros;
* tiros a puerta;
* tiros fuera;
* tiros bloqueados;
* córners;
* faltas;
* fuera de juego;
* tarjetas;
* pases;
* precisión de pases;
* goles;
* asistencias;
* minutos;
* entradas;
* intercepciones;
* despejes;
* atajadas;
* otras métricas disponibles.

Las estadísticas no deben asumirse como universales. Si una fuente no proporciona una métrica de forma fiable, VÉRTICE no debe inventarla.

## 🧠 Modelo de información

VÉRTICE debe construir su propio modelo de información en lugar de depender directamente de la estructura de una única fuente.

Conceptualmente, el dominio incluye elementos como:

```text
Competición
   ↓
Edición
   ↓
Fase
   ↓
Contexto competitivo
   ↓
Partido
   ├── Equipos
   ├── Eventos
   ├── Alineaciones
   └── Estadísticas
```

Las competiciones no necesariamente comparten la misma estructura. Una competición puede utilizar jornadas, grupos, rondas, llaves, partidos de ida y vuelta u otros formatos.

Por esta razón, el modelo debe ser flexible.

## 🔌 Fuentes de datos

La arquitectura de VÉRTICE no debe quedar atada a un único proveedor.

La idea general es:

```text
FUENTES
   ↓
INGESTA
   ↓
NORMALIZACIÓN
   ↓
MODELO VÉRTICE
   ↓
DATOS
   ↓
BACKEND / API
   ↓
FRONTEND
```

Los datos provenientes de diferentes fuentes deben poder transformarse a conceptos comunes dentro de VÉRTICE.

También se debe conservar la identificación de origen cuando sea necesario para poder rastrear de dónde proviene un dato.

## 🧭 Experiencia de navegación

La interfaz debe priorizar:

* jerarquía visual clara;
* información progresiva;
* espacios suficientes;
* pocas acciones principales por pantalla;
* estadísticas agrupadas por contexto;
* navegación sencilla;
* descubrimiento;
* continuidad entre entidades.

El objetivo no es mostrar todo al mismo tiempo.

La interfaz debe permitir que el usuario profundice cuando tenga interés, sin obligarlo a consumir toda la información desde el principio.

### Flujo inicial

```text
ABRO VÉRTICE
      ↓
PARTIDO MÁS RELEVANTE
      ↓
PARTIDOS EN VIVO
      ↓
PRÓXIMOS PARTIDOS
      ↓
PARTIDOS TERMINADOS
      ↓
DESCUBRIMIENTO
```

El diseño visual concreto se definirá durante el desarrollo del frontend y la iteración del producto. Este README describe principios, no una maqueta definitiva.

## 🚫 Lo que VÉRTICE no busca hacer

VÉRTICE no busca:

* mostrar toda la información disponible simultáneamente;
* saturar la interfaz con tarjetas;
* utilizar banners invasivos;
* sacrificar legibilidad por cantidad de estadísticas;
* crear navegación innecesariamente complicada;
* copiar la estructura visual de plataformas deportivas existentes;
* construir infraestructura solamente porque técnicamente sea posible.

## 🌎 Descubrimiento

Una parte importante de VÉRTICE es hacer que información futbolística poco accesible o difícil de encontrar sea más fácil de explorar.

Esto incluye competiciones, partidos, jugadores, equipos e historias que pueden tener poca presencia o poca estructura en otros sitios.

El objetivo es **mejorar la capacidad de descubrimiento**, no fabricar artificialmente interés.

## 🤖 Información para humanos y máquinas

A largo plazo, VÉRTICE aspira a que su información sea útil tanto para personas como para sistemas que necesiten consultar conocimiento futbolístico.

Para ello, los datos deben tender a ser:

* estructurados;
* consistentes;
* contextualizados;
* identificables;
* trazables;
* actualizables.

Esto podría permitir en el futuro APIs públicas, páginas estructuradas, URLs estables, datos para buscadores y otras formas de acceso.

No forma parte del MVP inmediato.

## 🛠️ Tecnologías

La tecnología se irá definiendo según las necesidades reales del proyecto.

Actualmente:

* **Python 3.12, FastAPI y SQLModel** para la API;
* **PostgreSQL 15** para persistencia;
* **React, Vite y Tailwind CSS** para el panel;
* **Docker Compose y NGINX** para ejecutar el conjunto;
* **Pytest, Node Test Runner y GitHub Actions** para las comprobaciones.

## 🚀 Ejecutar VÉRTICE

Necesitas Python 3.12 y Docker con Compose. Desde la raíz del repositorio:

```bash
python -m src.configure
```

El asistente pide tu usuario y contraseña, genera una clave de sesión aleatoria y
guarda `.env` de forma local. La contraseña del administrador se guarda como un
hash PBKDF2-SHA256 con salt individual y 600 000 iteraciones; no se guarda en texto
plano. `.env` está excluido de Git. No existe un usuario con contraseña universal.

**Si ya tienes datos en Docker**, introduce la contraseña actual de PostgreSQL
cuando el asistente la pida. Cambiarla solo en `.env` no cambia la contraseña del
volumen existente. Conserva ese volumen; no necesitas borrarlo para actualizar.
Si ya existe `.env`, el asistente no lo sobrescribe: complétalo usando
[.env.example](.env.example) como referencia. Para generar otro hash sin mostrar
la contraseña, ejecuta `python -c "from getpass import getpass; from src.security import hash_password; print(hash_password(getpass('Contraseña: ')))"`.

```bash
docker compose up --build -d
```

Este comando compila y arranca la base de datos, la API y el frontend. Abre
[http://localhost](http://localhost) e inicia sesión con las credenciales que
elegiste. La documentación de la API está en
[http://localhost/api/docs](http://localhost/api/docs).

NGINX envía `/api/` al backend. Desde otro equipo de tu red puedes abrir la IP del
servidor; el navegador seguirá usando el mismo origen, sin buscar una API en su
propio `localhost`. Solo el frontend escucha públicamente; los puertos directos
de PostgreSQL, pgAdmin y la API se limitan a la máquina anfitriona.

Para detener los servicios conservando los datos:

```bash
docker compose down
```

### Configuración

| Variable | Uso |
| --- | --- |
| `SECRET_KEY` | Clave aleatoria de al menos 32 bytes. Obligatoria; cambiarla invalida las sesiones anteriores. |
| `ADMIN_USERNAME` | Usuario administrador, obligatorio. |
| `ADMIN_PASSWORD_HASH` | Hash generado por el asistente, obligatorio. |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL; conserva la del volumen si ya existía. |
| `COOKIE_SECURE` | `false` para desarrollo HTTP; `true` al servir mediante HTTPS. |
| `CORS_ORIGINS` | Orígenes separados por comas para un frontend servido en otro origen. No requiere `*`. |
| `FRONTEND_PORT` | Puerto del frontend, `80` por defecto. |
| `VITE_API_URL` | Dirección de la API durante la compilación; `/api` por defecto. |

Para publicar detrás de un dominio, termina HTTPS en el servidor y establece
`COOKIE_SECURE=true`. La API se niega a arrancar si faltan los secretos requeridos.
Al actualizar desde la configuración antigua, genera una nueva `SECRET_KEY` y
elige una contraseña nueva para el administrador.

pgAdmin es opcional. Define `PGADMIN_DEFAULT_EMAIL` y
`PGADMIN_DEFAULT_PASSWORD` en `.env` y ejecuta
`docker compose --profile admin up -d pgadmin`. Estará en
[http://localhost:5050](http://localhost:5050).

### Desarrollo del frontend

Con la API de Docker en marcha:

```bash
cd frontend
npm ci
npm run dev
```

Vite reenvía `/api` a la API local. Para otra dirección del backend, define
`API_PROXY_TARGET` en `frontend/.env.local`. Para servir frontend y API en orígenes
distintos, configura `VITE_API_URL`, el origen permitido en `CORS_ORIGINS` y HTTPS.

## 🧪 Comprobar los cambios

Desde la raíz, instala las dependencias y ejecuta las pruebas:

```bash
python -m pip install -r requirements.txt
python -m pytest -q
```

Por defecto usan SQLite en memoria con claves foráneas activadas. Para comprobar
PostgreSQL, define `TEST_DATABASE_URL` apuntando a **una base desechable**: las
pruebas crean y eliminan sus tablas. No usan la base configurada en `DATABASE_URL`.
Cubren acceso, expiración, cookies, matrículas, cambios incompatibles, creación de
partidos, valores inválidos y borrado de estadísticas.

Desde `frontend/`:

```bash
npm ci
npm test
npm run lint
npm run build
```

GitHub Actions ejecuta estas comprobaciones en cada pull request y al actualizar
`main`: API contra PostgreSQL, pruebas y compilación del frontend, y un arranque
Docker completo con login y logout a través de NGINX.

## 📚 Documentación

La documentación detallada del proyecto se encuentra en `docs/`.

Actualmente incluye:

* `docs/vision.md` → visión y propósito del proyecto.
* `docs/ux.md` → principios y flujo de experiencia.
* `docs/data.md` → modelo conceptual y preguntas relacionadas con los datos.

## 🧑‍💻 Proyecto de aprendizaje

VÉRTICE también es un proyecto para aprender programación construyendo algo real.

El objetivo no es copiar código sin entenderlo.

Cada componente debe servir para aprender:

* qué hace;
* por qué existe;
* qué problema resuelve;
* cómo se relaciona con el resto del sistema.

La arquitectura puede cambiar a medida que aprendamos más y descubramos problemas reales.

## 🗺️ Camino del proyecto

```text
VISIÓN
  ↓
MODELO DE INFORMACIÓN
  ↓
FUENTES DE DATOS
  ↓
PRIMEROS DATOS REALES
  ↓
BACKEND
  ↓
FRONTEND
  ↓
ITERACIÓN
  ↓
VÉRTICE CRECE
```

Primero construimos el monstruo.

Después le ponemos la máscara.
