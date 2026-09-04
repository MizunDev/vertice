# UX de VÉRTICE

## 1. Flujo principal de navegación

```text
ABRO VÉRTICE

        ↓

"¿Qué está pasando en el fútbol?"

        ↓

PARTIDO MÁS RELEVANTE

        ↓

PARTIDOS EN VIVO

        ↓

PRÓXIMOS PARTIDOS

        ↓

PARTIDOS TERMINADOS / DESCUBRIMIENTO

        ↓

SELECCIONO UN PARTIDO

        ↓

DETALLE DEL PARTIDO

        ↓

JUGADORES / ESTADÍSTICAS / HISTORIAL

        ↓

"Uy, quiero ver este jugador"

        ↓

PERFIL CONTEXTUAL

        ↓

"Uy, quiero ver este otro partido"

        ↓

🐇 MADRIGUERA FUTBOLÍSTICA
```

## 2. Objetivo de la experiencia

VÉRTICE debe responder rápidamente a la pregunta:

> **¿Qué está pasando en el fútbol que me interesa?**

La página inicial no debe intentar mostrar toda la información disponible.

Debe presentar primero aquello que probablemente sea más relevante y permitir que el usuario profundice cuando tenga interés.

La experiencia debe favorecer la exploración natural.

## 3. Principio de progresión

La información debe aparecer por niveles.

### Nivel 1: Descubrimiento

El usuario entra y encuentra rápidamente:

* partido más relevante
* partidos en vivo
* próximos partidos
* partidos terminados
* oportunidades de descubrimiento

### Nivel 2: Contexto

Al seleccionar un partido:

* competición
* equipos
* marcador/estado
* eventos principales
* información básica
* estadísticas destacadas

### Nivel 3: Profundidad

Si el usuario quiere continuar:

* estadísticas completas
* alineaciones
* jugadores
* historial
* rendimiento
* contexto de competición
* información histórica

### Nivel 4: Exploración

El usuario puede saltar entre entidades relacionadas:

```text
PARTIDO
   ↓
JUGADOR
   ↓
EQUIPO
   ↓
OTRO PARTIDO
   ↓
COMPETICIÓN
   ↓
OTRO EQUIPO
```

La profundidad debe estar disponible, pero no debe imponerse al usuario.

## 4. Principio fundamental

> **La interfaz muestra poco. VÉRTICE sabe mucho.**

La cantidad de información disponible no debe determinar la cantidad de información visible simultáneamente.

## 5. Decisiones todavía abiertas

Estas decisiones NO están cerradas:

* estructura visual exacta de la página principal
* diseño de las tarjetas de partidos
* cómo se muestran los partidos en vivo
* modal vs panel lateral vs página para jugadores
* navegación móvil
* sistema de recomendaciones
* cantidad exacta de estadísticas visibles inicialmente
* animaciones y transiciones
* sistema visual definitivo

Estas decisiones deben evaluarse según su impacto en la experiencia de usuario.
