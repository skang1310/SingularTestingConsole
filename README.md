# Singular Attribution Debugger

Singular Attribution Debugger는 Singular 어트리뷰션 API를 간편하게 테스트하고 디버깅할 수 있는 도구입니다.

## 기능

- Singular 디바이스 디버깅 API 연동 (https://link.singular.net/api/v1/debug/device)
- API Key, Device ID, Keyspace 입력 폼
- 에러 처리 및 사용자 친화적인 메시지
- 다크모드 지원
- 로컬 저장 기능 (마지막 조회 결과 자동 저장/복원)
- 이벤트 결과 정렬 기능 (오름차순/내림차순)
- 앱 아이콘 자동 로딩 (Play Store / App Store)
- 스토어 링크 바로가기 기능

## 실행

https://peppy-pothos-aeba8b.netlify.app/

## 사용 방법

1. API Key를 입력합니다 (Singular 대시보드에서 확인)
2. Keyspace를 선택합니다 (idfa, android_advertising_id 등)
3. Device ID를 입력합니다
4. "조회하기" 버튼을 클릭합니다
5. 결과를 확인합니다


## 스토어 아이콘 기능

- 조회 결과에 앱 이름 옆에 스토어 아이콘이 표시됩니다.
- Android 앱의 경우 Google Play 스토어 아이콘, iOS 앱의 경우 App Store 아이콘이 표시됩니다.
- 아이콘을 클릭하면 해당 앱의 스토어 페이지로 이동합니다.

## 기술 스택

- React.js
- Material UI
- Axios
- http-proxy-middleware (CORS 이슈 해결)
- Netlify (배포)
