const axios = require('axios');
const cheerio = require('cheerio');

// 랜덤 User-Agent 목록
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
];

// 랜덤 User-Agent 선택
const getRandomUserAgent = () => {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
};

exports.handler = async (event) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // 쿼리 파라미터에서 패키지명 추출
    const packageName = event.queryStringParameters.package_name;
    
    if (!packageName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Package name is required' })
      };
    }

    // 구글 플레이 스토어 URL
    const url = `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageName)}&hl=en`;
    
    // 랜덤 User-Agent 설정
    const requestHeaders = {
      'User-Agent': getRandomUserAgent(),
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Referer': 'https://www.google.com/'
    };

    // 구글 플레이 스토어 페이지 요청
    const response = await axios.get(url, { headers: requestHeaders });
    const html = response.data;
    
    // HTML 파싱
    const $ = cheerio.load(html);
    
    // 방법 1: Open Graph 이미지 메타 태그 확인
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ icon_url: ogImage })
      };
    }
    
    // 방법 2: 앱 아이콘 이미지 태그 찾기
    let iconUrl = null;
    
    // 앱 아이콘일 가능성이 높은 이미지 태그 찾기
    $('img').each((i, elem) => {
      const alt = $(elem).attr('alt');
      if (alt && (alt.toLowerCase().includes('icon') || alt.toLowerCase().includes('logo'))) {
        iconUrl = $(elem).attr('src');
        return false; // 찾았으면 루프 종료
      }
    });
    
    if (iconUrl) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ icon_url: iconUrl })
      };
    }
    
    // 방법 3: HTML에서 이미지 URL 패턴 찾기
    const matches = html.match(/(https?:\/\/play-lh\.googleusercontent\.com\/[^"'\s]+)/g);
    if (matches && matches.length > 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ icon_url: matches[0] })
      };
    }
    
    // 아이콘을 찾지 못한 경우
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'App icon not found' })
    };
    
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: `Failed to fetch app icon: ${error.message}` })
    };
  }
}; 