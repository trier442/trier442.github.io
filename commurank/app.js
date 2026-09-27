const fallbackPosts = [
  {title:"커뮤랭크 자동 수집을 준비하고 있습니다.", source:"커뮤랭크", category:"이슈", views:0, likes:0, comments:0, change:"NEW", url:"#"},
  {title:"GitHub Actions가 실행되면 실제 인기글 데이터로 자동 교체됩니다.", source:"커뮤랭크", category:"이슈", views:0, likes:0, comments:0, change:0, url:"#"}
];

const periodInfo = {
  rising: {label:"급상승"},
  realtime: {label:"실시간"},
  daily: {label:"일간"},
  weekly: {label:"주간"},
  monthly: {label:"월간"}
};

let period = "realtime";
let category = "전체";
let source = "전체";
let keyword = "";
let liveData = null;
let archiveIndex = null;
let archiveData = null;

const communitySlug = {
  "디시인사이드":"dcinside",
  "더쿠":"theqoo",
  "루리웹":"ruliweb",
  "클리앙":"clien",
  "인벤":"inven",
  "뽐뿌":"ppomppu"
};

const fmt = n => new Intl.NumberFormat("ko-KR", {
  notation: Number(n) > 9999 ? "compact" : "standard"
}).format(Number(n) || 0);

function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[ch]));
}

function currentPosts(){
  if (archiveData?.period === period && Array.isArray(archiveData.posts)) {
    return archiveData.posts;
  }
  if (!liveData?.rankings?.[period]) return fallbackPosts;
  return liveData.rankings[period];
}

function currentTopics(){
  if (archiveData?.period === period) return archiveData.topics || [];
  return liveData?.topics || [];
}

function currentLabel(){
  if (archiveData?.period === period) return archiveData.label || periodInfo[period].label;
  return periodInfo[period].label;
}

function renderSourceOptions(){
  const select = document.querySelector("#sourceFilter");
  const names = new Set();

  if (liveData?.sources) {
    liveData.sources
      .filter(s => s.ok && s.count > 0)
      .forEach(s => names.add(s.source));
  }
  currentPosts().forEach(p => {
    if (p.source && p.source !== "커뮤랭크") names.add(p.source);
  });

  const ordered = [...names].sort((a,b)=>a.localeCompare(b,"ko"));
  select.innerHTML = '<option value="전체">전체 커뮤니티</option>' +
    ordered.map(name => `<option value="${safeText(name)}">${safeText(name)}</option>`).join("");

  if (source !== "전체" && !ordered.includes(source)) source = "전체";
  select.value = source;
}

function renderKeywords(){
  const rows = liveData?.keywords || [];
  const container = document.querySelector("#keywordList");
  const badge = document.querySelector("#keywordCount");
  badge.textContent = rows.length ? "TOP " + rows.length : "0건";

  if (!rows.length) {
    container.innerHTML = '<div class="empty">키워드 데이터가 아직 없습니다.</div>';
    return;
  }

  container.innerHTML = rows.map(row => {
    const ch = row.change;
    let change = '<span class="kw-change">―</span>';
    if (ch === "NEW") change = '<span class="kw-change new">NEW</span>';
    else if (Number(ch) > 0) change = '<span class="kw-change up">▲ ' + Number(ch) + '</span>';
    else if (Number(ch) < 0) change = '<span class="kw-change down">▼ ' + Math.abs(Number(ch)) + '</span>';

    const active = keyword === row.keyword ? " active" : "";
    return `
      <button class="keyword-row${active}" type="button" data-keyword="${safeText(row.keyword)}">
        <span class="keyword-rank">${Number(row.rank) || "-"}</span>
        <span class="keyword-name">#${safeText(row.keyword)}</span>
        <span class="keyword-meta">${Number(row.source_count) || 0}곳 · ${Number(row.post_count) || 0}글</span>
        ${change}
      </button>`;
  }).join("");
}

function renderTopics(){
  const topics = currentTopics();
  const container = document.querySelector("#topicList");
  const badge = document.querySelector("#topicCount");
  badge.textContent = topics.length ? topics.length + "건" : "0건";

  if (!topics.length) {
    container.innerHTML = '<div class="empty">여러 커뮤니티에서 동시에 잡힌 이슈가 없습니다.</div>';
    return;
  }

  container.innerHTML = topics.slice(0, 6).map(topic => {
    const links = (topic.posts || []).slice(0, 4).map(p =>
      `<a href="${safeText(p.url)}" target="_blank" rel="noopener noreferrer">${safeText(p.source)} ${Number(p.rank) || "-"}위</a>`
    ).join("");

    const keywords = (topic.keywords || []).length
      ? `<p class="topic-keywords">${topic.keywords.map(k => "#" + safeText(k)).join(" ")}</p>`
      : "";

    return `
      <article class="topic-card">
        <span class="topic-count">${Number(topic.source_count) || 0}개 커뮤니티 · 관련글 ${Number(topic.post_count) || 0}건</span>
        <h4>${safeText(topic.title)}</h4>
        ${keywords}
        <div class="topic-tags">${links}</div>
      </article>`;
  }).join("");
}

function renderArchiveControls(){
  const controls = document.querySelector("#archiveControls");
  const select = document.querySelector("#archiveSelect");

  if (period === "realtime" || period === "rising") {
    controls.hidden = true;
    archiveData = null;
    return;
  }

  controls.hidden = false;
  const items = archiveIndex?.periods?.[period] || [];
  const selectedKey = archiveData?.period === period ? archiveData.key : "";

  select.innerHTML = '<option value="">현재 순위</option>' +
    items.map(item =>
      `<option value="${safeText(item.key)}" ${item.key === selectedKey ? "selected" : ""}>${safeText(item.label)}</option>`
    ).join("");
}

function updateUrl(){
  const params = new URLSearchParams();
  if (period !== "realtime") params.set("period", period);
  if (archiveData?.period === period && archiveData.key) params.set("archive", archiveData.key);
  if (keyword) params.set("keyword", keyword);

  const next = params.toString() ? "?" + params.toString() : location.pathname;
  history.replaceState(null, "", next);
}

function render(){
  const posts = currentPosts();
  const filtered = posts
    .filter(p => category === "전체" || p.category === category)
    .filter(p => source === "전체" || p.source === source)
    .filter(p => !keyword || String(p.title || "").toLowerCase().includes(keyword.toLowerCase()));

  const baseLabel = period === "rising"
    ? `급상승 · ${Number(liveData?.rising_window_minutes || 30)}분 변화`
    : currentLabel();
  document.querySelector("#periodLabel").textContent = keyword ? baseLabel + " · #" + keyword : baseLabel;
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
              ${period === "rising"
                ? `<span class="delta hot-delta">+${Number(p.window_minutes || liveData?.rising_window_minutes || 30)}분</span>
                   <span>+조회 ${fmt(p.delta_views)}</span>
                   <span>+추천 ${fmt(p.delta_likes)}</span>
                   <span>+댓글 ${fmt(p.delta_comments)}</span>
                   <span>순위 +${Number(p.rank_gain) || 0}</span>`
                : `<span>조회 ${fmt(p.views)}</span>
                   <span>추천 ${fmt(p.likes)}</span>
                   <span>댓글 ${fmt(p.comments)}</span>`}
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
        ${communitySlug[c.name]
          ? `<a class="community-name community-link" href="./community/${communitySlug[c.name]}/">${safeText(c.name)}</a>`
          : `<span class="community-name">${safeText(c.name)}</span>`}
        <span class="community-score">${c.score}점 · ${c.count}건</span>
      </li>`).join("")
    : '<li class="empty">수집 대기 중</li>';

  const activeDate = archiveData?.period === period ? new Date(archiveData.collected_at) : new Date(liveData?.collected_at || Date.now());
  document.querySelector("#updatedAt").textContent = activeDate.toLocaleString("ko-KR", {
    month:"numeric", day:"numeric", hour:"2-digit", minute:"2-digit"
  });

  const keywordBar = document.querySelector("#activeKeywordBar");
  keywordBar.hidden = !keyword;
  document.querySelector("#activeKeywordText").textContent = keyword ? "#" + keyword + " 관련 인기글" : "";

  renderSourceOptions();
  renderKeywords();
  renderTopics();
  renderArchiveControls();
  updateUrl();
}

async function loadArchiveIndex(){
  try {
    const response = await fetch("./data/archive-index.json?ts=" + Date.now(), {cache:"no-store"});
    if (!response.ok) throw new Error("archive index unavailable");
    archiveIndex = await response.json();
  } catch {
    archiveIndex = {periods:{daily:[],weekly:[],monthly:[]}};
  }
}

async function loadArchive(periodName, key){
  if (!periodName || !key || periodName === "realtime") {
    archiveData = null;
    render();
    return;
  }

  const item = (archiveIndex?.periods?.[periodName] || []).find(x => x.key === key);
  if (!item) {
    archiveData = null;
    render();
    return;
  }

  try {
    const response = await fetch("./data/" + item.path + "?ts=" + Date.now(), {cache:"no-store"});
    if (!response.ok) throw new Error("archive data unavailable");
    archiveData = await response.json();
    source = "전체";
    category = "전체";
    document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active", x.dataset.category === "전체"));
  } catch {
    archiveData = null;
  }
  render();
}

async function loadLiveData(){
  try {
    const [response] = await Promise.all([
      fetch("./data/latest.json?ts=" + Date.now(), {cache:"no-store"}),
      loadArchiveIndex()
    ]);

    if (!response.ok) throw new Error("ranking data unavailable");
    liveData = await response.json();

    const okSources = (liveData.sources || []).filter(s => s.ok && s.count > 0).length;
    const totalSources = (liveData.sources || []).length;
    document.querySelector("#sourceStatus").textContent =
      totalSources ? `${okSources}/${totalSources}개 소스 정상` : "수집 준비";

    const params = new URLSearchParams(location.search);
    const requestedPeriod = params.get("period");
    const requestedArchive = params.get("archive");
    const requestedKeyword = params.get("keyword");
    if (requestedKeyword) keyword = requestedKeyword;

    if (requestedPeriod && periodInfo[requestedPeriod]) {
      period = requestedPeriod;
      document.querySelectorAll(".nav-item").forEach(x =>
        x.classList.toggle("active", x.dataset.period === period)
      );
    }

    if (requestedArchive && period !== "realtime") {
      await loadArchive(period, requestedArchive);
      return;
    }
  } catch (err) {
    liveData = null;
    document.querySelector("#updatedAt").textContent = "자동 수집 대기";
    document.querySelector("#sourceStatus").textContent = "수집 대기";
  }
  render();
}

document.querySelectorAll(".nav-item").forEach(btn=>{
  btn.addEventListener("click", async ()=>{
    document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    period = btn.dataset.period;
    archiveData = null;
    source = "전체";
    await Promise.resolve();
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

document.querySelector("#keywordList").addEventListener("click", e=>{
  const button = e.target.closest("[data-keyword]");
  if (!button) return;
  keyword = button.dataset.keyword || "";
  render();
});

document.querySelector("#clearKeyword").addEventListener("click", ()=>{
  keyword = "";
  render();
});

document.querySelector("#sourceFilter").addEventListener("change", e=>{
  source = e.target.value;
  render();
});

document.querySelector("#archiveSelect").addEventListener("change", async e=>{
  const key = e.target.value;
  if (!key) {
    archiveData = null;
    render();
    return;
  }
  await loadArchive(period, key);
});

document.querySelector("#latestButton").addEventListener("click", ()=>{
  archiveData = null;
  document.querySelector("#archiveSelect").value = "";
  render();
});

document.querySelector("#themeToggle").addEventListener("click", ()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("commurank-theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("commurank-theme") === "dark") document.body.classList.add("dark");

loadLiveData();
