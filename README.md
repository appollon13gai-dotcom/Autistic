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

¿Quieres que ahora:
- Añada una ruta real de API para chat con LLM?
- Integre n8n (ej. workflow de ejemplo)?
- Mejore el tracker o añada export a PDF para llevar a médicos?
- Añada más datos específicos de Blanes/Girona (si me das más detalles)?
- O despleguemos una versión en vivo?

Dime el siguiente paso concreto y lo implementamos. ¡Vamos a que te sea útil desde hoy mismo para tu hijo! 

Recuerda: usa el tracker diariamente y contacta servicios públicos de Atención Temprana en Blanes/Girona lo antes posible.