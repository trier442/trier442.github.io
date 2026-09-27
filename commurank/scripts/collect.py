#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import re
import time
from collections import Counter
from difflib import SequenceMatcher
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
LATEST_PATH = DATA_DIR / "latest.json"
ARCHIVE_PATH = DATA_DIR / "archive.json"
ARCHIVE_INDEX_PATH = DATA_DIR / "archive-index.json"
SNAPSHOT_DIR = DATA_DIR / "snapshots"

KST = timezone(timedelta(hours=9))
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/153.0 Safari/537.36 CommurankBot/0.1"
)
FMKOREA_USER_AGENT = "commurank-bot/0.1 (+https://trier442.github.io/commurank/)"

SITES = {
    "루리웹": "https://bbs.ruliweb.com/best",
    "디시인사이드": "https://gall.dcinside.com/board/lists/?id=dcbest",
    "더쿠": "https://theqoo.net/hot",
    "뽐뿌": "https://www.ppomppu.co.kr/hot.php",
    "에펨코리아": "https://www.fmkorea.com/best",
    "클리앙": "https://www.clien.net/service/board/park",
    "인벤": "https://www.inven.co.kr/board/webzine/2097",
}

CATEGORY_KEYWORDS = {
    "스포츠": ["축구", "야구", "농구", "경기", "선수", "감독", "리그", "골", "올림픽", "아시안게임"],
    "연예": ["아이돌", "가수", "배우", "방송", "드라마", "영화", "콘서트", "컴백", "연예"],
    "게임": ["게임", "스팀", "플스", "PS5", "닌텐도", "엑스박스", "롤 ", "LOL", "메이플", "던파"],
    "생활": ["직장", "회사", "여행", "음식", "맛집", "편의점", "카페", "육아", "건강", "집"],
    "유머": ["ㅋㅋ", "웃", "유머", "레전드", "짤", "드립"],
    "이슈": ["속보", "논란", "발표", "공개", "사건", "이슈", "뉴스"],
}


def parse_number(value: str | None) -> int:
    if not value:
        return 0
    value = value.replace(",", "").strip()
    m = re.search(r"-?\d+(?:\.\d+)?", value)
    if not m:
        return 0
    number = float(m.group())
    lower = value.lower()
    if "만" in value:
        number *= 10000
    elif "천" in value:
        number *= 1000
    elif "k" in lower:
        number *= 1000
    elif "m" in lower:
        number *= 1000000
    return max(0, int(number))


def clean_text(value: str | None) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def normalize_category(raw: str | None, title: str) -> str:
    raw = clean_text(raw)
    haystack = f"{raw} {title}"
    for category, words in CATEGORY_KEYWORDS.items():
        if any(word.lower() in haystack.lower() for word in words):
            return category
    if raw and any(k in raw.lower() for k in ["유머", "웃긴"]):
        return "유머"
    return "이슈"


def request_html(url: str, *, referer: str | None = None, user_agent: str | None = None) -> BeautifulSoup:
    headers = {
        "User-Agent": user_agent or USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.7",
        "Cache-Control": "no-cache",
    }
    if referer:
        headers["Referer"] = referer
    response = requests.get(url, headers=headers, timeout=20)
    response.raise_for_status()
    if not response.encoding or response.encoding.lower() == "iso-8859-1":
        response.encoding = response.apparent_encoding or "utf-8"
    return BeautifulSoup(response.text, "html.parser")


def post(source: str, title: str, url: str, category: str | None = None,
         views: int = 0, likes: int = 0, comments: int = 0) -> dict:
    return {
        "source": source,
        "title": clean_text(title),
        "url": url,
        "category": normalize_category(category, title),
        "views": int(views or 0),
        "likes": int(likes or 0),
        "comments": int(comments or 0),
    }


def scrape_ruliweb() -> list[dict]:
    base = "https://bbs.ruliweb.com"
    soup = request_html(SITES["루리웹"])
    items = []
    for row in soup.select("table.board_list_table tr.table_body"):
        link = row.select_one("td.subject a.subject_link")
        title_node = row.select_one("td.subject strong.text_over, td.subject span.text_over")
        if not link or not title_node or not link.get("href"):
            continue
        items.append(post(
            "루리웹",
            title_node.get_text(" ", strip=True),
            urljoin(base, link["href"]),
            views=parse_number(row.select_one("td.hit").get_text() if row.select_one("td.hit") else ""),
            likes=parse_number(row.select_one("td.recomd").get_text() if row.select_one("td.recomd") else ""),
            comments=parse_number(row.select_one("span.num_reply").get_text() if row.select_one("span.num_reply") else ""),
        ))
    return items


def scrape_dcinside() -> list[dict]:
    base = "https://gall.dcinside.com"
    soup = request_html(SITES["디시인사이드"], referer="https://gall.dcinside.com/")
    items = []
    for row in soup.select("tr.ub-content.us-post"):
        link = row.select_one("td.gall_tit a")
        if not link or not link.get("href"):
            continue
        title = clean_text(link.get_text(" ", strip=True))
        strong = link.select_one("strong")
        raw_category = clean_text(strong.get_text(" ", strip=True)) if strong else ""
        if raw_category:
            title = clean_text(title.replace(raw_category, "", 1))
        if not title:
            continue
        items.append(post(
            "디시인사이드",
            title,
            urljoin(base, link["href"]),
            category=raw_category,
            views=parse_number(row.select_one("td.gall_count").get_text() if row.select_one("td.gall_count") else ""),
            likes=parse_number(row.select_one("td.gall_recommend").get_text() if row.select_one("td.gall_recommend") else ""),
            comments=parse_number(row.select_one(".reply_num").get_text() if row.select_one(".reply_num") else ""),
        ))
    return items


def scrape_theqoo() -> list[dict]:
    base = "https://theqoo.net"
    soup = request_html(SITES["더쿠"])
    items = []
    for row in soup.select("table.theqoo_board_table tbody tr"):
        classes = set(row.get("class") or [])
        if "notice" in classes or "notice_expand" in classes:
            continue
        link = row.select_one("td.title > a")
        if not link or not link.get("href"):
            continue
        title = clean_text(link.get_text(" ", strip=True))
        if not title:
            continue
        items.append(post(
            "더쿠",
            title,
            urljoin(base, link["href"]),
            category=clean_text(row.select_one("td.cate span").get_text() if row.select_one("td.cate span") else ""),
            views=parse_number(row.select_one("td.m_no").get_text() if row.select_one("td.m_no") else ""),
            comments=parse_number(row.select_one("td.title a.replyNum").get_text() if row.select_one("td.title a.replyNum") else ""),
        ))
    return items


def scrape_ppomppu() -> list[dict]:
    base = "https://www.ppomppu.co.kr"
    soup = request_html(SITES["뽐뿌"])
    items = []
    for row in soup.select('table.board_table tr[class*="baseList"]'):
        links = row.select("td.title a.baseList-title")
        if not links:
            continue
        link = links[1] if len(links) > 1 else links[0]
        href = link.get("href")
        title = clean_text(link.get_text(" ", strip=True))
        if not href or not title:
            continue
        tds = row.select("td")
        likes = parse_number(tds[5].get_text()) if len(tds) > 5 else 0
        views = parse_number(tds[6].get_text()) if len(tds) > 6 else 0
        items.append(post(
            "뽐뿌",
            title,
            urljoin(base, href),
            category=clean_text(row.select_one("td.baseList-numb a").get_text() if row.select_one("td.baseList-numb a") else ""),
            views=views,
            likes=likes,
            comments=parse_number(row.select_one("span.list_comment2").get_text() if row.select_one("span.list_comment2") else ""),
        ))
    return items


def scrape_fmkorea() -> list[dict]:
    candidates = [
        ("https://www.fmkorea.com/best", "https://www.fmkorea.com"),
        ("https://m.fmkorea.com/best", "https://m.fmkorea.com"),
    ]
    last_error = None

    for list_url, base in candidates:
        try:
            soup = request_html(list_url, user_agent=FMKOREA_USER_AGENT)
        except Exception as exc:
            last_error = exc
            continue

        items = []
        nodes = soup.select("li.li_best2")
        if not nodes:
            nodes = soup.select(".fm_best_widget ul > li")

        for item in nodes:
            link = item.select_one("h3.title > a")
            if not link or not link.get("href"):
                continue

            title_node = item.select_one("h3.title span.ellipsis-target")
            title = clean_text(title_node.get_text(" ", strip=True) if title_node else "")
            if not title:
                title_el = item.select_one("h3.title")
                title = clean_text(title_el.get("data-original-title") if title_el else "")
            if not title:
                title = clean_text(link.get_text(" ", strip=True))
                comment_node = link.select_one("span.comment_count")
                if comment_node:
                    title = clean_text(title.replace(comment_node.get_text(" ", strip=True), ""))
            if not title:
                continue

            href = link["href"]
            if href.startswith("/best/"):
                canonical = urljoin("https://www.fmkorea.com", href)
            else:
                canonical = urljoin(base, href)

            items.append(post(
                "에펨코리아",
                title,
                canonical,
                category=clean_text(item.select_one("span.category > a").get_text() if item.select_one("span.category > a") else ""),
                likes=parse_number(item.select_one("a.pc_voted_count span.count").get_text() if item.select_one("a.pc_voted_count span.count") else ""),
                comments=parse_number(item.select_one("span.comment_count").get_text() if item.select_one("span.comment_count") else ""),
            ))

        if items:
            return items

    if last_error:
        raise last_error
    return []


def scrape_clien() -> list[dict]:
    base = "https://www.clien.net"
    soup = request_html(SITES["클리앙"])
    items = []
    for row in soup.select("div.list_item"):
        link = row.select_one("a.list_subject")
        if not link or not link.get("href"):
            continue
        title_node = row.select_one("span.subject_fixed")
        title = clean_text(title_node.get("title") if title_node and title_node.get("title") else title_node.get_text(" ", strip=True) if title_node else "")
        if not title:
            continue
        comments = parse_number(row.get("data-comment-count"))
        if comments == 0:
            cmt = row.select_one("span.rSymph05")
            comments = parse_number(cmt.get_text() if cmt else "")
        hit = row.select_one("span.hit")
        views = parse_number(hit.get_text() if hit else "")
        if not hit:
            continue
        like = row.select_one('[data-role="list-like-count"] span')
        items.append(post(
            "클리앙",
            title,
            urljoin(base, link["href"]),
            views=views,
            likes=parse_number(like.get_text() if like else ""),
            comments=comments,
        ))
    return items


def scrape_inven() -> list[dict]:
    base = "https://www.inven.co.kr"
    soup = request_html(SITES["인벤"])
    items = []
    for row in soup.select("tr"):
        classes = set(row.get("class") or [])
        if "notice" in classes or row.select_one("span.notice-icon"):
            continue
        cell = row.select_one("td.tit")
        link = cell.select_one("a.subject-link") if cell else None
        if not link or not link.get("href"):
            continue
        category_node = link.select_one("span.category")
        raw_category = clean_text(category_node.get_text(" ", strip=True) if category_node else "")
        if category_node:
            category_node.extract()
        title = clean_text(link.get_text(" ", strip=True))
        if not title:
            continue
        view_node = row.select_one("td.view")
        if not view_node:
            continue
        reco_node = row.select_one("td.reco")
        cmt_node = cell.select_one("span.con-comment") if cell else None
        items.append(post(
            "인벤",
            title,
            urljoin(base, link["href"]),
            category=raw_category,
            views=parse_number(view_node.get_text()),
            likes=parse_number(reco_node.get_text() if reco_node else ""),
            comments=parse_number(cmt_node.get_text() if cmt_node else ""),
        ))
    return items


SCRAPERS = {
    "루리웹": scrape_ruliweb,
    "디시인사이드": scrape_dcinside,
    "더쿠": scrape_theqoo,
    "뽐뿌": scrape_ppomppu,
    "에펨코리아": scrape_fmkorea,
    "클리앙": scrape_clien,
    "인벤": scrape_inven,
}


def percentile(values: list[int], value: int) -> float:
    if not values:
        return 0.5
    ordered = sorted(values)
    if len(ordered) == 1:
        return 1.0
    below = sum(1 for x in ordered if x < value)
    equal = sum(1 for x in ordered if x == value)
    return min(1.0, max(0.0, (below + 0.5 * equal) / len(ordered)))


def score_source(items: list[dict]) -> list[dict]:
    n = len(items)
    view_values = [p["views"] for p in items if p["views"] > 0]
    like_values = [p["likes"] for p in items if p["likes"] > 0]
    comment_values = [p["comments"] for p in items if p["comments"] > 0]

    for i, p in enumerate(items):
        position = 1.0 if n <= 1 else 1 - i / (n - 1)
        metrics = []
        if p["views"] > 0:
            metrics.append(percentile(view_values, p["views"]))
        if p["likes"] > 0:
            metrics.append(percentile(like_values, p["likes"]))
        if p["comments"] > 0:
            metrics.append(percentile(comment_values, p["comments"]))
        engagement = sum(metrics) / len(metrics) if metrics else 0.5
        p["score"] = round(100 * (0.6 * position + 0.4 * engagement), 2)
    return items


TOPIC_STOPWORDS = {
    "오늘", "요즘", "지금", "현재", "진짜", "관련", "반응", "근황", "결과", "이유", "정리",
    "공개", "발표", "논란", "소식", "사진", "영상", "장면", "사람", "이야기", "게시글",
    "대한", "에서", "으로", "그리고", "하지만", "그런데", "했다", "하는", "있는", "없는",
    "jpg", "gif", "mp4", "webp", "ㅋㅋ", "ㅋㅋㅋ", "ㄷㄷ", "속보",
    "사람들", "레전드", "한국인", "애들이", "사람이", "사람은", "같은", "이런", "저런",
    "이거", "이게", "이번", "정도", "생각", "사실", "하나", "모두", "정말", "그냥"
}


def topic_tokens(title: str) -> set[str]:
    normalized = re.sub(r"[^0-9A-Za-z가-힣 ]+", " ", title.lower())
    tokens = []
    for token in normalized.split():
        token = token.strip()
        if len(token) < 2 or token in TOPIC_STOPWORDS:
            continue
        if token.isdigit() and len(token) < 3:
            continue
        tokens.append(token)
    return set(tokens)


def title_similarity(a: str, b: str) -> float:
    ta, tb = topic_tokens(a), topic_tokens(b)
    if not ta or not tb:
        return 0.0

    shared = ta & tb
    union = ta | tb
    jaccard = len(shared) / len(union)
    coverage = len(shared) / min(len(ta), len(tb))

    na = re.sub(r"\s+", "", re.sub(r"[^0-9A-Za-z가-힣 ]+", "", a.lower()))
    nb = re.sub(r"\s+", "", re.sub(r"[^0-9A-Za-z가-힣 ]+", "", b.lower()))
    seq = SequenceMatcher(None, na, nb).ratio() if na and nb else 0.0

    # 짧은 공통어 하나만으로는 서로 다른 이슈가 합쳐지지 않게 보수적으로 판정한다.
    if len(shared) >= 3:
        return max(jaccard, coverage * 0.95, seq * 0.9)
    if len(shared) == 2:
        return max(jaccard, coverage * 0.88, seq * 0.82)
    if len(shared) == 1:
        only = next(iter(shared))
        if len(only) >= 5 and seq >= 0.62:
            return max(coverage * 0.7, seq * 0.72)
        return 0.0
    return seq * 0.55 if seq >= 0.78 else 0.0


def build_topics(posts: list[dict], limit: int = 8) -> list[dict]:
    ranked = [{**p, "rank": i + 1} for i, p in enumerate(posts)]
    topics = []

    # 1) 제목 전체가 상당히 닮은 게시물은 같은 사건으로 묶는다.
    clusters: list[dict] = []
    for p in ranked:
        best_cluster = None
        best_similarity = 0.0

        for cluster in clusters:
            similarities = [title_similarity(p["title"], item["title"]) for item in cluster["posts"]]
            similarity = max(similarities) if similarities else 0.0
            if similarity > best_similarity:
                best_similarity = similarity
                best_cluster = cluster

        if best_cluster is not None and best_similarity >= 0.44:
            best_cluster["posts"].append(p)
        else:
            clusters.append({"posts": [p]})

    for cluster in clusters:
        items = cluster["posts"]
        source_names = list(dict.fromkeys(item["source"] for item in items))
        if len(source_names) < 2:
            continue

        token_counts = Counter()
        for item in items:
            token_counts.update(topic_tokens(item["title"]))
        keywords = [token for token, count in token_counts.most_common(5) if count >= 2]

        representative = max(items, key=lambda x: (x.get("score", 0), -x["rank"]))
        source_best = {}
        for item in sorted(items, key=lambda x: x["rank"]):
            source_best.setdefault(item["source"], item)

        topics.append({
            "title": representative["title"],
            "source_count": len(source_names),
            "post_count": len(items),
            "score": round(max(float(item.get("score", 0)) for item in items) + (len(source_names) - 1) * 6 + min(6, len(items)), 2),
            "keywords": keywords,
            "posts": [
                {
                    "source": item["source"],
                    "rank": item["rank"],
                    "title": item["title"],
                    "url": item["url"],
                    "score": item.get("score", 0),
                }
                for item in list(source_best.values())[:6]
            ],
        })

    # 2) 서로 다른 제목이어도 같은 고유 키워드가 여러 커뮤니티에서 동시에 뜨면
    #    '동시 화제'로 잡는다. 단, 흔한 일반어는 STOPWORDS에서 제외한다.
    token_posts: dict[str, list[dict]] = {}
    for item in ranked:
        for token in topic_tokens(item["title"]):
            if len(token) < 3 or token.isdigit():
                continue
            token_posts.setdefault(token, []).append(item)

    for token, items in token_posts.items():
        source_names = list(dict.fromkeys(item["source"] for item in items))
        if len(source_names) < 2:
            continue

        source_best = {}
        for item in sorted(items, key=lambda x: x["rank"]):
            source_best.setdefault(item["source"], item)
        best_items = list(source_best.values())

        # 이미 제목 유사도 클러스터에서 거의 같은 글들이 묶였으면 중복 생성하지 않는다.
        candidate_urls = {item["url"] for item in best_items}
        duplicate = False
        for topic in topics:
            topic_urls = {item["url"] for item in topic["posts"]}
            overlap = len(candidate_urls & topic_urls)
            if overlap >= 2 and overlap / max(1, min(len(candidate_urls), len(topic_urls))) >= 0.66:
                if token not in topic["keywords"]:
                    topic["keywords"].append(token)
                duplicate = True
                break
        if duplicate:
            continue

        peak = max(float(item.get("score", 0)) for item in best_items)
        topics.append({
            "title": f"‘{token}’ 관련 글이 여러 커뮤니티에서 화제",
            "source_count": len(source_names),
            "post_count": len(items),
            "score": round(peak + (len(source_names) - 1) * 7 + min(5, len(items)), 2),
            "keywords": [token],
            "posts": [
                {
                    "source": item["source"],
                    "rank": item["rank"],
                    "title": item["title"],
                    "url": item["url"],
                    "score": item.get("score", 0),
                }
                for item in best_items[:6]
            ],
        })

    return sorted(
        topics,
        key=lambda t: (t["source_count"], t["post_count"], t["score"]),
        reverse=True,
    )[:limit]

def normalize_keyword_token(token: str) -> str:
    token = token.strip().lower()
    if not token:
        return ""
    suffixes = [
        "에서는", "으로는", "에게는", "까지는", "부터는",
        "에서", "으로", "에게", "까지", "부터", "처럼", "보다",
        "하고", "이며", "에는", "에도", "과는", "와는",
        "은", "는", "이", "가", "을", "를", "의", "에", "와", "과", "도", "만",
    ]
    if re.fullmatch(r"[가-힣]+", token) and len(token) >= 4:
        for suffix in suffixes:
            if token.endswith(suffix) and len(token) - len(suffix) >= 2:
                token = token[:-len(suffix)]
                break
    return token


def keyword_tokens(title: str) -> set[str]:
    result = set()
    for token in topic_tokens(title):
        normalized = normalize_keyword_token(token)
        if not normalized or normalized in TOPIC_STOPWORDS:
            continue
        if len(normalized) < 2:
            continue
        if normalized.isdigit():
            continue
        result.add(normalized)
    return result


def compute_keyword_rows(posts: list[dict], limit: int = 40) -> list[dict]:
    token_map: dict[str, list[dict]] = {}
    for rank, post_item in enumerate(posts, start=1):
        enriched = {**post_item, "_rank": rank}
        for token in keyword_tokens(post_item.get("title", "")):
            token_map.setdefault(token, []).append(enriched)

    rows = []
    for token, items in token_map.items():
        post_count = len(items)
        source_count = len({item.get("source") for item in items if item.get("source")})

        if post_count < 2:
            continue
        if source_count < 2 and post_count < 3:
            continue

        best_rank = min(item["_rank"] for item in items)
        avg_rank_strength = sum(max(0, 101 - item["_rank"]) / 100 for item in items) / post_count
        avg_score = sum(float(item.get("score", 0)) for item in items) / post_count
        keyword_score = (
            source_count * 22
            + post_count * 7
            + avg_rank_strength * 24
            + avg_score * 0.28
            + max(0, 20 - best_rank) * 0.35
        )

        rows.append({
            "keyword": token,
            "score": round(keyword_score, 2),
            "post_count": post_count,
            "source_count": source_count,
            "best_rank": best_rank,
            "sources": sorted({item.get("source") for item in items if item.get("source")}),
        })

    rows.sort(
        key=lambda row: (
            row["score"],
            row["source_count"],
            row["post_count"],
            -row["best_rank"],
        ),
        reverse=True,
    )
    return rows[:limit]


def build_keyword_trends(current: list[dict], previous: dict, limit: int = 20) -> list[dict]:
    current_rows = compute_keyword_rows(current, limit=max(limit * 3, 40))

    previous_rows = []
    if isinstance(previous, dict):
        previous_rows = previous.get("keywords") or []
        if not previous_rows:
            previous_realtime = previous.get("rankings", {}).get("realtime", [])
            previous_rows = compute_keyword_rows(previous_realtime, limit=max(limit * 3, 40))

    old_rank = {row.get("keyword"): i + 1 for i, row in enumerate(previous_rows)}

    result = []
    for i, row in enumerate(current_rows[:limit], start=1):
        item = dict(row)
        before = old_rank.get(row["keyword"])
        item["rank"] = i
        item["change"] = "NEW" if before is None else before - i
        result.append(item)

    return result


def load_json(path: Path, fallback):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return fallback


def dt(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def period_rank(archive: dict, since: datetime, now: datetime, limit: int = 100) -> list[dict]:
    candidates = []
    for entry in archive.values():
        last_seen = dt(entry["last_seen"]).astimezone(KST)
        if last_seen < since:
            continue
        p = dict(entry)
        recency_hours = max(0, (now - last_seen).total_seconds() / 3600)
        recency_bonus = max(0, 8 - min(8, recency_hours / 12))
        repeat_bonus = min(8, math.log1p(entry.get("appearances", 1)) * 2)
        p["score"] = round(entry.get("peak_score", 0) + recency_bonus + repeat_bonus, 2)
        p["views"] = entry.get("max_views", 0)
        p["likes"] = entry.get("max_likes", 0)
        p["comments"] = entry.get("max_comments", 0)
        candidates.append(p)
    return sorted(candidates, key=lambda x: (x["score"], x["views"], x["comments"]), reverse=True)[:limit]


def attach_rank_changes(rankings: dict[str, list[dict]], previous: dict) -> None:
    previous_rankings = previous.get("rankings", {}) if isinstance(previous, dict) else {}
    for period, items in rankings.items():
        old_map = {p.get("url"): i + 1 for i, p in enumerate(previous_rankings.get(period, []))}
        for i, p in enumerate(items):
            old_rank = old_map.get(p.get("url"))
            p["change"] = "NEW" if old_rank is None else old_rank - (i + 1)


def build_rising(current: list[dict], previous: dict, collected_at: str, limit: int = 50) -> tuple[list[dict], int]:
    previous_items = previous.get("rankings", {}).get("realtime", []) if isinstance(previous, dict) else []
    previous_map = {p.get("url"): {**p, "_rank": i + 1} for i, p in enumerate(previous_items) if p.get("url")}

    window_minutes = 30
    previous_at = previous.get("collected_at") if isinstance(previous, dict) else None
    if previous_at:
        try:
            before = dt(previous_at).astimezone(KST)
            after = dt(collected_at).astimezone(KST)
            window_minutes = max(1, round((after - before).total_seconds() / 60))
        except Exception:
            window_minutes = 30

    rows = []
    for rank, p in enumerate(current, start=1):
        old = previous_map.get(p.get("url"))
        row = dict(p)
        row["current_rank"] = rank
        row["new_entry"] = old is None

        if old:
            row["delta_views"] = max(0, int(p.get("views", 0)) - int(old.get("views", 0)))
            row["delta_likes"] = max(0, int(p.get("likes", 0)) - int(old.get("likes", 0)))
            row["delta_comments"] = max(0, int(p.get("comments", 0)) - int(old.get("comments", 0)))
            row["rank_gain"] = max(0, int(old.get("_rank", rank)) - rank)
        else:
            row["delta_views"] = 0
            row["delta_likes"] = 0
            row["delta_comments"] = 0
            row["rank_gain"] = 0

        rows.append(row)

    # 커뮤니티 규모 차이를 줄이기 위해 증가량을 각 사이트 내부 백분위로 정규화한다.
    by_source = {}
    for row in rows:
        by_source.setdefault(row["source"], []).append(row)

    for source_rows in by_source.values():
        view_values = [r["delta_views"] for r in source_rows if r["delta_views"] > 0]
        like_values = [r["delta_likes"] for r in source_rows if r["delta_likes"] > 0]
        comment_values = [r["delta_comments"] for r in source_rows if r["delta_comments"] > 0]
        gain_values = [r["rank_gain"] for r in source_rows if r["rank_gain"] > 0]

        for row in source_rows:
            if row["new_entry"]:
                # 신규 진입 글은 현재 사이트 내 인기점수가 높을 때만 급상승 후보가 된다.
                row["rising_score"] = round(42 + float(row.get("score", 0)) * 0.42, 2)
                continue

            pieces = []
            weights = []
            if row["delta_views"] > 0:
                pieces.append(percentile(view_values, row["delta_views"]))
                weights.append(0.45)
            if row["delta_likes"] > 0:
                pieces.append(percentile(like_values, row["delta_likes"]))
                weights.append(0.25)
            if row["delta_comments"] > 0:
                pieces.append(percentile(comment_values, row["delta_comments"]))
                weights.append(0.20)
            if row["rank_gain"] > 0:
                pieces.append(percentile(gain_values, row["rank_gain"]))
                weights.append(0.10)

            if weights:
                normalized = sum(v * w for v, w in zip(pieces, weights)) / sum(weights)
                row["rising_score"] = round(100 * normalized, 2)
            else:
                row["rising_score"] = round(float(row.get("score", 0)) * 0.35, 2)

    rising = sorted(
        rows,
        key=lambda r: (
            r.get("rising_score", 0),
            r.get("rank_gain", 0),
            r.get("delta_comments", 0),
            r.get("delta_likes", 0),
            r.get("delta_views", 0),
        ),
        reverse=True,
    )[:limit]

    for i, row in enumerate(rising, start=1):
        row["change"] = "NEW" if row.get("new_entry") else row.get("rank_gain", 0)
        row["rising_rank"] = i
        row["window_minutes"] = window_minutes

    return rising, window_minutes


def snapshot_meta(period: str, key: str, label: str, collected_at: str, path: Path) -> dict:
    return {
        "period": period,
        "key": key,
        "label": label,
        "collected_at": collected_at,
        "path": str(path.relative_to(DATA_DIR)).replace("\\", "/"),
    }


def write_period_snapshots(now: datetime, collected_at: str, rankings: dict[str, list[dict]]) -> list[dict]:
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)

    iso_year, iso_week, _ = now.isocalendar()
    week_start = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
    week_end = week_start + timedelta(days=6)

    specs = [
        ("daily", now.strftime("%Y-%m-%d"), now.strftime("%Y년 %m월 %d일")),
        (
            "weekly",
            f"{iso_year}-W{iso_week:02d}",
            f"{week_start.strftime('%Y.%m.%d')} ~ {week_end.strftime('%m.%d')}",
        ),
        ("monthly", now.strftime("%Y-%m"), now.strftime("%Y년 %m월")),
    ]

    metas = []
    for period, key, label in specs:
        period_dir = SNAPSHOT_DIR / period
        period_dir.mkdir(parents=True, exist_ok=True)
        path = period_dir / f"{key}.json"
        posts = rankings.get(period, [])
        snap = {
            "version": 1,
            "period": period,
            "key": key,
            "label": label,
            "collected_at": collected_at,
            "timezone": "Asia/Seoul",
            "posts": posts,
            "topics": build_topics(posts),
        }
        path.write_text(json.dumps(snap, ensure_ascii=False, indent=2), encoding="utf-8")
        metas.append(snapshot_meta(period, key, label, collected_at, path))
    return metas


def update_archive_index(new_metas: list[dict]) -> dict:
    index = load_json(ARCHIVE_INDEX_PATH, {"version": 1, "periods": {"daily": [], "weekly": [], "monthly": []}})
    index.setdefault("periods", {})
    limits = {"daily": 400, "weekly": 120, "monthly": 60}

    for meta in new_metas:
        period = meta["period"]
        items = index["periods"].setdefault(period, [])
        items = [item for item in items if item.get("key") != meta["key"]]
        items.append(meta)
        items.sort(key=lambda item: item.get("key", ""), reverse=True)
        index["periods"][period] = items[:limits[period]]

    index["updated_at"] = max((m["collected_at"] for m in new_metas), default=None)
    ARCHIVE_INDEX_PATH.write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8")
    return index


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    now = datetime.now(KST)
    collected_at = now.isoformat()
    statuses = []
    all_posts = []

    for source, scraper in SCRAPERS.items():
        started = time.time()
        try:
            items = scraper()
            items = [p for p in items if p.get("title") and p.get("url")][:60]
            score_source(items)
            all_posts.extend(items)
            statuses.append({
                "source": source,
                "ok": True,
                "count": len(items),
                "elapsed_ms": int((time.time() - started) * 1000),
            })
        except Exception as exc:
            statuses.append({
                "source": source,
                "ok": False,
                "count": 0,
                "error": f"{type(exc).__name__}: {str(exc)[:160]}",
                "elapsed_ms": int((time.time() - started) * 1000),
            })
        time.sleep(1.0)

    # URL 기준 중복 제거 후 통합 점수순
    dedup = {}
    for p in all_posts:
        if p["url"] not in dedup or p["score"] > dedup[p["url"]]["score"]:
            dedup[p["url"]] = p
    realtime = sorted(
        dedup.values(),
        key=lambda x: (x["score"], x["views"], x["comments"], x["likes"]),
        reverse=True,
    )[:100]

    archive = load_json(ARCHIVE_PATH, {})
    for p in dedup.values():
        key = p["url"]
        old = archive.get(key, {})
        archive[key] = {
            "title": p["title"],
            "source": p["source"],
            "category": p["category"],
            "url": p["url"],
            "first_seen": old.get("first_seen", collected_at),
            "last_seen": collected_at,
            "peak_score": max(float(old.get("peak_score", 0)), float(p["score"])),
            "max_views": max(int(old.get("max_views", 0)), p["views"]),
            "max_likes": max(int(old.get("max_likes", 0)), p["likes"]),
            "max_comments": max(int(old.get("max_comments", 0)), p["comments"]),
            "appearances": int(old.get("appearances", 0)) + 1,
        }

    # 최근 62일 + 최대 6000건만 유지
    cutoff = now - timedelta(days=62)
    archive = {
        k: v for k, v in archive.items()
        if dt(v["last_seen"]).astimezone(KST) >= cutoff
    }
    if len(archive) > 6000:
        newest = sorted(archive.items(), key=lambda kv: kv[1]["last_seen"], reverse=True)[:6000]
        archive = dict(newest)

    day_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    rankings = {
        "realtime": realtime,
        "daily": period_rank(archive, day_start, now),
        "weekly": period_rank(archive, week_start, now),
        "monthly": period_rank(archive, month_start, now),
    }

    previous = load_json(LATEST_PATH, {})
    attach_rank_changes(rankings, previous)
    rising, rising_window_minutes = build_rising(rankings["realtime"], previous, collected_at)
    rankings["rising"] = rising

    topics = build_topics(rankings["realtime"])
    keywords = build_keyword_trends(rankings["realtime"], previous)

    payload = {
        "version": 3,
        "collected_at": collected_at,
        "timezone": "Asia/Seoul",
        "period_basis": {
            "rising": f"직전 수집 대비 약 {rising_window_minutes}분 변화",
            "daily": "오늘 00:00부터 현재까지",
            "weekly": "이번 주 월요일 00:00부터 현재까지",
            "monthly": "이번 달 1일 00:00부터 현재까지",
        },
        "sources": statuses,
        "rising_window_minutes": rising_window_minutes,
        "rankings": rankings,
        "topics": topics,
        "keywords": keywords,
    }

    LATEST_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    ARCHIVE_PATH.write_text(json.dumps(archive, ensure_ascii=False, indent=2), encoding="utf-8")
    snapshot_metas = write_period_snapshots(now, collected_at, rankings)
    update_archive_index(snapshot_metas)

    ok = sum(1 for s in statuses if s["ok"] and s["count"] > 0)
    print(f"Collected {len(dedup)} posts from {ok}/{len(statuses)} sources")


if __name__ == "__main__":
    main()
