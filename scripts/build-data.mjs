import fs from 'node:fs';
const sourcePath=process.argv[2]||'/Users/rcdopazo/Downloads/Coding-the-Bible_Genesis-1-2_v2.md';
const md=fs.readFileSync(sourcePath,'utf8');
const xml=fs.readFileSync('/Users/rcdopazo/Downloads/OSHB-v.2.2/Gen.xml','utf8');
const cleanHebrew=s=>s.replace(/<note[\s\S]*?<\/note>/g,'').replace(/<[^>]+>/g,' ').replace(/\//g,'').replace(/\s+([־׃])/g,'$1').replace(/\s+/g,' ').trim();
const hebrewChapters={};
for(const m of xml.matchAll(/<verse osisID="Gen\.(\d+)\.(\d+)">([\s\S]*?)<\/verse>/g)){
  const chapter=+m[1]; hebrewChapters[chapter]??=[];
  hebrewChapters[chapter].push({number:m[2],hebrew:cleanHebrew(m[3])});
}
const codyChapters={}; let current=0;
for(const line of md.split('# LAS NOTAS')[0].split('\n')){
  const h=line.match(/^## Génesis (\d+)/); if(h){current=+h[1];codyChapters[current]??=[];continue}
  const v=line.match(/^\*\*(\d+(?:-\d+)?)\*\*\s+(.+)/);
  if(v&&current)codyChapters[current].push({number:v[1],text:v[2].replace(/\*([^*]+)\*/g,'$1')});
}
const chapters={};
for(let chapter=1;chapter<=50;chapter++){
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
const hs={1:'אֱלֹהִים',2:'בָּרָא',3:'תֹהוּ וָבֹהוּ',4:'תְהוֹם',5:'רוּחַ',6:'טוֹב',7:'עֶרֶב · בֹּקֶר',8:'יוֹם אֶחָד',9:'רָקִיעַ',10:'יַמִּים',11:'לְמִינוֹ',12:'מְאֹרֹת',13:'מוֹעֲדִים',14:'נֶפֶשׁ חַיָּה',15:'תַּנִּינִם',16:'צֶלֶם · דְּמוּת',17:'רָדָה · כָּבַשׁ',18:'טוֹב מְאֹד',19:'שָׁבַת',20:'תּוֹלְדֹת',21:'יְהוָה אֱלֹהִים',22:'אָדָם · אֲדָמָה',23:'אֵד',24:'יָצַר',25:'נִשְׁמַת חַיִּים',26:'נֶפֶשׁ חַיָּה',27:'עֵדֶן',28:'טוֹב וָרָע',29:'עָבַד · שָׁמַר',30:'עֵזֶר כְּנֶגְדּוֹ',31:'תַּרְדֵּמָה',32:'צֵלָע',33:'אִשָּׁה · אִישׁ',34:'דָּבַק',35:'עֲרוּמִּים'};
const teasers={1:'El plural que “Dios” suele ocultar.',3:'No caos moral: una tierra aún no habitable.',5:'Viento, aliento y espíritu en un mismo campo.',6:'¿Bueno o apto para funcionar?',9:'Un cielo trabajado a golpes.',14:'La misma expresión para animales y humano.',16:'Imagen como presencia delegada.',22:'El humano que lleva la tierra en el nombre.',28:'Apto y no-apto, antes que bien y mal.',30:'Rescate y paridad, no subordinación.',32:'Treinta y una veces “lado”; aquí, “costilla”.',35:'Un puente sonoro hacia la serpiente.'};
const notes=[];
const noteChapter=id=>id<=18?1:id<=35?2:id<=47?3:id<=60?4:id<=65?5:id<=75?6:id<=80?7:id<=85?8:9;
for(const m of md.matchAll(/^\*\*(\d+) — ([^*]+)\*\*\s*([\s\S]*?)(?=\n\n\*\*\d+ —|\n\n---|\n\n#|$)/gm)){
  const id=+m[1],raw=m[3].trim(),evidence=[...new Set(raw.match(/\b(?:E[123]|D[12])\b/g)||[])];
  notes.push({id,chapter:noteChapter(id),title:m[2].replace(/\s*\(.*?\)\.?$/,''),body:raw.replace(/\*([^*]+)\*/g,'$1').replace(/\*\*/g,''),evidence,hebrew:hs[id]||'',teaser:teasers[id]||''});
}
const verseCount=Object.values(chapters).reduce((n,verses)=>n+verses.length,0);
fs.mkdirSync('dist/data',{recursive:true});
const payload={chapters,notes,meta:{source:'OSHB v2.2 / Códice de Leningrado',license:'CC BY 4.0',method:'CODI',hebrewChapters:50,codyChapters:Object.keys(codyChapters).map(Number).filter(n=>codyChapters[n].length),verseCount}};
fs.writeFileSync('dist/data/genesis.json',JSON.stringify(payload,null,2));
fs.writeFileSync('dist/data/genesis-inline.js',`window.GENESIS_DATA=${JSON.stringify(payload,null,2)};\n`);
