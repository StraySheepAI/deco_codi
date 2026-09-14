import fs from 'node:fs';

function buildBook({sourcePath,xmlPath,osisId,chapterHeaderRegex,maxChapter,hs,teasers,unlinkedChapters,outputName,globalVar}){
  const md=fs.readFileSync(sourcePath,'utf8');
  const xml=fs.readFileSync(xmlPath,'utf8');
  const cleanHebrew=s=>s.replace(/<note[\s\S]*?<\/note>/g,'').replace(/<[^>]+>/g,' ').replace(/\//g,'').replace(/\s+([־׃])/g,'$1').replace(/\s+/g,' ').trim();
  const hebrewChapters={};
  const verseRe=new RegExp(`<verse osisID="${osisId}\\.(\\d+)\\.(\\d+)">([\\s\\S]*?)<\\/verse>`,'g');
  for(const m of xml.matchAll(verseRe)){
    const chapter=+m[1]; hebrewChapters[chapter]??=[];
    hebrewChapters[chapter].push({number:m[2],hebrew:cleanHebrew(m[3])});
  }
  const codyChapters={}; let current=0;
  for(const line of md.split('# LAS NOTAS')[0].split('\n')){
    const h=line.match(chapterHeaderRegex); if(h){current=+h[1];codyChapters[current]??=[];continue}
    const v=line.match(/^\*\*(\d+(?:-\d+)?)\*\*\s+(.+)/);
    if(v&&current)codyChapters[current].push({number:v[1],text:v[2].replace(/\*([^*]+)\*/g,'$1')});
  }
  const superscriptDigits={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
  const noteChapters=new Map();
  for(const [chapter,verses] of Object.entries(codyChapters))for(const verse of verses)for(const marker of verse.text.matchAll(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g)){
    const id=+[...marker[0]].map(d=>superscriptDigits[d]).join('');
    if(id&&!noteChapters.has(id))noteChapters.set(id,+chapter);
  }
  const chapters={};
  for(let chapter=1;chapter<=maxChapter;chapter++){
    const cody=new Map((codyChapters[chapter]||[]).map(v=>[v.number,v.text]));
    chapters[chapter]=(hebrewChapters[chapter]||[]).map(v=>({...v,text:cody.get(v.number)||null}));
    for(const unit of codyChapters[chapter]||[]){
      if(!unit.number.includes('-'))continue;
      const numbers=unit.number.split('-').map(Number);
      chapters[chapter]=chapters[chapter].filter(v=>v.number.includes('-')||+v.number<numbers[0]||+v.number>numbers[1]);
      const hebrew=(hebrewChapters[chapter]||[]).filter(v=>+v.number>=numbers[0]&&+v.number<=numbers[1]).map(v=>v.hebrew).join(' ');
      chapters[chapter].push({number:unit.number,hebrew,text:unit.text});
      chapters[chapter].sort((a,b)=>parseInt(a.number)-parseInt(b.number));
    }
  }
  const notes=[];
  for(const m of md.matchAll(/^\*\*(\d+) — ([^*]+)\*\*\s*([\s\S]*?)(?=\n\n\*\*\d+ —|\n\n---|\n\n#|$)/gm)){
    const id=+m[1],raw=m[3].trim(),evidence=[...new Set(raw.match(/\b(?:E[123]|D[12])\b/g)||[])];
    notes.push({id,chapter:noteChapters.get(id)||unlinkedChapters[id]||null,title:m[2].replace(/\s*\(.*?\)\.?$/,''),body:raw.replace(/\*([^*]+)\*/g,'$1').replace(/\*\*/g,''),evidence,hebrew:hs[id]||'',teaser:teasers[id]||''});
  }
  const verseCount=Object.values(chapters).reduce((n,verses)=>n+verses.length,0);
  fs.mkdirSync('dist/data',{recursive:true});
  const payload={chapters,notes,meta:{source:'OSHB v2.2 / Códice de Leningrado',license:'CC BY 4.0',method:'CODI',hebrewChapters:maxChapter,codyChapters:Object.keys(codyChapters).map(Number).filter(n=>codyChapters[n].length),verseCount}};
  fs.writeFileSync(`dist/data/${outputName}.json`,JSON.stringify(payload,null,2));
  fs.writeFileSync(`dist/data/${outputName}-inline.js`,`window.${globalVar}=${JSON.stringify(payload,null,2)};\n`);
  return payload;
}

// --- Génesis ---
const genesisHs={1:'אֱלֹהִים',2:'בָּרָא',3:'תֹהוּ וָבֹהוּ',4:'תְהוֹם',5:'רוּחַ',6:'טוֹב',7:'עֶרֶב · בֹּקֶר',8:'יוֹם אֶחָד',9:'רָקִיעַ',10:'יַמִּים',11:'לְמִינוֹ',12:'מְאֹרֹת',13:'מוֹעֲדִים',14:'נֶפֶשׁ חַיָּה',15:'תַּנִּינִם',16:'צֶלֶם · דְּמוּת',17:'רָדָה · כָּבַשׁ',18:'טוֹב מְאֹד',19:'שָׁבַת',20:'תּוֹלְדֹת',21:'יְהוָה אֱלֹהִים',22:'אָדָם · אֲדָמָה',23:'אֵד',24:'יָצַר',25:'נִשְׁמַת חַיִּים',26:'נֶפֶשׁ חַיָּה',27:'עֵדֶן',28:'טוֹב וָרָע',29:'עָבַד · שָׁמַר',30:'עֵזֶר כְּנֶגְדּוֹ',31:'תַּרְדֵּמָה',32:'צֵלָע',33:'אִשָּׁה · אִישׁ',34:'דָּבַק',35:'עֲרוּמִּים',152:'תְּרָפִים',153:'מִטּוֹב עַד־רָע',154:'אֱלֹהַי',155:'פֶּשַׁע · חַטָּאת',156:'פַּחַד יִצְחָק',157:'כָּרַת בְּרִית',158:'יְגַר שָׂהֲדוּתָא',159:'אִישׁ',160:'יִשְׂרָאֵל',161:'פְּנִיאֵל',162:'נֶפֶשׁ',163:'גִּיד הַנָּשֶׁה',164:'וַיִּשָּׁקֵהוּ',165:'אֵל אֱלֹהֵי יִשְׂרָאֵל',166:'וַיְעַנֶּהָ',167:'נְבָלָה',168:'בְּמִרְמָה',169:'אֱלֹהֵי הַנֵּכָר',170:'חִתַּת אֱלֹהִים',171:'יִשְׂרָאֵל יִהְיֶה שְׁמֶךָ',172:'אֵל שַׁדַּי',173:'בֶּן־אוֹנִי · בִנְיָמִין',174:'פִּילֶגֶשׁ',175:'זָקֵן וּשְׂבַע יָמִים',176:'אַלּוּף',177:'לִפְנֵי מְלָךְ־מֶלֶךְ',178:'כְּתֹנֶת פַּסִּים',179:'יִשְׁמְעֵאלִים · מִדְיָנִים',180:'שְׁאוֹל',181:'יִבֵּם',182:'פֶּתַח עֵינַיִם',183:'זוֹנָה · קְדֵשָׁה',184:'צָדְקָה מִמֶּנִּי',185:'פֶּרֶץ',186:'וַיְהִי יְהוָה אֶת־יוֹסֵף',187:'יְפֵה־תֹאַר וִיפֵה מַרְאֶה',188:'וְחָטָאתִי לֵאלֹהִים',189:'אִישׁ עִבְרִי',190:'הֲלוֹא לֵאלֹהִים פִּתְרֹנִים',191:'אֶרֶץ הָעִבְרִים',192:'יִשָּׂא אֶת־רֹאשְׁךָ',193:'וַתִּפָּעֶם רוּחוֹ',194:'רוּחַ אֱלֹהִים בּוֹ',195:'אַבְרֵךְ',196:'צָפְנַת פַּעְנֵחַ',197:'מְנַשֶּׁה · אֶפְרַיִם',198:'עֶרְוַת הָאָרֶץ',199:'צָרַת נַפְשׁוֹ',200:'תּוֹעֵבָה',201:'חָמֵשׁ יָדוֹת',202:'נַחֵשׁ יְנַחֵשׁ',203:'עָוֺן',204:'יַעַל עִם־אֶחָיו',205:'כִּי לְמִחְיָה שְׁלָחַנִי אֱלֹהִים',206:'וַתְּחִי רוּחַ יַעֲקֹב',207:'אָנֹכִי אֵרֵד עִמְּךָ וְאָנֹכִי אַעַלְךָ',208:'שִׁשִּׁים וָשֵׁשׁ · שִׁבְעִים',209:'וַתְּהִי הָאָרֶץ לְפַרְעֹה',210:'עַל־רֹאשׁ הַמִּטָּה',211:'כִּרְאוּבֵן וְשִׁמְעוֹן יִהְיוּ־לִי',212:'שִׂכֵּל אֶת־יָדָיו',213:'הַמַּלְאָךְ הַגֹּאֵל אֹתִי',214:'אָחִיו הַקָּטֹן יִגְדַּל מִמֶּנּוּ',215:'שְׁכֶם אֶחָד',216:'פַּחַז כַּמַּיִם',217:'כְּלֵי חָמָס מְכֵרֹתֵיהֶם',218:'עַד כִּי־יָבֹא שילה',219:'עירה · סותה',220:'דָּן יָדִין · נָחָשׁ עֲלֵי־דֶרֶךְ',221:'לִישׁוּעָתְךָ קִוִּיתִי יְהוָה',222:'גָּד גְּדוּד יְגוּדֶנּוּ',223:'רֹעֶה אֶבֶן יִשְׂרָאֵל',224:'בִּרְכֹת תְּהוֹם',225:'וְשָׁמָּה קָבַרְתִּי אֶת־לֵאָה',226:'וַיַּחַנְטוּ',227:'אָבֵל מִצְרַיִם',228:'שָׂא נָא פֶּשַׁע אַחֶיךָ וְחַטָּאתָם',229:'הֲתַחַת אֱלֹהִים אָנִי',230:'יֻלְּדוּ עַל־בִּרְכֵּי יוֹסֵף',231:'פָּקֹד יִפְקֹד',232:'וַיִּישֶׂם בָּאָרוֹן בְּמִצְרָיִם'};
const genesisTeasers={1:'El plural que “Dios” suele ocultar.',3:'No caos moral: una tierra aún no habitable.',5:'Viento, aliento y espíritu en un mismo campo.',6:'¿Bueno o apto para funcionar?',9:'Un cielo trabajado a golpes.',14:'La misma expresión para animales y humano.',16:'Imagen como presencia delegada.',22:'El humano que lleva la tierra en el nombre.',28:'Apto y no-apto, antes que bien y mal.',30:'Rescate y paridad, no subordinación.',32:'Treinta y una veces “lado”; aquí, “costilla”.',35:'Un puente sonoro hacia la serpiente.',152:'Ídolos de bolsillo, robados sin explicación.',153:'La misma pareja de palabras del Edén, vuelta modismo.',154:'Cuando “mis dioses” caben en la alforja de un camello.',155:'Dos palabras hebreas, una sola en español.',156:'El nombre de una divinidad que da miedo, no reverencia.',157:'El mismo corte, ahora entre dos humanos.',158:'La primera frase en arameo de toda la Torá.',159:'Toda la noche, solo “un varón”.',160:'¿Luchar con El, o ser gobernado por El?',161:'Rostro a rostro, dos veces en dos capítulos.',162:'La misma raíz de “aliento-viviente”, ahora sola.',163:'Una prohibición alimentaria nacida de un golpe.',164:'Puntos suspendidos sobre un beso.',165:'El nombre nuevo, ahora parte de un título divino.',166:'El verbo que marca que no hubo consentimiento.',167:'Una palabra reservada para el ultraje grave.',168:'El mismo engaño que sufrió Jacob, ahora lo usan sus hijos.',169:'Los ídolos, por fin, enterrados.',170:'Cuando “de Elohim” solo significa “enorme”.',171:'Esta vez, sin ambigüedad sobre quién habla.',172:'¿El Todopoderoso, o el de la montaña?',173:'El último nombre que da una madre moribunda.',174:'Un cambio de estatus que el texto marca con precisión.',175:'La misma fórmula que cerró la vida de Abraham.',176:'Un título que comparte raíz con “mil”.',177:'Un versículo que ya sabe que Israel tendrá reyes.',178:'No “de colores”: la misma prenda que viste una princesa.',179:'Tres nombres distintos para los mismos mercaderes.',180:'El primer nombre del lugar de los muertos, sin más.',181:'Un deber matrimonial que el texto asume, sin explicarlo.',182:'Se sienta a “la entrada de los ojos”, y él no la ve.',183:'Dos palabras para la misma mujer, según quién mira.',184:'Judá admite: ella tuvo más razón que yo.',185:'El nombre nace del grito de la partera.',186:'La frase que enmarca todo el capítulo.',187:'La misma belleza que se dijo de la madre.',188:'El primer pecado nombrado antes de cometerse.',189:'Un nombre que los demás usan para él.',190:'Interpretar no es una destreza propia.',191:'Un territorio que todavía no existe como tal.',192:'El mismo modismo, con dos finales opuestos.',193:'El mismo campo de palabras del viento y el aliento.',194:'Lo que un faraón politeísta cree estar viendo.',195:'Un grito de protocolo sin origen seguro.',196:'Un nombre egipcio, para un lugar en la corte egipcia.',197:'Dos etimologías reales, no juegos de sonido.',198:'La “desnudez” de un territorio, no de un cuerpo.',199:'La súplica que ellos mismos recuerdan haber ignorado.',200:'La primera vez que aparece una palabra que pesará mucho después.',201:'El favoritismo del padre, repetido por el propio hijo.',202:'José se presenta como adivino ante sus propios hermanos.',203:'Una tercera palabra hebrea para lo que el español llama culpa.',204:'El mismo hermano, en la misma escena, actuando al revés.',205:'José reescribe quién lo vendió a Egipto.',206:'El mismo campo de palabras del aliento y el viento.',207:'La promesa de volver a subir, sembrada antes de bajar.',208:'Dos cifras del propio texto que no cierran solas.',209:'Egipto entero, propiedad de la corona.',210:'Las mismas letras, ¿cama o bastón?',211:'Dos nietos, ascendidos a hijos.',212:'El mismo verbo del discernimiento, en un gesto de manos.',213:'Elohim y el mensajero, nombrados en la misma frase.',214:'El menor, otra vez, por encima del mayor.',215:'Una porción, o una ciudad con historia.',216:'La primogenitura, perdida por una sola escena.',217:'Jacob maldice el furor, no a los hijos.',218:'La palabra más discutida de toda la bendición.',219:'Letras que el propio texto masorético marca distinto.',220:'Un nombre real, y una imagen aparte.',221:'El único verso en primera persona de todo el poema.',222:'Tres veces la misma raíz en un solo verso.',223:'Un título divino que no vuelve a aparecer.',224:'El abismo del capítulo uno, ahora fuente de bendición.',225:'Una lista de tumbas donde falta un nombre.',226:'La primera momificación descrita en el corpus.',227:'Un lugar nombrado por el llanto que ocurrió ahí.',228:'Un mandato de Jacob que el texto nunca registró.',229:'José se niega a ocupar el lugar de Elohim.',230:'Un gesto de adopción, no solo de ternura.',231:'La frase que después reconocerá a Moisés.',232:'Génesis termina en un cajón, no en la tierra prometida.'};
const genesisUnlinked={122:19,123:19,124:19,133:23};

buildBook({
  sourcePath:process.argv[2]||'/Users/rcdopazo/Applications/decoding-the-bible/Coding-the-Bible_Genesis-1-2_v2_3_1.md',
  xmlPath:'/Users/rcdopazo/Applications/decoding-the-bible/OSHB-v.2.2/Gen.xml',
  osisId:'Gen',
  chapterHeaderRegex:/^## Génesis (\d+)/,
  maxChapter:50,
  hs:genesisHs,
  teasers:genesisTeasers,
  unlinkedChapters:genesisUnlinked,
  outputName:'genesis',
  globalVar:'GENESIS_DATA'
});

// --- Éxodo ---
const exodoHs={1:'פָּרוּ וַיִּשְׁרְצוּ',2:'מֶלֶךְ חָדָשׁ',3:'עָרֵי מִסְכְּנוֹת',4:'כֵּן יִרְבֶּה וְכֵן יִפְרֹץ',5:'וַתִּירֶאןָ הַמְיַלְּדֹת אֶת־הָאֱלֹהִים',6:'כִּי טוֹב הוּא',7:'תֵּבַת גֹּמֶא',8:'מֹשֶׁה',9:'וַיַּךְ אֶת־הַמִּצְרִי',10:'מִי שָׂמְךָ לְאִישׁ שַׂר וְשֹׁפֵט',11:'וַיִּזְכֹּר אֱלֹהִים אֶת־בְּרִיתוֹ',12:'סְנֶה',13:'אַדְמַת־קֹדֶשׁ',14:'רָאֹה רָאִיתִי · וָאֵרֵד',15:'אֶרֶץ זָבַת חָלָב וּדְבָשׁ',16:'אֶהְיֶה אֲשֶׁר אֶהְיֶה',17:'וְנִצַּלְתֶּם אֶת־מִצְרָיִם',18:'וַיְהִי לְנָחָשׁ',19:'מְצֹרַעַת כַּשָּׁלֶג',20:'כְּבַד פֶּה וּכְבַד לָשׁוֹן',21:'מִי שָׂם פֶּה לָאָדָם',22:'וְאַתָּה תִּהְיֶה־לּוֹ לֵאלֹהִים',23:'וַאֲנִי אֲחַזֵּק אֶת־לִבּוֹ',24:'בְּנִי בְכֹרִי יִשְׂרָאֵל',25:'חֲתַן־דָּמִים',26:'וַיַּאֲמֵן הָעָם',27:'לֹא יָדַעְתִּי אֶת־יְהוָה',28:'בְּאֵל שַׁדַּי וּשְׁמִי יְהוָה לֹא נוֹדַעְתִּי',29:'גָּאַלְתִּי',30:'עֲרַל שְׂפָתָיִם',31:'יוֹכֶבֶד דֹּדָתוֹ',32:'נְתַתִּיךָ אֱלֹהִים לְפַרְעֹה',33:'וַאֲנִי אַקְשֶׁה אֶת־לִבּוֹ',34:'וַיְהִי לְתַנִּין',35:'בְּזֹאת תֵּדַע כִּי אֲנִי יְהוָה',36:'אֶצְבַּע אֱלֹהִים הִוא',37:'וְשַׂמְתִּי פְדֻת',38:'תּוֹעֲבַת מִצְרַיִם',39:'וְהִפְלָה יְהוָה',40:'וּלְמַעַן סַפֵּר שְׁמִי בְּכָל־הָאָרֶץ',41:'יְהוָה הַצַּדִּיק',42:'לְמַעַן תְּסַפֵּר בְּאָזְנֵי בִנְךָ',43:'וּלְכָל־בְּנֵי יִשְׂרָאֵל הָיָה אוֹר',44:'לֹא יֶחֱרַץ־כֶּלֶב לְשֹׁנוֹ',45:'הַחֹדֶשׁ הַזֶּה לָכֶם רֹאשׁ חֳדָשִׁים',46:'שֶׂה תָמִים',47:'בֵּין הָעַרְבָּיִם',48:'פֶּסַח',49:'וּבְכָל־אֱלֹהֵי מִצְרַיִם אֶעֱשֶׂה שְׁפָטִים',50:'וְנִכְרְתָה הַנֶּפֶשׁ הַהִוא',51:'הַמַּשְׁחִית',52:'שֵׁשׁ־מֵאוֹת אֶלֶף רַגְלִי',53:'עֵרֶב רַב',54:'שְׁלֹשִׁים שָׁנָה וְאַרְבַּע מֵאוֹת שָׁנָה',55:'תּוֹרָה אַחַת לָאֶזְרָח וְלַגֵּר'};
const exodoTeasers={1:'Los mismos verbos de la bendición de la creación.',2:'El olvido con el que arranca todo el libro.',3:'Ciudades reales, fuera del propio texto.',4:'La opresión produce el efecto contrario.',5:'La primera desobediencia civil del corpus.',6:'La misma palabra que organizó los siete días.',7:'La misma arqueta que salvó a Noé.',8:'Una etimología hebrea para un nombre egipcio.',9:'El primer acto violento de Moshé, sin juicio del narrador.',10:'Una burla que termina siendo profecía.',11:'El pacto ya hecho, ahora invocado.',12:'Una zarza que suena como un monte.',13:'Tierra consagrada, no por rito sino por presencia.',14:'El mismo verbo con que Elohim bajó a mirar Babel.',15:'La fórmula fija de la tierra prometida.',16:'El nombre que se explica con su propio verbo.',17:'El despojo, anunciado antes de ocurrir.',18:'La misma serpiente del jardín, ahora señal de poder.',19:'La primera mención de la afección que después regula Levítico.',20:'La misma raíz que después describe un corazón terco.',21:'Quién le dio boca al humano de tierra.',22:'Moshé, “elohim” para su propio hermano.',23:'El primer verbo de una larga cadena de endurecimiento.',24:'La amenaza final, anunciada desde el capítulo cuatro.',25:'Una de las escenas más oscuras de toda la Torá.',26:'La misma raíz de “creer” que usó Abraham.',27:'La frase que todo el ciclo de plagas viene a corregir.',28:'La crux que sostiene la hipótesis documentaria.',29:'La misma raíz del rescate de parentesco de Jacob.',30:'Incircunciso, pero de labios.',31:'Un matrimonio que la ley posterior prohibirá.',32:'La misma palabra de función, ahora a mayor escala.',33:'La tercera raíz de un corazón que se resiste.',34:'La misma bestia del caos de Génesis 1, domesticada en una vara.',35:'La fórmula que organiza todo el ciclo de plagas.',36:'La primera confesión viene del bando contrario.',37:'La primera vez que el texto marca la asimetría entre los dos pueblos.',38:'La misma palabra, dos abominaciones distintas.',39:'Una raíz de asombro, usada como verbo de separación.',40:'El versículo que hizo famosa la pregunta por la libertad de faraón.',41:'Una confesión que no cambia nada, un versículo después.',42:'Las plagas, pensadas para ser contadas a los nietos.',43:'La misma separación de luz y oscuridad del primer capítulo.',44:'Ni el gruñido de un perro, en la noche del gran clamor.',45:'El calendario entero se reinicia con este versículo.',46:'El primer término técnico del vocabulario sacrificial.',47:'Una franja horaria que la propia tradición judía discute.',48:'Un nombre con dos etimologías posibles, ninguna cerrada.',49:'Los dioses egipcios, nombrados con la misma palabra que Elohim.',50:'La primera vez que aparece la pena de ser “cortado”.',51:'Una figura aparte de YHWH, que ejecuta y a la que se le impide entrar.',52:'Una cifra que la demografía moderna no logra sostener.',53:'Quienes salieron de Egipto no eran solo israelitas.',54:'Una cifra que no cuadra con solo cuatro generaciones.',55:'La misma ley para el nativo y para el extranjero.'};
const exodoUnlinked={};

buildBook({
  sourcePath:process.argv[3]||'/Users/rcdopazo/Applications/decoding-the-bible/Coding-the-Bible_Exodo.md',
  xmlPath:'/Users/rcdopazo/Applications/decoding-the-bible/OSHB-v.2.2/Exod.xml',
  osisId:'Exod',
  chapterHeaderRegex:/^## Éxodo (\d+)/,
  maxChapter:40,
  hs:exodoHs,
  teasers:exodoTeasers,
  unlinkedChapters:exodoUnlinked,
  outputName:'exodo',
  globalVar:'EXODO_DATA'
});
