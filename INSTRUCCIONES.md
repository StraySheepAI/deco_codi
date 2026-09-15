# Instrucciones de estilo y convenciones — Coding the Bible / Decoding the Bible

Este archivo complementa al Definition of Done. El Definition of Done dice CUÁNDO un capítulo está terminado; este archivo dice CÓMO se escribe, palabra por palabra, para que el estilo no cambie entre tandas ni entre sesiones.

## Estado del proyecto
El archivo de trabajo (`Coding-the-Bible_Genesis-1-2_v2.md`) tiene a la fecha Génesis 1 al 30 completos (texto en EL TEXTO, notas 1 a 151 en LAS NOTAS). Continuar desde el capítulo 31, nota 152 en adelante. Extraer siempre el hebreo desde `Gen.xml` (lema + morfología vía XML/OSIS, namespace `bibletechnologies.net/2003/OSIS/namespace`) — nunca traducir de memoria ni copiar de una versión existente (Reina-Valera, JPS, etc.), aunque el resultado final se le pueda parecer por tratarse del mismo texto.

## Reglas de traducción — palabras que NUNCA se traducen
- **Elohim** — queda siempre así, nunca "Dios". Es plural en la forma, y esa ambigüedad es parte del hallazgo central del proyecto (nota 1).
- **YHWH** — el tetragrámaton, nunca "Yahvé", "Jehová" ni "SEÑOR". Cuando aparece la fórmula compuesta "YHWH Elohim", se deja igual, compuesta.
- **adam / adamah** — "humano/humanidad" y "tierra cultivable" quedan sin traducir cuando el juego de palabras entre ambas está activo o cuando el término se usa con el peso que trae desde el capítulo 2 (nota 22). Fuera de esos contextos puede traducirse como "el hombre" o "la tierra" si no hay ambigüedad en juego — usar criterio, no automatismo.
- **ish / ishah / ishot** — "varón" y "esposa/mujer" (singular y plural) se dejan sin traducir por el mismo motivo que adam/adamah: preservan el juego de palabras de 2:23.

## Estructura del texto (Capa C)
- Una sola lectura decidida en el cuerpo de EL TEXTO — nunca dos alternativas en el cuerpo. Las alternativas o disputas académicas van SOLO en las notas.
- Numeración de versículo en negrita (`**1**`, `**2-4**` si se agrupan). Agrupar rango de versículos está permitido y es preferible en tramos genealógicos largos, listas de nombres, o diálogos muy repetitivos (ver más abajo, "Compresión").
- Los números de nota van como superíndice unicode (¹²³) pegados a la palabra o frase relevante, nunca al final del versículo entero salvo que la nota sea sobre el versículo completo.

## Estructura de las notas (LAS NOTAS)
Formato exacto: `**N — término hebreo / traducción breve (cap:vers).** Contenido. Tag E1/E2/D1/D2.`

- **E1** = dato textual/filológico verificable directamente (raíz compartida, primera aparición, dato gramatical, cifra que da el propio texto).
- **E2** = dato de erudición externa real (cognados, arqueología, ANE, crítica de fuentes) — con fuente o consenso académico citado en términos generales, nunca inventado.
- **E3** = disputa académica genuina y no resuelta — se muestra como disputa, no se elige un bando.
- **D1** = lectura interpretativa de Rocío o del proyecto, construida sobre el dato pero explícitamente marcada como lectura, no como hecho del texto.
- **D2** = lectura interpretativa más especulativa/menor, mismo criterio.

Nunca mezclar el tag: si una nota tiene dato duro y lectura interpretativa, se separan las dos frases y cada una lleva su tag.

## Chequeo de vocabulario doctrinal (obligatorio antes de cerrar cada tanda)
Antes de dar una tanda de capítulos por cerrada, revisar específicamente contra el hebreo (no traducir de memoria) los términos de carga doctrinal fuerte que aparezcan: pacto (¿karat, natan, o heqim? — no son sinónimos, ver nota 118), pecado/culpa (¿chet, avon, pesha, chattaah? — raíces distintas), santo/consagrado, bendecir/maldecir (¿barak, qalal, o arar? — no son sinónimos, ver nota 84), alma/vida (¿nefesh, ruach, neshamah?), justicia (¿tzedaqah o mishpat? — no son sinónimos, ver nota 119), fe/confianza (¿aman? ver nota 107), temor (¿yirah en sentido reverencial o pachad en sentido de miedo?). Si dos capítulos usan palabras distintas para lo que el español traduciría igual, eso es nota. Si el mismo hebreo se repite donde el español variaría por elegancia, mantener la repetición en la traducción y nota la raíz compartida.

## Distinguir juego de sonido de etimología real
Cuando el texto explica un nombre propio, verificar si la raíz que el texto invoca es realmente la raíz etimológica de la palabra o si es una paronomasia (juego de sonido sobre una raíz distinta, real en hebreo bíblico como recurso literario pero no la etimología histórica). Casos ya establecidos como paronomasia y no etimología real: Noé/nacham (nota 65), Babel/balal (nota 97, etimología real es acadia "Bab-ili"), Abraham/"hamon goyim" (nota 114), Edom/adom (nota 137). Casos de etimología real y exacta ya verificados: Ismael/shama (nota 110), Reuvén/Simeón/Leví/Judá (nota 147). Marcar siempre cuál es cada caso — nunca presentar una paronomasia como si fuera la etimología histórica sin la aclaración.

## Compresión de tramos largos
Genealogías puramente enumerativas (listas de nombres sin acción narrativa) y diálogos que se repiten casi palabra por palabra dentro del mismo capítulo (ej. un mensaje que se da y luego se repite al ser transmitido) pueden comprimirse. Cuando se comprime, decirlo explícitamente entre corchetes en el propio texto (ver ejemplo en Gen 24:28-49 del archivo actual) — nunca comprimir en silencio como si fuera el texto completo.

## Notas cruzadas con otros libros
Cuando aparezca una correspondencia fuerte con un pasaje de otro libro del Tanaj (no Génesis), anotarla como "Nota fuera de corpus" al final de la tanda de notas correspondiente, aclarando que no pertenece a este libro, y no forzar el orden canónico de lectura para perseguirla — se deja anotada y se sigue avanzando en Génesis.

## Cuándo parar y preguntar
No parar a preguntar por decisiones de traducción menores. Parar y marcar (sin dejar de avanzar en el resto de la tanda) solo si una decisión de traducción contradice una ya tomada en capítulos anteriores del propio archivo, o si aparece un caso de disputa académica real y central que cambiaría significativamente el sentido de un pasaje clave.

## Cierre de cada tanda
1. Verificar que cada número de nota en superíndice del cuerpo tenga su nota correspondiente en LAS NOTAS, en el mismo orden en que aparecen en el texto (ya hubo un desorden de numeración una vez — chequear siempre antes de entregar).
2. Actualizar el título del archivo ("Coding the Bible — Génesis 1 a N") al último capítulo cerrado.
3. No tocar capítulos ni notas ya escritos salvo corrección explícita de un error.
