# Sophie Reading Lab

독서논술 플랫폼 1차 프로토타입입니다.

## 구현된 기능
- 반응형 홈 화면
- 주제별 독서논술 콘텐츠 3종
- 읽기 → 핵심어휘 → 내용확인 → 사고확장 → 논술쓰기 5단계 학습
- 객관식 즉시 채점 및 해설
- 논술 답안 글자 수 계산
- 논술 초안 자동 저장 / 수동 저장
- 학습 단계 진행률 저장
- 나의 학습 대시보드
- 브라우저 localStorage 기반 저장

## 접속
GitHub Pages가 저장소 main/root를 배포하고 있다면:
https://trier442.github.io/readinglab/

## 다음 단계
2차에서는 Supabase를 연결해 학생/교사 로그인, 반 관리, 과제 배정, 서버 저장을 구현합니다.
3차에서는 교사 첨삭, 루브릭 평가, AI 초벌 피드백을 추가합니다.

> 현재 버전은 서버 DB를 연결하지 않은 체험용 MVP이므로 학습 기록은 사용자의 브라우저에만 저장됩니다.


## 2차 프로토타입 (교사/학생 운영)
- 학생 모드 ↔ 교사 모드 전환
- 반 2개 / 학생 샘플 데이터
- 과제 배정 및 삭제
- 학생 홈의 배정 과제 표시
- 제출 답안 목록과 미첨삭/첨삭완료 필터
- 논제 이해 / 근거 활용 / 논리 구성 / 표현 4개 루브릭
- 교사 총평 저장
- `supabase-schema.sql`에 실제 서버 전환용 테이블 및 RLS 정책 포함

### Supabase 연결 준비
1. Supabase 프로젝트 생성
2. `supabase-schema.sql` 실행
3. `supabase-config.example.js`를 참고해 공개 URL과 anon key 설정
4. 현재 localStorage 어댑터를 Supabase 쿼리 어댑터로 교체

현재 화면은 서버 연결 전 데모 운영을 위해 localStorage를 사용합니다. 실제 학생 계정과 개인정보를 운영할 때에는 Supabase Auth + RLS 연결 후 사용해야 합니다.
