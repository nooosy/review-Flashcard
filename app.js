/* 앱 본체 (평소엔 수정 X) */

const $=id=>document.getElementById(id);
const LK={gwa:["gk","gs","gr"],earth:["gk_e","gs_e","gr_e"],bio:["gk_b","gs_b","gr_b"],soc:["gk_s","gs_s","gr_s"]},ST={};
for(const id in LK){ST[id]={K:{},S:{},R:{}};try{ST[id].K=JSON.parse(localStorage.getItem(LK[id][0])||"{}");ST[id].S=JSON.parse(localStorage.getItem(LK[id][1])||"{}");ST[id].R=JSON.parse(localStorage.getItem(LK[id][2])||"{}")}catch(e){}}
let cur="gwa",view="home",D=SB.gwa.D,C=SB.gwa.C,K=ST.gwa.K,S=ST.gwa.S,R=ST.gwa.R,sel=new Set(),mode=1,shuf=false,deck=[],pos=0,ans=[],face=0,starOnly=false,DBR=null,tmr=null;
const hd=c=>`<span class="star">${S[c.id]?"★":"☆"}</span><div class="sec">${D[c.s][0]}${K[c.id]?" · 아는 카드":""}${gold?" · ✨ 황금 카드 (+3)":""}</div>`;
const save=()=>{try{for(const id in LK){localStorage.setItem(LK[id][0],JSON.stringify(ST[id].K));localStorage.setItem(LK[id][1],JSON.stringify(ST[id].S));localStorage.setItem(LK[id][2],JSON.stringify(ST[id].R))}localStorage.setItem("gb",JSON.stringify(G))}catch(e){}clearTimeout(tmr);tmr=setTimeout(()=>{if(DBR)DBR.set({K:ST.gwa.K,S:ST.gwa.S,R:ST.gwa.R,X:{earth:ST.earth,bio:ST.bio,soc:ST.soc},G,t:Date.now()}).catch(()=>{})},500)};
let G={tot:0,best:0,list:0,star:0,cn:0,ch:0,gb:0,sh:0,gn:0,jp:0,rec:{time:0,surv:0},dd:"",dc:0,th:"",ths:{},ti:{},tt:"",log:{},gold:0,boss:0,bs:0,qd:0,st:0,last:"",day:null,got:{}};try{Object.assign(G,JSON.parse(localStorage.getItem("gb")||"{}"))}catch(e){}
const mastered=id=>{const c=SB[id].C;return c.length>0&&c.every(x=>ST[id].K[x.id])};
const BD=[
{e:"🌱",n:"첫걸음",d:"처음으로 '알아요' 누르기",id:"first",f:()=>G.tot>=1},
{e:"🔥",n:"5연속 정답",d:"'알아요' 5연속",id:"c5",f:()=>G.best>=5},
{e:"⚡",n:"10연속 정답",d:"'알아요' 10연속",id:"c10",f:()=>G.best>=10},
{e:"🌋",n:"20연속 정답",d:"'알아요' 20연속",id:"c20",f:()=>G.best>=20},
{e:"🥉",n:"브론즈 트로피",d:"누적 '알아요' 50번",id:"t50",f:()=>G.tot>=50},
{e:"🥈",n:"실버 트로피",d:"누적 '알아요' 150번",id:"t150",f:()=>G.tot>=150},
{e:"🥇",n:"골드 트로피",d:"누적 '알아요' 300번",id:"t300",f:()=>G.tot>=300},
{e:"⭐",n:"별표 수집가",d:"카드에 별표 처음 달기",id:"star",f:()=>G.star>=1},
{e:"🔭",n:"모아보기 탐험가",d:"모아보기 열어보기",id:"list",f:()=>G.list>=1},
{e:"🧪",n:"과과연 마스터",d:"과과연 카드 전부 '알아요'",id:"mgwa",f:()=>mastered("gwa")},
{e:"🌏",n:"지구과학 마스터",d:"지구과학 카드 전부 '알아요'",id:"mearth",f:()=>mastered("earth")},
{e:"🪙",n:"황금 사냥꾼",d:"황금 카드 처음 맞히기",id:"gold",f:()=>G.gold>=1},
{e:"⚔️",n:"보스 슬레이어",d:"보스 처치하기",id:"boss",f:()=>G.boss>=1},
{e:"📅",n:"3일 연속",d:"3일 연속 학습",id:"st3",f:()=>G.bs>=3},
{e:"🗓️",n:"7일 연속",d:"7일 연속 학습",id:"st7",f:()=>G.bs>=7},
{e:"🎯",n:"퀘스트 달인",d:"일일 퀘스트 모두 완료",id:"qd",f:()=>G.qd>=1},
{e:"📦",n:"첫 상자",d:"보물상자 처음 열기",id:"ch1",f:()=>G.ch>=1},
{e:"🎁",n:"상자 사냥꾼",d:"보물상자 10개 열기",id:"ch10",f:()=>G.ch>=10},
{e:"🏷️",n:"칭호 수집가",d:"칭호 5개 모으기",id:"ti5",f:()=>Object.keys(G.ti||{}).length>=5},
{e:"⏱️",n:"스피드러너",d:"타임어택 20장 달성",id:"gt20",f:()=>(G.rec||{}).time>=20},
{e:"💀",n:"생존자",d:"서바이벌 20장 달성",id:"gs20",f:()=>(G.rec||{}).surv>=20},
{e:"📅",n:"챌린지 마스터",d:"오늘의 챌린지 3회 클리어",id:"gd3",f:()=>G.dc>=3},
{e:"🌟",n:"스페셜 수집가",d:"스페셜 칭호 획득",id:"sp1",f:()=>SP.some(x=>(G.ti||{})[x])},
{e:"👑",n:"잭팟",d:"보물상자에서 잭팟 터뜨리기",id:"jp",f:()=>G.jp>=1},
{e:"🎨",n:"테마 수집가",d:"테마 3개 모으기",id:"th3",f:()=>Object.keys(G.ths||{}).length>=3},
{e:"📖",n:"사회 마스터",d:"사회 카드 전부 '알아요'",id:"msoc",f:()=>mastered("soc")},
{e:"🧠",n:"간격 복습러",d:"카드 5장을 3단계까지 올리기",id:"srs",f:()=>Object.values(ST).reduce((a,x)=>a+Object.values(x.R||{}).filter(r=>r.b>=3).length,0)>=5}];
let gold=0,boss=null,bc=0,HV=1;const M=new Set();
try{HV=localStorage.getItem("hv")=="0"?0:1}catch(e){}
const vib=p=>{if(HV)try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const roll=()=>{const p=G.gb>0?.35:.12;if(G.gb>0)G.gb--;let f=0;if(G.gn>0&&!boss){G.gn--;f=1}gold=(!boss&&(f||Math.random()<p))?1:0};
const tdf=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const dy=()=>G.day&&G.day.d==tdf(new Date())?G.day:{n:0,c:0,g:0,ok:0};
const stv=()=>(G.last==tdf(new Date())||G.last==tdf(new Date(Date.now()-864e5)))?G.st||0:0;
const QS=[["📚","알아요 20장",()=>dy().n,20],["⚡","7연속 정답",()=>dy().c,7],["✨","황금 카드 잡기",()=>dy().g,1]];
function qpanel(){return`<div class="qp"><div class="qh"><b>🎯 오늘의 퀘스트</b><span>${QS.filter(q=>q[2]()>=q[3]).length} / ${QS.length}</span></div>`+QS.map(q=>{const v=Math.min(q[2](),q[3]),ok=v>=q[3];return`<div class="qr${ok?" ok":""}"><div class="qt"><span>${q[0]} ${q[1]}</span><span>${ok?"✅ 완료":v+" / "+q[3]}</span></div><div class="pb"><i style="width:${v/q[3]*100}%"></i></div></div>`}).join("")+`</div>`}
function ann(e,t,sm){const d=document.createElement("div");d.className="tst";d.innerHTML=`<span>${e}</span><div><small>${sm}</small><b>${t}</b></div>`;document.body.appendChild(d);setTimeout(()=>d.remove(),3300)}
function daily(){const t=tdf(new Date());if(!G.day||G.day.d!=t)G.day={d:t,n:0,c:0,g:0,ok:0};
if(G.last!=t){G.st=G.last==tdf(new Date(Date.now()-864e5))?(G.st||0)+1:1;G.bs=Math.max(G.bs||0,G.st);G.last=t;ann("🔥",G.st+"일 연속 학습!","스트릭");vib([30,30,60])}}
function goldfx(){word(innerWidth/2,innerHeight*.4,"✨황금 카드! +3✨");for(let i=0;i<6;i++)setTimeout(()=>burst(innerWidth*Math.random(),innerHeight*(.2+Math.random()*.5),30),i*100);SFX.c10();vib([30,40,30,40,90])}
function bossbar(){$("st").innerHTML=`<b>👹 보스전</b> HP ${"🟥".repeat(boss.hp)}${"⬜".repeat(boss.max-boss.hp)} · 목숨 ${"❤️".repeat(boss.lives)}${"🖤".repeat(3-boss.lives)}`}
function startBoss(){const q=[...M].slice(0,5).map(id=>C.find(x=>x.id==id)).filter(Boolean).sort(()=>Math.random()-.5);if(!q.length){M.clear();draw();return}
boss={q,hp:q.length,max:q.length,lives:3};deck=q;pos=0;face=0;gold=0;ann("👹","보스 출현!","틀린 카드를 모두 맞혀 물리치세요 · 목숨 3");SFX.no();vib([100,50,100,50,200]);draw()}
function bwin(){G.boss=(G.boss||0)+1;LGD().b++;boss=null;M.clear();ann("⚔️","보스 처치!","틀린 카드를 정복했어요");SFX.c10();vib([60,40,60,40,60,40,200]);for(let i=0;i<5;i++)setTimeout(()=>burst(innerWidth*Math.random(),innerHeight*(.2+Math.random()*.5),30),i*120);chk();save();build()}
function nxt(v,c){if(gm){gnxt(v,c);return}
if(boss){if(v){boss.q.shift();boss.hp--;vib(25)}else{boss.lives--;boss.q.push(boss.q.shift())}
if(boss.hp<=0){bwin();return}
if(boss.lives<=0){boss=null;bc=5;ann("💀","보스에게 패배…","복습하고 다시 도전!");vib([200,60,200]);build();return}
deck=boss.q;pos=0;face=0;gold=0;draw();return}
if(v)M.delete(c.id);else M.add(c.id);
if(bc>0)bc--;if(!v&&mode==3)deck.splice(Math.min(pos+4,deck.length),0,c);
if(M.size>=5&&bc<=0){startBoss();return}
pos++;face=0;roll();if(pos>=deck.length){build();return}draw()}
const mR=(a,b)=>{for(const k in b||{})if(!a[k]||(b[k].t||0)>(a[k].t||0))a[k]=b[k]};
const IV=[0,6e5,864e5,2592e5,6048e5,12096e5];
const dd=c=>R[c.id]?R[c.id].d:0,due=c=>dd(c)<=Date.now();
function srs(c,v){const r=R[c.id]||{b:0,d:0};r.b=v?Math.min(r.b+1,5):0;r.d=Date.now()+(v?IV[r.b]:0);r.t=Date.now();R[c.id]=r}
function nextDue(){const t=C.filter(c=>sel.has(c.s)&&R[c.id]).map(c=>R[c.id].d).filter(d=>d>Date.now()).sort((a,b)=>a-b)[0];if(!t)return"복습할 카드가 없어요.";const m=Math.ceil((t-Date.now())/6e4);return"🎉 지금 복습할 카드를 다 끝냈어요!<br>다음 복습: "+(m<60?m+"분 후":m<1440?Math.round(m/60)+"시간 후":Math.round(m/1440)+"일 후")}
const LGD=()=>G.log[G.day.d]||(G.log[G.day.d]={n:0,m:0,c:0,g:0,b:0});
const TT=["암기 새싹","복습 요정","퀴즈 헌터","콤보 장인","지식 수집가","시험 앞의 침착맨","만점 예감","밤샘 방지 요원","빈칸 파괴자","필기의 신","카드 슬레이어","정답 자석","개념 탐험가","오답 정복자","시험장의 여유","벼락치기 방어자","빈칸 사냥꾼","암기 달인","기억의 건축가","한 장 더 도전자","새벽의 복습러","밥상 위의 학자","집중력 몬스터","만점 후보생"];
const SP=["제다이 마스터","포스와 함께하는 자","시스 암기 군주","은하 제국 수석","요다급 통찰력","호그와트 수석","마법부 장관","불사조 기사단원","헤르미온느급 노력가","패트로누스 소환사"];
const TRV=["빛은 1초에 지구를 약 7바퀴 반 돌아요 (약 30만 km/s)","사람 세포 하나에 든 DNA를 펴면 약 2m예요","번개의 온도는 태양 표면보다 몇 배나 높아요 (약 3만 K)","물은 약 4℃에서 밀도가 가장 커요","금성은 자전 주기(약 243일)가 공전 주기(약 225일)보다 길어요","문어는 심장이 세 개예요","바나나에는 아주 약한 방사성 칼륨-40이 들어 있어요","'공짜 점심은 없다' = 모든 선택에는 기회비용이 있다는 말이에요"];
const TH=[["기본",""],["보라","#7c3aed"],["핑크","#db2777"],["오렌지","#ea580c"],["에메랄드","#059669"],["하늘","#0284c7"],["로즈골드","#b76e79"]];
const applyTh=()=>{const t=TH.find(x=>x[0]==G.th);document.documentElement.style.setProperty("--ac",t&&t[1]?t[1]:"")};
const MSG=["지금 외운 건 시험장에서 반드시 나온다 (아마도)","한 장 한 장이 쌓여서 만점이 돼요","오늘의 나, 어제보다 똑똑해짐 📈","밥 먹으면서 외우는 사람 = 승자","틀린 카드는 내일의 효자 카드","머리가 말랑말랑해지는 중 🧠","잘하고 있어요. 진짜로요","10장 돌파! 손이 먼저 알고 있어요","틀려도 괜찮아요, 틀린 만큼 기억에 새겨져요 ✍️","지금 이 한 장이 시험 한 문제예요","오늘도 카드 넘기는 손맛 최고 👏","잠깐, 물 한 잔 마시고 계속 가요 💧"];
function chest(){if($("cst"))return;const o=document.createElement("div");o.id="cst";o.innerHTML=`<div class="cb"><div class="ce">🎁</div><p><b>보물상자 등장!</b><br><small>탭해서 열어보세요</small></p></div>`;document.body.appendChild(o);vib([40,40,40]);SFX.c5();let st=0;
o.onclick=()=>{if(st==2){o.remove();return}if(st)return;st=1;o.querySelector(".ce").classList.add("shk");vib([20,20,20,20,40]);
setTimeout(()=>{const r=Math.random(),own=G.ti||(G.ti={}),left=TT.filter(x=>!own[x]);let e,t,sm;
const pk=a=>a[Math.floor(Math.random()*a.length)],ths=G.ths||(G.ths={}),lt=TH.filter(x=>x[1]&&!ths[x[0]]);
const r2=Math.random(),sp=SP.filter(x=>!own[x]);if(r<.05&&sp.length){const x=pk(sp);own[x]=1;G.tt=x;e="🌟";t="스페셜 칭호: "+x;sm="약 5% 확률로만 나오는 희귀 칭호예요!";for(let i=0;i<6;i++)setTimeout(()=>burst(innerWidth*Math.random(),innerHeight*Math.random(),40),i*150)}else if(r2<.03){G.gb=15;G.sh=(G.sh||0)+3;G.gn=(G.gn||0)+1;G.jp=(G.jp||0)+1;e="👑";t="잭팟!!";sm="황금 부스트 15장 + 콤보 보호막 3개 + 황금 카드 확정권!";burst(innerWidth/2,innerHeight/2,80)}
else if(r2<.10){G.gb=10;e="💎";t="황금 부스트!";sm="다음 10장은 황금 카드가 잘 나와요"}
else if(r2<.18){G.gn=(G.gn||0)+1;e="✨";t="황금 카드 확정권";sm="다음 카드는 무조건 황금 카드!"}
else if(r2<.28){G.sh=(G.sh||0)+2;e="🛡️";t="콤보 보호막 ×2";sm="몰라요를 눌러도 콤보가 2번 유지돼요"}
else if(r2<.40&&lt.length){const x=pk(lt);ths[x[0]]=1;G.th=x[0];e="🎨";t="테마 획득: "+x[0];sm="바로 적용됐어요 · 로비 테마 타일에서 바꿀 수 있어요";applyTh()}
else if(r2<.56&&left.length){const x=pk(left);own[x]=1;G.tt=x;e="🏷️";t="칭호 획득: "+x;sm="로비에서 칭호를 탭하면 바꿀 수 있어요"}
else if(r2<.74){e="🧠";t=pk(TRV);sm="오늘의 잡학"}
else{e="💬";t=pk(MSG);sm="격려 메시지"}
G.ch=(G.ch||0)+1;o.querySelector(".cb").innerHTML=`<div class="ce">${e}</div><p><b></b><br><small>${sm}</small></p><button class="on">계속하기</button>`;o.querySelector("b").textContent=t;
burst(innerWidth/2,innerHeight/2,40);SFX.c10();vib([30,30,30,30,100]);chk();save();st=2},700)}}
const wmsg=(a,t)=>t>=50?"오늘 진짜 열일했어요 🔥":a>=80?"기억이 단단해지고 있어요 💪":a>=50?"틀린 카드는 복습 모드가 챙겨줄게요":"틀린 만큼 성장한 날이에요 🌱";
function wrap(k){const l=(G.log||{})[k],t=l?l.n+l.m:0;if(!t)return`<div class="wr"><b>${+k.slice(5,7)}월 ${+k.slice(8)}일</b><p class="sec" style="margin:6px 0 0">이 날은 학습 기록이 없어요.</p></div>`;const a=Math.round(l.n/t*100);
return`<div class="wr"><b>📋 ${+k.slice(5,7)}월 ${+k.slice(8)}일 마무리 카드</b><div class="wg"><div><em>${t}</em><small>푼 카드</small></div><div><em>${a}%</em><small>알아요 비율</small></div><div><em>${l.c}</em><small>최고 콤보</small></div><div><em>${l.g||0}</em><small>황금 카드</small></div></div><p style="margin:0">${wmsg(a,t)}${l.b?` · 보스 ${l.b}회 처치 ⚔️`:""}</p></div>`}
let cmo=new Date(),csel=null;
function cal(day){view="cal";show();if(day)csel=day;if(!csel)csel=tdf(new Date());const y=cmo.getFullYear(),m=cmo.getMonth(),f=new Date(y,m,1).getDay(),dn=new Date(y,m+1,0).getDate(),L=G.log||{},td=tdf(new Date());let cells="";
for(let i=0;i<f;i++)cells+="<i></i>";
for(let d=1;d<=dn;d++){const k=y+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0"),l=L[k],t=l?l.n+l.m:0,lv=t?Math.min(1+Math.floor(t/15),4):0;cells+=`<button class="cd l${lv}${k==csel?" sel":""}${k==td?" td":""}" data-d="${k}">${d}</button>`}
$("cal").innerHTML=`<div class="bar"><button class="bk" id="cb">‹ 과목 선택</button></div><div class="cm"><button id="cp">‹</button><b>${y}년 ${m+1}월</b><button id="cn">›</button></div><div class="cw"><span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span></div><div class="cg">${cells}</div>`+wrap(csel);scrollTo(0,0)}
let gm=null;
const GT={time:["⏱️","TIME ATTACK","#22d3ee"],surv:["💀","SURVIVAL","#f43f5e"],daily:["📅","DAILY CHALLENGE","#f5b301"]};
const m32=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
function fx(c){const e=$("gfx");e.className="";void e.offsetWidth;e.className=c}
function shake(){const a=$("app");a.classList.remove("shk2");void a.offsetWidth;a.classList.add("shk2")}
function stopGm(){if(gm){clearInterval(gm.iv);gm=null}const a=$("app"),h=$("hud");if(a)a.classList.remove("gaming","gm-time","gm-surv","gm-daily");if(h){h.hidden=true;h.className=""}}
function hudInit(){const g=gm,h=$("hud");h.hidden=false;h.className="hd";h.innerHTML=`<div class="hl"><b id="h1"></b><small>${{time:"SEC",surv:"COMBO",daily:"CARD"}[g.type]}</small></div><div class="hm"><div class="hb"><i id="hbi"></i></div><div id="hh"></div></div><button id="gx" aria-label="그만하기">✕</button>`;hudUp()}
function hudUp(){const g=gm;if(!g)return;const h=$("hud");
if(g.type=="time"){$("h1").textContent=Math.ceil(g.left);$("hbi").style.width=Math.min(g.left/60*100,100)+"%";$("hh").textContent="✅ "+g.ok+"  🔥 "+combo;h.classList.toggle("low",g.left<=10)}
else if(g.type=="surv"){$("h1").textContent=combo;$("hbi").style.width=(combo%10)*10+"%";$("hh").textContent="❤️".repeat(g.lives)+"🖤".repeat(Math.max(0,3-g.lives))+"  ✅ "+g.ok}
else{$("h1").textContent=g.n+"/10";$("hbi").style.width=g.n*10+"%";$("hh").textContent="✅ "+g.ok+"  🔥 "+combo}}
function tick(){const g=gm;if(!g||g.over)return;const p=Math.ceil(g.left);g.left=Math.max(0,g.left-.1);const q=Math.ceil(g.left);if(q!=p&&q<=5&&q>0){tone(900,0,.08,"square",.08);vib(15)}hudUp();if(g.left<=0)endG()}
function intro(type,cb){const T=GT[type],o=document.createElement("div");o.id="gi";o.style.setProperty("--gc",T[2]);o.innerHTML=`<div class="rg"></div><div class="rg r2"></div><div class="gt">${T[0]}<br>${T[1]}</div><div class="gn"></div>`;document.body.appendChild(o);const A=[3,2,1,"GO!"];let k=0;
const step=()=>{const n=o.querySelector(".gn"),go=k==3;n.textContent=A[k];n.style.animation="none";void n.offsetWidth;n.style.animation="gnum .7s cubic-bezier(.2,1.6,.4,1)";tone(go?880:440,0,.18,"square",.1);vib(go?[30,30,60]:20);burst(innerWidth/2,innerHeight/2,go?50:12);k++;if(k<A.length)setTimeout(step,750);else setTimeout(()=>{o.remove();cb()},600)};step()}
function startG(type){if(!C.length){ann("🃏","카드가 없어요","다른 과목에서 시도해 보세요");return}
let pool=type=="daily"?C.slice():C.filter(c=>sel.has(c.s));if(!pool.length)pool=C.slice();
if(type=="daily"){let h=0;for(const ch of tdf(new Date())+cur)h=(h*31+ch.charCodeAt(0))>>>0;const r=m32(h);pool=pool.map(c=>[r(),c]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]).slice(0,10)}else pool.sort(()=>Math.random()-.5);
closeSheet();stopGm();boss=null;
intro(type,()=>{gm={type,n:0,ok:0,ng:0,best:0,left:60,lives:3};combo=0;badge();deck=pool;pos=0;face=0;roll();const a=$("app");a.classList.add("gaming","gm-"+type);hudInit();draw();if(type=="time")gm.iv=setInterval(tick,100)})}
function gnxt(v,c){const g=gm;if(g.over)return;g.n++;v?g.ok++:g.ng++;g.best=Math.max(g.best,combo);
if(v&&gold&&g.type=="time"){g.left+=3;word(innerWidth/2,innerHeight*.3,"⏱️ +3초!");SFX.c5()}
if(!v&&g.type=="surv"){g.lives--;fx("fl-r");shake();vib([120,50,120]);if(g.lives<=0){hudUp();endG();return}}
if(v&&g.type=="surv"&&combo>0&&combo%10==0&&g.lives<5){g.lives++;word(innerWidth/2,innerHeight*.3,"❤️ +1 목숨!");fx("fl-g")}
if(g.type=="daily"&&g.n>=10){hudUp();endG();return}
pos++;face=0;roll();if(pos>=deck.length){if(g.type=="daily"){endG();return}deck.sort(()=>Math.random()-.5);pos=0}
hudUp();draw()}
function cu(o){o.querySelectorAll("[data-v]").forEach((e,i)=>{const v=+e.dataset.v,t0=performance.now()+300+i*150,f=t=>{const p=Math.min(Math.max((t-t0)/900,0),1);e.textContent=Math.round(v*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}
function endG(){const g=gm;if(!g||g.over)return;g.over=1;clearInterval(g.iv);hudUp();G.rec=G.rec||{time:0,surv:0};
const T=GT[g.type],sc=g.ok,th={time:[25,18,10],surv:[40,25,12],daily:[10,8,6]}[g.type],gr=sc>=th[0]?"S":sc>=th[1]?"A":sc>=th[2]?"B":"C",rk=g.type=="daily"?"":g.type,nr=!!rk&&sc>(G.rec[rk]||0);if(nr)G.rec[rk]=sc;
let rw="";if(g.type=="daily"){if(G.dd!=tdf(new Date())){G.dd=tdf(new Date());G.dc=(G.dc||0)+1;rw="🎁 첫 클리어 보상: 보물상자!";g.rc=1}else rw="오늘 보상은 이미 받았어요"}
chk();save();
const o=document.createElement("div");o.id="gr";o.style.setProperty("--gc",T[2]);
o.innerHTML=`<div class="gp"><div class="gh">${T[0]} ${g.type=="time"?"TIME UP!":g.type=="surv"?"GAME OVER":"CLEAR!"}</div><div class="gl g${gr}">${gr}</div>${nr?`<div class="nr">🏆 신기록!</div>`:""}<div class="gs"><div><em data-v="${g.n}">0</em><small>푼 카드</small></div><div><em data-v="${g.ok}">0</em><small>알아요</small></div><div><em data-v="${g.n?Math.round(g.ok/g.n*100):0}">0</em><small>정답률 %</small></div><div><em data-v="${g.best}">0</em><small>최고 콤보</small></div></div>${rw?`<p class="rw">${rw}</p>`:""}${rk?`<p class="bs">내 최고 기록 ${G.rec[rk]}장</p>`:""}<div class="gb">${g.type=="daily"?"":`<button id="gre">다시 도전</button>`}<button id="gok" class="on">나가기</button></div></div>`;
document.body.appendChild(o);vib([60,40,60]);cu(o);
setTimeout(()=>{if(gr!="C"){for(let i=0;i<(gr=="S"?8:4);i++)setTimeout(()=>burst(innerWidth*Math.random(),innerHeight*(.15+Math.random()*.5),36),i*140);SFX.c10()}else SFX.no();vib([30,30,80])},1100);
if($("gre"))$("gre").onclick=()=>{o.remove();startG(g.type)};
$("gok").onclick=()=>{o.remove();stopGm();build();if(g.rc)setTimeout(chest,300)}}
const closeSheet=()=>{const o=$("gms");if(o)o.remove()};
function modes(){if($("gms"))return;const R=G.rec||{},o=document.createElement("div");o.id="gms";o.className="ov";
o.innerHTML=`<div class="gsh"><b>🎮 게임 모드</b>`+[["time","⏱️","타임어택","60초 안에 최대한 많이! 황금 카드는 +3초",`최고 ${R.time||0}장`],["surv","💀","서바이벌","목숨 3개 · 10연속마다 +1 · 몰라요 3번이면 끝",`최고 ${R.surv||0}장`],["daily","📅","오늘의 챌린지","매일 같은 10장 · 첫 클리어 시 보물상자",G.dd==tdf(new Date())?"오늘 클리어 ✅":"도전 가능!"]].map(m=>`<button class="mc m-${m[0]}" data-m="${m[0]}"><span class="me">${m[1]}</span><span><b>${m[2]}</b><small>${m[3]}</small><em>${m[4]}</em></span></button>`).join("")+`<button id="gmc" class="rz">닫기</button></div>`;
document.body.appendChild(o);o.onclick=e=>{const b=e.target.closest("[data-m]");if(b){startG(b.dataset.m);return}if(e.target.closest("#gmc")||e.target==o)closeSheet()}}
function titleSheet(){if($("ts"))return;const own=Object.keys(G.ti||{}),o=document.createElement("div");o.id="ts";o.className="ov";
o.innerHTML=`<div class="gsh"><b>🏷️ 내 칭호 <small>보유 ${own.length}개</small></b>`+(own.length?own.map(x=>`<button class="tr${x==G.tt?" cur":""}${SP.includes(x)?" sp":""}" data-t="${x}">${SP.includes(x)?"✨ ":""}${x}${x==G.tt?" ✓":""}</button>`).join(""):`<p class="sec">아직 획득한 칭호가 없어요. 보물상자를 열어 보세요!</p>`)+(G.tt?`<button class="tr" data-t="">칭호 해제</button>`:"")+`<button id="tsc" class="rz">닫기</button></div>`;
document.body.appendChild(o);o.onclick=e=>{const b=e.target.closest("[data-t]");if(b){G.tt=b.dataset.t;save();vib(15);o.remove();home();return}if(e.target.closest("#tsc")||e.target==o)o.remove()}}
function toast(b){vib([40,30,40,30,120]);const t=document.createElement("div");t.className="tst";t.innerHTML=`<span>${b.e}</span><div><small>새 배지 획득!</small><b>${b.n}</b></div>`;document.body.appendChild(t);SFX.c10();burst(innerWidth/2,90,40);setTimeout(()=>t.remove(),3300)}
function chk(){if(G.day&&!G.day.ok&&QS.every(q=>q[2]()>=q[3])){G.day.ok=1;G.qd=(G.qd||0)+1;ann("🎁","오늘의 퀘스트 완료!","축하해요");SFX.c10();burst(innerWidth/2,100,40);vib([40,30,40,30,120])}let i=0;BD.forEach(b=>{if(!G.got[b.id]&&b.f()){G.got[b.id]=Date.now();setTimeout(()=>toast(b),500+i++*1300)}})}
function badges(){view="badge";show();$("bdg").innerHTML=`<div class="bar"><button class="bk" id="bb">‹ 과목 선택</button><span class="sec" style="margin:0">🏆 ${Object.keys(G.got).length} / ${BD.length}</span></div><div class="bgs">`+BD.map(b=>`<div class="bg ${G.got[b.id]?"on":""}"><span>${b.e}</span><b>${b.n}</b><small>${b.d}</small></div>`).join("")+`</div>`;scrollTo(0,0)}
function show(){$("home").hidden=view!="home";$("app").hidden=view!="study";$("lst").hidden=view!="list";$("bdg").hidden=view!="badge";$("cal").hidden=view!="cal"}
function home(){stopGm();view="home";show();const nb=Object.keys(G.got).length,ic={gwa:["🧪","#1f4fd8"],earth:["🌏","#0f8b8d"],soc:["📚","#b45309"],bio:["🧬","#2f9e44"]};
$("home").innerHTML=`<div class="hh"><div><h1>복습 플래시카드</h1><p id="tti">${G.tt?(SP.includes(G.tt)?"✨ ":"🏷️ ")+G.tt+" ▾":"오늘도 한 장씩, 가볍게"}</p></div><div class="stk">🔥 ${stv()}일</div></div>`+qpanel()+`<div class="hs">과목</div><div class="subs">`+SUBJ.map(s=>{const c=SB[s.id].C,k=c.filter(x=>ST[s.id].K[x.id]).length,dc=c.filter(x=>{const r=ST[s.id].R[x.id];return r&&r.d<=Date.now()}).length,pc=c.length?Math.round(k/c.length*100):0;return`<button class="sub" data-s="${s.id}" style="--c:${ic[s.id][1]}"><span class="si">${ic[s.id][0]}</span><span class="sm"><b>${s.n}</b><small>${s.d}</small><span class="pb"><i style="width:${pc}%"></i></span><em>${c.length?`아는 카드 ${k} / ${c.length} · ${pc}%${dc?` · 🧠 복습 ${dc}장`:""}`:"준비 중"}</em></span></button>`}).join("")+`</div><div class="tl"><button id="thb"><span>🎨</span><b>테마</b><em>${G.th||"기본"}</em></button><button id="clb"><span>📅</span><b>학습 기록</b><em>${Object.keys(G.log||{}).length}일</em></button><button id="bgb"><span>🏆</span><b>배지·트로피</b><em>${nb} / ${BD.length}</em></button><button id="hvb"><span>📳</span><b>진동 피드백</b><em>${HV?"켜짐":"꺼짐"}</em></button></div><button class="rz" id="rab">전체 카드 기록 초기화</button>`}
function enter(id){cur=id;D=SB[id].D;C=SB[id].C;K=ST[id].K;S=ST[id].S;R=ST[id].R;sel=new Set(D.map((_,i)=>i));M.clear();bc=0;boss=null;mode=1;shuf=false;starOnly=false;combo=0;badge();$("bk").textContent="‹ "+SUBJ.find(s=>s.id==id).n;view="study";show();build()}
function fill(t){return t.replace(/^※/,"").replace(/\{(.+?)\}/g,'<span class="a">$1</span>')}
function list(){view="list";show();G.list++;chk();save();const cs=C.filter(c=>sel.has(c.s)&&(!starOnly||S[c.id]));$("lst").innerHTML=`<div class="bar"><button class="bk" id="lb">‹ 카드 학습</button><span class="sec" style="margin:0">모아보기 · ${cs.length}장</span></div>`+(cs.map(c=>`<div class="lc"><div class="sec">${D[c.s][0]}</div>${c.q?`<div class="lq">${c.q}</div>`:""}<div>${fill(c.t)}</div></div>`).join("")||`<p class="sec">표시할 카드가 없어요.</p>`);scrollTo(0,0)}
const W=["쾅!","휘리릭~","슈웅!","덜덜덜","쿵!","짜잔!","지직!","뿅!"],COL=[0,40,140,200,270,320];
function build(){boss=null;deck=C.filter(c=>sel.has(c.s)&&(mode==1||(mode==3?due(c):!K[c.id]))&&(!starOnly||S[c.id]));if(mode==3)deck.sort((a,b)=>dd(a)-dd(b));if(shuf)deck.sort(()=>Math.random()-.5);pos=0;face=0;roll();draw()}
function head(){$("secs").innerHTML=D.map((s,i)=>`<button class="${sel.has(i)?"on":""}" data-i="${i}">${s[0]}</button>`).join("");
$("m1").className=mode==1?"on":"";$("m2").className=mode==2?"on":"";$("m3").className=mode==3?"on":"";$("sh").className=shuf?"on":"";$("sf").className=starOnly?"on":""}
function left(){const r=$("card").querySelectorAll(".b").length;$("hint").textContent=r?`남은 빈칸 ${r}개 · 빈칸을 탭하세요`:""}
function draw(){head();const n=C.filter(c=>sel.has(c.s)),k=n.filter(c=>K[c.id]).length,c=deck[pos],card=$("card");
$("st").textContent=deck.length?`${pos+1} / ${deck.length}  ·  아는 카드 ${k} / ${n.length}`:`아는 카드 ${k} / ${n.length}`;
$("act").innerHTML="";ans=[];if(boss)bossbar();
if(!c){card.innerHTML=`<div>${starOnly&&!C.some(c=>S[c.id]&&sel.has(c.s))?"별표한 카드가 없어요.":mode==3?nextDue():mode==2?"모르는 카드가 없어요. 전부 아는 카드로 표시했어요.":(C.length?"선택한 파트에 카드가 없어요.":"아직 카드가 없어요.")}</div>`;$("hint").textContent="";return}
if(c.q&&!face){card.innerHTML=hd(c)+`<div class="qq">${c.q}</div>`;card.classList.remove("enter","flp");void card.offsetWidth;card.classList.add("enter");card.classList.toggle("fire",combo>=5);card.classList.toggle("gold",!!gold);card.classList.toggle("bossc",!!boss);$("hint").textContent="카드를 탭하면 뒤집혀요";return}
let t=c.t,note="";if(t[0]=="※"){t=t.slice(1);note=`<div class="n">노트에 빈칸이던 항목이라 보충한 답이에요</div>`}
t=t.replace(/\{(.+?)\}/g,(m,a)=>{ans.push(a);return`<span class="b" data-k="${ans.length-1}" style="width:${Math.min(Math.max(a.length,3),9)}em"></span>`});
card.innerHTML=hd(c)+`<div>${t}</div>${note}`;
card.classList.remove("enter","flp");void card.offsetWidth;card.classList.add(c.q?"flp":"enter");card.classList.toggle("fire",combo>=5);card.classList.toggle("gold",!!gold);card.classList.toggle("bossc",!!boss);left()}
function burst(x,y,n){for(let i=0;i<n;i++){const p=document.createElement("span"),a=Math.random()*6.283,d=50+Math.random()*100;p.className="p";p.textContent=["★","✦","●","♦","✿"][i%5];p.style.cssText=`left:${x}px;top:${y}px;color:hsl(${COL[i%6]+Math.random()*30} 90% 60%);--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;--r:${Math.random()*720-360}deg`;document.body.appendChild(p);setTimeout(()=>p.remove(),950)}}
function word(x,y,t){const w=document.createElement("span");w.className="w";w.textContent=t;w.style.left=Math.min(Math.max(x,50),innerWidth-50)+"px";w.style.top=y+"px";w.style.color=`hsl(${COL[Math.floor(Math.random()*6)]} 95% 58%)`;document.body.appendChild(w);setTimeout(()=>w.remove(),950)}
function hit(){const c=$("card");c.classList.remove("hit");void c.offsetWidth;c.classList.add("hit")}
let AC=null;
function tone(f,t,d,ty,v,sl){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state=="suspended")AC.resume();const o=AC.createOscillator(),g=AC.createGain(),a=AC.currentTime+t;o.type=ty||"sine";o.frequency.setValueAtTime(f,a);if(sl)o.frequency.exponentialRampToValueAtTime(sl,a+d);g.gain.setValueAtTime(0.0001,a);g.gain.exponentialRampToValueAtTime(Math.min((v||.15)*3.2,.95),a+.012);g.gain.exponentialRampToValueAtTime(0.0001,a+d);o.connect(g);g.connect(AC.destination);o.start(a);o.stop(a+d+.02)}catch(e){}}
const SFX={flip(){tone(260,0,.22,"sine",.12,1100);tone(1400,.12,.15,"triangle",.08)},open(){tone(520,0,.12,"sine",.16,880)},
yes(n){const b=659*Math.pow(1.0595,Math.min(n,12));tone(b,0,.12,"triangle",.15);tone(b*1.5,.07,.2,"triangle",.14)},
no(){tone(220,0,.18,"sine",.18,110)},
c5(){[523,659,784,1047].forEach((f,i)=>tone(f,i*.07,.2,"triangle",.15))},
c10(){[523,659,784,1047,1319,1568].forEach((f,i)=>tone(f,i*.06,.28,"triangle",.15));tone(262,0,.6,"sawtooth",.06);tone(2093,.38,.5,"sine",.1)}};
function pop(el){const k=+el.dataset.k,r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,f=Math.floor(Math.random()*8),s=document.createElement("span");
s.className="a fx"+f;s.textContent=ans[k];el.replaceWith(s);
burst(x,y,18);hit();SFX.open();try{vib(f==0||f==3?[30,30,30]:25)}catch(e){}
left();if(!$("card").querySelector(".b"))done()}
function done(){const c=$("card").getBoundingClientRect();
for(let i=0;i<8;i++)setTimeout(()=>burst(c.left+Math.random()*c.width,c.top+Math.random()*c.height,10),i*90);

$("act").innerHTML=`<button id="no">몰라요</button><button id="ok" class="on">알아요</button>`;
$("no").onclick=()=>mark(0);$("ok").onclick=()=>mark(1);$("hint").textContent="← 몰라요 · 알아요 → 카드를 밀어도 돼요"}
let combo=0;
function badge(up){const b=$("combo");document.documentElement.style.setProperty("--h",(combo*28)%360);
if(combo<1){b.className="";return}
b.textContent="🔥 ×"+combo;b.style.fontSize=Math.min(16+combo*2,40)+"px";b.className="show";
if(up){void b.offsetWidth;b.classList.add("bump")}}
function cheer(x,y){burst(x,y,Math.min(10+combo*3,50));if(combo%10==0)SFX.c10();else if(combo%5==0)SFX.c5();else SFX.yes(combo);
if(combo%5==0){const f=$("fl");f.classList.remove("go");void f.offsetWidth;f.classList.add("go");
for(let i=0;i<5;i++)setTimeout(()=>burst(innerWidth*Math.random(),innerHeight*(.2+Math.random()*.5),30),i*110);
if(combo%10==0)for(let i=0;i<14;i++)setTimeout(()=>burst(innerWidth*Math.random(),20,16),i*70)}}
let busy=0;function mark(v){if(busy)return;daily();const c=deck[pos],r=$("act").getBoundingClientRect(),x=r.left+r.width*(v?.75:.25),y=r.top+r.height/2;
if(v){K[c.id]=1;combo++;G.tot+=gold?3:1;G.best=Math.max(G.best,combo);G.day.n++;G.day.c=Math.max(G.day.c,combo);if(gold){G.gold=(G.gold||0)+1;G.day.g++;goldfx()}badge(true);cheer(x,y)}
else{delete K[c.id];SFX.no();if(G.sh>0&&combo>=1){G.sh--;ann("🛡️","보호막 발동!","콤보 유지 · 남은 "+G.sh+"개");vib([40,30,40])}else{if(combo>=1){$("combo").classList.add("lose");hit();setTimeout(()=>{if(combo<1)$("combo").className=""},650)}combo=0}}
srs(c,v);G.cn=(G.cn||0)+1;{const l=LGD();v?l.n++:l.m++;l.c=Math.max(l.c,combo);if(v&&gold)l.g++}chk();save();busy=1;const cd=$("card");cd.classList.remove("enter","flp","hit");void cd.offsetWidth;if(!swp){cd.classList.add(v?"outok":"outno");cd.style.transform="";cd.style.boxShadow=""}vib(v?(combo%5==0?[20,30,20,30,60]:18):[70,40,70]);word(x,y-40,v?["알아요!","굿!","완벽!","나이스!"][combo%4]:"다시!");const sw=swp;setTimeout(()=>{busy=0;swp=0;cd.classList.remove("outok","outno","sw-r","sw-l");cd.style.cssText="";nxt(v,c);if(G.cn%10==0&&!gm)setTimeout(chest,350)},sw?260:340)}
$("card").onclick=e=>{if(drg){drg=0;return}const st=e.target.closest(".star");if(st){const c=deck[pos];if(c){if(S[c.id])delete S[c.id];else{S[c.id]=1;G.star++;chk()}save();st.textContent=S[c.id]?"★":"☆"}return}const c0=deck[pos];if(c0&&c0.q&&!face){face=1;draw();SFX.flip();vib(12);{const r=$("card").getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,14)}return}const el=e.target.closest(".b")||$("card").querySelector(".b");if(el)pop(el)};
$("secs").onclick=e=>{const i=+e.target.dataset.i;if(isNaN(i))return;sel.has(i)?sel.delete(i):sel.add(i);build()};
$("m1").onclick=()=>{mode=1;build()};$("m2").onclick=()=>{mode=2;build()};$("m3").onclick=()=>{mode=3;build()};
$("sh").onclick=()=>{shuf=!shuf;build()};$("sf").onclick=()=>{starOnly=!starOnly;build()};
$("rs").onclick=()=>{if(confirm("이 과목의 아는 카드 기록을 모두 지울까요?")){for(const k in K)delete K[k];for(const k in R)delete R[k];combo=0;badge();save();build()}};
$("home").onclick=e=>{if(e.target.closest("#thb")){const o=TH.filter(x=>!x[1]||(G.ths||{})[x[0]]);G.th=o[(o.findIndex(x=>x[0]==(G.th||"기본"))+1)%o.length][0];applyTh();save();vib(15);return home()}if(e.target.closest("#tti"))return titleSheet();if(e.target.closest("#clb")){cmo=new Date();csel=null;return cal()}if(e.target.closest("#rab")){if(confirm("모든 과목의 아는/모르는 카드 기록을 전부 초기화할까요? (배지는 유지돼요)")){for(const id in ST){for(const k in ST[id].K)delete ST[id].K[k];for(const k in ST[id].R)delete ST[id].R[k]}M.clear();combo=0;badge();save();home()}return}if(e.target.closest("#bgb"))return badges();if(e.target.closest("#hvb")){HV=HV?0:1;try{localStorage.setItem("hv",HV)}catch(x){}vib(30);return home()}const b=e.target.closest("[data-s]");if(b)enter(b.dataset.s)};
$("cal").onclick=e=>{const b=e.target.closest("[data-d]");if(b)return cal(b.dataset.d);if(e.target.closest("#cb"))return home();if(e.target.closest("#cp")){cmo=new Date(cmo.getFullYear(),cmo.getMonth()-1,1);return cal()}if(e.target.closest("#cn")){cmo=new Date(cmo.getFullYear(),cmo.getMonth()+1,1);cal()}};$("bdg").onclick=e=>{if(e.target.closest("#bb"))home()};$("bk").onclick=home;$("gmb").onclick=modes;$("hud").onclick=e=>{if(e.target.closest("#gx")){stopGm();build()}};$("ls").onclick=list;
$("lst").onclick=e=>{if(e.target.closest("#lb")){view="study";show();draw()}};
let drg=0,swp=0;(()=>{const cd=$("card");let x0=0,y0=0,t0=0,on=0,dx=0;
const live=()=>!!$("no")&&!busy;
const cls=()=>{cd.classList.remove("sw-r","sw-l");cd.style.setProperty("--o",0)};
cd.addEventListener("pointerdown",e=>{x0=e.clientX;y0=e.clientY;t0=performance.now();on=1;drg=0;dx=0;cd.style.transition="none"});
cd.addEventListener("pointermove",e=>{if(!on||!live())return;dx=e.clientX-x0;const dy=e.clientY-y0;
if(!drg){if(Math.abs(dx)<8||Math.abs(dy)>Math.abs(dx)*1.4)return;drg=1;try{cd.setPointerCapture(e.pointerId)}catch(x){}}
cd.style.transform=`translateX(${dx}px) rotate(${dx/14}deg)`;cd.classList.toggle("sw-r",dx>0);cd.classList.toggle("sw-l",dx<0);cd.style.setProperty("--o",Math.min(Math.abs(dx)/80,1))});
const end=()=>{if(!on)return;on=0;cd.style.transition="";if(!drg||!live()){cd.style.transform="";cls();return}
const v=dx/Math.max(performance.now()-t0,1),go=Math.abs(dx)>70||(Math.abs(v)>.5&&Math.abs(dx)>25);
if(go){swp=1;vib(15);cd.style.transition="transform .28s ease-out,opacity .28s";cd.style.transform=`translateX(${dx>0?"120vw":"-120vw"}) rotate(${dx>0?28:-28}deg)`;cd.style.opacity="0";mark(dx>0?1:0)}
else{cd.style.transition="transform .3s cubic-bezier(.2,1.5,.4,1)";cd.style.transform="";cls();setTimeout(()=>{cd.style.transition=""},320)}};
cd.addEventListener("pointerup",end);cd.addEventListener("pointercancel",end);
addEventListener("keydown",e=>{if(view!="study")return;const b=e.key=="ArrowRight"?$("ok"):e.key=="ArrowLeft"?$("no"):null;if(b)b.click()})})();
applyTh();home();
(async()=>{try{if(!window.claude)return;const u=await claude.use("user"),db=await claude.use("db");if(!u||!db)return;const id=await u.id();if(!id)return;const ref=db.collection("data/users/"+id).doc("progress"),snap=await ref.get();if(snap.exists){const d=snap.data()||{};if(d.G){for(const k of["tot","best","list","star","gold","boss","bs","qd","cn","ch","jp","dc"])G[k]=Math.max(G[k]||0,d.G[k]||0);Object.assign(G.got,d.G.got||{});G.ti=Object.assign(G.ti||{},d.G.ti||{});G.tt=G.tt||d.G.tt||"";G.ths=Object.assign(G.ths||{},d.G.ths||{});if(!G.th)G.th=d.G.th||"";G.rec=G.rec||{time:0,surv:0};for(const k of["time","surv"])G.rec[k]=Math.max(G.rec[k]||0,(d.G.rec||{})[k]||0);if((d.G.dd||"")>(G.dd||""))G.dd=d.G.dd;applyTh();G.log=G.log||{};for(const k in d.G.log||{}){const a=G.log[k],b=d.G.log[k];if(!a||(b.n+b.m)>(a.n+a.m))G.log[k]=b}if((d.G.last||"")>(G.last||"")){G.last=d.G.last;G.st=d.G.st;G.day=d.G.day}}Object.assign(ST.gwa.K,d.K||{});Object.assign(ST.gwa.S,d.S||{});mR(ST.gwa.R,d.R);for(const id of["earth","bio","soc"]){const x=(d.X||{})[id];if(x){Object.assign(ST[id].K,x.K||{});Object.assign(ST[id].S,x.S||{});mR(ST[id].R,x.R)}}}DBR=ref;save();if(view=="home")home();else if(view=="study"&&combo<1)build()}catch(e){}})();
