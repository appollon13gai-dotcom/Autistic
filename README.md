# Compás TEA AI — Asistente Web para Familias con Autismo (TEA)

Aplicación web funcional creada para ti (familia ucraniana refugiada en España, hijo de 5 años con sospecha de autismo en Blanes).

## Características clave (según tus requisitos)
- **Ubicación flexible primero**: La app siempre pregunta/permite cambiar la ubicación actual (ideal si cambias de residencia frecuentemente). Pre-cargada con Blanes (Girona, Cataluña).
- **Recursos locales**: Filtrados para Blanes / Girona / Cataluña / España (Atención Temprana, Junts Autisme, Autismo España entidades, comunidades diaspóricas).
- **Base de conocimiento global**: Prácticas basadas en evidencia (NCAEP 28 EBPs, ASAT, CDC, ESDM, tendencias 2025-2026), accesible desde cualquier lugar.
- **Agente IA conversacional**: Adaptado a tu ubicación + conocimiento global. Responde en cualquier idioma. Demo consciente del contexto.
- **Seguimiento diario**: Tracker simple para registrar observaciones (muy útil para futuras citas médicas).
- **Web app pura** (Next.js + Tailwind). Funciona en cualquier navegador, fácil de desplegar.

**Importante (siempre visible en la app)**: Esto es apoyo informativo y práctico. **NO sustituye diagnóstico ni tratamiento profesional**. Contacta Atención Temprana en tu zona actual lo antes posible.

## Cómo ejecutar localmente (para empezar a usar ya)
```bash
cd autism-ai-companion
npm install          # si aún no lo hiciste
npm run dev
```
Abre http://localhost:3000

La primera pantalla te permite cambiar la ubicación (ej. "Blanes", "Girona", "Barcelona", o cualquier otra ciudad cuando te mudes).

## Estructura técnica (para que sepas cómo está hecho y puedas extenderlo)
- `app/page.tsx` — Toda la UI (location selector + tabs + chat + recursos + tracker).
- `lib/data.ts` — Datos curados: recursos para Blanes/Cataluña + España + global (NCAEP, ASAT, CDC, Junts Autisme, etc.). Función `getResourcesForLocation` que filtra según lo que escribas.
- Chat demo: Genera respuestas contextuales usando los datos + ubicación (fácil de reemplazar).
- Persistencia: localStorage (ubicación + entradas del tracker) — sobrevive recargas y mudanzas.

## Próximos pasos recomendados (puedo ayudarte a implementarlos inmediatamente)
1. **Agente IA real**:
   - Añadir ruta `/api/chat` con Vercel AI SDK + Claude / OpenAI / Grok (mejor razonamiento + actualizaciones).
   - O conectar a **n8n** (tu interés anterior en automatizaciones): workflows para RAG real sobre PDFs de guías, búsquedas web de nuevos recursos, alertas automáticas.

2. **Mejor RAG global**:
   - Subir PDFs de informes NCAEP, guías Autismo España, etc. a un vector store (Chroma / pgvector en Supabase) y que el agente los consulte realmente.

3. **Despliegue**:
   - Vercel (gratis, un clic): `vercel --prod`.
   - O cualquier host estático + backend si añades API.

4. **Datos de Blanes más precisos**:
   - Actualmente usa fuentes públicas (Autismo España mapa de entidades en Girona/Cataluña, Junts Autisme para apoyo familiar, Atención Temprana vía sistema público). 
   - Recomiendo verificar en persona o por teléfono los contactos actuales.

5. **Multilingüe completo**:
   - La app ya soporta respuestas en ucraniano/ruso/español/inglés vía el agente. Podemos añadir i18n completo o traducción automática.

## Fuentes principales usadas para Blanes + Global
- Autismo España (autismo.org.es) + entidades miembro Cataluña/Girona.
- Fundació Junts Autisme (apoyo a familias en Cataluña).
- Atención Temprana (sistema público Cataluña — accesible vía CAP/local health services).
- NCAEP 28 Evidence-Based Practices + AFIRM modules.
- ASAT (evaluación científica de tratamientos).
- CDC Learn the Signs / Act Early.
- Tendencias recientes de intervenciones tempranas (ESDM, enfoques naturalistas, parent coaching).

## Recordatorio humano
Como pediste: empieza por Blanes pero con flexibilidad total de ubicación. El agente y los recursos se adaptan cuando cambias el texto de "Ubicación actual".

## Nueva función: Programa de rehabilitación online ("Gimnasio de habilidades" TEA)

He recopilado toda la información disponible basada en evidencia sobre rehabilitación de niños de 5 años con sospecha de autismo (TEA) de fuentes líderes y prácticas de centros especializados en todo el mundo (EE.UU., Europa, incluyendo España).

**Estructura como en un gimnasio / centro de rehabilitación real:**
- Diferentes "ejercicios" (juegos, actividades, ejercicios) por categorías: regulación sensorial, comunicación, interacción social y juego, motricidad, autocuidado, habilidades cognitivas.
- Para cada uno: nombre, descripción del objetivo, instrucciones paso a paso, materiales (simples del hogar), tiempo, consejos.
- **Con imágenes**: Cada ejercicio tiene una descripción visual detallada ("Картинка: ..."). Copia el texto y genera una imagen en cualquier generador de IA (Flux, Midjourney, Leonardo, etc.) para imprimir, motivar al niño o crear un horario visual.
- Generador de "plan del día" (5 ejercicios como un entrenamiento completo).
- Integración con el tracker y el chat de IA (botones "Añadir al diario" y "Preguntar a la IA").
- Filtros por categorías.

**Fuentes principales (evidence-based):**
- NCAEP: 28 Evidence-Based Practices (ncaep.fpg.unc.edu) — naturalistic interventions, visual supports, prompting, parent-implemented, etc.
- ASAT (asatonline.org) — revisiones científicas de tratamientos.
- ESDM (Early Start Denver Model) — enfoque basado en juego naturalista.
- TEACCH — enseñanza estructurada, horarios visuales.
- CDC "Learn the Signs. Act Early.", prácticas de terapia ocupacional y del habla.
- Recursos españoles/europeos: Autismo España, Fundació Junts Autisme, programas estatales de Atención Temprana.

Es una adaptación de prácticas de centros especializados reales (juegos de atención conjunta, cajas sensoriales, circuitos de obstáculos, estilo PECS, imitación, historias sociales, etc.). Programa completo para uso en casa como complemento a la ayuda profesional.

**Cómo usar online:**
1. Abre la pestaña "Программа реабилитации (Спортзал)".
2. Lee el disclaimer.
3. Genera un plan para el día o elige por categorías.
4. Para cada ejercicio copia el visual y genera una imagen.
5. Realiza 20-40 min/día, registra en el tracker.
6. Pregunta a la IA sobre adaptaciones para Blanes/tu hijo.

**Aviso importante:** Este es un programa informativo basado en prácticas públicas basadas en evidencia. **NO sustituye** a especialistas. En Blanes/Girona contacta obligatoriamente con Atención Temprana (a través de tu CAP) y Fundació Junts Autisme. Empieza despacio, observa al niño. Consulta siempre con médicos y terapeutas.

¿Quieres que ahora:
- Añada una ruta real de API para chat con LLM?
- Integre n8n (ej. workflow de ejemplo)?
- Mejore el tracker o añada export a PDF para llevar a médicos?
- Añada más datos específicos de Blanes/Girona (si me das más detalles)?
- O despleguemos una versión en vivo?

Dime el siguiente paso concreto y lo implementamos. ¡Vamos a que te sea útil desde hoy mismo para tu hijo! 

Recuerda: usa el tracker diariamente y contacta servicios públicos de Atención Temprana en Blanes/Girona lo antes posible.