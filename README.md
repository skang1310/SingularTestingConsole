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

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

## 사용 방법

1. API Key를 입력합니다 (Singular 대시보드에서 확인)
2. Device ID를 입력합니다
3. Keyspace를 선택합니다 (idfa, android_advertising_id 등)
4. "조회하기" 버튼을 클릭합니다
5. 결과를 확인합니다

## CORS 이슈 해결 방법

이 애플리케이션은 내장 프록시 서버를 통해 Singular API 호출 시 발생할 수 있는 CORS 이슈를 해결합니다. `setupProxy.js` 파일이 프록시 설정을 담당하며, 클라이언트 코드에서는 `/api/singular` 경로로 요청을 보냅니다.

## 기술 스택

- React.js
- Material UI
- Axios
- http-proxy-middleware (CORS 이슈 해결) 