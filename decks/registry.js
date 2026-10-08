/* 과목 목록 + 덱 등록. 새 과목 추가 시 여기만 수정 */
const SUBJ=[{id:"gwa",n:"과과연",d:"탐구 방법 · 실험 안전 · 분자간 인력 · 표면장력"},{id:"earth",n:"지구과학",d:"앞면 질문 → 뒷면 빈칸 채우기"},{id:"soc",n:"사회",d:"통합사회 · 경제 · 앞면 질문 → 뒷면 빈칸"},{id:"bio",n:"생물",d:"준비 중"}];
const SB={};
(()=>{const C=[];DG.forEach((s,i)=>s[1].forEach(t=>C.push({s:i,t,id:C.length})));DG.push(["보충",[]],["그림문자",[]]);C.forEach(c=>{if(c.t[0]=="※")c.s=DG.length-2;else if(c.t.startsWith("GHS "))c.s=DG.length-1});SB.gwa={D:DG,C}})();
SB.earth={D:[["10/1 해수",[]],["해수의 용존 기체",[]],["해수의 표층·심층 순환",[]]],C:EARTH.map(([q,t,s],i)=>({s:s||0,q,t,id:i}))};
SB.soc={D:CATS.map(n=>[n,[]]),C:SOC.map(([s,q,t],i)=>({s,q,t,id:i}))};SB.bio={D:[],C:[]};
