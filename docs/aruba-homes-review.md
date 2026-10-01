# /aruba-homes — primera versión para revisión local

> Reporte histórico de la primera iteración. La implementación actual está descrita en [Segunda iteración](aruba-homes-iteration-2.md).

Vista local: http://localhost:3000/aruba-homes

Implementación independiente dentro del proyecto Next.js existente. No se ha publicado, hecho commit ni push. El servidor local se deja funcionando para la revisión.

## 1. Archivos creados

| Archivo | Función |
| --- | --- |
| `app/aruba-homes/page.tsx` | Página prerenderizada, metadata, cabecera, ocho secciones y footer. |
| `app/aruba-homes/funnel.module.css` | Foco visible y desplazamiento con alcance limitado a la landing; respeta movimiento reducido. |
| `app/aruba-homes/_components/funnel-interactions.tsx` | Formularios, estados de envío y selección compartida de modelo. |
| `app/aruba-homes/_lib/contact-payload.ts` | Adaptación de los tres campos al contrato actual de `/api/contact`. |
| `lib/contact-config.ts` | Teléfono oficial y generador reutilizable de enlaces de WhatsApp. |
| `scripts/check-aruba-homes.mjs` | Pruebas del contrato con transporte de correo simulado y comprobaciones HTTP locales opcionales. |
| `docs/aruba-homes-review.md` | Este reporte. |

## 2. Archivos modificados

- `components/site/app-chrome.tsx`: excluye la cabecera general y el WhatsApp flotante exclusivamente en `/aruba-homes`, que cuenta con su propia cabecera y enlaces contextuales. Sigue mostrando el mismo `CookieConsent`.
- `components/site/whatsapp-button.tsx`: obtiene su URL desde la configuración compartida. El número, mensaje predeterminado, apariencia y evento existentes se conservan. La prueba compara la URL anterior y la nueva carácter por carácter.

## 3. Elementos reutilizados

- Fuentes heredadas: Geist para texto y Georgia/Times New Roman para encabezados.
- Tokens existentes: `luxury-gold`, `luxury-gold-ink`, `luxury-gold-soft`, `luxury-border`, `foreground`, `muted-foreground`.
- Clases existentes: `luxury-eyebrow`, `luxury-title-sm`, `luxury-input`; degradado dorado y botones redondeados utilizados en la web.
- Datos de `lib/projects.ts`: nombres, descripciones, imágenes y cuatro características por modelo. No se duplicaron medidas, dormitorios o baños en una fuente comercial nueva.
- `lib/legal-config.ts`: marca, razón social, dirección y correo.
- `CookieSettingsButton`, `CookieConsent` y la infraestructura de consentimiento existente.
- Endpoint `/api/contact`, validación del servidor, honeypot y envío mediante Resend.
- Evento existente `lead_form_success`, sin nuevos parámetros ni datos personales.
- Componentes `next/image`, `next/link` e iconos `lucide-react` ya instalados.

El formulario largo de la home no se reutiliza visualmente porque exige comentarios y añade ciudad y suscripción promocional. Se reutiliza su endpoint sin modificarlo. La landing no utiliza los componentes de video, galería compleja ni animación de la home.

## 4. Assets utilizados

| Asset existente | Uso |
| --- | --- |
| `/Logo_Icono_Dorado.png` | Logo de la cabecera. |
| `/front3DOliver.webp` | Hero, tarjeta Oliver y metadata social. |
| `/lucaDetails.webp` | Tarjeta Luca. |
| `/projects/audrey/audrey-front-elevation.webp` | Tarjeta Audrey. |
| `/newComplex.webp` | Vista aérea de la comunidad en Why Reina Sophia. |
| `/aruba-map.png` | Mapa pequeño y estático en la sección de ubicación. |

No se generaron imágenes ni se descargó stock. Las imágenes se sirven con `next/image`, espacios reservados y `sizes` adaptativos. Solo el hero usa `loading="eager"` y `fetchPriority="high"`; el resto conserva carga diferida. No se emplea `priority`, obsoleto en esta versión de Next.js.

## 5. Copy final

### Cabecera y hero

- Marca: **Reina Sophia / Residences**.
- Botón de cabecera: **WhatsApp**.
- Eyebrow: **NEW RESIDENCES IN ARUBA**.
- H1: **Own Your Place in Aruba.**
- Texto: **Discover Reina Sophia Residences in Paradera. Explore our home models and request current pricing and availability.**
- CTA principal: **Get Prices & Availability**.
- CTA secundario: **Talk to Us on WhatsApp**.
- Pie del render: **PARADERA, ARUBA / A place to call your own. / Oliver residence · Architectural render**.

### Formularios

- Título: **Request Prices & Availability**.
- Apoyo: **Leave your details and our team will contact you with current residence options.**
- Tres campos: **Name**, **WhatsApp / Phone**, **Email**.
- Placeholders: **Your name / Include country code / you@example.com**.
- CTA inicial: **Send Me the Information**.
- CTA final: **Request Information**.
- Modelo elegido: **Interested in: Oliver**, **Luca** o **Audrey**; botón **Clear**.
- Carga: **Sending…**.
- Botón tras éxito: **Request Sent**.
- Éxito: **Thank you. Your request has been received.**
- Error: **We couldn't confirm your request. Please try again or contact us on WhatsApp.**
- Alternativa tras éxito/error: **Continue on WhatsApp**.
- Privacidad: **By submitting, you acknowledge that JBSSECO / Reina Sophia Residences will process your information to respond to your enquiry. Read our Privacy Policy.**

### Micro trust bar

**PARADERA, ARUBA / PRIVATE COMMUNITY / THREE HOME MODELS / DIRECT PROJECT INFORMATION**.

La ubicación está documentada en el contenido y la configuración legal; la comunidad privada aparece en el hero actual; los tres modelos provienen de `lib/projects.ts`; las solicitudes llegan al contacto del proyecto mediante el endpoint existente.

### Modelos

- Eyebrow: **THE RESIDENCES**.
- Título: **Choose Your Residence**.
- Apoyo: **Three models. One private community. Find the space that feels like you.**

| Modelo | Descripción existente | Características existentes |
| --- | --- | --- |
| OLIVER | A more expansive villa composition with a softer palette, garden framing, and a relaxed outdoor rhythm. | 130 m² House; Three Bedrooms; Three bathrooms; 18 m² Pool Area. |
| LUCA | A compact boutique residence with crisp lines, warm accents, and a private resort feel. | 80 m² House; Two Bedrooms; Two Bathrooms; 11 m² Pool Area. |
| AUDREY | A two-level villa with four bedrooms, three bathrooms, and a refined minimalist character. | 160 m² House; Four Bedrooms; Three Bathrooms; 18 m² Pool. |

Cada tarjeta incluye **Request Availability** y **View Residence**.

### Why Reina Sophia

- Eyebrow: **WHY REINA SOPHIA**.
- Título: **Thoughtfully designed. Yours to make a home.**
- **A private community** — A residential setting with a children's recreational park and sidewalks throughout the complex.
- **Your own outdoor space** — Private swimming pools and outdoor areas designed for life at home.
- **Contemporary by design** — Three minimalist residence models, with two, three or four bedrooms.
- **Considered finishes** — Porcelain flooring, double-glazed PVC windows and air conditioning.
- Pie del render: **The community · Architectural render**.

Fuentes: `hero-section.tsx` y los campos `features` y `highlights` de los modelos. No se tomaron afirmaciones técnicas adicionales de los textos genéricos del dossier.

### Ubicación

- Eyebrow: **PARADERA, ARUBA**.
- Título: **Life in Aruba. A place of your own.**
- Texto: **Make Paradera the starting point for your home in Aruba. Reina Sophia is a private residential community in a central area of the island, with access to supermarkets, restaurants and schools.**
- Dirección: **Paradera 184, Paradera, Aruba**.

Fuente del contexto: `benefits-section.tsx`. Se evita una promesa financiera de inversión y se conserva la intención de adquirir una residencia.

### Segundo momento de conversión

- Eyebrow: **YOUR NEXT CHAPTER**.
- Título: **Ready to Discover Your Options?**
- Texto: **Request current pricing and availability for Reina Sophia Residences.**
- Botones: **Get Prices & Availability / WhatsApp Us**.

### Contacto final

- Eyebrow: **LET'S TALK**.
- Título: **Your home in Aruba starts with a conversation.**
- Texto: **Tell us how to reach you. The Reina Sophia team will share current residence options and help you explore your next step.**
- Alternativa: **Prefer to get in touch directly?**
- Contacto: **+297 699 2222 / info@jbsseco.com**.

### Proceso y footer

- **01 Request Information**.
- **02 Receive Current Options**.
- **03 Speak With the Reina Sophia Team**.
- Footer: **Reina Sophia Residences / JBSS ECO REAL ESTATE & CONSTRUCTION V.B.A. / Paradera 184, Paradera, Aruba**.
- Contacto: **+297 699 2222 / info@jbsseco.com**.
- Enlaces: **Privacy Policy / Cookie Policy / Terms of Use / Cookie Settings / View Full Website**.
- Copyright: **© 2026 Reina Sophia Residences. All rights reserved.**

## 6. Estructura completa

1. Cabecera reducida: logo y WhatsApp; enlace accesible para saltar al contenido.
2. Hero: copy, CTA al formulario, WhatsApp y render. En desktop, imagen a la derecha y formulario debajo del copy. En móvil: copy, CTA, WhatsApp, render y formulario; el CTA salta directamente al formulario.
3. Micro trust bar de cuatro mensajes.
4. Choose Your Residence: Oliver, Luca y Audrey, una imagen por tarjeta, cuatro características y dos enlaces.
5. Why Reina Sophia: render de la comunidad y cuatro beneficios breves.
6. Ubicación: contexto de Paradera y mapa estático secundario.
7. Segundo momento de conversión: bloque oscuro con CTA dorado y WhatsApp.
8. Formulario final con contacto directo alternativo.
9. Proceso de tres pasos.
10. Footer reducido con contacto y enlaces legales existentes.

Los puntos 2–9 corresponden a las ocho secciones solicitadas. No hay menú hamburguesa, carrusel, popups nuevos, videos ni animaciones de entrada. Los CTA miden al menos 44 px de alto; los inputs visibles, al menos 48 px. Los links a modelos y páginas generales llevan `prefetch={false}` para evitar precargar sus experiencias más pesadas.

## 7. Funcionamiento del formulario

- Ambos formularios comparten el mismo componente y piden tres datos visibles: nombre, WhatsApp/teléfono y email. Los tres son obligatorios.
- `Request Availability` selecciona el modelo y desplaza al formulario final. El estado se comparte con ambos formularios; no usa cookies, almacenamiento local ni base de datos. `Clear` elimina la preferencia.
- Se envía JSON a `POST /api/contact`. El adaptador deja `city` vacío y completa `comments` con la solicitud de precios, modelo y origen `/aruba-homes`, respetando la validación existente.
- `marketingConsent` se envía como `false`: solicitar información no implica consentir promociones.
- Se conserva el campo honeypot invisible `website`.
- El endpoint sigue usando su configuración existente de Resend, `CONTACT_TO_EMAIL` y `CONTACT_FROM_EMAIL`, con sus valores predeterminados. No se modificaron variables de entorno.
- Se bloquean envíos simultáneos, se muestra carga, se comprueba la respuesta de éxito y se ofrece WhatsApp en caso de éxito o error. Las entradas se conservan si falla y se vacían si el servidor confirma el envío.
- Se aplica un límite de espera de 25 segundos en el cliente. Un timeout muestra que no se pudo **confirmar** el envío, porque el servidor podría haberlo procesado.
- No se redirige al usuario después de enviar. El seguimiento no puede convertir un éxito real en un error visual.
- Las pruebas usan un transporte simulado: no se verificó la recepción en un buzón real ni se enviaron correos de prueba.

## 8. WhatsApp

Número oficial reutilizado: **+297 699 2222**. El helper en `lib/contact-config.ts` genera la URL `wa.me` y codifica el mensaje.

Mensaje de todos los CTA de la landing:

> Hi, I'm interested in Reina Sophia Residences. I'd like to receive current pricing and availability.

Hay enlaces en cabecera, hero, bloque de conversión, contacto final y estados de éxito/error. Abren WhatsApp en otra pestaña sin enviar el mensaje automáticamente. El flotante de las páginas anteriores conserva su mensaje y evento originales.

## 9. Tracking e indexación

Los siguientes valores se dejan en atributos `data-funnel-event`, sin listeners analíticos nuevos:

| Identificador | Ubicación preparada |
| --- | --- |
| `funnel_primary_cta` | CTA del hero, tarjetas y bloque de conversión. |
| `funnel_whatsapp_click` | Enlaces contextuales y alternativa después del envío. |
| `funnel_form_start` | Cada formulario; un futuro listener podrá detectar la primera interacción. |
| `funnel_form_submit` | Botón de envío de cada formulario. |
| `funnel_model_view` | Enlaces a las páginas de los modelos. |

Se añaden `data-cta-location`, `data-form-location` y `data-residence` donde corresponden. No contienen datos personales. **Estos atributos no disparan eventos.**

Se conserva `lead_form_success` tras una confirmación real de `/api/contact`, con el mismo payload que el formulario actual. No se tocaron Google Ads, GTM, GA4 ni Consent Mode.

La metadata incluye **`noindex, follow`**: excluye la landing del índice durante esta fase de revisión y permite seguir sus enlaces. Tiene canonical propio y metadata social específica que reutiliza el render existente. No se modificó el sitemap ni la indexación de las otras páginas. La exclusión del índice no equivale a control de acceso; la ruta sigue siendo accesible si se despliega.

## 10. Datos comerciales omitidos

- Los precios que figuran en `lib/projects.ts` para Luca y Oliver se omiten: el código no acredita su vigencia; Audrey no tiene un precio publicado en esa fuente.
- No se afirma disponibilidad actual ni cantidades restantes.
- No se muestran descuentos, promociones, financiación, plazos de entrega, ROI, rentabilidad ni tiempos de respuesta.
- No se repiten los tiempos de traslado a playas del contenido actual, porque no son necesarios para este funnel y pueden variar.
- No se hacen afirmaciones sobre propiedad frente al mar ni condiciones legales/comerciales de adquisición.

## 11. Validaciones

| Verificación | Resultado |
| --- | --- |
| `npm exec -- tsc --noEmit` | Correcto. |
| `npm run lint` | Correcto, 0 errores. Una advertencia previa sobre `<img>` en `app/client/page.tsx:510`, fuera del alcance. |
| `npm run build` | Correcto; `/aruba-homes` se genera como página estática. |
| `git diff --check` | Correcto. |
| `node scripts/check-aruba-homes.mjs http://localhost:3000` | Correcto: adaptación real del payload, todos los modelos, ambos orígenes, validación, honeypot, error del proveedor, compatibilidad del formulario previo y URL de WhatsApp. |
| `/` | HTTP 200. |
| `/aruba-homes` | HTTP 200. |
| `/projects/oliver` | HTTP 200. |
| `/projects/luca` | HTTP 200. |
| `/projects/audrey` | HTTP 200. |

La comprobación HTTP confirma dos formularios, anclas, marcadores futuros, ausencia de video/iframe y `noindex, follow` únicamente en la nueva landing. Las rutas anteriores mantienen el WhatsApp flotante en su HTML.

El optimizador de Next.js también devolvió HTTP 200 para el render principal. La suma local de los scripts referenciados en el HTML de producción fue de **223 KiB con gzip para la landing y 231 KiB para la home** (737 y 768 KiB sin comprimir, respectivamente). Es una comparación de archivos compilados, no una medición de transferencia real. La reducción principal del funnel viene de no cargar las experiencias de video, los módulos diferidos de scroll ni el mapa embebido de la home; se conserva la infraestructura compartida de consentimiento.

Limitaciones de la verificación: el navegador integrado no estaba disponible. No se realizó una prueba visual automatizada por viewport, una prueba de teclado en navegador ni mediciones Lighthouse/LCP/CLS. La estructura responsive, el foco, los labels y las dimensiones reservadas están implementados; la revisión visual final debe hacerse en el navegador local. No se atribuyen puntuaciones de rendimiento no medidas.

## 12. Confirmación del alcance

La home y las páginas actuales de Oliver, Luca y Audrey no tienen cambios de contenido, estilos o código de página. Tampoco se modificaron `app/layout.tsx`, `app/globals.css`, `lib/projects.ts`, el formulario original, `/api/contact`, las políticas, los módulos de consentimiento ni Supabase. Los dos cambios compartidos son el tratamiento exclusivo de la ruta nueva en `AppChrome` y la extracción compatible del helper de WhatsApp.

No se instalaron dependencias, no se cambiaron los scripts de npm, no se modificaron `package.json` o el lockfile y no se hicieron commit, push, despliegue ni conexiones de campañas.

Para volver a iniciar la vista local, ejecutar `npm run dev` y abrir `/aruba-homes` en la URL indicada por Next.js. En PowerShell con scripts deshabilitados, usar `npm.cmd run dev`.
