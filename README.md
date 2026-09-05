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

🟡 **Construcción inicial**

Actualmente estamos:

* aprendiendo Python mediante la construcción del proyecto;
* definiendo el modelo conceptual de la información;
* investigando las fuentes de datos;
* construyendo los primeros componentes de programación;
* utilizando Git y GitHub para mantener el proyecto versionado y portable.

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

* **Python** para el aprendizaje y desarrollo inicial;
* **Git** para control de versiones;
* **GitHub** para almacenamiento y colaboración del proyecto.

Otras tecnologías se incorporarán cuando resuelvan un problema concreto.

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
