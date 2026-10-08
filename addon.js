
(()=>{
/* ===== 공통 ===== */
const IC={gwa:["🧪","#1f4fd8"],earth:["🌏","#0f8b8d"],soc:["📚","#b45309"],bio:["🧬","#2f9e44"]};
const RR=[["N","일반",.6,"★"],["R","레어",.27,"★★"],["SR","에픽",.1,"★★★"],["UR","홀로",.03,"★★★★"]];
const RI=r=>RR.findIndex(x=>x[0]==r);
if(G.tk==null)G.tk=3; if(!G.cc)G.cc={}; if(G.tkc==null)G.tkc=G.cn||0; if(!G.fb)G.fb=0;
const esc=s=>String(s).replace(/[<>&]/g,m=>({"<":"&lt;",">":"&gt;","&":"&amp;"}[m]));
const fillx=t=>esc(t.replace(/^※/,"")).replace(/\{(.+?)\}/g,'<span class="xa">$1</span>');
const allCards=()=>{const a=[];SUBJ.forEach(s=>SB[s.id].C.forEach(c=>a.push({sid:s.id,c})));return a};
const keyOf=(sid,c)=>sid+":"+c.id;
const secName=(sid,c)=>(SB[sid].D[c.s]||[""])[0];
const sname=sid=>SUBJ.find(s=>s.id==sid).n;
function giveTk(n,why){G.tk+=n;save();vib([30,30,60]);SFX.c5();ann("🎟️","뽑기권 +"+n,why);document.querySelectorAll(".xtk").forEach(e=>{e.textContent="🎟️ "+G.tk;e.classList.remove("bump");void e.offsetWidth;e.classList.add("bump")});const t=document.querySelector("#xgt");if(t)t.textContent="🎟️ "+G.tk}
/* 학습 10장마다 뽑기권 (기존 학습 기록 G.cn을 읽기만 함) */
setInterval(()=>{if((G.cn||0)-G.tkc>=10){const n=Math.floor(((G.cn||0)-G.tkc)/10);G.tkc+=n*10;giveTk(n,"카드 학습 보상 · 10장마다 1장")}},1500);
function srsx(sid,c,v){const R=ST[sid].R,r=R[c.id]||{b:0,d:0};r.b=v?Math.min(r.b+1,5):0;r.d=Date.now()+(v?IV[r.b]:0);r.t=Date.now();R[c.id]=r}
function closeAll(){["xfeed","xgacha","xcoll","xzoom","xcm"].forEach(i=>{const e=$(i);if(e)e.remove()});document.querySelectorAll(".ftop,#xfc").forEach(e=>e.remove());document.body.style.overflow=""}
function backHome(){closeAll();home();deco()}

/* ===== 로비 히어로 ===== */
function deco(){const h=$("home");if(!h||h.querySelector(".xhero"))return;const hh=h.querySelector(".hh");if(!hh)return;
const own=Object.keys(G.cc).length,tot=allCards().length;
const d=document.createElement("div");d.className="xhero";
d.innerHTML=`<button id="xfb"><span class="xlive">LIVE FEED</span><span class="e">📱</span><b>넘겨보기 피드</b><small>위로 쓱쓱 · 밥 먹으면서 가볍게</small></button>
<button id="xgb"><span class="xtk">🎟️ ${G.tk}</span><span class="e">🔮</span><b>카드 뽑기</b><small>레어 · 에픽 · 홀로</small></button>
<button id="xcb"><span class="e">📖</span><b>도감</b><small>수집 ${own} / ${tot}</small></button>`;
hh.after(d)}
new MutationObserver(deco).observe($("home"),{childList:true});deco();
$("home").addEventListener("click",e=>{
 if(e.target.closest("#xfb")){vib(20);SFX.open();openFeed()}
 else if(e.target.closest("#xgb")){vib(20);SFX.open();openGacha()}
 else if(e.target.closest("#xcb")){vib(20);SFX.open();openColl()}});

/* ===== 넘겨보기 피드 + 피드 콤보 ===== */
let fc=0,fv=0,feedQ=[],io=null;
function pickFeed(n){const a=allCards();if(!a.length)return[];const out=[];
 for(let i=0;i<n;i++){
  const w=a.map(x=>{const r=ST[x.sid].R[x.c.id];let s=1;if(!ST[x.sid].K[x.c.id])s+=2;if(r&&r.d<=Date.now())s+=3;if(ST[x.sid].S[x.c.id])s+=1;return s});
  let t=Math.random()*w.reduce((p,q)=>p+q,0),k=0;while(t>w[k]){t-=w[k];k++}out.push(a[k]);
  if(Math.random()<.07)out.push({bonus:1})}
 return out}
function splitSteps(t){const raw=t.replace(/^※/,"");let head="",parts=null,arrow=false;
 if(/[①②③④⑤]/.test(raw)){const seg=raw.split(/\s*[①②③④⑤⑥]\s*/);head=seg.shift().trim();parts=seg.filter(x=>x.trim())}
 else if((raw.match(/ → /g)||[]).length>=2){parts=raw.split(/\s*→\s*/);arrow=true}
 if(!parts||parts.length<2)return null;let note="";const last=parts[parts.length-1],m=last.match(/^(.*?)\s*(원리:.*)$/);if(m){parts[parts.length-1]=m[1];note=m[2]}
 return{head,parts:parts.map(x=>x.trim().replace(/[.,]\s*$/,"")),arrow,note}}
function bodyHTML(c){const sp=splitSteps(c.t);if(!sp)return`<div class="pt">${fillx(c.t)}</div>`;
 return`<div class="pt">${sp.head?`<div class="sh">${fillx(sp.head)}</div>`:""}<ol class="steps${sp.arrow?" arr":""}">${sp.parts.map((x,k)=>`<li style="--d:${k*.09}s"><i>${sp.arrow?["🟢","🔵","🟣","🟠","🔴","⚪"][k%6]:k+1}</i><span>${fillx(x)}</span></li>`).join("")}</ol>${sp.note?`<div class="snote">💡 ${fillx(sp.note)}</div>`:""}</div>`}
function fxOf(sid,c){return(FX[sid]||{})[c.id]}
function postHTML(it,i){
 if(it.bonus)return`<section class="post bonus" data-i="${i}"><div class="pc"><div class="gift">🎁</div><h2 style="margin:10px 0 4px">깜짝 보너스!</h2><p style="opacity:.85;margin:0">탭해서 뽑기권 받기</p></div></section>`;
 const {sid,c}=it,K=ST[sid].K,r=ST[sid].R[c.id],due=r&&r.d<=Date.now(),star=ST[sid].S[c.id],fx=fxOf(sid,c);
 const tg=due?`<span class="tag due">🧠 복습 타이밍</span>`:K[c.id]?`<span class="tag">✅ 아는 카드</span>`:`<span class="tag">🆕 학습 중</span>`;
 const ago=["방금","5분 전","23분 전","1시간 전","3시간 전","어제"][(c.id*7)%6];
 return`<section class="post" data-i="${i}" style="--sc:${IC[sid][1]}"><div class="pc">
 <div class="ph"><div class="av"><span>${IC[sid][0]}</span></div><div><b>r/${esc(sname(sid))}</b><small>${esc(secName(sid,c))} · ${ago}</small></div>${tg}</div>
 ${fx?`<h2 class="ptl">${esc(fx[0])}</h2>`:""}
 ${c.q?`<div class="pq${fx?" sm":""}">${esc(c.q)}</div>`:""}${bodyHTML(c)}
 <div class="pf"><button class="up">⬆️ 알아</button><button class="dn">⬇️ 헷갈려</button>${fx?`<button class="cm">💬 ${fx[1].length}</button>`:""}<button class="hr${star?" on":""}">${star?"❤️":"🤍"}</button></div>
 ${fx?`<button class="cmo">💬 댓글 ${fx[1].length}개 보기</button>`:""}
 </div>${i==0?`<div class="swh">⬆ 위로 넘기기 · 더블탭 ❤️</div>`:""}</section>`}
function avc(n){const h=[...NK[n]].reduce((a,ch)=>a+ch.charCodeAt(0),0);return`hsl(${h%360} 70% 55%)`}
function openCm(it){const fx=fxOf(it.sid,it.c);if(!fx)return;vib(15);SFX.open();
 const L=fx[1].map((x,k)=>({n:x[0],t:x[1],v:x[2],k})).sort((a,b)=>b.v-a.v);
 const tm=["12분 전","1시간 전","3시간 전","5시간 전","어제","2일 전"];
 const w=document.createElement("div");w.id="xcm";w.innerHTML=`<div class="cbd"></div><div class="csh"><div class="cgr"></div><div class="chd"><b>댓글 ${L.length}</b><small>${esc(fx[0])}</small></div>
 <div class="cls">${L.map((x,j)=>`<div class="cmt" style="--d:${.12+j*.08}s"><div class="cav" style="background:${avc(x.n)}">${[...NK[x.n]][0]}</div><div class="cbx"><div class="cnm">${esc(NK[x.n])}${j==0?` <span class="best">🏆 베스트</span>`:""}<small>${tm[(x.k*3+it.c.id)%6]}</small></div><div class="ctx">${esc(x.t)}</div><button class="cup" data-v="${x.v}">⬆️ <span>${x.v}</span></button></div></div>`).join("")}</div></div>`;
 document.body.appendChild(w);requestAnimationFrame(()=>w.classList.add("on"));
 const close=()=>{w.classList.remove("on");setTimeout(()=>w.remove(),350)};
 w.querySelector(".cbd").onclick=close;
 let sy=null;const sh=w.querySelector(".csh");
 w.querySelector(".cgr").addEventListener("pointerdown",e=>{sy=e.clientY});
 window.addEventListener("pointerup",e=>{if(sy!=null&&e.clientY-sy>60)close();sy=null},{once:false});
 w.querySelectorAll(".cup").forEach(b=>b.onclick=e=>{const on=b.classList.toggle("on"),v=+b.dataset.v+(on?1:0);b.querySelector("span").textContent=v;if(on){burst(e.clientX,e.clientY,10);tone(990,0,.08,"triangle",.1);vib(12)}else vib(8)})}
function addPosts(n){const f=$("xfeed");if(!f)return;const s=feedQ.length,more=pickFeed(n);feedQ.push(...more);
 const tmp=document.createElement("div");tmp.innerHTML=more.map((it,j)=>postHTML(it,s+j)).join("");[...tmp.children].forEach(el=>{f.appendChild(el);io.observe(el)})}
function fcBadge(up){const b=$("xfc");if(!b)return;if(fc<1){b.className="";return}b.textContent="🔥 COMBO ×"+fc;b.className="show"+(fc>=10?" fever":"");if(up){void b.offsetWidth;b.classList.add("bump")}$("xfeed").classList.toggle("fever",fc>=10)}
function openFeed(){closeAll();fc=0;fv=0;feedQ=[];document.body.style.overflow="hidden";
 const top=document.createElement("div");top.className="ftop";top.innerHTML=`<button class="bk" id="xfx">‹ 로비</button><span style="font-weight:900">피드</span><span class="fx"><span class="chipx" id="xfn">👀 0</span></span>`;
 const f=document.createElement("div");f.id="xfeed";f.className="xov";
 const cb=document.createElement("div");cb.id="xfc";
 document.body.append(f,top,cb);
 io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const el=e.target;if(!el.classList.contains("vis")){el.classList.add("vis");if(!el.classList.contains("bonus")){fv++;$("xfn").textContent="👀 "+fv;if(fv%15==0)giveTk(1,"피드 15장 둘러보기 보상")}}const i=+el.dataset.i;if(i>=feedQ.length-4)addPosts(10)}}),{root:f,threshold:.6});
 addPosts(12);
 $("xfx").onclick=()=>{vib(15);backHome()};
 let lt=0;
 f.addEventListener("click",e=>{const p=e.target.closest(".post");if(!p)return;const it=feedQ[+p.dataset.i];
  if(it.bonus){if(p.classList.contains("got"))return;p.classList.add("got");const r=p.getBoundingClientRect();for(let i=0;i<6;i++)setTimeout(()=>burst(innerWidth*Math.random(),r.top+r.height*Math.random(),24),i*80);G.fb++;giveTk(1,"깜짝 보너스 발견!");setTimeout(()=>{const nx=p.nextElementSibling;if(nx&&document.body.contains(p))nx.scrollIntoView({behavior:"smooth",block:"start"})},900);return}
  if(e.target.closest(".cm,.cmo")){openCm(it);return}
  const up=e.target.closest(".up"),dn=e.target.closest(".dn"),hr=e.target.closest(".hr");
  if(up||dn){vote(p,it,!!up,e);return}
  if(hr){heart(p,it,e,true);return}
  const n=performance.now();if(n-lt<300){heart(p,it,e,false);lt=0}else lt=n});
}
function heart(p,it,e,toggle){const S=ST[it.sid].S,b=p.querySelector(".hr");
 if(toggle&&S[it.c.id]){delete S[it.c.id];b.textContent="🤍";b.classList.remove("on");save();vib(10);return}
 if(!S[it.c.id]){S[it.c.id]=1;G.star++;try{chk()}catch(x){}}save();b.textContent="❤️";b.classList.remove("on");void b.offsetWidth;b.classList.add("on");
 const h=document.createElement("div");h.className="bigh";h.textContent="❤️";p.querySelector(".pc").appendChild(h);setTimeout(()=>h.remove(),950);
 burst(e.clientX,e.clientY,22);tone(880,0,.12,"triangle",.14);tone(1320,.08,.18,"triangle",.12);vib([15,30,25])}
function vote(p,it,v,e){if(p.dataset.v)return;p.dataset.v=1;const {sid,c}=it,K=ST[sid].K;
 p.querySelector(v?".up":".dn").classList.add("on");
 try{daily()}catch(x){}
 if(v){K[c.id]=1;fc++;G.tot++;if(G.day){G.day.n++;G.day.c=Math.max(G.day.c,fc)}G.fbest=Math.max(G.fbest||0,fc);
  burst(e.clientX,e.clientY,Math.min(12+fc*3,50));word(e.clientX,e.clientY-40,["알아!","굿!","완벽!","나이스!","미쳤다!"][fc%5]);
  if(fc%10==0){SFX.c10();fever();giveTk(1,"🔥 "+fc+"콤보 달성!")}else if(fc%5==0){SFX.c5();const fl=$("fl");fl.classList.remove("go");void fl.offsetWidth;fl.classList.add("go");for(let i=0;i<5;i++)setTimeout(()=>burst(innerWidth*Math.random(),innerHeight*(.2+Math.random()*.5),28),i*100)}else SFX.yes(fc);
  vib(fc%5==0?[20,30,20,30,60]:18);fcBadge(true)}
 else{delete K[c.id];SFX.no();vib([60,40,60]);word(e.clientX,e.clientY-40,"다시 보자!");
  if(fc>=1){const b=$("xfc");b.classList.add("lose");setTimeout(()=>fcBadge(),650)}fc=0;$("xfeed").classList.remove("fever")}
 srsx(sid,c,v);try{const l=LGD();v?l.n++:l.m++;l.c=Math.max(l.c,fc);chk()}catch(x){}save();
 setTimeout(()=>{const nx=p.nextElementSibling;if(nx)$("xfeed").scrollTo({top:nx.offsetTop,behavior:"smooth"})},v?420:650)}
function fever(){const t=document.createElement("div");t.className="fever-t";t.textContent="🔥 FEVER ×"+fc+" 🔥";document.body.appendChild(t);setTimeout(()=>t.remove(),1450);
 for(let i=0;i<14;i++)setTimeout(()=>burst(innerWidth*Math.random(),30+Math.random()*innerHeight*.6,20),i*60)}

/* ===== 카드 뽑기 ===== */
function rollR(){let x=Math.random(),a=0;for(const r of RR){a+=r[2];if(x<a)return r[0]}return"N"}
function cardFace(sid,c,r){const rr=RR[RI(r)];
 return`<div class="cc r-${r}"><div class="ct">${IC[sid][0]} ${esc(sname(sid))}<span class="rb">${r}</span></div><div class="ce">${IC[sid][0]}</div><div class="cx">${c.q?`<b>${esc(c.q)}</b><br>`:""}${fillx(c.t)}</div><div class="cs">${rr[3]}</div></div>`}
function openGacha(){closeAll();document.body.style.overflow="hidden";const o=document.createElement("div");o.id="xgacha";o.className="xov";document.body.appendChild(o);packScreen()}
let gN=1;
const RCOL=["#cfd6e4","#1f8fff","#b26bff","linear-gradient(135deg,#ff3d6e,#f5b301,#22d3ee,#7c3aed)"];
function gTop(){return`<div class="rays"></div><div class="stars"></div><div class="gtop"><button class="bk" id="xgx">‹ 로비</button><span class="chipx" id="xgt">🎟️ ${G.tk}</span><button class="ginf" id="xgi">ⓘ</button></div>`}
function gTopBind(){$("xgx").onclick=()=>{vib(15);backHome()};$("xgi").onclick=()=>{vib(10);const m=document.createElement("div");m.className="gmod";m.innerHTML=`<div class="gmb"><h3>🔮 확률 안내</h3>${RR.map(r=>`<div class="gmr r-${r[0]}"><span class="rd"></span><b>${r[1]}</b><span>${r[3]}</span><em>${Math.round(r[2]*100)}%</em></div>`).join("")}<p>10연차는 에픽 이상 1장 확정<br>뽑기권: 학습 10장 · 피드 15장 · 10콤보 · 깜짝 보너스</p><button>확인</button></div>`;$("xgacha").appendChild(m);m.onclick=e=>{if(e.target==m||e.target.tagName=="BUTTON")m.remove()}}}
function packScreen(){const o=$("xgacha");
 o.innerHTML=gTop()+`<div class="pstage"><div class="pglow"></div>
 <div class="pk2" id="xpk"><div class="strip"><span>✂ - - - - - - - - - - - - - -</span></div><div class="pbody"><div class="orb">🔮</div><div class="plogo">STUDY<br>ORB PACK</div><div class="psub">${gN==10?"10 CARDS":"1 CARD"}</div></div><div class="pfoil"></div></div>
 <div class="phint">⬆ 팩을 위로 쓸어 올려서 뜯기</div></div>
 <div class="gctl"><div class="gseg"><button data-n="1" class="${gN==1?"on":""}">1회</button><button data-n="10" class="${gN==10?"on":""}">10연차 <small>에픽↑ 확정</small></button></div>
 <button class="gbig" id="xgo" ${G.tk<gN?"disabled":""}>🔮 뽑기 <span>🎟️ ${gN}</span></button></div>`;
 gTopBind();
 o.querySelectorAll(".gseg button").forEach(b=>b.onclick=()=>{gN=+b.dataset.n;vib(10);tone(660,0,.05,"triangle",.08);packScreen()});
 const go=()=>{if(G.tk<gN){ann("🎟️","뽑기권이 부족해요","피드나 학습으로 모아보세요");vib([60,40,60]);const p=$("xpk");p.classList.remove("nope");void p.offsetWidth;p.classList.add("nope");return}pull(gN)};
 $("xgo").onclick=go;
 const pk=$("xpk");let y0=null,dy=0;
 pk.addEventListener("pointerdown",e=>{y0=e.clientY;dy=0;pk.setPointerCapture(e.pointerId);pk.classList.add("hold")});
 pk.addEventListener("pointermove",e=>{if(y0==null)return;dy=Math.min(0,e.clientY-y0);pk.style.transform=`translateY(${dy*.35}px) scale(${1+Math.min(-dy,160)/1600})`;pk.querySelector(".strip").style.transform=`translateY(${dy*.25}px) rotate(${dy/20}deg)`;if(-dy>20&&Math.random()<.3)vib(5)});
 pk.addEventListener("pointerup",()=>{if(y0==null)return;pk.classList.remove("hold");pk.style.transform="";pk.querySelector(".strip").style.transform="";const d=dy;y0=null;if(-d>70)go();else if(-d<8)go()})}
function pull(n){const a=allCards();if(!a.length)return;G.tk-=n;
 const res=[];for(let i=0;i<n;i++){const it=a[Math.floor(Math.random()*a.length)];res.push({...it,r:rollR()})}
 if(n==10&&!res.some(x=>RI(x.r)>=2))res[Math.floor(Math.random()*10)].r=Math.random()<.2?"UR":"SR";
 res.forEach(x=>{const k=keyOf(x.sid,x.c),e=G.cc[k];x.nw=!e;if(!e)G.cc[k]={r:x.r,n:1};else{e.n++;if(RI(x.r)>RI(e.r)){e.r=x.r;x.up=1}}});
 save();const t0=$("xgt");if(t0)t0.textContent="🎟️ "+G.tk;
 const best=Math.max(...res.map(x=>RI(x.r))),o=$("xgacha"),pk=$("xpk");
 o.querySelectorAll(".gctl,.phint").forEach(e=>e.classList.add("gone"));
 pk.classList.add("tear");SFX.flip();vib([20,20,40]);
 const gl=o.querySelector(".pglow");gl.style.background=best==3?"conic-gradient(#ff3d6e,#f5b301,#22d3ee,#7c3aed,#ff3d6e)":RCOL[best];
 setTimeout(()=>{pk.classList.add("shake");gl.classList.add("on");let t=0;const iv=setInterval(()=>{tone(300+t*70,0,.05,"square",.05);vib(10);t++},85);
  setTimeout(()=>{clearInterval(iv);pk.classList.remove("shake");pk.classList.add("boom");SFX.c5();vib([40,30,80]);
   const fl=document.createElement("div");fl.className="flashw";if(best==3)fl.style.background="radial-gradient(#fff,#f5b301,#ff3d6e)";else if(best==2)fl.style.background="radial-gradient(#fff,#b26bff)";document.body.appendChild(fl);setTimeout(()=>fl.remove(),650);
   for(let i=0;i<8;i++)setTimeout(()=>burst(innerWidth/2+(Math.random()-.5)*200,innerHeight*.45+(Math.random()-.5)*200,26),i*60);
   setTimeout(()=>solo(res,0),380)},1100)},450)}
function fxReveal(x,el){const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,ri=RI(x.r);
 if(ri==0){burst(cx,cy,10);vib(12)}else if(ri==1){burst(cx,cy,24);SFX.yes(4);vib(25)}
 else if(ri==2){for(let i=0;i<4;i++)setTimeout(()=>burst(cx+(Math.random()-.5)*140,cy+(Math.random()-.5)*140,24),i*80);SFX.c5();vib([30,30,60]);word(cx,cy-80,"EPIC!")}
 else{const f=document.createElement("div");f.className="flashw";f.style.background="linear-gradient(135deg,#ff3d6e,#f5b301,#22d3ee,#7c3aed)";document.body.appendChild(f);setTimeout(()=>f.remove(),650);
  for(let i=0;i<16;i++)setTimeout(()=>burst(innerWidth*Math.random(),innerHeight*Math.random(),28),i*60);SFX.c10();vib([60,40,60,40,200]);word(cx,cy-90,"✨HOLO✨")}}
function solo(res,i){const o=$("xgacha"),x=res[i],n=res.length;
 o.innerHTML=gTop()+`<div class="sstage r-${x.r}"><div class="sglow"></div>
 <div class="scount">${n>1?`${i+1} / ${n}`:""}</div>
 <div class="gc solo pre-${x.r}" id="xsc"><div class="gi"><div class="gb"><span>🔮</span></div><div class="gf">${cardFace(x.sid,x.c,x.r)}</div></div>${x.nw?`<span class="newb" hidden>NEW!</span>`:x.up?`<span class="newb" hidden>UP!</span>`:""}</div>
 <div class="rlab big r-${x.r}" hidden>${RR[RI(x.r)][1]} ${RR[RI(x.r)][3]}</div>
 <div class="stap">탭해서 뒤집기</div></div>
 <div class="gctl">${n>1?`<button class="gsk" id="xsk">건너뛰기 ⏭</button>`:""}</div>`;
 gTopBind();const el=$("xsc");let open=false;
 o.querySelector(".sstage").onclick=e=>{if(e.target.closest(".gsk"))return;
  if(!open){open=true;el.classList.add("open");el.classList.remove("pre-SR","pre-UR");SFX.flip();o.querySelector(".stap").textContent=i<n-1?"탭해서 다음 카드":"탭해서 결과 보기";
   setTimeout(()=>{o.querySelector(".rlab").hidden=false;const nb=el.querySelector(".newb");if(nb)nb.hidden=false;fxReveal(x,el);if(x.r=="UR")holoTilt(el.querySelector(".cc"))},380)}
  else{vib(10);const s=o.querySelector(".sstage");s.classList.add("out");setTimeout(()=>i<n-1?solo(res,i+1):(n>1?summary(res):single(res)),260)}};
 const sk=$("xsk");if(sk)sk.onclick=()=>{vib(15);summary(res)}}
function single(res){const o=$("xgacha");o.querySelector(".stap").textContent="";o.querySelector(".sstage").classList.remove("out");
 o.querySelector(".gctl").innerHTML=`<div class="gend"><button class="gsk" id="xcl">📖 도감</button><button class="gbig" id="xmore">🔮 한 번 더</button></div>`;
 $("xcl").onclick=()=>{vib(15);openColl()};$("xmore").onclick=()=>{vib(15);packScreen()}}
function summary(res){const o=$("xgacha"),nw=res.filter(x=>x.nw).length,best=Math.max(...res.map(x=>RI(x.r)));
 o.innerHTML=gTop()+`<div class="sumw"><div class="sumh"><b>결과</b><span>NEW ${nw}장 · 최고 <em class="r-${RR[best][0]}">${RR[best][1]}</em></span></div>
 <div class="sumg">${res.map((x,i)=>`<div class="sc" style="--d:${i*.06}s"><div class="gc open"><div class="gi"><div class="gb"></div><div class="gf">${cardFace(x.sid,x.c,x.r)}</div></div>${x.nw?`<span class="newb">NEW!</span>`:x.up?`<span class="newb">UP!</span>`:""}</div></div>`).join("")}</div></div>
 <div class="gctl"><div class="gend"><button class="gsk" id="xcl">📖 도감</button><button class="gbig" id="xmore">🔮 한 번 더</button></div></div>`;
 gTopBind();res.forEach((x,i)=>{if(RI(x.r)>=2)setTimeout(()=>{const el=o.querySelectorAll(".sc")[i];if(el){const r=el.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,14)}},300+i*60)});
 o.querySelectorAll(".sc .cc.r-UR").forEach(holoTilt);
 $("xcl").onclick=()=>{vib(15);openColl()};$("xmore").onclick=()=>{vib(15);packScreen()}}
function holoTilt(cc){if(!cc)return;const host=cc.closest(".gc,.zc")||cc;
 host.addEventListener("pointermove",e=>{const r=host.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;cc.style.setProperty("--tx",px*100+"%");cc.style.setProperty("--ty",py*100+"%");if(host.classList.contains("zc"))host.style.transform=`rotateY(${(px-.5)*24}deg) rotateX(${(.5-py)*24}deg)`});
 host.addEventListener("pointerleave",()=>{if(host.classList.contains("zc"))host.style.transform=""})}

/* ===== 도감 ===== */
let ctab="all";
function openColl(){closeAll();document.body.style.overflow="hidden";const o=document.createElement("div");o.id="xcoll";o.className="xov";document.body.appendChild(o);drawColl()}
function drawColl(){const o=$("xcoll"),a=allCards(),own=a.filter(x=>G.cc[keyOf(x.sid,x.c)]),pc=a.length?Math.round(own.length/a.length*100):0;
 const cnt=RR.map(r=>own.filter(x=>G.cc[keyOf(x.sid,x.c)].r==r[0]).length);
 const subs=SUBJ.filter(s=>SB[s.id].C.length);const list=ctab=="all"?a:a.filter(x=>x.sid==ctab);
 o.innerHTML=`<div class="cwrap"><div class="bar"><button class="bk" id="xcx">‹ 로비</button><span class="chipx xtk" style="margin-left:auto">🎟️ ${G.tk}</span></div>
 <div class="chero"><small>내 도감</small><div><b>${own.length}</b> / ${a.length} 장 · ${pc}%</div><span class="pb"><i style="width:${pc}%"></i></span>
 <div class="rstat">${RR.map((r,i)=>`<span>${r[1]} ${cnt[i]}</span>`).join("")}</div></div>
 <div class="ctabs"><button data-t="all" class="${ctab=="all"?"on":""}">전체</button>${subs.map(s=>{const c=SB[s.id].C,k=c.filter(x=>G.cc[keyOf(s.id,x)]).length;return`<button data-t="${s.id}" class="${ctab==s.id?"on":""}">${IC[s.id][0]} ${esc(s.n)} ${k}/${c.length}</button>`}).join("")}</div>
 <div class="cgrid">${list.map((x,i)=>{const e=G.cc[keyOf(x.sid,x.c)],dl=`style="animation-delay:${Math.min(i,40)*.02}s"`;return e?`<div class="slot" data-k="${keyOf(x.sid,x.c)}" ${dl}>${cardFace(x.sid,x.c,e.r)}${e.n>1?`<span class="cnt">×${e.n}</span>`:""}</div>`:`<div class="slot no" ${dl}>?</div>`}).join("")}</div>
 ${own.length?"":`<p class="sec" style="text-align:center;margin-top:16px">아직 모은 카드가 없어요. 로비의 🔮 카드 뽑기에서 시작해 보세요!</p>`}</div>`;
 $("xcx").onclick=()=>{vib(15);backHome()};
 o.querySelectorAll(".ctabs button").forEach(b=>b.onclick=()=>{ctab=b.dataset.t;vib(10);drawColl()});
 o.querySelectorAll(".slot[data-k]").forEach(s=>s.onclick=e=>{const [sid,id]=s.dataset.k.split(":"),c=SB[sid].C.find(x=>x.id==+id),en=G.cc[s.dataset.k];vib(15);SFX.flip();
  const z=document.createElement("div");z.id="xzoom";z.innerHTML=`<div><div class="zc">${cardFace(sid,c,en.r)}</div><p>${RR[RI(en.r)][1]} · ${esc(secName(sid,c))} · 보유 ${en.n}장<br><small style="opacity:.7">카드를 기울여 보세요 · 바깥 탭하면 닫기</small></p></div>`;
  document.body.appendChild(z);const cc=z.querySelector(".cc");holoTilt(cc);const zc=z.querySelector(".zc");
  zc.addEventListener("pointermove",ev=>{const r=zc.getBoundingClientRect(),px=(ev.clientX-r.left)/r.width,py=(ev.clientY-r.top)/r.height;zc.style.transform=`rotateY(${(px-.5)*24}deg) rotateX(${(.5-py)*24}deg)`;cc.style.setProperty("--tx",px*100+"%");cc.style.setProperty("--ty",py*100+"%")});
  if(RI(en.r)>=2){const r=zc.getBoundingClientRect();setTimeout(()=>burst(r.left+r.width/2,r.top+r.height/2,30),300)}
  z.onclick=ev=>{if(!ev.target.closest(".zc"))z.remove()}})}
})();
