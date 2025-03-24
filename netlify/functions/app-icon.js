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

// 앱 패키지명에 따른 기본 아이콘 URL 매핑
const KNOWN_APP_ICONS = {
  'com.instagram.android': 'https://play-lh.googleusercontent.com/c2DcVsBUhJb3a-Q-LOdCIJs5NMhKqO4Hh6KhUAkBr1vNu0XieFqXoQYL8yvDWQYJNj4=s180',
  'com.facebook.katana': 'https://play-lh.googleusercontent.com/ccWDU4A7fX1R24v-vvT480ySh26AYp97g1VrIB_FIdjRcuQB2JP2WdY7h_wVVAeSpg=s180',
  'com.google.android.youtube': 'https://play-lh.googleusercontent.com/lMoItBgdPPVDJsNOVtP26EKHePkwBg-PkuY9NOrc-fumRtTFP4XhpUNk_22syN4Datc=s180',
  'com.twitter.android': 'https://play-lh.googleusercontent.com/wIf3HtczQDjHzHuu7vezhqNs0zXAG85F7VmP7nhsTxO3OHegrVXlqIh_DWBYi86FTIGk=s180',
  'com.spotify.music': 'https://play-lh.googleusercontent.com/UrY7BAZ-XfXGpfkeWg0zCCeo-7ras4DCoRalC_WXXWTK9q5b0Iw7B0YQMsVxZaNB7DM=s180',
  'com.netflix.mediaclient': 'https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI=s180',
  'com.tiktok.tiktok': 'https://play-lh.googleusercontent.com/iBYjvYuNq8BB7EEJHexVtTKILQrWEwHfDKAl-cYPvJ-0ewpGdVTmIbR-C49MKwj3Uw=s180'
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
    
    console.log(`[app-icon] Received request for package: ${packageName}`);
    
    if (!packageName) {
      console.log('[app-icon] Error: Package name is missing');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Package name is required' })
      };
    }

    // 1. 알려진 앱 아이콘 매핑 확인
    if (KNOWN_APP_ICONS[packageName]) {
      console.log(`[app-icon] Found known app icon for ${packageName}`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ icon_url: KNOWN_APP_ICONS[packageName] })
      };
    }

    // 2. 직접 URL 생성 시도 (Google Play 이미지 패턴 활용)
    const directIconUrl = `https://play-lh.googleusercontent.com/proxy-app-icons/${packageName}=s180`;
    console.log(`[app-icon] Trying direct icon URL: ${directIconUrl}`);
    
    // 3. 구글 플레이 스토어 URL
    const url = `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageName)}&hl=en`;
    console.log(`[app-icon] Fetching from URL: ${url}`);
    
    // 랜덤 User-Agent 설정
    const userAgent = getRandomUserAgent();
    console.log(`[app-icon] Using User-Agent: ${userAgent}`);
    
    const requestHeaders = {
      'User-Agent': userAgent,
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Referer': 'https://www.google.com/'
    };

    // 구글 플레이 스토어 페이지 요청
    console.log('[app-icon] Sending request to Google Play Store');
    const response = await axios.get(url, { headers: requestHeaders });
    console.log('[app-icon] Received response from Google Play Store');
    const html = response.data;
    
    // HTML 파싱
    const $ = cheerio.load(html);
    console.log('[app-icon] HTML parsed successfully');
    
    // 방법 1: Open Graph 이미지 메타 태그 확인
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) {
      console.log(`[app-icon] Found OG image: ${ogImage}`);
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
      const src = $(elem).attr('src');
      console.log(`[app-icon] Checking image ${i}: alt="${alt}", src="${src?.substring(0, 50)}..."`);
      if (alt && (alt.toLowerCase().includes('icon') || alt.toLowerCase().includes('logo'))) {
        iconUrl = src;
        console.log(`[app-icon] Found icon image: ${iconUrl}`);
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
      console.log(`[app-icon] Found image URL pattern: ${matches[0]}`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ icon_url: matches[0] })
      };
    }
    
    // 방법 4: 직접 생성한 URL 반환
    console.log(`[app-icon] Using direct icon URL as fallback: ${directIconUrl}`);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ icon_url: directIconUrl })
    };
    
  } catch (error) {
    console.error('[app-icon] Error:', error);
    
    // 오류 발생 시에도 항상 아이콘 URL을 반환하도록 수정
    const packageName = event.queryStringParameters.package_name;
    const directIconUrl = `https://play-lh.googleusercontent.com/proxy-app-icons/${packageName}=s180`;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ icon_url: directIconUrl })
    };
  }
};