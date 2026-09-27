const fallbackPosts = [
  {title:"커뮤랭크 자동 수집을 준비하고 있습니다.", source:"커뮤랭크", category:"이슈", views:0, likes:0, comments:0, change:"NEW", url:"#"},
  {title:"GitHub Actions가 실행되면 실제 인기글 데이터로 자동 교체됩니다.", source:"커뮤랭크", category:"이슈", views:0, likes:0, comments:0, change:0, url:"#"}
];

const periodInfo = {
  realtime: {label:"실시간"},
  daily: {label:"오늘"},
  weekly: {label:"이번 주"},
  monthly: {label:"이번 달"}
};

let period = "realtime";
let category = "전체";
let source = "전체";
let liveData = null;

const fmt = n => new Intl.NumberFormat("ko-KR", {notation: Number(n) > 9999 ? "compact" : "standard"}).format(Number(n) || 0);

function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[ch]));
}

function currentPosts(){
  if (!liveData?.rankings?.[period]) return fallbackPosts;
  return liveData.rankings[period];
}

function renderSourceOptions(){
  if (!liveData?.sources) return;
  const select = document.querySelector("#sourceFilter");
  const names = liveData.sources.filter(s => s.ok && s.count > 0).map(s => s.source);
  select.innerHTML = '<option value="전체">전체 커뮤니티</option>' +
    names.map(name => `<option value="${safeText(name)}">${safeText(name)}</option>`).join("");
  if (!names.includes(source)) source = "전체";
  select.value = source;
}

function render(){
  const posts = currentPosts();
  const filtered = posts
    .filter(p => category === "전체" || p.category === category)
    .filter(p => source === "전체" || p.source === source);

  document.querySelector("#periodLabel").textContent = periodInfo[period].label;
  document.querySelector("#heroCount").textContent = liveData?.rankings?.realtime?.length ?? 0;

  const list = document.querySelector("#rankingList");
  if (!filtered.length) {
    list.innerHTML = '<div class="empty">조건에 맞는 인기글이 없습니다.</div>';
  } else {
    list.innerHTML = filtered.map((p,i) => {
      const ch = p.change;
      let changeHtml = '<span class="rank-change">―</span>';
      if (ch === "NEW") changeHtml = '<span class="rank-change new">NEW</span>';
      else if (Number(ch) > 0) changeHtml = '<span class="rank-change up">▲ '+Number(ch)+'</span>';
      else if (Number(ch) < 0) changeHtml = '<span class="rank-change down">▼ '+Math.abs(Number(ch))+'</span>';

      const href = p.url && p.url !== "#" ? safeText(p.url) : "#";
      const target = href === "#" ? "" : ' target="_blank" rel="noopener noreferrer"';
      return `
        <article class="rank-item">
          <div class="rank-num ${i < 3 ? "top" : ""}">${i+1}</div>
          <div>
            <a class="post-title" href="${href}"${target}>${safeText(p.title)}</a>
            <div class="meta">
              <span class="source">${safeText(p.source)}</span>
              <span class="category">${safeText(p.category || "이슈")}</span>
              <span>조회 ${fmt(p.views)}</span>
              <span>추천 ${fmt(p.likes)}</span>
              <span>댓글 ${fmt(p.comments)}</span>
            </div>
          </div>
          ${changeHtml}
        </article>`;
    }).join("");
  }

  const communityStats = {};
  posts.forEach(p => {
    if (!communityStats[p.source]) communityStats[p.source] = {count:0, total:0};
    communityStats[p.source].count += 1;
    communityStats[p.source].total += Number(p.score) || 0;
  });

  const communities = Object.entries(communityStats)
    .map(([name,v]) => ({name, score: v.count ? Math.round(v.total / v.count) : 0, count:v.count}))
    .sort((a,b)=>b.score-a.score || b.count-a.count)
    .slice(0,6);

  document.querySelector("#communityList").innerHTML = communities.length
    ? communities.map((c,i)=>`
      <li class="community-row">
        <span class="community-rank">${i+1}</span>
        <span class="community-name">${safeText(c.name)}</span>
        <span class="community-score">${c.score}점 · ${c.count}건</span>
      </li>`).join("")
    : '<li class="empty">수집 대기 중</li>';
}

async function loadLiveData(){
  try {
    const response = await fetch("./data/latest.json?ts=" + Date.now(), {cache:"no-store"});
    if (!response.ok) throw new Error("ranking data unavailable");
    liveData = await response.json();
    const date = new Date(liveData.collected_at);
    document.querySelector("#updatedAt").textContent = date.toLocaleString("ko-KR", {
      month:"numeric", day:"numeric", hour:"2-digit", minute:"2-digit"
    });
    renderSourceOptions();
    const okSources = (liveData.sources || []).filter(s => s.ok && s.count > 0).length;
    const totalSources = (liveData.sources || []).length;
    document.querySelector("#sourceStatus").textContent =
      totalSources ? `${okSources}/${totalSources}개 소스 정상` : "수집 준비";
  } catch (err) {
    liveData = null;
    document.querySelector("#updatedAt").textContent = "자동 수집 대기";
    document.querySelector("#sourceStatus").textContent = "수집 대기";
  }
  render();
}

document.querySelectorAll(".nav-item").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    period = btn.dataset.period;
    render();
  });
});

document.querySelectorAll(".chip").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    category = btn.dataset.category;
    render();
  });
});

document.querySelector("#sourceFilter").addEventListener("change", e=>{
  source = e.target.value;
  render();
});

document.querySelector("#themeToggle").addEventListener("click", ()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("commurank-theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("commurank-theme") === "dark") document.body.classList.add("dark");

loadLiveData();
