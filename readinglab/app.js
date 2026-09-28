const lessons = [
  {
    id:"ai-literacy", category:"사회", icon:"✦", level:"중3~고2", time:"25분", difficulty:"보통",
    title:"AI 시대에도 깊이 읽어야 하는 이유",
    intro:"빠르게 답을 얻을 수 있는 시대에, 읽기는 어떤 역할을 해야 할까요?",
    passage:[
      "생성형 인공지능은 질문에 대한 답을 빠르게 정리해 준다. 필요한 정보를 찾고 여러 자료를 요약하는 시간도 크게 줄여 준다. 그래서 사람들은 이전보다 더 많은 정보를 짧은 시간에 접할 수 있게 되었다. 그러나 정보에 접근하는 속도가 빨라졌다고 해서 생각의 깊이까지 자동으로 깊어지는 것은 아니다.",
      "읽기는 단순히 문장을 눈으로 확인하는 행위가 아니다. 글쓴이가 어떤 전제를 두고 있는지, 제시한 근거가 결론을 충분히 뒷받침하는지, 빠진 관점은 없는지를 점검하는 과정이다. 이러한 과정에는 시간이 필요하다. 특히 서로 충돌하는 주장들을 비교할 때에는 내용을 잠시 멈춰 세우고 자신의 언어로 다시 구성해 보아야 한다.",
      "AI가 만든 요약은 출발점이 될 수 있지만 최종 판단을 대신할 수는 없다. <span class='focus-line'>요약이 생각의 시간을 줄여 주는 도구라면, 깊이 읽기는 그 절약한 시간을 판단에 다시 투자하는 활동</span>이라고 볼 수 있다. 따라서 AI 시대의 읽기 교육은 더 많은 정보를 외우게 하는 데 집중하기보다, 정보를 검토하고 질문하고 연결하는 힘을 기르는 방향으로 바뀔 필요가 있다."
    ],
    vocab:[
      ["전제","어떤 주장이나 판단이 성립하기 위해 미리 받아들이는 조건."],
      ["근거","주장이나 판단이 타당하다고 뒷받침하는 이유 또는 자료."],
      ["판단","여러 정보와 기준을 비교하여 의미나 가치를 결정하는 일."],
      ["재구성","주어진 내용을 자신의 관점이나 구조에 맞게 다시 조직하는 것."]
    ],
    quiz:[
      {q:"윗글이 가장 강조하는 내용은?", choices:["AI의 요약 기능을 사용하지 않아야 한다.","정보 접근 속도와 사고의 깊이는 같은 개념이다.","AI 시대에는 정보를 검토하고 판단하는 읽기가 더 중요해진다.","읽기는 가능한 한 많은 정보를 암기하는 활동이다."], answer:2, why:"글은 AI를 배제하기보다, 요약으로 절약한 시간을 검토와 판단에 사용해야 한다고 본다."},
      {q:"윗글에서 ‘깊이 읽기’의 과정으로 보기 어려운 것은?", choices:["글쓴이의 전제를 확인한다.","근거와 결론의 관계를 검토한다.","서로 다른 주장을 비교한다.","요약된 결론을 별도 검토 없이 수용한다."], answer:3, why:"깊이 읽기는 제시된 정보를 그대로 수용하지 않고 검토하는 과정이다."},
      {q:"글의 관점에 가장 부합하는 AI 활용 방식은?", choices:["AI 답변을 최종 판단으로 사용한다.","AI 요약을 바탕으로 원문과 근거를 다시 확인한다.","긴 글은 읽지 않고 요약문만 암기한다.","모든 판단 기준을 AI에게 맡긴다."], answer:1, why:"AI 요약은 출발점이며 최종 판단은 독자가 직접 해야 한다는 관점이다."}
    ],
    thinking:[
      ["속도와 깊이","정보를 빨리 얻는 것이 오히려 판단을 어렵게 만드는 경우는 무엇이 있을까요? 실제 사례를 하나 떠올려 보세요."],
      ["도구와 주체","AI를 잘 활용하는 사람과 AI에 의존하는 사람의 차이는 어디에서 생길까요?"],
      ["교육의 변화","학교의 읽기·쓰기 수업은 AI 시대에 무엇을 더 강조해야 할까요?"]
    ],
    prompt:"AI가 정보를 요약해 주는 시대에도 ‘깊이 읽기’ 교육이 필요한 이유를 설명하고, 학교 수업에서 실천할 수 있는 방법을 한 가지 제안하시오. (500~800자 권장)"
  },
  {
    id:"fair-algorithm", category:"과학", icon:"⌘", level:"고1~고3", time:"30분", difficulty:"심화",
    title:"알고리즘의 판단은 공정할 수 있을까",
    intro:"데이터로 판단하는 시스템에도 인간 사회의 기준과 선택이 들어갑니다.",
    passage:[
      "알고리즘은 정해진 규칙과 데이터를 바탕으로 결과를 계산한다. 이 때문에 사람의 감정이나 순간적인 편견에서 자유로울 것이라고 기대되기도 한다. 하지만 어떤 데이터를 모을지, 무엇을 정답으로 간주할지, 오류를 어느 정도 허용할지는 모두 사람이 정한다.",
      "예를 들어 과거의 채용 결과를 학습한 시스템은 과거 조직의 선택 경향을 다시 반복할 수 있다. 데이터가 현실을 그대로 비추는 거울이 아니라, 이미 이루어진 선택이 남긴 기록이기 때문이다. 따라서 데이터가 많다는 사실만으로 판단의 공정성이 보장되지는 않는다.",
      "<span class='focus-line'>알고리즘의 공정성을 평가하려면 계산 과정뿐 아니라 목표와 데이터, 결과가 누구에게 어떤 영향을 주는지 함께 살펴야 한다.</span> 기술의 문제처럼 보이는 판단에도 사회적 기준에 대한 토론이 필요한 이유다."
    ],
    vocab:[["알고리즘","문제를 해결하기 위해 정해 놓은 단계적 절차."],["편향","판단이나 자료가 특정 방향으로 치우치는 현상."],["공정성","정해진 기준이 관련된 사람들에게 정당하게 적용되는 성질."],["데이터","관찰·측정·기록 등을 통해 수집된 사실이나 값."]],
    quiz:[
      {q:"윗글에 따르면 데이터가 많아도 공정성이 보장되지 않는 이유는?",choices:["데이터는 계산할 수 없기 때문에","데이터가 과거의 선택과 편향을 포함할 수 있기 때문에","알고리즘은 언제나 무작위로 작동하기 때문에","사회적 기준은 데이터와 전혀 관련이 없기 때문에"],answer:1,why:"과거의 선택이 남긴 기록인 데이터에는 기존 경향과 편향이 반영될 수 있다."},
      {q:"글쓴이가 알고리즘 평가에서 함께 보아야 한다고 한 요소가 아닌 것은?",choices:["목표","데이터","사회적 영향","개발자의 취미"],answer:3,why:"글은 목표, 데이터, 계산 과정, 결과의 영향을 함께 검토해야 한다고 말한다."}
    ],
    thinking:[["공정한 기준","모든 사람에게 같은 기준을 적용하는 것과 결과의 불이익을 줄이는 것 중 어느 쪽이 공정성에 더 가까울까요?"],["책임","알고리즘이 잘못된 결정을 했을 때 책임은 누구에게 있어야 할까요?"]],
    prompt:"알고리즘의 판단을 ‘객관적’이라고만 볼 수 없는 이유를 글의 내용을 활용해 설명하고, 공정성을 높이기 위해 필요한 원칙을 제시하시오. (600~900자 권장)"
  },
  {
    id:"choice-happiness", category:"인문", icon:"◌", level:"중2~고1", time:"20분", difficulty:"입문",
    title:"선택지가 많으면 우리는 더 행복해질까",
    intro:"선택의 자유가 커질수록 만족도도 항상 높아지는지 살펴봅니다.",
    passage:[
      "선택할 수 있는 것이 많다는 사실은 자유가 넓어졌다는 뜻으로 받아들여진다. 실제로 선택지가 너무 적으면 사람은 자신에게 맞는 것을 고르기 어렵다. 그러나 선택지가 계속 늘어날수록 만족도도 끝없이 높아지는 것은 아니다.",
      "선택지가 많으면 각각의 장단점을 비교하는 데 더 많은 시간이 들고, 선택하지 않은 대안의 장점도 쉽게 떠오른다. 그 결과 결정을 내리고도 ‘다른 것을 골랐어야 하지 않았을까’라는 생각이 남을 수 있다. 선택의 자유가 커지는 동시에 선택에 대한 책임과 후회 가능성도 커지는 것이다.",
      "<span class='focus-line'>중요한 것은 선택지의 수 자체보다 무엇을 기준으로 선택할지를 알고 있는가이다.</span> 자신에게 중요한 기준이 분명하면 많은 선택지는 기회가 되지만, 기준이 없다면 선택지는 오히려 부담이 될 수 있다."
    ],
    vocab:[["대안","어떤 방안 대신 선택할 수 있는 다른 방안."],["만족도","결과나 상태에 대해 만족하는 정도."],["기준","판단하거나 선택할 때 근거로 삼는 원칙."],["책임","자신의 선택과 행동의 결과를 감당하는 태도."]],
    quiz:[
      {q:"글의 중심 주장으로 가장 적절한 것은?",choices:["선택지는 항상 적을수록 좋다.","선택지가 많으면 반드시 행복해진다.","선택의 만족에는 선택 기준의 명확성이 중요하다.","후회를 막으려면 다른 대안을 검토해서는 안 된다."],answer:2,why:"글은 선택지의 수보다 자신에게 중요한 기준을 알고 있는지가 중요하다고 본다."},
      {q:"선택지가 많을 때 나타날 수 있는 현상은?",choices:["비교에 드는 시간이 줄어든다.","선택하지 않은 대안의 장점이 떠오를 수 있다.","결정에 대한 책임이 사라진다.","모든 사람이 같은 기준을 사용하게 된다."],answer:1,why:"대안이 많을수록 비교 비용과 선택 후 후회 가능성이 커질 수 있다고 설명한다."}
    ],
    thinking:[["나의 기준","최근 선택한 일 하나를 떠올리고, 실제로 어떤 기준을 사용했는지 적어 보세요."],["자유와 부담","선택의 자유가 부담으로 바뀌는 지점은 언제라고 생각하나요?"]],
    prompt:"선택지가 많을수록 반드시 더 행복해지는 것은 아니라는 글의 관점을 설명하고, 자신의 경험이나 관찰 사례를 들어 바람직한 선택 방법을 논하시오. (400~700자 권장)"
  }
];

const steps=["read","vocab","quiz","think","write"];
const stepNames={read:"읽기",vocab:"핵심어휘",quiz:"내용확인",think:"사고확장",write:"논술쓰기"};
let currentLesson=lessons[0], currentStep="read", currentFilter="all";

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const stateKey="sophieReadingLabState";
function loadState(){try{return JSON.parse(localStorage.getItem(stateKey))||{lessons:{}}}catch{return {lessons:{}}}}
function saveState(s){localStorage.setItem(stateKey,JSON.stringify(s))}
function getLessonState(id){const s=loadState();return s.lessons[id]||{done:[],draft:"",submitted:false}}
function setLessonState(id,patch){const s=loadState();s.lessons[id]={...getLessonState(id),...patch};saveState(s);refreshStats()}
function markDone(id,step){const ls=getLessonState(id);if(!ls.done.includes(step)) setLessonState(id,{done:[...ls.done,step]})}
function percent(id){return Math.round(getLessonState(id).done.length/steps.length*100)}

function route(name){
  $$(".page").forEach(p=>p.classList.remove("active"));
  $("#page-"+name)?.classList.add("active");
  $$(".nav-link").forEach(n=>n.classList.toggle("active",n.dataset.route===name));
  if(name==="library") renderLibrary();
  if(name==="writing") renderWritingHub();
  if(name==="progress") renderProgress();
  window.scrollTo({top:0,behavior:"smooth"});
}
function cardHTML(l){
  return `<article class="topic-card" data-category="${l.category}">
    <div class="topic-icon">${l.icon}</div>
    <div class="card-meta"><span class="tag">${l.category}</span><span class="tag">${l.level}</span><span class="tag">${l.difficulty}</span></div>
    <h3>${l.title}</h3><p>${l.intro}</p>
    <div class="progress-row"><span>${l.time}</span><span>진행률 ${percent(l.id)}%</span></div>
    <button class="text-link" data-open-lesson="${l.id}">학습하기 →</button>
  </article>`;
}
function renderCards(){
  $("#homeCards").innerHTML=lessons.map(cardHTML).join("");
  renderLibrary();
}
function renderLibrary(){
  const arr=currentFilter==="all"?lessons:lessons.filter(l=>l.category===currentFilter);
  $("#libraryCards").innerHTML=arr.map(cardHTML).join("");
  bindLessonButtons();
}
function bindLessonButtons(){
  $$("[data-open-lesson]").forEach(b=>b.onclick=()=>openLesson(b.dataset.openLesson));
}
function openLesson(id,step="read"){
  currentLesson=lessons.find(l=>l.id===id)||lessons[0];currentStep=step;route("lesson");renderLesson();
}
function renderLesson(){
  const l=currentLesson;
  $("#lessonMeta").innerHTML=`<span class="tag">${l.category}</span><span class="tag">${l.level}</span><span class="tag">${l.time}</span><span class="tag">${l.difficulty}</span>`;
  $("#lessonTitle").textContent=l.title;$("#lessonIntro").textContent=l.intro;
  $("#lessonTabs").innerHTML=steps.map((s,i)=>`<button class="lesson-tab ${s===currentStep?"active":""}" data-step="${s}">${i+1}. ${stepNames[s]}</button>`).join("");
  $$("[data-step]").forEach(b=>b.onclick=()=>{currentStep=b.dataset.step;renderLesson()});
  renderLessonContent();updateLessonProgress();
}
function nextButton(step){
  const i=steps.indexOf(step), next=steps[i+1];
  if(!next)return "";
  return `<div style="margin-top:26px;text-align:right"><button class="btn primary" id="nextStep">다음: ${stepNames[next]}</button></div>`;
}
function renderLessonContent(){
  const l=currentLesson;let html="";
  if(currentStep==="read"){
    html=`<div class="content-box"><span class="eyebrow">STEP 01</span><h2>제시문 읽기</h2>
      <div class="note-box">밑줄 친 핵심 문장을 중심으로 글쓴이가 ‘문제 → 이유 → 제안’을 어떤 순서로 제시하는지 살펴보세요.</div>
      <article class="article-box">${l.passage.map(p=>`<p>${p}</p>`).join("")}</article>
      ${nextButton("read")}</div>`;
  }
  if(currentStep==="vocab"){
    html=`<div class="content-box"><span class="eyebrow">STEP 02</span><h2>핵심 어휘</h2><div class="vocab-list">${l.vocab.map(v=>`<div class="vocab-item"><b>${v[0]}</b><span>${v[1]}</span></div>`).join("")}</div>${nextButton("vocab")}</div>`;
  }
  if(currentStep==="quiz"){
    html=`<div class="content-box"><span class="eyebrow">STEP 03</span><h2>내용 확인</h2><p class="note-box">각 문항의 답을 고른 뒤 해설을 확인하세요.</p>
      ${l.quiz.map((q,qi)=>`<div class="question-card" data-q="${qi}"><p>${qi+1}. ${q.q}</p>${q.choices.map((c,ci)=>`<button class="choice" data-choice="${ci}">${ci+1}. ${c}</button>`).join("")}<div class="feedback"></div></div>`).join("")}${nextButton("quiz")}</div>`;
  }
  if(currentStep==="think"){
    html=`<div class="content-box"><span class="eyebrow">STEP 04</span><h2>사고 확장</h2><p class="note-box">정답이 하나로 정해진 질문이 아닙니다. 말로 설명한 뒤 핵심 문장을 한 줄로 적어 보세요.</p>
      ${l.thinking.map(t=>`<div class="thinking-prompt"><b>${t[0]}</b><p>${t[1]}</p></div>`).join("")}${nextButton("think")}</div>`;
  }
  if(currentStep==="write"){
    const ls=getLessonState(l.id);
    html=`<div class="content-box"><span class="eyebrow">STEP 05</span><h2>논술쓰기</h2><div class="writing-card">
      <div class="writing-prompt"><b>논제</b><p>${l.prompt}</p></div>
      <textarea id="essay" placeholder="주장 → 근거 → 설명 → 결론의 흐름을 생각하며 작성해 보세요.">${escapeHtml(ls.draft)}</textarea>
      <div class="writing-toolbar"><div><span class="char-count" id="charCount">0자</span><span class="save-status" id="saveStatus"></span></div><button class="btn ghost small" id="saveEssay">초안 저장</button></div>
      <div class="self-check"><label><input type="checkbox"> 논제에 직접 답했나요?</label><label><input type="checkbox"> 제시문의 개념을 정확히 활용했나요?</label><label><input type="checkbox"> 근거 뒤에 설명이 있나요?</label><label><input type="checkbox"> 문단의 역할이 구분되나요?</label></div>
      <button class="btn primary" id="submitEssay">${ls.submitted?"제출 완료 · 다시 저장":"학습 완료로 제출"}</button>
    </div></div>`;
  }
  $("#lessonContent").innerHTML=html;
  if(currentStep==="quiz") bindQuiz();
  if(currentStep==="write") bindEssay();
  $("#nextStep")?.addEventListener("click",()=>{markDone(l.id,currentStep);currentStep=steps[steps.indexOf(currentStep)+1];renderLesson();window.scrollTo({top:180,behavior:"smooth"})});
  if(currentStep!=="write") markDone(l.id,currentStep);
}
function bindQuiz(){
  $$(".question-card").forEach(card=>card.querySelectorAll(".choice").forEach(btn=>btn.onclick=()=>{
    const q=currentLesson.quiz[+card.dataset.q], selected=+btn.dataset.choice;
    card.querySelectorAll(".choice").forEach((x,i)=>{x.disabled=true;if(i===q.answer)x.classList.add("correct");else if(i===selected)x.classList.add("wrong")});
    card.querySelector(".feedback").textContent=(selected===q.answer?"정답입니다. ":"다시 확인해 보세요. ")+q.why;
  }));
}
function bindEssay(){
  const ta=$("#essay"), count=$("#charCount"), status=$("#saveStatus");
  const update=()=>count.textContent=ta.value.replace(/\s/g,"").length+"자";update();
  ta.addEventListener("input",()=>{update();status.textContent="작성 중…";clearTimeout(window.__saveTimer);window.__saveTimer=setTimeout(()=>{setLessonState(currentLesson.id,{draft:ta.value});status.textContent="자동 저장됨"},700)});
  $("#saveEssay").onclick=()=>{setLessonState(currentLesson.id,{draft:ta.value});status.textContent="저장되었습니다."};
  $("#submitEssay").onclick=()=>{setLessonState(currentLesson.id,{draft:ta.value,submitted:true,done:[...new Set([...getLessonState(currentLesson.id).done,"write"])]});status.textContent="제출 및 저장 완료";$("#submitEssay").textContent="제출 완료 · 다시 저장";updateLessonProgress()};
}
function escapeHtml(v){return (v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function updateLessonProgress(){
  const p=percent(currentLesson.id);$("#lessonPercent").textContent=p+"%";$("#progressRing").style.background=`conic-gradient(var(--green) ${p*3.6}deg,#e8eeeb 0deg)`;$("#lessonStepCopy").textContent=p===100?"한 편의 학습을 완성했습니다.":`${getLessonState(currentLesson.id).done.length}/5단계를 학습했습니다.`;
}
function renderWritingHub(){
  const drafts=lessons.filter(l=>getLessonState(l.id).draft);
  $("#writingHub").innerHTML=drafts.length?drafts.map(l=>{const s=getLessonState(l.id);return `<article class="draft-card"><span class="pill">${s.submitted?"제출 완료":"작성 중"}</span><h3>${l.title}</h3><p>${escapeHtml(s.draft)}</p><button class="btn ghost small" data-write="${l.id}">이어 쓰기</button></article>`}).join(""):`<div class="empty-state"><h3>아직 저장된 논술이 없습니다.</h3><p>독서논술 콘텐츠에서 마지막 단계까지 진행하면 이곳에서 이어 쓸 수 있습니다.</p><button class="btn primary" data-route="library">콘텐츠 고르기</button></div>`;
  $$("[data-write]").forEach(b=>b.onclick=()=>openLesson(b.dataset.write,"write"));bindRouteButtons();
}
function renderProgress(){
  const values=lessons.map(l=>({l,p:percent(l.id),s:getLessonState(l.id)}));
  const completed=values.filter(x=>x.p===100).length,drafts=values.filter(x=>x.s.draft).length,avg=Math.round(values.reduce((a,x)=>a+x.p,0)/values.length);
  $("#metricCompleted").textContent=completed;$("#metricDrafts").textContent=drafts;$("#metricAverage").textContent=avg;
  $("#progressList").innerHTML=values.map(x=>`<div class="progress-item"><div class="progress-row"><b>${x.l.title}</b><span>${x.p}%</span></div><div class="bar"><span style="width:${x.p}%"></span></div></div>`).join("");
  const next=values.sort((a,b)=>a.p-b.p).find(x=>x.p<100)||values[0];
  $("#nextLesson").innerHTML=`<div class="topic-icon">${next.l.icon}</div><span class="pill">${next.l.category}</span><h3>${next.l.title}</h3><p style="color:var(--muted);font-size:13px">${next.l.intro}</p><button class="btn primary small" data-open-lesson="${next.l.id}">학습 이어가기</button>`;bindLessonButtons();
}
function refreshStats(){
  const vals=lessons.map(l=>getLessonState(l.id)),completed=lessons.filter(l=>percent(l.id)===100).length,drafts=vals.filter(s=>s.draft).length,avg=Math.round(lessons.reduce((a,l)=>a+percent(l.id),0)/lessons.length);
  $("#statCompleted").textContent=completed;$("#statDrafts").textContent=drafts;$("#headerProgress").textContent=`진행률 ${avg}%`;
}
function bindRouteButtons(){$$("[data-route]").forEach(b=>b.onclick=()=>route(b.dataset.route))}
$$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentFilter=b.dataset.filter;renderLibrary()});
bindRouteButtons();renderCards();bindLessonButtons();refreshStats();
