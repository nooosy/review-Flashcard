/* ===== 추가 기능: D-day · 백업/복원 · 오프라인 ===== */
(()=>{
const $=id=>document.getElementById(id);
const KEYS=()=>Object.keys(localStorage).filter(k=>!k.startsWith("xsync"));
function dd(){try{return JSON.parse(localStorage.getItem("xdd")||"null")}catch(e){return null}}
function dtxt(d){const t=new Date();t.setHours(0,0,0,0);const n=Math.round((new Date(d.date+"T00:00:00")-t)/864e5);return n>0?"D-"+n:n==0?"D-DAY 🔥":"D+"+(-n)+" (종료)"}
function render(){const h=$("home");if(!h||h.querySelector(".xex"))return;const hh=h.querySelector(".hh");if(!hh)return;
 const d=dd(),w=document.createElement("div");w.className="xex";
 const on=window.XSYNC&&XSYNC.on();
 w.innerHTML=`<button class="xdd" id="xdd">${d?`<span>📅 ${d.name}</span><b>${dtxt(d)}</b>`:`<span>📅 시험 D-day 설정하기</span><b>＋</b>`}</button>
 <div class="xbk"><button id="xsy">☁️ 동기화<em class="${on?"ok":""}">${on?"켜짐":"꺼짐"}</em></button><button id="xexp">📤 백업</button><button id="ximp">📥 복원</button></div>`;
 (h.querySelector(".xhero")||hh).after(w)}

function fmt(t){return t?new Date(t).toLocaleString("ko-KR",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}):"-"}
function syncSheet(){if(document.getElementById("xsyn"))return;const o=document.createElement("div");o.id="xsyn";o.className="ov";document.body.appendChild(o);
 const draw=()=>{const on=XSYNC.on(),i=XSYNC.info();
  o.innerHTML=`<div class="gsh"><b>☁️ 기기 동기화</b>`+(on?
  `<p class="sp1">연결됨 ✅<br><small>마지막 동기화 ${fmt(i.last)}${i.err?` · <span style="color:#f43f5e">오류 ${i.err}</span>`:""}</small></p>
   <p class="sp2">다른 기기에서 앱을 열면 자동으로 최신 기록을 받아와요.<br>기기를 바꿀 땐 앱을 잠깐 닫았다가 열어 주세요.</p>
   <div class="gb"><button id="xsn">지금 동기화</button><button id="xsd">연결 해제</button></div>`:
  `<ol class="sp2"><li><a href="https://github.com/settings/tokens/new?scopes=gist&description=flashcards-sync" target="_blank" rel="noopener">여기</a>를 눌러 토큰 만들기<br><small>(Note 그대로, <b>gist</b>만 체크, Expiration은 No expiration → 맨 아래 Generate)</small></li><li>만들어진 <b>ghp_…</b> 토큰을 복사해서 아래에 붙여넣기</li><li>iPhone, iPad <b>둘 다 같은 토큰</b>을 넣으면 연결돼요</li></ol>
   <input id="xst" type="password" placeholder="ghp_xxxxxxxx" autocomplete="off" autocapitalize="off">
   <div class="gb"><button id="xsc" class="on">연결하기</button></div>
   <p class="sp3">🔒 토큰은 이 기기 안에만 저장되고, 내 비공개 Gist 한 곳에만 기록이 올라가요.</p>`)+`<button id="xsx" class="rz">닫기</button></div>`};
 draw();
 o.onclick=async e=>{const b=e.target.closest("button");if(e.target==o||(b&&b.id=="xsx")){o.remove();const x=document.querySelector(".xex");x&&x.remove();render();return}if(!b)return;
  if(b.id=="xsc"){const t=document.getElementById("xst").value.trim();if(!t)return;b.textContent="연결 중…";b.disabled=true;
   try{const r=await XSYNC.connect(t);if(r=="reload"){location.reload();return}draw()}catch(x){alert(x.message);b.textContent="연결하기";b.disabled=false}}
  else if(b.id=="xsn"){b.textContent="동기화 중…";b.disabled=true;try{if(await XSYNC.pull()){location.reload();return}await XSYNC.push()}catch(x){alert("동기화 실패: "+x.message)}draw()}
  else if(b.id=="xsd"){if(confirm("이 기기의 동기화 연결을 해제할까요? (기록은 그대로 남아요)")){XSYNC.disconnect();draw()}}}}
new MutationObserver(render).observe($("home"),{childList:true});render();
$("home").addEventListener("click",e=>{
 if(e.target.closest("#xsy"))syncSheet();
 else if(e.target.closest("#xdd")){const d=dd()||{};const n=prompt("시험 이름 (비우면 삭제)",d.name||"중간고사");if(n===null)return;
  if(!n.trim()){localStorage.removeItem("xdd")}else{const dt=prompt("시험 날짜 (예: 2026-10-20)",d.date||"");if(!dt||isNaN(new Date(dt)))return alert("날짜 형식이 올바르지 않아요 (YYYY-MM-DD)");localStorage.setItem("xdd",JSON.stringify({name:n.trim(),date:dt}))}
  const x=document.querySelector(".xex");x&&x.remove();render()}
 else if(e.target.closest("#xexp")){const o={v:1,t:new Date().toISOString(),d:{}};KEYS().forEach(k=>o.d[k]=localStorage.getItem(k));
  const blob=new Blob([JSON.stringify(o)],{type:"application/json"}),name="flashcards-backup-"+o.t.slice(0,10)+".json",f=new File([blob],name,{type:"application/json"});
  if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:"플래시카드 백업"}).catch(()=>{});
  else{const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click()}}
 else if(e.target.closest("#ximp")){const i=document.createElement("input");i.type="file";i.accept=".json,application/json";
  i.onchange=()=>{const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!o.d)throw 0;if(!confirm("현재 기록을 백업 파일로 덮어쓸까요?"))return;Object.keys(o.d).forEach(k=>localStorage.setItem(k,o.d[k]));location.reload()}catch(x){alert("올바른 백업 파일이 아니에요")}};r.readAsText(i.files[0])};i.click()}
});
if("serviceWorker"in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});
})();
