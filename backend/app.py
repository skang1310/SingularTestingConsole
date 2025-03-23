from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import re
import time
import random
from urllib.parse import quote

app = Flask(__name__)
CORS(app)  # 모든 출처에서의 요청 허용

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
]

@app.route('/api/app-icon', methods=['GET'])
def get_app_icon():
    package_name = request.args.get('package_name')
    if not package_name:
        return jsonify({'error': 'Package name is required'}), 400
    
    # 요청 간 간격 설정 (구글의 속도 제한 방지)
    time.sleep(random.uniform(0.5, 1.5))
    
    # 구글 플레이 스토어 URL
    url = f"https://play.google.com/store/apps/details?id={quote(package_name)}&hl=en"
    
    try:
        # 랜덤 User-Agent 설정
        headers = {
            'User-Agent': random.choice(USER_AGENTS),
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml',
            'Referer': 'https://www.google.com/'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 방법 1: 앱 아이콘 메타 태그 확인
        meta_icon = soup.find('meta', property='og:image')
        if meta_icon and meta_icon.get('content'):
            return jsonify({'icon_url': meta_icon.get('content')})
        
        # 방법 2: 이미지 태그에서 앱 아이콘 찾기
        img_tags = soup.find_all('img')
        for img in img_tags:
            if img.get('alt') and ('icon' in img.get('alt').lower() or 'logo' in img.get('alt').lower()):
                if img.get('src'):
                    return jsonify({'icon_url': img.get('src')})
        
        # 방법 3: 일반적인 패턴의 이미지 URL 확인
        img_pattern = re.compile(r'(https?://play-lh\.googleusercontent\.com/[^"\s]+)')
        matches = img_pattern.findall(response.text)
        if matches:
            # 첫 번째 매치 반환
            return jsonify({'icon_url': matches[0]})
        
        return jsonify({'error': 'App icon not found'}), 404
    
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return jsonify({'error': f'Failed to fetch app details: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True) 