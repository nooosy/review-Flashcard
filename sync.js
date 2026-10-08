/* ===== 기기 간 동기화 (iPhone ↔ iPad) — GitHub 비공개 Gist 사용 =====
   · 이 파일은 앱 스크립트보다 먼저 실행돼요: 클라우드 기록을 먼저 받아온 뒤 앱을 켭니다.
   · 로드할 스크립트 목록은 index.html 의 #boot-list 에 있어요. */
(()=>{
const LS=localStorage,P=Storage.prototype,rawSet=P.setItem,rawDel=P.removeItem,rawGet=P.getItem;
const F="flashcards-sync.json",API="https://api.github.com";
const isK=k=>!String(k).startsWith("xsync");
const get=k=>rawGet.call(LS,k);
let MT={};try{MT=JSON.parse(get("xsync_mt")||"{}")}catch(e){}
const saveMT=()=>rawSet.call(LS,"xsync_mt",JSON.stringify(MT));
const on=()=>!!get("xsync_tok")&&!!get("xsync_gid");
let timer=null,busy=false,err="";
function touch(k){MT[k]=Date.now();saveMT();if(on()){clearTimeout(timer);timer=setTimeout(push,4000)}}
P.setItem=function(k,v){if(this===LS&&isK(k)){const o=get(k);rawSet.call(this,k,v);if(o!==String(v))touch(k);return}return rawSet.call(this,k,v)};
P.removeItem=function(k){if(this===LS&&isK(k)&&get(k)!==null){rawDel.call(this,k);touch(k);return}return rawDel.call(this,k)};

function snap(){const ks=new Set(Object.keys(MT));for(let i=0;i<LS.length;i++){const k=LS.key(i);if(isK(k))ks.add(k)}
 const o={};ks.forEach(k=>{if(isK(k))o[k]={v:get(k),t:MT[k]||0}});return o}
function apply(r){let ch=false;for(const k in r){if(!isK(k))continue;const x=r[k];if((x.t||0)>(MT[k]||0)){if(get(k)!==x.v){ch=true;x.v==null?rawDel.call(LS,k):rawSet.call(LS,k,x.v)}MT[k]=x.t}}saveMT();return ch}
async function gh(path,opt,ms,tok){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms||10000);
 try{const r=await fetch(API+path,{...(opt||{}),signal:c.signal,cache:"no-store",headers:{Authorization:"Bearer "+(tok||get("xsync_tok")),Accept:"application/vnd.github+json","Content-Type":"application/json"}});
  if(!r.ok)throw new Error(r.status);return await r.json()}finally{clearTimeout(t)}}
async function readRemote(gid,ms,tok){const g=await gh("/gists/"+gid,{},ms,tok),f=g.files&&g.files[F];if(!f)throw new Error(404);
 let txt=f.content;if(f.truncated)txt=await(await fetch(f.raw_url)).text();return(JSON.parse(txt).k)||{}}
const stamp=()=>rawSet.call(LS,"xsync_last",String(Date.now()));

async function pull(ms){const rem=await readRemote(get("xsync_gid"),ms);const ch=apply(rem);stamp();return ch}
async function push(){if(!on()||busy)return;busy=true;err="";
 try{const gid=get("xsync_gid");let rem={};try{rem=await readRemote(gid)}catch(e){if(String(e.message)==="404")throw e}
  const loc=snap(),out={};new Set([...Object.keys(rem),...Object.keys(loc)]).forEach(k=>{const a=rem[k],b=loc[k];out[k]=!a?b:!b?a:(b.t>=a.t?b:a)});
  await gh("/gists/"+gid,{method:"PATCH",body:JSON.stringify({files:{[F]:{content:JSON.stringify({v:1,k:out})}}})});stamp()}
 catch(e){err=String(e.message||e)}finally{busy=false}}
async function connect(tok){
 let L;try{L=await gh("/gists?per_page=100",{},12000,tok)}catch(e){throw new Error(String(e.message)==="401"?"토큰이 올바르지 않아요":"연결 실패 ("+e.message+")")}
 const g=L.find(x=>x.files&&x.files[F]);rawSet.call(LS,"xsync_tok",tok);
 if(g){rawSet.call(LS,"xsync_gid",g.id);const rem=await readRemote(g.id,12000,tok);
  const hasLocal=Object.keys(snap()).some(k=>get(k)!=null);
  const cloud=!hasLocal||confirm("클라우드에 저장된 기록이 있어요.\n\n[확인] 클라우드 기록을 이 기기로 불러오기\n   (이 기기의 기존 기록은 덮어써져요)\n[취소] 이 기기의 기록으로 클라우드를 덮어쓰기");
  if(cloud){const loc=Object.keys(snap());MT={};apply(rem);loc.forEach(k=>{if(!(k in rem))MT[k]=Date.now()});saveMT();stamp();return"reload"}
  const n=Date.now();Object.keys(snap()).forEach(k=>MT[k]=n);saveMT();await push();return"ok"}
 const n=Date.now();Object.keys(snap()).forEach(k=>MT[k]=n);saveMT();
 const r=await gh("/gists",{method:"POST",body:JSON.stringify({description:"flashcards sync data (자동 생성)",public:false,files:{[F]:{content:JSON.stringify({v:1,k:snap()})}}})},12000,tok);
 rawSet.call(LS,"xsync_gid",r.id);stamp();return"ok"}
function disconnect(){["xsync_tok","xsync_gid","xsync_last"].forEach(k=>rawDel.call(LS,k))}
window.XSYNC={on,push,pull,connect,disconnect,info:()=>({last:+get("xsync_last")||0,err,busy})};

let hid=0;
document.addEventListener("visibilitychange",async()=>{if(document.hidden){hid=Date.now();if(on()){clearTimeout(timer);push()}}
 else if(on()&&hid&&Date.now()-hid>60000){try{if(await pull())location.reload()}catch(e){}}});

/* ----- 부팅: 클라우드 → 로컬 반영 후 앱 스크립트 순서대로 로드 ----- */
(async()=>{let splash;
 if(on()&&navigator.onLine!==false){splash=document.createElement("div");splash.style.cssText="position:fixed;inset:0;display:grid;place-items:center;font:600 14px system-ui;color:#8a93a6;z-index:99999;background:inherit";splash.textContent="☁️ 동기화 중…";document.body.appendChild(splash);
  try{await pull(3500)}catch(e){err=String(e.message||e)}}
 let list=[];try{list=JSON.parse(document.getElementById("boot-list").textContent)}catch(e){}
 for(const src of list)await new Promise(r=>{const s=document.createElement("script");s.src=src;s.onload=s.onerror=r;document.body.appendChild(s)});
 if(splash)splash.remove()})();
})();
