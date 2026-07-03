
// ============ Defaults ============
const DOW_ORDER=[1,2,3,4,5,6,0];
const DOW_SHORT={0:"Sun",1:"Mon",2:"Tue",3:"Wed",4:"Thu",5:"Fri",6:"Sat"};

function defTemplates(){return {
 office:{label:"Office day", mode:"Survival + recovery mode", carries:"Survival · animals · gentle movement", blocks:[
  {t:"05:00",b:"Wake · meds/water · feed animals · litter scoop",tag:""},
  {t:"05:20",b:"Short dog walk (15–20 min)",tag:""},
  {t:"05:45",b:"Get ready · grab pre-prepped breakfast, lunch + bag",tag:""},
  {t:"06:00",b:"Leave — commute (headphones / podcast / audio study)",tag:""},
  {t:"08:00",b:"Work · lunch: eat + short walk",tag:""},
  {t:"16:00",b:"Commute home",tag:""},
  {t:"18:00",b:"Arrive — 15–20 min decompression. No demands.",tag:"protected"},
  {t:"18:20",b:"Longer dog walk + animal care",tag:""},
  {t:"19:00",b:"Reheat dinner (no cooking)",tag:""},
  {t:"19:45",b:"10-min home reset (timer)",tag:""},
  {t:"20:00",b:"Wind-down: screens down, prep tomorrow",tag:"protected"},
  {t:"21:00",b:"Bed — aim ~8 hrs",tag:""} ]},
 home:{label:"Home day", mode:"Workhorse mode", carries:"Study · exercise · animal play", blocks:[
  {t:"05:30",b:"Wake · feed animals · litter",tag:""},
  {t:"06:15",b:"Dog walk (20–30 min)",tag:""},
  {t:"06:45",b:"Reclaimed block: exercise OR study (25–45 min)",tag:""},
  {t:"08:00",b:"Work · lunch: real break",tag:""},
  {t:"16:00",b:"Transition buffer",tag:"protected"},
  {t:"16:20",b:"Second block: study / exercise / batch-cook",tag:""},
  {t:"18:00",b:"Dinner",tag:""},
  {t:"18:45",b:"Main dog walk + play",tag:""},
  {t:"19:30",b:"One cleaning zone — 15 min timer",tag:""},
  {t:"20:00",b:"Wind-down",tag:""},
  {t:"21:30",b:"Bed",tag:""} ]},
 sat:{label:"Weekend", mode:"Big-movement + errands day", carries:"Long activity · groceries · deep-clean · social", blocks:[
  {t:"07:00",b:"Wake · feed animals · litter · coffee",tag:""},
  {t:"07:30",b:"Long activity: hike / long walk + strength",tag:""},
  {t:"10:00",b:"Grocery shop for the week",tag:""},
  {t:"12:00",b:"Lunch + rest",tag:""},
  {t:"13:00",b:"One deeper cleaning zone (timed)",tag:""},
  {t:"14:00",b:"Slot B: social / hobby / creative",tag:"slot"},
  {t:"17:00",b:"Dinner + evening dog walk",tag:""},
  {t:"20:00",b:"Wind-down",tag:""},
  {t:"21:30",b:"Bed",tag:""} ]},
 sun:{label:"Weekend", mode:"Reset day — cook, gentle move, plan, rest", carries:"Batch-cook · yoga · study · reset", blocks:[
  {t:"07:00",b:"Wake · feed animals · litter",tag:""},
  {t:"07:30",b:"Gentle exercise: yoga / mobility",tag:""},
  {t:"09:00",b:"Batch-cook the week's meals",tag:""},
  {t:"12:00",b:"Lunch",tag:""},
  {t:"13:00",b:"Study block (~1.5 hr, timed)",tag:""},
  {t:"15:00",b:"Next-week reset: plan + prep tomorrow",tag:""},
  {t:"16:00",b:"Genuine downtime / rest",tag:"protected"},
  {t:"17:30",b:"Dinner + dog walk",tag:""},
  {t:"20:00",b:"Wind-down",tag:""},
  {t:"21:00",b:"Bed",tag:""} ]},
};}

function defConfig(){return {
 name:"",
 workStart:"08:00", workEnd:"16:00",
 workDays:[1,2,3,4,5], officeDays:[1,3,5],
 commute:120, lunchStart:"11:00", lunchEnd:"12:00",
 templates:defTemplates(),
 essentials:["Animals fed + litter","Dogs walked (short is fine)","You fed","Water + meds","You sleep"],
 cycle:{enabled:false, start:"", len:28, period:5}
};}

const PHASES={
 menstrual:{label:"Menstrual",emoji:"🩸",color:"#a8434f",energy:2,
  move:"Swap hard strength/cardio for gentle — walks, yoga, mobility. Baseline walks stay.",
  mind:"Keep study light or audio-only. Minimum viable day counts double.",
  care:"Rest, warmth, iron-rich food, more sleep. No guilt for doing less."},
 follicular:{label:"Follicular",emoji:"🌱",color:"#3f6f5c",energy:4,
  move:"Energy's rising — progress strength, try new movement.",
  mind:"Sharpest focus. Tackle harder study; good time to start new projects.",
  care:"Use the momentum — but keep your anchors and buffers."},
 ovulatory:{label:"Ovulatory",emoji:"☀️",color:"#c8912f",energy:5,
  move:"Strongest days — hardest workouts, long activity, heavy strength.",
  mind:"Most social + verbal. Best window for social plans.",
  care:"High energy — but protect sleep + decompression as always."},
 luteal_early:{label:"Early luteal",emoji:"🍂",color:"#a9784f",energy:3,
  move:"Still solid — steady sessions, start easing intensity down.",
  mind:"Better for finishing + consolidating than starting new things.",
  care:"Appetite rises — lean on batch-cooked meals; keep routines steady."},
 luteal_late:{label:"Late luteal (PMS)",emoji:"🌘",color:"#6b5b8a",energy:2,
  move:"Dial exercise back to gentle. Don't force hard sessions.",
  mind:"Cut study first if overloaded. Expect lower focus + more sensitivity.",
  care:"Overwhelm hits hardest now — guard decompression + sleep, comfort food, extra kindness."},
};

// ============ State ============
let cfg=null;
let viewDate=new Date();
let low=false;
let editTmpl='office';

function loadConfig(){ try{ const s=localStorage.getItem('wos_config_v2'); return s?JSON.parse(s):null; }catch(e){ return null; } }
function saveConfig(c){ localStorage.setItem('wos_config_v2', JSON.stringify(c)); }

// ============ Helpers ============
function toMin(hhmm){ const p=(hhmm||"0:0").split(':'); return (parseInt(p[0])||0)*60+(parseInt(p[1])||0); }
function fmt(hhmm){ let m=toMin(hhmm); let h=Math.floor(m/60), mm=m%60; const ap=h<12?'am':'pm'; let h12=h%12; if(h12===0)h12=12; return h12+(mm?':'+String(mm).padStart(2,'0'):'')+ap; }
function sameDay(a,b){ return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate(); }
function startOfWeekMon(d){ const x=new Date(d); const dow=x.getDay(); const diff=(dow===0?-6:1-dow); x.setDate(x.getDate()+diff); x.setHours(0,0,0,0); return x; }

function typeForDow(dow){
  if(cfg.officeDays.includes(dow)) return 'office';
  if(cfg.workDays.includes(dow)) return 'home';
  if(dow===0) return 'sun';
  return 'sat';
}
function bannerClass(tKey){ return (tKey==='office')?'office':(tKey==='home')?'home':'weekend'; }
function tmplFor(dow){ return cfg.templates[typeForDow(dow)]; }

// ============ Cycle ============
function cycleFor(date){
  if(!cfg.cycle.enabled || !cfg.cycle.start) return null;
  const L=parseInt(cfg.cycle.len)||28, P=parseInt(cfg.cycle.period)||5;
  const s=new Date(cfg.cycle.start+'T00:00:00');
  const d=new Date(date); d.setHours(0,0,0,0);
  let diff=Math.floor((d-s)/86400000); if(diff<0) diff=0;
  let day=(diff%L)+1;
  const ovDay=Math.max(L-14,P+2), ovS=ovDay-1, ovE=ovDay+1;
  let key = day<=P?'menstrual' : day<ovS?'follicular' : day<=ovE?'ovulatory' : day<=L-4?'luteal_early' : 'luteal_late';
  return Object.assign({day:day,L:L}, PHASES[key]);
}

// ============ Render app ============
function render(){
  const now=new Date();
  document.getElementById('clock').textContent=now.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
  document.getElementById('apptitle').textContent=(cfg.name?cfg.name.toUpperCase()+"'S WEEK":"MY WEEK");

  const dow=viewDate.getDay();
  const tKey=typeForDow(dow);
  const meta=cfg.templates[tKey];
  const isToday=sameDay(viewDate,now);

  // nav
  document.getElementById('navdate').textContent=viewDate.toLocaleDateString([], {weekday:'long', month:'short', day:'numeric'});
  document.getElementById('navtoday').textContent=isToday?'Today':'';

  // banner
  document.getElementById('banner').className='banner '+bannerClass(tKey);
  document.getElementById('bdate').textContent=viewDate.toLocaleDateString([], {weekday:'long', month:'long', day:'numeric'});
  document.getElementById('btype').textContent=meta.label;
  document.getElementById('bmode').textContent=meta.mode;

  // sorted blocks
  const blocks=meta.blocks.slice().sort((a,b)=>toMin(a.t)-toMin(b.t));
  const nm=now.getHours()*60+now.getMinutes();
  let cur=-1;
  if(isToday){ for(let i=0;i<blocks.length;i++){ if(nm>=toMin(blocks[i].t)) cur=i; } }

  // now card
  const act=document.getElementById('act'), win=document.getElementById('win'), then=document.getElementById('then');
  document.getElementById('nowlbl').textContent=isToday?'Right now':'Planned day';
  if(isToday){
    if(cur===-1){ const f=blocks[0]; act.textContent="First up: "+(f?f.b:'—'); win.textContent=f?("From "+fmt(f.t)):""; then.textContent=""; }
    else{ const c=blocks[cur]; act.textContent=c.b; win.textContent="Started "+fmt(c.t);
      const nx=blocks[cur+1]; then.innerHTML=nx?("<b>Then "+fmt(nx.t)+":</b> "+nx.b):"Last block — rest well."; }
  } else {
    act.textContent=meta.label+" — "+meta.mode;
    win.textContent=blocks.length+" blocks planned";
    const f=blocks[0]; then.innerHTML=f?("<b>Starts "+fmt(f.t)+":</b> "+f.b):"";
  }

  // cycle
  renderCycleCard();

  // timeline
  const tl=document.getElementById('timeline'); tl.innerHTML="";
  document.getElementById('plansec').textContent=isToday?"Today's plan":(viewDate.toLocaleDateString([], {weekday:'long'})+"'s plan");
  blocks.forEach((blk,i)=>{
    const li=document.createElement('li');
    if(isToday && i<cur) li.className='past';
    if(isToday && i===cur) li.className='cur';
    const tag=blk.tag?(' <span class="tag">'+blk.tag+'</span>'):'';
    li.innerHTML='<span class="t">'+fmt(blk.t)+'</span><span class="b">'+escapeHtml(blk.b)+tag+'</span>';
    tl.appendChild(li);
  });

  // MVD list
  const ml=document.getElementById('mvdlist'); ml.innerHTML="";
  cfg.essentials.forEach(e=>{ const li=document.createElement('li'); li.textContent=e; ml.appendChild(li); });

  // week grid
  const wk=document.getElementById('week'); wk.innerHTML="";
  const mon=startOfWeekMon(now);
  for(let i=0;i<7;i++){
    const d=new Date(mon); d.setDate(mon.getDate()+i);
    const dd=d.getDay(); const tk=typeForDow(dd); const m=cfg.templates[tk];
    const el=document.createElement('div');
    el.className='wday'+(sameDay(d,now)?' today':'')+(sameDay(d,viewDate)?' view':'');
    el.innerHTML='<span class="dd">'+DOW_SHORT[dd]+'</span>'+
      '<span class="ty '+bannerClass(tk)+'">'+shortType(tk)+'</span>'+
      '<span class="c">'+escapeHtml(m.carries)+'</span>';
    el.addEventListener('click',()=>{ viewDate=new Date(d); render(); window.scrollTo({top:0,behavior:'smooth'}); });
    wk.appendChild(el);
  }
}
function shortType(tk){ return tk==='office'?'Office':tk==='home'?'Home':'Wknd'; }
function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function renderCycleCard(){
  const card=document.getElementById('cyccard');
  const c=cycleFor(viewDate);
  if(!c){ card.style.display='none'; return; }
  card.style.display='block'; card.style.borderLeftColor=c.color;
  const ph=document.getElementById('cycph'); ph.textContent=c.emoji+" "+c.label; ph.style.color=c.color;
  document.getElementById('cycdy').textContent="Day "+c.day+" · ~"+c.L+"-day cycle";
  document.getElementById('cycdots').textContent="●".repeat(c.energy)+"○".repeat(5-c.energy)+"  energy";
  document.getElementById('cycmove').textContent=c.move;
  document.getElementById('cycmind').textContent=c.mind;
  document.getElementById('cyccare').textContent=c.care;
}

// ============ Config screen ============
function dayChips(containerId, selected, offStyle){
  const c=document.getElementById(containerId); c.innerHTML="";
  DOW_ORDER.forEach(dow=>{
    const b=document.createElement('button'); b.type='button';
    b.className='chip'+(selected.includes(dow)?' on'+(offStyle?' off2':''):''); b.textContent=DOW_SHORT[dow];
    b.addEventListener('click',()=>{ const i=selected.indexOf(dow); if(i>=0)selected.splice(i,1); else selected.push(dow); dayChips(containerId,selected,offStyle); });
    c.appendChild(b);
  });
}

let formCfg=null; // working copy while editing

function openConfig(isFirst){
  formCfg=JSON.parse(JSON.stringify(cfg||defConfig()));
  document.getElementById('app').style.display='none';
  document.getElementById('config').style.display='block';
  document.getElementById('ctitle').textContent=isFirst?'Set up your week':'Settings';
  document.getElementById('csub').style.display=isFirst?'block':'none';
  document.getElementById('cancel').style.display=isFirst?'none':'block';

  document.getElementById('c_name').value=formCfg.name||"";
  document.getElementById('c_ws').value=formCfg.workStart; document.getElementById('c_we').value=formCfg.workEnd;
  document.getElementById('c_commute').value=formCfg.commute;
  document.getElementById('c_ls').value=formCfg.lunchStart; document.getElementById('c_le').value=formCfg.lunchEnd;
  dayChips('c_workdays', formCfg.workDays, false);
  dayChips('c_officedays', formCfg.officeDays, true);

  buildTabs(); editTmpl='office'; loadTmplEditor();

  renderEssentials();

  document.getElementById('c_cyc_on').checked=!!formCfg.cycle.enabled;
  document.getElementById('c_cyc_start').value=formCfg.cycle.start||"";
  document.getElementById('c_cyc_len').value=formCfg.cycle.len||28;
  document.getElementById('c_cyc_per').value=formCfg.cycle.period||5;
  toggleCycFields();
  window.scrollTo(0,0);
}

function buildTabs(){
  const t=document.getElementById('tmpl_tabs'); t.innerHTML="";
  [['office','Office day'],['home','Home day'],['sat','Saturday'],['sun','Sunday']].forEach(([k,lbl])=>{
    const b=document.createElement('button'); b.type='button'; b.className='tab'+(k===editTmpl?' on':''); b.textContent=lbl;
    b.addEventListener('click',()=>{ saveTmplMeta(); editTmpl=k; buildTabs(); loadTmplEditor(); });
    t.appendChild(b);
  });
}
function loadTmplEditor(){
  const tm=formCfg.templates[editTmpl];
  document.getElementById('m_label').value=tm.label;
  document.getElementById('m_mode').value=tm.mode;
  document.getElementById('m_carries').value=tm.carries;
  const box=document.getElementById('blocks'); box.innerHTML="";
  tm.blocks.forEach((blk,idx)=> box.appendChild(blockRow(blk,idx)));
}
function blockRow(blk,idx){
  const row=document.createElement('div'); row.className='blockrow';
  const tinp=document.createElement('input'); tinp.type='time'; tinp.value=blk.t;
  tinp.addEventListener('change',()=>{ formCfg.templates[editTmpl].blocks[idx].t=tinp.value; });
  const txt=document.createElement('input'); txt.type='text'; txt.className='txt'; txt.value=blk.b; txt.placeholder='Activity';
  txt.addEventListener('input',()=>{ formCfg.templates[editTmpl].blocks[idx].b=txt.value; });
  const del=document.createElement('button'); del.type='button'; del.className='del'; del.textContent='×';
  del.addEventListener('click',()=>{ formCfg.templates[editTmpl].blocks.splice(idx,1); loadTmplEditor(); });
  row.appendChild(tinp); row.appendChild(txt); row.appendChild(del);
  return row;
}
function saveTmplMeta(){
  const tm=formCfg.templates[editTmpl];
  tm.label=document.getElementById('m_label').value;
  tm.mode=document.getElementById('m_mode').value;
  tm.carries=document.getElementById('m_carries').value;
}

function renderEssentials(){
  const box=document.getElementById('essentials'); box.innerHTML="";
  formCfg.essentials.forEach((e,idx)=>{
    const row=document.createElement('div'); row.className='listrow';
    const inp=document.createElement('input'); inp.type='text'; inp.value=e;
    inp.addEventListener('input',()=>{ formCfg.essentials[idx]=inp.value; });
    const del=document.createElement('button'); del.type='button'; del.className='del'; del.textContent='×';
    del.addEventListener('click',()=>{ formCfg.essentials.splice(idx,1); renderEssentials(); });
    row.appendChild(inp); row.appendChild(del); box.appendChild(row);
  });
}
function toggleCycFields(){ document.getElementById('cycfields').style.display=document.getElementById('c_cyc_on').checked?'block':'none'; }

function collectAndSave(){
  saveTmplMeta();
  formCfg.name=document.getElementById('c_name').value.trim();
  formCfg.workStart=document.getElementById('c_ws').value||"08:00";
  formCfg.workEnd=document.getElementById('c_we').value||"16:00";
  formCfg.commute=parseInt(document.getElementById('c_commute').value)||0;
  formCfg.lunchStart=document.getElementById('c_ls').value||"11:00";
  formCfg.lunchEnd=document.getElementById('c_le').value||"12:00";
  formCfg.cycle.enabled=document.getElementById('c_cyc_on').checked;
  formCfg.cycle.start=document.getElementById('c_cyc_start').value||"";
  formCfg.cycle.len=parseInt(document.getElementById('c_cyc_len').value)||28;
  formCfg.cycle.period=parseInt(document.getElementById('c_cyc_per').value)||5;
  // clean empty blocks/essentials
  Object.keys(formCfg.templates).forEach(k=>{ formCfg.templates[k].blocks=formCfg.templates[k].blocks.filter(b=>b.b&&b.b.trim()); });
  formCfg.essentials=formCfg.essentials.filter(e=>e&&e.trim());
  cfg=formCfg; saveConfig(cfg);
  document.getElementById('config').style.display='none';
  document.getElementById('app').style.display='block';
  viewDate=new Date();
  render();
}

// ============ Wire up ============
document.getElementById('gear').addEventListener('click',()=>openConfig(false));
document.getElementById('prev').addEventListener('click',()=>{ viewDate.setDate(viewDate.getDate()-1); viewDate=new Date(viewDate); render(); });
document.getElementById('next').addEventListener('click',()=>{ viewDate.setDate(viewDate.getDate()+1); viewDate=new Date(viewDate); render(); });
document.getElementById('todaybtn').addEventListener('click',()=>{ viewDate=new Date(); render(); });
document.getElementById('lowbtn').addEventListener('click',()=>{
  low=!low; const b=document.getElementById('lowbtn'); b.classList.toggle('on',low);
  b.textContent=low?'↩︎ Back to full day':'🔋 Low energy — show minimum day';
  document.getElementById('full').style.display=low?'none':'block';
  document.getElementById('mvd').style.display=low?'block':'none';
});
document.getElementById('addblock').addEventListener('click',()=>{ formCfg.templates[editTmpl].blocks.push({t:"12:00",b:"",tag:""}); loadTmplEditor(); });
document.getElementById('addess').addEventListener('click',()=>{ formCfg.essentials.push(""); renderEssentials(); });
document.getElementById('c_cyc_on').addEventListener('change',toggleCycFields);
document.getElementById('save').addEventListener('click',collectAndSave);
document.getElementById('cancel').addEventListener('click',()=>{ document.getElementById('config').style.display='none'; document.getElementById('app').style.display='block'; render(); });
document.getElementById('resetdefaults').addEventListener('click',()=>{ if(confirm('Reset everything to the starter example? Your current settings will be replaced.')){ formCfg=defConfig(); openConfigFromForm(); } });
function openConfigFromForm(){ const keep=formCfg; cfg=cfg; // reopen with formCfg values
  // repopulate fields from formCfg
  document.getElementById('c_name').value=formCfg.name||"";
  document.getElementById('c_ws').value=formCfg.workStart; document.getElementById('c_we').value=formCfg.workEnd;
  document.getElementById('c_commute').value=formCfg.commute;
  document.getElementById('c_ls').value=formCfg.lunchStart; document.getElementById('c_le').value=formCfg.lunchEnd;
  dayChips('c_workdays', formCfg.workDays, false); dayChips('c_officedays', formCfg.officeDays, true);
  editTmpl='office'; buildTabs(); loadTmplEditor(); renderEssentials();
  document.getElementById('c_cyc_on').checked=!!formCfg.cycle.enabled; toggleCycFields();
  document.getElementById('c_cyc_start').value=formCfg.cycle.start||"";
  document.getElementById('c_cyc_len').value=formCfg.cycle.len; document.getElementById('c_cyc_per').value=formCfg.cycle.period;
}

// ============ Init ============
cfg=loadConfig();
if(!cfg){
  // migrate old cycle keys if present
  const oldStart=localStorage.getItem('wos_cycle_start');
  cfg=null;
  openConfig(true);
  if(oldStart){ document.getElementById('c_cyc_on').checked=true; toggleCycFields();
    document.getElementById('c_cyc_start').value=oldStart;
    document.getElementById('c_cyc_len').value=localStorage.getItem('wos_cycle_len')||28;
    document.getElementById('c_cyc_per').value=localStorage.getItem('wos_period_len')||5; }
} else {
  document.getElementById('app').style.display='block';
  render();
}
setInterval(()=>{ if(document.getElementById('app').style.display!=='none') render(); }, 30000);
