# CoffeeOS 스크린샷 전달 가이드

이 문서는 ChatGPT가 라이브 링크를 열지 못할 때도 CoffeeOS의 실제 화면 흐름을 검토할 수 있도록 스크린샷을 준비하는 방법을 정리합니다.

## 1. 로컬 앱 실행

```bash
npm run dev
```

브라우저에서 안내된 로컬 주소를 엽니다. 보통 `http://localhost:3000` 또는 사용 가능한 다른 포트로 실행됩니다.

## 2. 주요 화면 열기

아래 화면을 순서대로 열어 스크린샷을 준비합니다.

- `/login`
- `/`
- `/beans`
- `/beans/peru-la-primavera-geisha-washed`
- `/beans/peru-la-primavera-geisha-washed/brew`
- `/beans/peru-la-primavera-geisha-washed/sensory`
- `/brew-diagnosis`
- `/my-recipes`
- `/roasteries`
- `/roasteries/kook-coffee-roasters`
- `/roastery-admin/login`
- `/roastery-admin/dashboard`

## 3. 맥북 스크린샷

화면 일부를 캡처할 때는 아래 단축키를 사용합니다.

```text
Command + Shift + 4
```

브라우저의 모바일 폭 화면이 잘 보이도록 CoffeeOS 앱 영역을 중심으로 캡처합니다.

## 4. 저장할 파일명

스크린샷은 아래 경로와 파일명으로 저장합니다.

```text
public/review-screenshots/01-login.png
public/review-screenshots/02-home.png
public/review-screenshots/03-beans-list.png
public/review-screenshots/04-bean-detail.png
public/review-screenshots/05-brew-timer.png
public/review-screenshots/06-sensory.png
public/review-screenshots/07-brew-diagnosis.png
public/review-screenshots/08-my-recipes.png
public/review-screenshots/09-roasteries.png
public/review-screenshots/10-roastery-detail.png
public/review-screenshots/11-roastery-admin-login.png
public/review-screenshots/12-roastery-admin-dashboard.png
```

이미지가 없으면 `/gpt` 페이지에는 “스크린샷이 아직 등록되지 않았습니다.”라는 안내 카드가 표시됩니다.

## 5. GitHub에 올리기

```bash
git add public/review-screenshots docs/SCREENSHOT_GUIDE.md
git commit -m "Add review screenshots"
git push
```

## 6. ChatGPT에게 전달할 문장

```text
아래 /gpt 페이지와 스크린샷을 기준으로 CoffeeOS를 검토해줘.
라이브 링크가 열리지 않으면 docs/GPT_HANDOFF.md, public/review-manifest.json, public/review-screenshots/ 폴더를 기준으로 제품 흐름과 UX를 리뷰해줘.
```
