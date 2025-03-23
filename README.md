# Singular Attribution Debugger

Singular Attribution Debugger는 Singular 어트리뷰션 API를 간편하게 테스트하고 디버깅할 수 있는 도구입니다.

## 기능

- Singular 디바이스 디버깅 API 연동 (https://link.singular.net/api/v1/debug/device)
- API Key, Device ID, Keyspace 입력 폼
- 에러 처리 및 사용자 친화적인 메시지
- 다크모드 지원
- 로컬 저장 기능 (마지막 조회 결과 자동 저장/복원)
- 결과 정렬 기능 (오름차순/내림차순)
- 프록시 서버를 통한 CORS 이슈 해결
- 앱 아이콘 자동 로딩 (Play Store / App Store)
- 스토어 링크 바로가기 기능

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 빌드
npm run build
```

## 사용 방법

1. API Key를 입력합니다 (Singular 대시보드에서 확인)
2. Device ID를 입력합니다
3. Keyspace를 선택합니다 (idfa, android_advertising_id 등)
4. "조회하기" 버튼을 클릭합니다
5. 결과를 확인합니다

## 배포

이 애플리케이션은 Netlify를 통해 자동 배포됩니다.

- 배포 URL: https://peppy-pothos-aeba8b.netlify.app
- GitHub 저장소: https://github.com/skang1310/SingularTestingConsole

```bash
# Netlify에 배포
netlify deploy --prod
```

## CORS 이슈 해결 방법

이 애플리케이션은 내장 프록시 서버를 통해 Singular API 호출 시 발생할 수 있는 CORS 이슈를 해결합니다. `setupProxy.js` 파일이 프록시 설정을 담당하며, 클라이언트 코드에서는 `/api/singular` 경로로 요청을 보냅니다.

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
