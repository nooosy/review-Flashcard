/* 과목 목록 + 덱 등록. 새 과목 추가 시 여기만 수정 */
const SUBJ=[{id:"gwa",n:"과과연",d:"탐구 방법 · 실험 안전 · 분자간 인력 · 표면장력"},{id:"earth",n:"지구과학",d:"앞면 질문 → 뒷면 빈칸 채우기"},{id:"soc",n:"사회",d:"통합사회 · 경제 · 앞면 질문 → 뒷면 빈칸"},{id:"bio",n:"생물",d:"준비 중"}];
const SB={};
(()=>{const C=[];DG.forEach((s,i)=>s[1].forEach(t=>C.push({s:i,t,id:C.length})));DG.push(["보충",[]],["그림문자",[]]);C.forEach(c=>{if(c.t[0]=="※")c.s=DG.length-2;else if(c.t.startsWith("GHS "))c.s=DG.length-1});SB.gwa={D:DG,C}})();
/* 지구과학: 파트 이름은 EARTH_SEC 에 적기. 카드의 3번째 값(1,2,3...)이 파트 번호.
   카드에 새 번호가 나오면 "파트 N"으로 자동 추가돼서, 파트가 몇 개든 전체 카드가 다 보여요. */
const EARTH_SEC=["표층 수온 분포","수온 약층·혼합층","염분·밀도","용존 기체","해수 순환·기후 변화"];
(()=>{const mx=Math.max(EARTH_SEC.length,...EARTH.map(x=>x[2]||1));const D=[];for(let i=0;i<mx;i++)D.push([EARTH_SEC[i]||"파트 "+(i+1),[]]);
SB.earth={D,C:EARTH.map(([q,t,s],i)=>({s:Math.max(0,(s||1)-1),q,t,id:i}))}})();
SB.soc={D:CATS.map(n=>[n,[]]),C:SOC.map(([s,q,t],i)=>({s,q,t,id:i}))};SB.bio={D:[],C:[]};
