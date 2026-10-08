# 학점은행제 정민쌤 홈페이지 — 배포 가이드

## 폴더 구성
```
index.html      메인
about.html      정민쌤 소개
hakjeom.html    학점은행제 안내
courses.html    과정 안내
reviews.html    수강생 후기
contact.html    상담 신청 (EmailJS 폼)
contact.js      상담 신청 발송 스크립트 (EmailJS 키 설정)
style.css       공용 디자인
script.js       공용 스크립트
```

## 1. 깃허브 배포 (GitHub Pages)
1. https://github.com 가입 → 우측 상단 **+ → New repository**
2. 저장소 이름 입력 (예: `edusolution`) → Public 선택 → Create
3. **uploading an existing file** 클릭 → 이 폴더의 파일 9개(README 포함)를 전부 드래그해서 업로드 → Commit changes
4. 저장소 **Settings → Pages** 메뉴
5. Branch를 `main` / `(root)` 로 선택 → Save
6. 1~2분 뒤 `https://아이디.github.io/edusolution/` 접속 확인

## 2. 상담폼 이메일 연결 (EmailJS, 무료)
1. https://www.emailjs.com 가입
2. **Email Services → Add New Service** → Gmail 등 상담 받을 메일 연결 → **Service ID** 확인
3. **Email Templates → Create New Template**
   - Subject: `[정민쌤] 새 상담 신청 - {{name}}`
   - To Email: 상담 받을 이메일 주소
   - Reply To: `{{email}}`
   - Content:
     ```
     이름: {{name}}
     연락처: {{phone}}
     희망 상담 방식: {{contact_method}}
     이메일: {{email}}
     관심 과정: {{course}}
     최종 학력: {{education}}
     문의 내용:
     {{message}}
     ```
   - 저장 후 **Template ID** 확인
4. **Account → General** 에서 **Public Key** 확인
5. `contact.js` 맨 위 3줄의 `YOUR_PUBLIC_KEY`, `YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID` 를 교체
6. (권장) EmailJS **Account → Security** 에서 허용 도메인에 사이트 주소 등록
   - 무료 플랜: 월 200건 발송 가능

## 3. 카카오톡 버튼 연결
`contact.html`의 카카오톡 버튼 링크(`https://open.kakao.com/o/...`)를
오픈채팅 주소가 바뀌면 함께 교체하세요.

## 4. 커스텀 도메인 (선택)
도메인 구매 후 (가비아 등) 저장소 Settings → Pages → Custom domain에
입력하고, 도메인 업체에서 안내하는 DNS 설정을 추가하면 됩니다.
