# Tarjetas Anki - Algoritmos de Decisión y Diseño de Flujos

---

Q: ¿Qué algoritmo conviene usar para elegir UNA opción óptima entre muchas, minimizando comparaciones?
A: Single-Elimination Tournament. Requiere exactamente n-1 comparaciones para n opciones, y cada decisión es binaria (baja carga cognitiva). Ideal cuando solo importa el ganador final, no el ranking completo.

Q: ¿Cuál es la fórmula para calcular el número de comparaciones en un torneo de eliminación directa?
A: Comparaciones = n - 1, donde n es el número de participantes. En un torneo de 16 opciones, siempre serán exactamente 15 comparaciones, independientemente de los resultados.

Q: ¿Qué es un "bye" en un sistema de brackets y cuándo ocurre?
A: Un bye es un pase automático a la siguiente ronda sin competir. Ocurre cuando el número de participantes no es potencia de 2. El participante con bye avanza directamente, manteniendo la estructura del bracket balanceada.

Q: ¿Por qué las comparaciones binarias (A vs B) reducen la carga cognitiva comparado con elegir entre múltiples opciones?
A: El cerebro procesa decisiones binarias más rápido (Ley de Hick). Elegir entre 2 opciones requiere menos energía mental que evaluar 10 simultáneamente. Además, fuerza una decisión concreta en lugar de permitir indecisión.

Q: ¿Cuándo usar Single-Elimination vs Round Robin para tomar decisiones?
A: Single-Elimination: cuando solo importa el ganador y quieres rapidez (n-1 comparaciones). Round Robin: cuando necesitas un ranking completo o más confianza estadística (n*(n-1)/2 comparaciones). Round Robin es más justo pero exponencialmente más lento.

Q: ¿Qué ventaja tiene aleatorizar el orden de opciones antes de un proceso de eliminación?
A: Elimina el sesgo de posición (las primeras/últimas opciones suelen recibir más atención). También evita que el usuario prediga enfrentamientos y "juegue" el sistema en lugar de decidir honestamente.

Q: ¿Cuándo conviene usar localStorage en vez de un backend para persistir estado?
A: Cuando: 1) Los datos son solo del usuario actual, 2) No hay sincronización entre dispositivos, 3) El volumen es pequeño (<5MB), 4) La privacidad importa (datos sensibles que no deben salir del dispositivo), 5) Se requiere funcionamiento offline.

Q: ¿Qué información mínima debe guardarse para permitir "continuar donde quedaste" en un flujo de múltiples pasos?
A: El paso/estado actual, las decisiones ya tomadas (historial), y suficiente contexto para reconstruir la UI. En un torneo: ronda actual, match actual, estructura del bracket con ganadores, e historial para deshacer.

Q: ¿Por qué es importante mostrar progreso (barra, porcentaje, contador) en procesos largos de múltiples pasos?
A: Reduce la ansiedad del usuario, crea sensación de avance, permite estimar tiempo restante, y aumenta la probabilidad de completar el proceso. Un proceso sin indicador de progreso se siente infinito.

Q: ¿Qué patrón de diseño permite implementar "deshacer" de forma simple en una secuencia de decisiones?
A: Patrón Command con un stack de historial. Cada acción guarda su estado previo en un array. Deshacer = pop del array y restaurar estado. Requiere que cada acción sea reversible o que se guarde suficiente información para reconstruir.

Q: ¿Cómo estructurar el estado de una aplicación para que sea fácilmente serializable a JSON (para localStorage)?
A: Usar solo tipos primitivos, arrays y objetos planos. Evitar: funciones, referencias circulares, instancias de clases, DOM elements, y closures. El estado debe ser "data-only", separado de la lógica.

Q: ¿Qué es el patrón "Single Source of Truth" y por qué facilita la persistencia y el debugging?
A: Todo el estado de la app vive en UN objeto central. La UI se deriva de ese estado. Cambios al estado -> re-render UI. Facilita: guardar/restaurar (JSON.stringify), debugging (inspeccionar un objeto), y evita inconsistencias entre componentes.

Q: ¿Por qué separar "estado del dominio" de "estado de la UI" en aplicaciones frontend?
A: El estado del dominio (datos del torneo, opciones, resultados) es persistible y transferible. El estado de UI (modal abierto, tema visual) es efímero o preferencia local. Mezclarlos complica la persistencia y crea bugs al restaurar.

Q: ¿Qué estrategia usar para manejar preferencias de usuario (tema, idioma) de forma persistente?
A: Guardar en localStorage con keys específicas. Al cargar la app: 1) Leer preferencias, 2) Aplicar inmediatamente (antes del render si es posible), 3) Proveer valores por defecto sensatos si no existen.

Q: ¿Cómo implementar internacionalización (i18n) de forma simple en vanilla JS?
A: Un objeto con traducciones por idioma: {es: {key: "texto"}, en: {key: "text"}}. Una función t(key) que retorna la traducción actual. Elementos con data-i18n="key" que se actualizan al cambiar idioma. Guardar preferencia en localStorage.

Q: ¿Qué es la "Ley de Hick" y cómo aplicarla al diseño de interfaces de decisión?
A: El tiempo de decisión aumenta logarítmicamente con el número de opciones. Aplicación: reducir opciones visibles simultáneamente, agrupar en categorías, usar eliminación progresiva, presentar decisiones binarias secuenciales en lugar de selección múltiple.

Q: ¿Por qué pedir confirmación antes de acciones destructivas (resetear, borrar) mejora la UX?
A: Previene pérdida accidental de datos/progreso, especialmente en dispositivos táctiles donde los toques accidentales son comunes. El costo de un click extra es menor que el costo de perder trabajo. Usar confirm() o modales personalizados.

Q: ¿Qué ventajas tiene usar CSS custom properties (variables) para implementar temas (dark/light)?
A: Cambiar tema = cambiar un atributo en :root. No requiere re-renderizar ni cambiar clases en múltiples elementos. El CSS se encarga automáticamente. Facilita agregar más temas sin modificar HTML/JS.

Q: ¿Cómo estructurar una visualización de bracket/árbol de eliminación en HTML/CSS?
A: Contenedor flex horizontal con una columna por ronda. Cada ronda es flex vertical con los matches. Los matches se distribuyen con space-around para alinearse con sus "padres" de la ronda anterior. CSS Grid también funciona bien.

Q: ¿Qué consideraciones tener al implementar controles por teclado (keyboard shortcuts) en una web app?
A: 1) No interferir con inputs/textareas, 2) Usar teclas intuitivas (flechas para navegación), 3) Prevenir default del browser cuando corresponda, 4) Mostrar hints visuales de los shortcuts disponibles, 5) No romper accesibilidad.

Q: ¿Por qué validar exhaustivamente antes de operar sobre datos que pueden ser null/undefined?
A: En flujos complejos con múltiples estados (torneos, wizards), es fácil llegar a estados inesperados por bugs o datos corruptos de localStorage. Las validaciones defensivas (early returns) previenen crashes y facilitan debugging.

Q: ¿Qué patrón usar para procesar automáticamente casos especiales (byes) sin intervención del usuario?
A: Un loop que verifica condiciones y procesa automáticamente mientras se cumplan, con recursión o iteración para manejar casos encadenados. Importante: incluir condiciones de salida claras para evitar loops infinitos.

Q: ¿Cómo diseñar una "pantalla de victoria" efectiva que cierre satisfactoriamente un proceso?
A: Feedback visual claro (animaciones, colores destacados), mostrar el resultado prominentemente, celebrar el logro (emojis, confetti), y ofrecer acción siguiente clara (nuevo proceso, compartir, etc.). El cierre emocional importa.

Q: ¿Por qué embeber assets pequeños (favicon, iconos) en base64 en lugar de archivos separados?
A: Reduce requests HTTP (mejor performance inicial), simplifica deployment (un solo archivo), garantiza disponibilidad (no hay 404 de assets), y facilita portabilidad. Trade-off: aumenta tamaño del HTML y no se cachea separadamente.

Q: ¿Cuál es la estructura mínima para un "game state" que soporte save/load y undo?
A: { currentStep, completedSteps[], history[], metadata }. currentStep indica dónde estamos, completedSteps qué pasó, history permite deshacer (cada entrada tiene datos para revertir), metadata guarda info auxiliar (timestamps, versión).

Q: ¿Qué significa que una aplicación sea "stateless" en su lógica y por qué es deseable?
A: Las funciones reciben todo lo que necesitan como parámetros y no dependen de variables globales ocultas. Facilita testing, debugging, y razonamiento. El estado existe, pero está centralizado y se pasa explícitamente.

Q: ¿Cómo manejar la transición entre "fases" de una aplicación (setup -> proceso -> resultado)?
A: Mostrar/ocultar secciones completas según el estado actual. Usar clases CSS (.active, .hidden) controladas por JS. Evitar manipular elementos individuales; cambiar el estado y dejar que la UI refleje el estado.

Q: ¿Qué es el "progressive disclosure" y cómo aplicarlo en flujos de decisión?
A: Mostrar solo la información relevante para el paso actual, ocultando complejidad futura. En un torneo: mostrar solo el match actual prominentemente, con el bracket completo como contexto secundario. Reduce overwhelm cognitivo.

Q: ¿Por qué ofrecer múltiples modalidades de input (click, teclado, touch) mejora la accesibilidad?
A: Diferentes usuarios prefieren diferentes inputs. Usuarios avanzados prefieren teclado (más rápido). Usuarios móviles necesitan touch. Usuarios con discapacidades motoras pueden depender de uno específico. Más modalidades = más usuarios atendidos.

Q: ¿Cómo calcular y mostrar un porcentaje de progreso de forma que se sienta "justo" al usuario?
A: Progreso = (pasos_completados / pasos_totales) * 100. Importante: calcular pasos_totales correctamente desde el inicio, actualizar inmediatamente al completar cada paso, y considerar si pasos automáticos (byes) cuentan o no.
