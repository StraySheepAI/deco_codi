# Instrucciones — corpus Rollos del Mar Muerto

Complementa a INSTRUCCIONES.md (Génesis/Tanaj). Los principios de fondo son los mismos —Elohim/YHWH sin traducir, una sola lectura decidida en el cuerpo, notas E1/E2/D1/D2, chequeo de vocabulario doctrinal contra el original—, pero este corpus tiene tres diferencias que cambian el flujo de trabajo.

## Diferencia 1 — la fuente no viene en XML/OSIS como Gen.xml
La fuente de referencia es el repositorio **ETCBC/dss** (`github.com/ETCBC/dss`), transcripción y etiquetado morfológico de los rollos, basado en el trabajo de Martin Abegg, en formato **Text-Fabric** (no OSIS/XML). Antes de poder extraer texto como se hace con `Gen.xml`, hay que: clonar el repo, inspeccionar su estructura real de archivos, y decidir si conviene instalar la librería Text-Fabric (Python) para leerlo, o escribir un conversor propio a un formato más simple (JSON o XML análogo a lo que ya usamos) para no depender de esa librería en cada build.

## Diferencia 2 — es un corpus fragmentario, no libros completos
No hay "Génesis entero" ni "Isaías entero" en un solo rollo — la mayoría son fragmentos, con huecos, de extensión muy variable. Antes de arrancar a decodificar, hacer un inventario de qué rollos bíblicos existen en la fuente y cuánto texto continuo tiene cada uno. Elegir como punto de partida el rollo más largo y mejor preservado disponible — candidato natural: **1QIsa^a (el Gran Rollo de Isaías, 1QIsaa)**, por ser el único rollo bíblico casi completo que se conservó entero; si no está disponible o accesible en la fuente, buscar el siguiente candidato más completo y proponerlo antes de arrancar.

## Diferencia 3 — el valor está en la comparación, no solo en la decodificación
A diferencia de Génesis (donde no había con qué comparar), acá el hallazgo central posible es **crítica textual real**: cotejar el texto del rollo (que puede ser mil años o más anterior al Códice de Leningrado) contra el texto masorético que ya decodificamos en `Coding-the-Bible_Genesis-1-2_v2_3_1.md` y en el archivo de Éxodo. Cuando el rollo cubra un pasaje ya decodificado en esos archivos, la nota filológica correspondiente debe señalar explícitamente si el rollo coincide palabra por palabra con el Leningrado o si hay una variante real (una palabra distinta, un orden distinto, una palabra de más o de menos) — eso es un dato E1 de primer orden para este proyecto, no un detalle menor.

## Estructura del archivo nuevo
Crear `Coding-the-Bible_Rollos-Mar-Muerto.md`, misma estructura EL TEXTO / LAS NOTAS, numeración de notas propia empezando en 1. En EL TEXTO, marcar claramente los huecos del manuscrito con corchetes y puntos suspensivos (`[...texto reconstruido o faltante...]`) en vez de rellenar en silencio como si el rollo no tuviera daño — la fragmentación es un dato, no algo a disimular.

## Antes de arrancar a decodificar en serio
Hacer un primer paso de reconocimiento (clonar el repo, ver qué formato tiene, inventariar qué rollos bíblicos hay y su extensión) y reportar eso primero, antes de escribir texto y notas — recién ahí definir junto conmigo (o con criterio propio si la elección es obvia, como 1QIsaa) por dónde arrancar. Este primer paso sí amerita pausa y reporte, a diferencia del resto del flujo de Génesis/Éxodo donde se avanzaba sin preguntar.
