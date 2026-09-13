import fs from 'node:fs';
const md=fs.readFileSync('/Users/rcdopazo/Desktop/Coding-the-Bible_Genesis-1-2_v2.md','utf8');
const xml=fs.readFileSync('/Users/rcdopazo/Downloads/OSHB-v.2.2/Gen.xml','utf8');
const strip=s=>s.replace(/<[^>]+>/g,' ').replace(/\//g,'').replace(/\s+/g,' ').trim();
const heb={};
for(const m of xml.matchAll(/<verse osisID="Gen\.(1|2)\.(\d+)">([\s\S]*?)<\/verse>/g))heb[`${m[1]}:${m[2]}`]=strip(m[3]);
const textPart=md.split('# LAS NOTAS')[0];
const chapters={1:[],2:[]};let current=0;
for(const line of textPart.split('\n')){
  const h=line.match(/^## Génesis ([12])/);if(h){current=+h[1];continue}
  const v=line.match(/^\*\*(\d+(?:-\d+)?)\*\*\s+(.+)/);if(v&&current){
    const nums=v[1].includes('-')?v[1].split('-').map(Number):[+v[1]];
    const hebrew=nums.map(n=>heb[`${current}:${n}`]||'').join(' ');
    chapters[current].push({number:v[1],text:v[2].replace(/\*([^*]+)\*/g,'$1'),hebrew});
  }
}
const hs={1:'אֱלֹהִים',2:'בָּרָא',3:'תֹהוּ וָבֹהוּ',4:'תְהוֹם',5:'רוּחַ',6:'טוֹב',7:'עֶרֶב · בֹּקֶר',8:'יוֹם אֶחָד',9:'רָקִיעַ',10:'יַמִּים',11:'לְמִינוֹ',12:'מְאֹרֹת',13:'מוֹעֲדִים',14:'נֶפֶשׁ חַיָּה',15:'תַּנִּינִם',16:'צֶלֶם · דְּמוּת',17:'רָדָה · כָּבַשׁ',18:'טוֹב מְאֹד',19:'שָׁבַת',20:'תּוֹלְדֹת',21:'יְהוָה אֱלֹהִים',22:'אָדָם · אֲדָמָה',23:'אֵד',24:'יָצַר',25:'נִשְׁמַת חַיִּים',26:'נֶפֶשׁ חַיָּה',27:'עֵדֶן',28:'טוֹב וָרָע',29:'עָבַד · שָׁמַר',30:'עֵזֶר כְּנֶגְדּוֹ',31:'תַּרְדֵּמָה',32:'צֵלָע',33:'אִשָּׁה · אִישׁ',34:'דָּבַק',35:'עֲרוּמִּים'};
const teasers={1:'El plural que “Dios” suele ocultar.',3:'No caos moral: una tierra aún no habitable.',5:'Viento, aliento y espíritu en un mismo campo.',6:'¿Bueno o apto para funcionar?',9:'Un cielo trabajado a golpes.',14:'La misma expresión para animales y humano.',16:'Imagen como presencia delegada.',22:'El humano que lleva la tierra en el nombre.',28:'Apto y no-apto, antes que bien y mal.',30:'Rescate y paridad, no subordinación.',32:'Treinta y una veces “lado”; aquí, “costilla”.',35:'Un puente sonoro hacia la serpiente.'};
const notes=[];
for(const m of md.matchAll(/^\*\*(\d+) — ([^*]+)\*\*\s*([\s\S]*?)(?=\n\n\*\*\d+ —|$)/gm)){
  const id=+m[1], raw=m[3].trim();
  const evidence=[...new Set((raw.match(/\b(?:E[123]|D[12])\b/g)||[]))];
  notes.push({id,title:m[2].replace(/\s*\(.*?\)\.?$/,''),body:raw.replace(/\*([^*]+)\*/g,'$1').replace(/\*\*/g,''),evidence,hebrew:hs[id]||'',teaser:teasers[id]||''});
}
fs.mkdirSync('dist/data',{recursive:true});
fs.writeFileSync('dist/data/genesis.json',JSON.stringify({chapters,notes,meta:{source:'OSHB v2.2 / Códice de Leningrado',license:'CC BY 4.0',method:'DIMA'}},null,2));
