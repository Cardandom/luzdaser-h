# /aruba-homes — segunda iteración

Vista local: http://localhost:3000/aruba-homes

Esta versión acorta el funnel de la primera iteración y conserva su identidad visual. El servidor local permanece activo para revisión.

## 1. Secciones eliminadas o fusionadas

- Eliminado el segundo formulario y todo el bloque de contacto que lo acompañaba.
- Integrada la micro trust bar dentro del único formulario superior.
- Fusionados Why Reina Sophia y ubicación/Aruba en una sección con cuatro beneficios breves.
- Eliminados el render aéreo adicional y el mapa; se conservan el render principal y las tres imágenes de modelos.
- Integrado el mini proceso dentro del cierre, sin una sección adicional.
- Eliminadas las descripciones largas de las tarjetas, su cuarta característica y los enlaces View Residence.
- Acortados el subheadline del hero, sus leyendas y los espacios entre secciones.

## 2. Nueva longitud y estructura

El contenido pasa de **ocho bloques a cinco**, con **un formulario en vez de dos**. Se mantienen cabecera y footer reducidos.

1. **Hero:** propuesta, ubicación, CTA y render de Oliver.
2. **Formulario + confianza:** tres campos y cuatro mensajes breves.
3. **Modelos:** Oliver, Luca y Audrey; una imagen, tres características y un CTA por tarjeta.
4. **Why Reina Sophia + Aruba:** cuatro razones breves.
5. **Cierre:** dos CTA y mini proceso.

Los beneficios finales son:

- **Private residential setting** — A private community with a children's park.
- **Contemporary home models** — Minimalist homes with two, three or four bedrooms.
- **Outdoor living** — Private swimming pools and outdoor spaces.
- **Central location in Aruba** — Paradera, with access to shops, restaurants and schools.

Fuentes: hero y sección de ubicación existentes, además de `lib/projects.ts`. No se añadieron afirmaciones comerciales nuevas. No se afirma una reducción exacta de píxeles o porcentaje de scroll porque no se midió en navegador.

## 3. Hero

- Eyebrow: **NEW HOMES FOR SALE IN ARUBA**.
- Headline: **Own Your Place in Aruba.**
- Subheadline: **Discover Reina Sophia Residences in Paradera and request current pricing and availability.**
- CTA principal: **Get Prices & Availability**.
- CTA secundario: **WhatsApp Us**.
- Render: `/front3DOliver.webp`, con `next/image`, carga inmediata y prioridad alta.

Se mantienen fuentes, dorados, fondos, bordes redondeados, logo y tratamiento editorial. El render es horizontal en móvil y se ubica junto al copy en desktop. El formulario queda inmediatamente después del hero.

## 4. CTA y formulario

Todos los CTA de precios y disponibilidad vuelven a **`#request-prices`**. El formulario tiene `tabIndex={-1}` para poder recibir el foco de la navegación por ancla sin añadir un paso al orden normal de tabulación. El desplazamiento respeta la preferencia de movimiento reducido.

Los tres campos siguen siendo **Name**, **WhatsApp / Phone** y **Email**. El botón dice **Send Me Prices & Availability**. Debajo se integran:

**Paradera, Aruba · Private Residential Project · Three Home Models · Direct Project Information**.

Se conservan el adaptador, `POST /api/contact`, el honeypot, `marketingConsent: false`, los estados de carga/éxito/error y `lead_form_success`. No se modificaron el backend, su configuración ni el formato del envío.

WhatsApp mantiene el número oficial **+297 699 2222** y el mensaje precargado de la primera iteración. Solo abre la conversación; no envía el mensaje automáticamente.

## 5. Tarjetas dentro del funnel

| Modelo | Características tomadas de `lib/projects.ts` |
| --- | --- |
| Oliver | 130 m² House; Three Bedrooms; 18 m² Pool Area. |
| Luca | 80 m² House; Two Bedrooms; 11 m² Pool Area. |
| Audrey | 160 m² House; Four Bedrooms; 18 m² Pool. |

Cada **Request Availability** selecciona el modelo y vuelve al formulario superior. La preferencia se muestra como **Interested in: Oliver/Luca/Audrey** y viaja en los comentarios generados por el adaptador existente. No se usan cookies ni almacenamiento persistente para esta selección.

No hay enlaces de las tarjetas a `/projects/*`, ni modales o acordeones añadidos. Los marcadores pasivos son `funnel_primary_cta`, `funnel_whatsapp_click`, `funnel_form_start`, `funnel_form_submit` y **`funnel_model_interest`**. Se retira `funnel_model_view` de esta ruta. No se disparan eventos analíticos nuevos.

## 6. Sticky CTA móvil

- Visible únicamente por debajo de 768 px de ancho.
- Aparece cuando el hero ha salido por la parte superior del viewport.
- Se oculta cuando el formulario, el cierre o el footer están visibles y mientras se escribe en un campo. Así evita competir con el contacto ya disponible.
- Botones: **Get Prices**, al formulario, y **WhatsApp**, al mismo número y mensaje oficiales.
- Botones de al menos 44 px de alto; safe-area inferior y lateral mediante `env(safe-area-inset-*)`.
- Espacio inferior reservado desde el render inicial y margen de scroll para el contenido y los controles enfocados; mostrar la barra no desplaza el layout.
- Oculta inicialmente y en desktop, sin popup, modal, animación de entrada, video o pinning.
- Usa `IntersectionObserver` y cambios del breakpoint; no instala un listener continuo de scroll. Desconecta observadores y listeners al desmontarse.

## 7. Archivos de esta iteración

Modificados respecto de la primera versión:

- `app/aruba-homes/page.tsx`.
- `app/aruba-homes/_components/funnel-interactions.tsx`.
- `app/aruba-homes/funnel.module.css`.
- `scripts/check-aruba-homes.mjs`.
- `docs/aruba-homes-review.md`: referencia a este reporte para distinguir la primera versión de la actual.

Creados:

- `app/aruba-homes/_components/mobile-funnel-actions.tsx`.
- `docs/aruba-homes-iteration-2.md`.

Los cambios pendientes de la primera iteración en `app-chrome.tsx` y `whatsapp-button.tsx` siguen en el árbol de trabajo, pero **no se modificaron nuevamente**.

## 8. Validaciones

| Comprobación | Resultado |
| --- | --- |
| `npm exec -- tsc --noEmit` | Correcto. |
| `npm run lint` | Correcto: 0 errores; persiste una advertencia previa sobre `<img>` en `app/client/page.tsx:510`. |
| `npm run build` | Correcto; la landing sigue siendo estática. |
| `git diff --check` | Correcto. |
| `node scripts/check-aruba-homes.mjs http://localhost:3000` | Correcto. |
| `/` | HTTP 200. |
| `/aruba-homes` | HTTP 200. |
| `/projects/oliver` | HTTP 200. |
| `/projects/luca` | HTTP 200. |
| `/projects/audrey` | HTTP 200. |

Las pruebas verifican un formulario, cinco bloques, una imagen y tres características por tarjeta, destino único de contacto, ausencia de navegación a proyectos, ausencia de video/iframe y metadata `noindex, follow`. También comprueban el contrato real de envío con correo simulado y los casos de la barra móvil con observadores simulados: hero, dirección de scroll, formulario, foco, cierre, footer, cambio a desktop y limpieza al desmontarse.

El navegador integrado no estuvo disponible. No se verificaron visualmente viewports reales ni se midieron LCP/CLS; las pruebas de la barra validan su lógica, no su renderizado. No se enviaron correos reales.

## 9. Home, proyectos y sistemas existentes

Se compararon hashes SHA-256 antes y después de 13 archivos protegidos, incluidos home, página compartida de proyectos, layout, estilos globales, backend de contacto, formulario original, consentimiento, componentes compartidos y adaptador de envío. Permanecen idénticos respecto del inicio de esta iteración.

No se modificaron `/`, `/projects/oliver`, `/projects/luca`, `/projects/audrey`, Google Ads, GTM, GA4, Consent Mode, Supabase ni el backend de contacto. Se conserva `noindex, follow` y no se toca el sitemap.

## 10. Estado de entrega

**Sin commit, push ni despliegue.** La segunda versión queda disponible únicamente para revisión local en la URL indicada.
