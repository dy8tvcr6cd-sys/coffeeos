# CoffeeOS

CoffeeOS는 로스터리 발견, 원두 정보, 브루잉 실행, 센서리 기록, 취향 추천, 재방문 흐름을 연결하는 모바일 우선 커피 경험 프로토타입입니다.

## GPT 전달용 자료

임시 공유 링크가 열리지 않을 때는 아래 문서를 GPT에게 보내면 됩니다.

- [CoffeeOS GPT 전달용 자료](./docs/GPT_HANDOFF.md)

## ChatGPT 리뷰용 링크

Cloudflare 터널 링크는 외부 리뷰 환경에서 안정적으로 열리지 않을 수 있습니다. 안정적인 리뷰에는 Vercel 배포와 `/gpt` 리뷰 페이지를 사용합니다.

- 리뷰 페이지: `https://coffee-site-bice.vercel.app/gpt`
- GitHub 핸드오프 문서: [docs/GPT_HANDOFF.md](./docs/GPT_HANDOFF.md)
- 스크린샷 전달 가이드: [docs/SCREENSHOT_GUIDE.md](./docs/SCREENSHOT_GUIDE.md)
- 리뷰 manifest: [public/review-manifest.json](./public/review-manifest.json)
- 리뷰 스크린샷 폴더: [public/review-screenshots/](./public/review-screenshots/)

## 로컬 전용 로스터리 로고

실제 로스터리 로고 파일은 이 저장소에 커밋하지 않습니다.

비공개 로컬 프로토타입 테스트용으로만 `public/logos/` 폴더에 약속된 파일명으로 로고 이미지를 넣어 사용할 수 있습니다.
앱은 로컬에 있는 로고를 표시하고, 파일이 없으면 로스터리 이니셜 플레이스홀더를 보여줍니다.

공개 배포 전에는 반드시 로스터리가 승인하거나 직접 제공한 로고만 사용해야 합니다.

## 공유 링크 체크

앱에서 복사하는 QR URL은 `NEXT_PUBLIC_SITE_URL` 값이 있으면 그 배포 주소를 우선 사용합니다.

- 카톡에 바로 보낼 때는 배포 후 `https://배포주소/kakao` 링크를 사용합니다.
- 로컬 개발 주소(`localhost`, `127.0.0.1`)는 다른 사람의 기기에서 열리지 않습니다.
- `trycloudflare.com` 같은 임시 터널 주소는 터널이 끊기면 더 이상 열리지 않습니다.
- 로스터리 관리자에서 새로 추가한 원두는 현재 브라우저의 로컬 저장소에만 저장됩니다. 다른 기기에서 열려면 원두 데이터를 배포 데이터나 백엔드에 저장해야 합니다.
