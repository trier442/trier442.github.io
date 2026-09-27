const posts = [
  {title:"퇴근길에 다들 한 번쯤 공감했다는 사진", source:"에펨코리아", category:"유머", views:82143, likes:1382, comments:427, change:7},
  {title:"오늘 공개된 신제품, 커뮤니티에서 가장 많이 언급된 기능", source:"클리앙", category:"이슈", views:74582, likes:1044, comments:512, change:3},
  {title:"주말 경기 마지막 10분이 역대급이었다는 반응", source:"인벤", category:"스포츠", views:69350, likes:994, comments:638, change:"NEW"},
  {title:"팬들 사이에서 화제 중인 무대 장면", source:"더쿠", category:"연예", views:67110, likes:876, comments:805, change:-1},
  {title:"오랜만에 업데이트된 게임, 첫날 반응 정리", source:"루리웹", category:"게임", views:58120, likes:742, comments:319, change:4},
  {title:"요즘 직장인들 사이에서 조용히 유행한다는 루틴", source:"디시인사이드", category:"생활", views:53420, likes:650, comments:201, change:10},
  {title:"사진 한 장으로 댓글 수백 개 달린 이유", source:"에펨코리아", category:"유머", views:50211, likes:611, comments:492, change:-2},
  {title:"새 정책 발표 이후 커뮤니티에서 많이 나온 질문", source:"클리앙", category:"이슈", views:47775, likes:520, comments:446, change:2},
  {title:"이번 시즌 가장 극적인 장면으로 꼽히는 순간", source:"인벤", category:"스포츠", views:44102, likes:488, comments:355, change:"NEW"},
  {title:"방송 직후 실시간 검색량이 크게 오른 출연자", source:"더쿠", category:"연예", views:41990, likes:703, comments:381, change:-4},
  {title:"출시 전인데 벌써 의견이 갈리는 신작", source:"루리웹", category:"게임", views:39881, likes:477, comments:520, change:1},
  {title:"편의점 신상품 먹어본 사람들 반응 모음", source:"디시인사이드", category:"생활", views:36240, likes:365, comments:188, change:6}
];

const periodInfo = {
  realtime: {label:"실시간", factor:1},
  daily: {label:"오늘", factor:1.35},
  weekly: {label:"이번 주", factor:2.1},
  monthly: {label:"이번 달", factor:3.6}
};

const communityBase = [
  ["에펨코리아", 98], ["더쿠", 95], ["루리웹", 91], ["클리앙", 88], ["인벤", 84], ["디시인사이드", 81]
];

let period = "realtime";
let category = "전체";
let source = "전체";

const fmt = n => new Intl.NumberFormat("ko-KR", {notation: n > 9999 ? "compact" : "standard"}).format(n);

function render(){
  const factor = periodInfo[period].factor;
  const filtered = posts
    .filter(p => category === "전체" || p.category === category)
    .filter(p => source === "전체" || p.source === source);

  document.querySelector("#periodLabel").textContent = periodInfo[period].label;
  document.querySelector("#heroCount").textContent = Math.round(128 * factor);

  const list = document.querySelector("#rankingList");
  if (!filtered.length) {
    list.innerHTML = '<div class="empty">조건에 맞는 인기글이 없습니다.</div>';
  } else {
    list.innerHTML = filtered.map((p,i) => {
      const ch = p.change;
      let changeHtml = '<span class="rank-change">―</span>';
      if (ch === "NEW") changeHtml = '<span class="rank-change new">NEW</span>';
      else if (ch > 0) changeHtml = '<span class="rank-change up">▲ '+ch+'</span>';
      else if (ch < 0) changeHtml = '<span class="rank-change down">▼ '+Math.abs(ch)+'</span>';
      return `
        <article class="rank-item">
          <div class="rank-num ${i < 3 ? "top" : ""}">${i+1}</div>
          <div>
            <div class="post-title">${p.title}</div>
            <div class="meta">
              <span class="source">${p.source}</span>
              <span class="category">${p.category}</span>
              <span>조회 ${fmt(Math.round(p.views*factor))}</span>
              <span>추천 ${fmt(Math.round(p.likes*factor))}</span>
              <span>댓글 ${fmt(Math.round(p.comments*factor))}</span>
            </div>
          </div>
          ${changeHtml}
        </article>`;
    }).join("");
  }

  const communities = [...communityBase]
    .map(([name,score],idx)=>({name, score: Math.min(100, Math.round(score + (period === "realtime" ? 0 : (idx%2?2:-1))))}))
    .sort((a,b)=>b.score-a.score);

  document.querySelector("#communityList").innerHTML = communities.map((c,i)=>`
    <li class="community-row">
      <span class="community-rank">${i+1}</span>
      <span class="community-name">${c.name}</span>
      <span class="community-score">${c.score}점</span>
    </li>`).join("");
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

const now = new Date();
document.querySelector("#updatedAt").textContent = now.toLocaleTimeString("ko-KR", {hour:"2-digit", minute:"2-digit"});
render();
