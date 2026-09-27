#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import re
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
LATEST_PATH = DATA_DIR / "latest.json"
ARCHIVE_PATH = DATA_DIR / "archive.json"

KST = timezone(timedelta(hours=9))
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/153.0 Safari/537.36 CommurankBot/0.1"
)

SITES = {
    "루리웹": "https://bbs.ruliweb.com/best",
    "디시인사이드": "https://gall.dcinside.com/board/lists/?id=dcbest",
    "더쿠": "https://theqoo.net/hot",
    "뽐뿌": "https://www.ppomppu.co.kr/hot.php",
    "에펨코리아": "https://www.fmkorea.com/best",
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


def request_html(url: str, *, referer: str | None = None) -> BeautifulSoup:
    headers = {
        "User-Agent": USER_AGENT,
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
    base = "https://www.fmkorea.com"
    soup = request_html(SITES["에펨코리아"])
    items = []
    for item in soup.select(".fm_best_widget ul > li"):
        link = item.select_one("h3.title > a")
        if not link or not link.get("href"):
            continue
        title_node = item.select_one("h3.title span.ellipsis-target")
        title = clean_text(title_node.get_text(" ", strip=True) if title_node else "")
        if not title:
            title = clean_text(item.select_one("h3.title").get("data-original-title") if item.select_one("h3.title") else "")
        if not title:
            continue
        items.append(post(
            "에펨코리아",
            title,
            urljoin(base, link["href"]),
            category=clean_text(item.select_one("span.category > a").get_text() if item.select_one("span.category > a") else ""),
            likes=parse_number(item.select_one("a.pc_voted_count span.count").get_text() if item.select_one("a.pc_voted_count span.count") else ""),
            comments=parse_number(item.select_one("span.comment_count").get_text() if item.select_one("span.comment_count") else ""),
        ))
    return items


SCRAPERS = {
    "루리웹": scrape_ruliweb,
    "디시인사이드": scrape_dcinside,
    "더쿠": scrape_theqoo,
    "뽐뿌": scrape_ppomppu,
    "에펨코리아": scrape_fmkorea,
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

    payload = {
        "version": 1,
        "collected_at": collected_at,
        "timezone": "Asia/Seoul",
        "period_basis": {
            "daily": "오늘 00:00부터 현재까지",
            "weekly": "이번 주 월요일 00:00부터 현재까지",
            "monthly": "이번 달 1일 00:00부터 현재까지",
        },
        "sources": statuses,
        "rankings": rankings,
    }

    LATEST_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    ARCHIVE_PATH.write_text(json.dumps(archive, ensure_ascii=False, indent=2), encoding="utf-8")

    ok = sum(1 for s in statuses if s["ok"] and s["count"] > 0)
    print(f"Collected {len(dedup)} posts from {ok}/{len(statuses)} sources")


if __name__ == "__main__":
    main()
