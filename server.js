const express = require('express');
const path = require('path');
const app = express();

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'build')));

// 모든 요청에 대해 index.html 제공
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 환경 변수에서 포트 가져오기 또는 3000 기본값 사용
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 