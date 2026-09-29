const $=id=>document.getElementById(id),T=new Date().toISOString().slice(0,10),M=T.slice(0,7);
const fmt=n=>Number(n||0).toLocaleString('th-TH'),KEY='dorm-v1';
const RS=['ว่าง','มีผู้เช่า','รอเข้าพัก','ปิดปรับปรุง'],RD={'ว่าง':'🟢','มีผู้เช่า':'🔵','รอเข้าพัก':'🟠','ปิดปรับปรุง':'🔴'};
const CH=['เงินสด','โอนธนาคาร','พร้อมเพย์/QR'];
const add=(d,m)=>{const x=new Date(d);x.setMonth(x.getMonth()+m);return x.toISOString().slice(0,10)};
function seed(){
 const occ=[101,102,103,201,202,203,301],names=['สมชาย ใจดี','สุภาพร แก้วมณี','ณัฐวุฒิ ศรีสุข','พิมพ์ชนก รุ่งเรือง','อนันต์ มั่นคง','ธนพร เพชรงาม','กิตติ วงศ์ไทย'];
 const st={104:'ว่าง',204:'รอเข้าพัก',302:'ปิดปรับปรุง',303:'ว่าง',304:'ว่าง'},rooms=[],tenants=[],bills=[];let id=1;
 for(let f=1;f<=3;f++)for(let n=1;n<=4;n++){const no=f*100+n,a=n>2;rooms.push({id:no,no,floor:f,type:a?'ห้องแอร์':'ห้องพัดลม',price:a?4200:3000,status:st[no]||'มีผู้เช่า'})}
 occ.forEach((r,i)=>{const start=add(T,-(i*2+3)),rm=rooms.find(x=>x.no==r);
  tenants.push({id:i+1,name:names[i],phone:'08'+(1234500+i*7919).toString().padStart(8,'0'),idcard:'1-9000-'+(10000+i*137),room:r,start,end:add(start,12),deposit:rm.price*2,status:'เช่าอยู่'});
  ['2026-07','2026-08','2026-09'].forEach(m=>{const w=3+i%3,e=90+i*12,tot=rm.price+w*18+e*8,late=r==103&&m=='2026-08',cur=m==M&&i%2;
   const s=late?'ค้างชำระ':cur?'รอชำระ':'ชำระแล้ว';bills.push({id:id++,month:m,room:r,rent:rm.price,w,e,other:0,total:tot,status:s,paid:s=='ชำระแล้ว'?m+'-05':'',ch:s=='ชำระแล้ว'?CH[i%3]:'',slip:''})})});
 return{rooms,tenants,bills,
  repairs:[{id:1,room:102,by:'สุภาพร แก้วมณี',type:'ระบบน้ำ',desc:'ก๊อกน้ำในห้องน้ำรั่ว',date:T,status:'รอดำเนินการ',cost:0,owner:'ช่างประสิทธิ์'},{id:2,room:302,by:'เจ้าของ',type:'ไฟฟ้า',desc:'เปลี่ยนสายไฟและเบรกเกอร์',date:add(T,0),status:'กำลังซ่อม',cost:2500,owner:'ช่างประสิทธิ์'}],
  news:[{id:1,title:'กำหนดชำระค่าเช่า',type:'แจ้งกำหนดชำระค่าเช่า',body:'กรุณาชำระค่าเช่าภายในวันที่ 5 ของทุกเดือน',date:T}],
  staff:[{id:1,name:'คุณเจ้าของหอ',role:'เจ้าของ'},{id:2,name:'ประสิทธิ์ ช่างดี',role:'ช่างซ่อม'}],log:[],
  set:{name:'หอพักสุขสบาย',addr:'123 ถ.เพชรเกษม อ.หาดใหญ่ จ.สงขลา',tel:'074-123456',wr:18,er:8,due:5,late:100,pay:'ธนาคารกรุงเทพ 123-4-56789-0 / พร้อมเพย์ 081-234-5678'}}
}
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}S=S||seed();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}},log=t=>{S.log.unshift({t:new Date().toLocaleString('th-TH'),msg:t});S.log=S.log.slice(0,30)};
const bd=(t,c)=>`<span class="bd ${c||({'ชำระแล้ว':'ok','ซ่อมเสร็จแล้ว':'ok','เช่าอยู่':'ok','รอชำระ':'wa','รอดำเนินการ':'wa','กำลังซ่อม':'in','ค้างชำระ':'er','ยกเลิก':'er','ย้ายออก':''}[t]||'')}">${t}</span>`;
const tbl=(h,r)=>`<div class="tw"><table><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr>${r.length?r.map(x=>`<tr>${x.map(c=>`<td>${c}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${h.length}" class="mut">ยังไม่มีข้อมูล</td></tr>`}</table></div>`;
const roomOpts=()=>S.rooms.map(r=>r.no);
/* ---------- modal / forms ---------- */
const openM=h=>{$('mc').innerHTML=h;$('m').style.display='flex'},closeM=()=>$('m').style.display='none';
$('m').onclick=e=>{if(e.target.id=='m')closeM()};
function form(title,fields,v,ok){
 window._ok=ok;window._f=fields;
 openM(`<h2>${title}</h2>`+fields.map(([n,l,t,o])=>{const val=v[n]??'',op=typeof o=='function'?o():o;
  return`<label>${l}</label>`+(t=='select'?`<select id="f_${n}">${op.map(x=>`<option${x==val?' selected':''}>${x}</option>`).join('')}</select>`:t=='area'?`<textarea id="f_${n}" rows="3">${val}</textarea>`:`<input id="f_${n}" type="${t}" value="${val}">`)}).join('')+
  `<p style="text-align:right"><button onclick="closeM()">ยกเลิก</button><button class="pri" onclick="submitF()">บันทึก</button></p>`)}
function submitF(){const o={};_f.forEach(([n,,t])=>{let x=$('f_'+n).value;o[n]=t=='number'?+x:x});_ok(o);closeM();save();render()}
/* generic CRUD */
const F={
 rooms:[['no','เลขห้อง','number'],['floor','ชั้น','number'],['type','ประเภทห้อง','select',['ห้องพัดลม','ห้องแอร์','ห้องสตูดิโอ']],['price','ราคาเช่า (บาท)','number'],['status','สถานะห้อง','select',RS]],
 tenants:[['name','ชื่อ–นามสกุล','text'],['phone','เบอร์โทรศัพท์','tel'],['idcard','เลขบัตรประชาชน','text'],['room','ห้องพัก','select',roomOpts],['start','วันที่เริ่มเช่า','date'],['end','วันที่สิ้นสุดสัญญา','date'],['deposit','เงินประกัน','number'],['status','สถานะการเช่า','select',['เช่าอยู่','ย้ายออก']]],
 repairs:[['room','เลขห้อง','select',roomOpts],['by','ผู้แจ้ง','text'],['type','ประเภทปัญหา','select',['ระบบน้ำ','ไฟฟ้า','เครื่องปรับอากาศ','เฟอร์นิเจอร์','อื่น ๆ']],['desc','รายละเอียด','area'],['img','รูปภาพปัญหา (ชื่อไฟล์/ลิงก์)','text'],['date','วันที่แจ้ง','date'],['status','สถานะ','select',['รอดำเนินการ','กำลังซ่อม','ซ่อมเสร็จแล้ว']],['cost','ค่าใช้จ่ายในการซ่อม','number'],['owner','ผู้รับผิดชอบ','text']],
 news:[['title','หัวข้อ','text'],['type','ประเภท','select',['แจ้งกำหนดชำระค่าเช่า','แจ้งน้ำไม่ไหล','แจ้งไฟฟ้าดับ','แจ้งทำความสะอาด','แจ้งซ่อมแซมพื้นที่ส่วนกลาง','ข่าวสารของหอพัก']],['body','รายละเอียด','area'],['date','วันที่','date']],
 staff:[['name','ชื่อ','text'],['role','สิทธิ์','select',['Admin','เจ้าของ','พนักงาน','ช่างซ่อม']]]
};
const DEF={rooms:{floor:1,type:'ห้องพัดลม',price:3000,status:'ว่าง'},tenants:{start:T,end:add(T,12),deposit:0,status:'เช่าอยู่'},repairs:{date:T,status:'รอดำเนินการ',cost:0,by:''},news:{date:T},staff:{role:'พนักงาน'}};
function edit(k,id){const r=id!=null?S[k].find(x=>x.id==id):null;
 form(r?'แก้ไข':'เพิ่มข้อมูล',F[k],r||DEF[k],o=>{
  if(r)Object.assign(r,o);else S[k].push({id:Date.now(),...o});
  if(k=='rooms'){const q=S.rooms.find(x=>x.no==o.no);q.id=q.id}
  if(k=='tenants'){const rm=S.rooms.find(x=>x.no==o.room);if(rm)rm.status=o.status=='เช่าอยู่'?'มีผู้เช่า':'ว่าง'}
  if(k=='repairs'){const rm=S.rooms.find(x=>x.no==o.room);if(rm&&o.status=='กำลังซ่อม')rm.status='ปิดปรับปรุง'}
  log((r?'แก้ไข ':'เพิ่ม ')+k)})}
function del(k,id){if(confirm('ลบรายการนี้?')){S[k]=S[k].filter(x=>x.id!=id);log('ลบ '+k);save();render()}}
const ab=(k,r)=>`<button onclick="edit('${k}',${r.id})">แก้ไข</button><button class="dg" onclick="del('${k}',${r.id})">ลบ</button>`;
const head=(t,k,x='')=>`<div class="bar"><h2>${t}</h2><div>${x}${k?`<button class="pri" onclick="edit('${k}')">+ เพิ่ม</button>`:''}</div></div>`;
/* ---------- business logic ---------- */
const tenantOf=no=>S.tenants.find(t=>t.room==no&&t.status=='เช่าอยู่');
const paid=()=>S.bills.filter(b=>b.status=='ชำระแล้ว');
function newBill(){form('สร้างบิลค่าเช่า',[['room','ห้อง','select',()=>S.tenants.filter(t=>t.status=='เช่าอยู่').map(t=>t.room)],['month','เดือน','month'],['w','ค่าน้ำ (หน่วยที่ใช้)','number'],['e','ค่าไฟ (หน่วยที่ใช้)','number'],['other','ค่าใช้จ่ายอื่น ๆ (บาท)','number']],{month:M,w:0,e:0,other:0},o=>{
  const rm=S.rooms.find(r=>r.no==o.room),s=S.set;
  S.bills.push({id:Date.now(),...o,rent:rm.price,total:rm.price+o.w*s.wr+o.e*s.er+o.other,status:'รอชำระ',paid:'',ch:'',slip:''});log('สร้างบิลห้อง '+o.room)})}
function pay(id){const b=S.bills.find(x=>x.id==id);form('รับชำระ ห้อง '+b.room+' ฿'+fmt(b.total),[['paid','วันที่ชำระ','date'],['ch','ช่องทางชำระ','select',CH],['slip','สลิป (ชื่อไฟล์)','text']],{paid:T},o=>{Object.assign(b,o,{status:'ชำระแล้ว'});log('รับชำระห้อง '+b.room)})}
function overdue(id){const b=S.bills.find(x=>x.id==id);b.status='ค้างชำระ';b.total+=S.set.late;log('ค้างชำระ+ค่าปรับ ห้อง '+b.room);save();render()}
function receipt(id){const b=S.bills.find(x=>x.id==id),t=tenantOf(b.room)||{},s=S.set;
 openM(`<h2>ใบเสร็จรับเงิน</h2><p><b>${s.name}</b><br><span class="mut">${s.addr} โทร ${s.tel}</span></p>
 <p>เลขที่ RC-${String(b.id).slice(-5)} · ห้อง ${b.room} · ${t.name||''}<br>ประจำเดือน ${b.month} · ชำระ ${b.paid} (${b.ch})</p>
 <table><tr><td>ค่าเช่า</td><td>${fmt(b.rent)}</td></tr><tr><td>ค่าน้ำ ${b.w} หน่วย</td><td>${fmt(b.w*s.wr)}</td></tr><tr><td>ค่าไฟ ${b.e} หน่วย</td><td>${fmt(b.e*s.er)}</td></tr><tr><td>อื่น ๆ / ค่าปรับ</td><td>${fmt(b.total-b.rent-b.w*s.wr-b.e*s.er)}</td></tr><tr><th>รวมทั้งสิ้น</th><th>฿${fmt(b.total)}</th></tr></table>
 <p style="text-align:right"><button onclick="closeM()">ปิด</button><button class="pri" onclick="print()">พิมพ์</button></p>`)}
const renew=id=>{const t=S.tenants.find(x=>x.id==id);t.end=add(t.end,12);log('ต่อสัญญา '+t.name);save();render()};
function cancel(id){if(!confirm('ยกเลิกสัญญานี้?'))return;const t=S.tenants.find(x=>x.id==id);t.status='ย้ายออก';const r=S.rooms.find(x=>x.no==t.room);if(r)r.status='ว่าง';log('ยกเลิกสัญญา '+t.name);save();render()}
const days=d=>Math.round((new Date(d)-new Date(T))/864e5);
/* ---------- views ---------- */
const V={
dash(){const r=S.rooms,c=s=>r.filter(x=>x.status==s).length,m=paid().filter(b=>b.paid.startsWith(M)).reduce((a,b)=>a+b.total,0),od=S.bills.filter(b=>b.status=='ค้างชำระ'),odS=od.reduce((a,b)=>a+b.total,0);
 const exp=S.tenants.filter(t=>t.status=='เช่าอยู่'&&days(t.end)<=60),pend=S.repairs.filter(x=>x.status!='ซ่อมเสร็จแล้ว');
 const K=(a,b,x='')=>`<div class="k"><span>${a}</span><b${x}>${b}</b></div>`;
 return head('ภาพรวมหอพัก')+`<div class="grid">${K('ห้องทั้งหมด',r.length)}${K('🟢 ห้องว่าง',c('ว่าง'))}${K('🔵 มีผู้เช่า',c('มีผู้เช่า'))}${K('🔴 กำลังซ่อม/ปิดปรับปรุง',c('ปิดปรับปรุง'))}${K('ผู้เช่าทั้งหมด',S.tenants.filter(t=>t.status=='เช่าอยู่').length)}${K('ค่าเช่าที่ได้รับเดือนนี้','฿'+fmt(m))}${K('ค่าเช่าค้างชำระ','฿'+fmt(odS),' style="color:var(--dg)"')}</div>
 <div class="box"><h3>การแจ้งเตือน</h3>${od.map(b=>`<div class="al">🔴 ห้อง ${b.room} ค้างชำระเดือน ${b.month} ฿${fmt(b.total)}</div>`).join('')}${exp.map(t=>`<div class="al">🟠 สัญญาห้อง ${t.room} (${t.name}) ${days(t.end)<0?'หมดอายุแล้ว':'จะหมดใน '+days(t.end)+' วัน'}</div>`).join('')}${od.length+exp.length?'':'<span class="mut">ไม่มีการแจ้งเตือน</span>'}</div>
 <div class="box"><h3>รายการแจ้งซ่อมล่าสุด</h3>${pend.map(x=>`<div class="al">ห้อง ${x.room} · ${x.type} · ${x.desc} ${bd(x.status)}</div>`).join('')||'<span class="mut">ไม่มีงานค้าง</span>'}</div>`},
rooms(){const f=S.rooms.slice().sort((a,b)=>a.no-b.no);
 return head('จัดการห้องพัก','rooms')+tbl(['ห้อง','ชั้น','ประเภท','ราคา','สถานะ','ผู้เช่าปัจจุบัน',''],f.map(r=>[r.no,r.floor,r.type,fmt(r.price),RD[r.status]+' '+r.status,(tenantOf(r.no)||{}).name||'-',ab('rooms',r)]))},
tenants(){return head('จัดการผู้เช่า','tenants')+tbl(['ชื่อ','โทร','บัตรประชาชน','ห้อง','เริ่มเช่า','สิ้นสุด','เงินประกัน','สถานะ',''],S.tenants.map(t=>[t.name,t.phone,t.idcard,t.room,t.start,t.end,fmt(t.deposit),bd(t.status),ab('tenants',t)]))},
bills(){const mo=window.bm||M,l=S.bills.filter(b=>b.month==mo);
 return head('ค่าเช่าและการชำระเงิน','',`<input type="month" value="${mo}" onchange="bm=this.value;render()"> <button class="pri" onclick="newBill()">+ สร้างบิล</button>`)+
 tbl(['ห้อง','ค่าเช่า','ค่าน้ำ','ค่าไฟ','อื่น ๆ','ยอดรวม','สถานะ',''],l.map(b=>[b.room,fmt(b.rent),fmt(b.w*S.set.wr),fmt(b.e*S.set.er),fmt(b.other),'<b>'+fmt(b.total)+'</b>',bd(b.status),b.status=='ชำระแล้ว'?`<button onclick="receipt(${b.id})">ใบเสร็จ</button>`:`<button class="pri" onclick="pay(${b.id})">รับชำระ</button>`+(b.status=='รอชำระ'?`<button class="dg" onclick="overdue(${b.id})">ค้างชำระ</button>`:'')]))},
hist(){const q=(window.hq||'').trim(),l=paid().filter(b=>!q||(b.room+b.month+b.ch+((tenantOf(b.room)||{}).name||'')).includes(q)).sort((a,b)=>b.paid.localeCompare(a.paid));
 return head('ประวัติการชำระเงิน','',`<input placeholder="ค้นหา ห้อง / ชื่อ / เดือน" value="${q}" onchange="hq=this.value;render()">`)+tbl(['ผู้เช่า','ห้อง','ของเดือน','วันที่จ่าย','จำนวน','ช่องทาง','ใบเสร็จ'],l.map(b=>[(tenantOf(b.room)||{}).name||'-',b.room,b.month,b.paid,fmt(b.total),b.ch,`<button onclick="receipt(${b.id})">ดู / พิมพ์</button>`]))},
repairs(){return head('แจ้งซ่อม','repairs')+tbl(['ห้อง','ผู้แจ้ง','ประเภท','รายละเอียด','วันที่','สถานะ','ค่าซ่อม','ผู้รับผิดชอบ',''],S.repairs.map(r=>[r.room,r.by,r.type,r.desc,r.date,bd(r.status),fmt(r.cost),r.owner,ab('repairs',r)]))},
contracts(){return head('สัญญาเช่า','tenants')+tbl(['ผู้เช่า','ห้อง','เริ่ม','หมดสัญญา','เงินประกัน','สถานะ',''],S.tenants.map(t=>{const d=days(t.end),on=t.status=='เช่าอยู่';return[t.name,t.room,t.start,t.end,fmt(t.deposit),on?(d<0?bd('หมดอายุแล้ว','er'):d<=60?bd('ใกล้หมด '+d+' วัน','wa'):bd('เช่าอยู่')):bd(t.status==='ย้ายออก'?'ยกเลิก':t.status),on?`<button onclick="renew(${t.id})">ต่อสัญญา +12 เดือน</button><button class="dg" onclick="cancel(${t.id})">ยกเลิก</button>`:'']}))},
news(){return head('ประกาศและแจ้งเตือน','news')+S.news.slice().reverse().map(n=>`<div class="box"><h3>${n.title} ${bd(n.type,'in')}</h3><p>${n.body}</p><span class="mut">${n.date}</span> ${ab('news',n)}</div>`).join('')},
report(){const ms=[...new Set(S.bills.map(b=>b.month))].sort(),inc=ms.map(m=>paid().filter(b=>b.month==m).reduce((a,b)=>a+b.total,0)),mx=Math.max(...inc,1);
 const occ=S.rooms.filter(r=>r.status=='มีผู้เช่า').length,ut=paid().reduce((a,b)=>a+b.w*S.set.wr+b.e*S.set.er,0),rc=S.repairs.reduce((a,b)=>a+b.cost,0),yr=paid().filter(b=>b.paid.startsWith(T.slice(0,4))).reduce((a,b)=>a+b.total,0);
 const svg=`<svg viewBox="0 0 ${ms.length*90+20} 190" width="100%" style="max-width:${ms.length*90+20}px">${inc.map((v,i)=>`<rect x="${i*90+25}" y="${160-v/mx*140}" width="50" height="${v/mx*140}" fill="var(--pri)" rx="3"/><text x="${i*90+50}" y="${152-v/mx*140}" text-anchor="middle" font-size="12" fill="currentColor">${fmt(v)}</text><text x="${i*90+50}" y="180" text-anchor="middle" font-size="12" fill="currentColor">${ms[i]}</text>`).join('')}</svg>`;
 const K=(a,b)=>`<div class="k"><span>${a}</span><b>${b}</b></div>`;
 return head('รายงาน')+`<div class="grid">${K('รายได้รายปี','฿'+fmt(yr))}${K('อัตราการเข้าพัก',Math.round(occ/S.rooms.length*100)+'%')}${K('ห้องว่าง',S.rooms.filter(r=>r.status=='ว่าง').length)}${K('ค่าเช่าค้างชำระ','฿'+fmt(S.bills.filter(b=>b.status=='ค้างชำระ').reduce((a,b)=>a+b.total,0)))}${K('รายได้ค่าน้ำ/ไฟ','฿'+fmt(ut))}${K('ค่าซ่อมรวม','฿'+fmt(rc))}</div><div class="box"><h3>รายได้รายเดือน (บาท)</h3>${svg}</div>`},
staff(){return head('พนักงาน / ผู้ดูแล','staff')+tbl(['ชื่อ','สิทธิ์',''],S.staff.map(s=>[s.name,bd(s.role,'in'),ab('staff',s)]))+`<div class="box" style="margin-top:14px"><h3>ประวัติการทำงาน</h3>${S.log.map(l=>`<div class="al"><span class="mut">${l.t}</span> ${l.msg}</div>`).join('')||'<span class="mut">ยังไม่มีประวัติ</span>'}</div>`},
set(){const s=S.set,L={name:'ชื่อหอพัก',addr:'ที่อยู่',tel:'เบอร์โทร',wr:'อัตราค่าน้ำ (บาท/หน่วย)',er:'อัตราค่าไฟ (บาท/หน่วย)',due:'วันครบกำหนดชำระ (ของทุกเดือน)',late:'ค่าปรับล่าช้า (บาท)',pay:'ช่องทางชำระเงิน / บัญชีธนาคาร / QR'};
 return head('ตั้งค่าระบบ')+`<div class="box" style="max-width:480px">${Object.keys(L).map(k=>`<label>${L[k]}</label><input style="width:100%" id="s_${k}" value="${s[k]}">`).join('')}<p><button class="pri" onclick="saveSet()">บันทึกการตั้งค่า</button> <button class="dg" onclick="if(confirm('ล้างข้อมูลทั้งหมดและกลับเป็นข้อมูลตัวอย่าง?')){S=seed();save();render()}">รีเซ็ตข้อมูล</button></p></div>`}
};
function saveSet(){Object.keys(S.set).forEach(k=>{const v=$('s_'+k).value;S.set[k]=typeof S.set[k]=='number'?+v:v});log('แก้ไขการตั้งค่า');save();render()}
const N=[['dash','🏢 ภาพรวม'],['rooms','🚪 ห้องพัก'],['tenants','👤 ผู้เช่า'],['bills','💰 ค่าเช่า/ชำระเงิน'],['hist','🧾 ประวัติชำระเงิน'],['repairs','🔧 แจ้งซ่อม'],['contracts','📄 สัญญาเช่า'],['news','📢 ประกาศ'],['report','📊 รายงาน'],['staff','👨‍💼 ผู้ดูแล'],['set','⚙️ ตั้งค่า']];
let cur='dash';
function render(){$('nav').innerHTML=`<h1>${S.set.name}</h1>`+N.map(([k,l])=>`<a tabindex="0" class="${k==cur?'on':''}" onclick="cur='${k}';render()" onkeydown="if(event.key=='Enter'){cur='${k}';render()}">${l}</a>`).join('');$('main').innerHTML=V[cur]();document.title=S.set.name}
render();