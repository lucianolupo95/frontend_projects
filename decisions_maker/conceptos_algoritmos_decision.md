# Algoritmos de decisión y diseño de flujos comparativos

---

## 1. Idea central

Elegir entre múltiples opciones es un problema universal: desde decidir qué película ver hasta seleccionar una arquitectura de software. Cuando las opciones superan las 4-5, el cerebro humano colapsa en "parálisis de análisis".

Este problema aparece constantemente en diseño de sistemas: filtros de búsqueda, recomendadores, wizards de configuración, y cualquier flujo donde el usuario debe converger hacia una decisión.

El enfoque explorado es **reducir decisiones complejas a secuencias de decisiones binarias**. En lugar de pedir "elige 1 de 20", presentar pares sucesivos hasta que emerja un ganador. Esto aprovecha la capacidad natural del cerebro para comparaciones directas (A vs B) mientras evita la sobrecarga de evaluar múltiples opciones simultáneamente.

La clave está en elegir el algoritmo correcto según el objetivo: ¿necesitas solo el ganador o un ranking completo? ¿Priorizas velocidad o justicia estadística?

---

## 2. Algoritmos de decisión

### Single-Elimination Tournament (Eliminación Directa)

```
Estructura: Bracket de eliminación (como Copa del Mundo)
Comparaciones: n - 1 (para n opciones)
Resultado: UN ganador definitivo
```

**Funcionamiento:**
- Las opciones se emparejan aleatoriamente
- El perdedor de cada match queda eliminado
- Los ganadores avanzan hasta que queda uno

**Ventajas:**
- Mínimo número de comparaciones posible para obtener un ganador
- Cada decisión es binaria (baja carga cognitiva)
- Progreso visible y predecible
- Fácil de implementar y visualizar

**Desventajas:**
- No genera ranking (el segundo lugar podría haber perdido con el campeón en ronda 1)
- Sensible a la aleatorización inicial (emparejamientos "injustos")
- Una mala decisión temprana elimina una buena opción para siempre

**Cuándo usarlo:** Cuando solo importa "el mejor" y el tiempo/atención son limitados.

---

### Round Robin (Todos contra todos)

```
Estructura: Cada opción compite con todas las demás
Comparaciones: n × (n-1) / 2
Resultado: Ranking completo por victorias
```

**Funcionamiento:**
- Cada par posible se compara exactamente una vez
- Se cuentan victorias totales
- El ranking se determina por número de victorias

**Ventajas:**
- Ranking completo y justo
- Cada opción tiene múltiples oportunidades
- Resultados más estables y confiables

**Desventajas:**
- Explosión cuadrática de comparaciones (20 opciones = 190 comparaciones)
- Fatiga de decisión severa en conjuntos grandes
- Puede haber empates que requieren desempate

**Cuándo usarlo:** Conjuntos pequeños (<10) donde importa el ranking completo o la "justicia" del proceso.

---

### Sequential Pairwise (King of the Hill)

```
Estructura: El ganador defiende contra el siguiente retador
Comparaciones: n - 1
Resultado: UN ganador (el último "rey")
```

**Funcionamiento:**
- Opción 1 vs Opción 2 → Ganador
- Ganador vs Opción 3 → Nuevo ganador
- ... continúa hasta agotar opciones

**Ventajas:**
- Simple de implementar
- Mismas comparaciones que Single-Elimination
- No requiere estructura de bracket

**Desventajas:**
- Altamente sensible al orden inicial
- Las últimas opciones tienen ventaja (menos "batallas")
- Sesgo hacia opciones que aparecen tarde

**Cuándo usarlo:** Situaciones informales o cuando el orden tiene significado (ej: priorización de tareas ya ordenadas).

---

### Comparación rápida

| Algoritmo | Comparaciones (n=16) | Resultado | Justicia | Complejidad |
|-----------|---------------------|-----------|----------|-------------|
| Single-Elimination | 15 | 1 ganador | Media | Baja |
| Round Robin | 120 | Ranking | Alta | Media |
| Sequential Pairwise | 15 | 1 ganador | Baja | Muy baja |

---

## 3. Diseño de flujos de decisión en apps

### Principio 1: Decisiones atómicas

Cada pantalla/paso debe requerir UNA decisión clara. Mezclar múltiples decisiones en un paso causa parálisis.

```
MAL:  "Configura tu perfil" (nombre, foto, preferencias, privacidad)
BIEN: "¿Cómo te llamamos?" → "Sube una foto" → "¿Notificaciones?"
```

### Principio 2: Progreso visible y honesto

El usuario necesita saber:
- ¿Cuánto falta? (barra de progreso, X de Y)
- ¿Dónde estoy? (indicador de paso actual)
- ¿Puedo volver? (opción de deshacer/retroceder)

La incertidumbre genera abandono. Un proceso de 20 pasos con barra de progreso se completa más que uno de 5 pasos sin indicador.

### Principio 3: Reversibilidad reduce ansiedad

Si cada decisión es final, el usuario se paraliza por miedo a equivocarse. Ofrecer "deshacer" libera al usuario para decidir más rápido y con menos estrés.

Implementación: Stack de historial donde cada acción guarda cómo revertirse.

### Principio 4: Automatizar lo obvio

Si una decisión tiene respuesta obvia en cierto contexto, tomarla automáticamente. Ejemplos:
- Byes en torneos (si solo hay un participante, avanza)
- Defaults inteligentes basados en contexto
- Skip de pasos no aplicables

### Principio 5: Feedback inmediato

Cada acción debe tener respuesta visual instantánea:
- Click → cambio visual inmediato
- Selección → confirmación visual
- Error → indicación clara de qué falló

El lag entre acción y feedback genera incertidumbre ("¿funcionó?").

### Principio 6: Cierre satisfactorio

El final del proceso debe sentirse como logro:
- Celebración visual (animaciones, colores)
- Resumen de lo conseguido
- Acción siguiente clara

Un final abrupto ("Listo.") se siente anticlimático.

---

## 4. Principios técnicos aplicables

### Estado centralizado (Single Source of Truth)

```javascript
// Todo el estado en UN objeto
const appState = {
    phase: 'tournament',      // 'input' | 'tournament' | 'result'
    options: [...],
    currentStep: 0,
    history: [...],
    preferences: { theme, lang }
};

// La UI se deriva del estado, nunca al revés
function render() {
    // Leer appState, actualizar DOM
}
```

**Beneficios:**
- Guardar estado = `JSON.stringify(appState)`
- Restaurar = `appState = JSON.parse(saved)`
- Debugging = inspeccionar un objeto
- Time-travel debugging posible

### Separación estado dominio vs UI

```javascript
// PERSISTIR (estado del dominio)
const tournamentState = {
    options: [...],
    rounds: [...],
    history: [...]
};

// NO PERSISTIR (estado de UI)
const uiState = {
    modalOpen: false,
    animating: false
};
```

### Validación defensiva

En flujos complejos, el estado puede corromperse (bugs, localStorage viejo, edge cases). Validar antes de operar:

```javascript
function selectOption(index) {
    // Validaciones defensivas - early return
    if (!state.active) return;
    if (!state.rounds?.length) return;
    if (!currentMatch?.participant1) return;

    // Lógica principal solo si todo está bien
    ...
}
```

### Patrón Command para Undo

```javascript
// Cada acción guarda cómo revertirse
function doAction(action) {
    // Guardar estado para deshacer
    history.push({
        type: action.type,
        previousState: captureRelevantState()
    });

    // Ejecutar acción
    applyAction(action);
}

function undo() {
    const last = history.pop();
    restoreState(last.previousState);
}
```

### Persistencia con localStorage

```javascript
// Guardar
function saveState() {
    localStorage.setItem('app_state', JSON.stringify(state));
}

// Cargar con fallback
function loadState() {
    try {
        const saved = localStorage.getItem('app_state');
        return saved ? JSON.parse(saved) : defaultState;
    } catch (e) {
        return defaultState;  // Fallback si está corrupto
    }
}
```

### i18n simple

```javascript
const translations = {
    es: { greeting: "Hola", next: "Siguiente" },
    en: { greeting: "Hello", next: "Next" }
};

let currentLang = 'es';

function t(key) {
    return translations[currentLang][key] || key;
}

// En HTML: <span data-i18n="greeting">Hola</span>
// Al cambiar idioma, actualizar todos los [data-i18n]
```

### Temas con CSS Variables

```css
:root {
    --bg: #0f0f1a;
    --text: #f0f0f5;
    --accent: #8b5cf6;
}

[data-theme="light"] {
    --bg: #ffffff;
    --text: #1a1a2e;
    --accent: #7c3aed;
}

/* Usar variables en todos los estilos */
body {
    background: var(--bg);
    color: var(--text);
}
```

```javascript
// Cambiar tema = cambiar un atributo
document.documentElement.setAttribute('data-theme', 'light');
```

---

## 5. Patrones de UX reutilizables

### Reducción progresiva de opciones

```
20 opciones → Categorización → 5 grupos
Seleccionar grupo → 4 opciones
Comparación binaria → 1 ganador
```

Cada paso reduce el espacio de decisión sin abrumar.

### Diseño del "momento de decisión"

El instante donde el usuario decide debe tener:
- **Foco visual** en las opciones (nada más compite por atención)
- **Tamaño generoso** de elementos clickeables
- **Diferenciación clara** entre opciones
- **Zona de escape** (deshacer, saltar, cerrar)

### Información contextual vs focal

```
FOCAL: Las dos opciones a comparar (grande, centrado)
CONTEXTUAL: Progreso, ronda actual, bracket (pequeño, periférico)
```

La información focal guía la acción inmediata. La contextual da orientación sin distraer.

### Estados vacíos y de carga

Nunca mostrar contenedores vacíos o estados intermedios confusos:
- Loading: spinner o skeleton
- Vacío: mensaje explicativo + acción sugerida
- Error: qué pasó + cómo recuperarse

---

## 6. Checklist para nuevos proyectos de decisión

- [ ] ¿Cuál es el objetivo? (1 ganador vs ranking)
- [ ] ¿Cuántas opciones típicas? (determina algoritmo viable)
- [ ] ¿Importa la velocidad o la justicia?
- [ ] ¿Necesito persistencia entre sesiones?
- [ ] ¿El usuario puede deshacer decisiones?
- [ ] ¿Cómo comunico progreso?
- [ ] ¿Cómo celebro el resultado final?
- [ ] ¿Qué pasa si el usuario abandona a mitad?
- [ ] ¿Funciona offline?
- [ ] ¿Funciona en móvil?

---

## 7. Referencias y lecturas

- **Ley de Hick**: Tiempo de decisión ~ log2(n opciones)
- **Paradoja de la elección** (Barry Schwartz): Más opciones ≠ mejor experiencia
- **Progressive Disclosure**: Mostrar complejidad gradualmente
- **Teoría de torneos** (matemáticas): Propiedades de diferentes sistemas de competencia
