import React, { useState, useEffect, useMemo } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CssBaseline,
  IconButton,
  Alert,
  Snackbar,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Collapse,
  AppBar,
  Toolbar,
  useMediaQuery,
  Avatar,
  Badge,
  Chip,
  Zoom,
  Fade,
  Grow,
  Checkbox,
  useTheme
} from "@mui/material";
import { Container, createTheme, ThemeProvider } from "@mui/material";
import { 
  Brightness4, 
  Brightness7, 
  InfoOutlined,
  ArrowDropUp,
  ArrowDropDown,
  History,
  Delete,
  ExpandLess,
  ExpandMore,
  Fingerprint,
  Key,
  AppShortcut,
  Schedule,
  LocalOffer,
  Share,
  Apple,
  ShopTwo,
  Home,
  Launch,
  Language as LanguageIcon
} from "@mui/icons-material";
import axios from "axios";
import { keyframes } from '@mui/system';

/**
 * SingularDebugger 컴포넌트
 * 
 * Singular 어트리뷰션 데이터를 조회하고 표시하는 메인 컴포넌트입니다.
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.systemTheme - 시스템 테마 설정 ('dark' 또는 'light')
 * @returns {JSX.Element} SingularDebugger 컴포넌트
 */
export default function SingularDebugger({ systemTheme }) {
  // ===== 상태 변수 정의 =====
  
  // API 요청 관련 상태
  const [apiKey, setApiKey] = useState(""); // Singular API 키
  const [deviceId, setDeviceId] = useState(""); // 디바이스 ID
  const [keyspace, setKeyspace] = useState(""); // 키스페이스 (IDFA, AIFA 등)
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [result, setResult] = useState(null); // API 응답 결과
  const [error, setError] = useState(null); // 오류 메시지
  
  // UI 관련 상태
  const [darkMode, setDarkMode] = useState(() => {
    // 시스템 다크모드 설정 감지
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    // 로컬 스토리지에 저장된 사용자 설정 확인
    const savedPreference = localStorage.getItem('darkMode');
    // 저장된 설정이 있으면 그 값 사용, 없으면 시스템 설정 사용
    return savedPreference !== null ? savedPreference === 'true' : systemPrefersDark;
  });
  const [openSnackbar, setOpenSnackbar] = useState(false); // 스낵바 표시 여부
  const [snackbarMessage, setSnackbarMessage] = useState(""); // 스낵바 메시지
  const [sortField, setSortField] = useState("event_name"); // 정렬 필드
  const [sortDirection, setSortDirection] = useState("asc"); // 정렬 방향
  const [deviceIdError, setDeviceIdError] = useState(""); // 디바이스 ID 오류 메시지
  const [hasSearched, setHasSearched] = useState(false); // 검색 여부
  
  // 검색 히스토리 관련 상태
  const [searchHistory, setSearchHistory] = useState([]); // 검색 히스토리
  const [historyOpen, setHistoryOpen] = useState(false); // 히스토리 표시 여부
  
  // 테스트 및 앱 정보 관련 상태
  const [useMockData, setUseMockData] = useState(false); // 목업 데이터 사용 여부 (내부 테스트용)
  const [appName, setAppName] = useState(""); // 앱 이름
  const [appIcon, setAppIcon] = useState(null); // 앱 아이콘 URL
  const [appLongName, setAppLongName] = useState(""); // 앱 패키지명
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ko'); // 언어 설정
  const [logoIsLoading, setLogoIsLoading] = useState(true); // 로고 로딩 상태

  // 앱 아이콘 캐시 객체 - 한 번 불러온 아이콘을 저장하여 재사용
  const appIconCache = {};
  
  // ===== 다국어 지원 =====
  
  // 언어 관련 텍스트 객체
  const translations = {
    ko: {
      title: 'Testing Console',
      apiKeyLabel: 'API Key',
      deviceIdLabel: 'Device ID',
      keyspaceLabel: 'Keyspace',
      searchButton: '조회하기',
      noResults: '결과가 없습니다',
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      copySuccess: '복사되었습니다',
      sortAsc: '오름차순 정렬',
      sortDesc: '내림차순 정렬',
      touchData: '터치 정보',
      campaignData: '캠페인 정보',
      storeLink: '스토어에서 보기',
      appHeaderTitle: '앱 정보',
      queryParams: '쿼리 파라미터',
      returnToMain: '메인으로',
      returnToMainTooltip: '메인으로 돌아가기',
      historyTitle: '최근 검색 기록',
      installNetwork: '설치 네트워크',
      installTime: '설치 시간',
      infoMissing: '정보 없음',
      eventListTitle: '이벤트 목록',
      lastEvent: '최종 이벤트',
      totalRevenue: '총 수익',
      eventName: '이벤트명',
      eventCount: '횟수',
      firstEvent: '첫 이벤트',
      lastEventColumn: '마지막 이벤트',
      revenueLtv: '수익(LTV)',
      noEventData: '이벤트 데이터가 없습니다',
      notes: '참고 사항',
      requestFailed: '요청 실패',
      loadingData: '데이터 불러오는 중...',
      loadingFromApi: 'Singular API로부터 정보를 가져오고 있습니다',
      resultsShownHere: '결과가 여기에 표시됩니다',
      enterParamsInstruction: '왼쪽에서 파라미터를 입력하고 조회하기 버튼을 클릭하세요',
      checkApiKeyAndDevice: 'API 키와 디바이스 ID가 정확한지 확인하세요.',
      noSearchHistory: '검색 히스토리가 없습니다.',
      htmlResponseError: 'HTML 응답을 받았습니다. API 주소를 확인하세요.',
      keyspaceTooltip: '광고 ID 유형:\nIDFA: iOS 기기에서 사용 (Identifier for Advertisers)\nIDFV: iOS 기기에서 사용 (Identifier for Vendors)\nAIFA: Android 기기에서 사용, GAID라고도 함\nSDID: Singular Device ID - used for web tracking. You can read the Singular Device ID using singularSdk.getSingularDeviceId() after calling the init method.',
      allFields: 'API Key, Device ID, Keyspace를 모두 입력해주세요.',
      idFAUpperCase: 'IDFA/IDFV는 대문자로 입력해야 합니다.',
      gaIDLowerCase: 'AIFA(GAID)는 소문자로 입력해야 합니다.',
      appName: '앱 이름',
      selectKeyspace: '선택해주세요',
      androidDevice: 'Android',
      iOSDevice: 'iOS',
      footer: '2025 DK'
    },
    en: {
      title: 'Testing Console',
      apiKeyLabel: 'API Key',
      deviceIdLabel: 'Device ID',
      keyspaceLabel: 'Keyspace',
      searchButton: 'Search',
      noResults: 'No results',
      loading: 'Loading...',
      error: 'An error occurred',
      copySuccess: 'Copied',
      sortAsc: 'Sort Ascending',
      sortDesc: 'Sort Descending',
      touchData: 'Touch Data',
      campaignData: 'Campaign Data',
      storeLink: 'View in Store',
      appHeaderTitle: 'App Information',
      queryParams: 'Query Parameters',
      returnToMain: 'Back to Main',
      returnToMainTooltip: 'Return to main page',
      historyTitle: 'Recent Search History',
      installNetwork: 'Install Network',
      installTime: 'Install Time',
      infoMissing: 'No Information',
      eventListTitle: 'Event List',
      lastEvent: 'Last Event',
      totalRevenue: 'Total Revenue',
      eventName: 'Event Name',
      eventCount: 'Count',
      firstEvent: 'First Event',
      lastEventColumn: 'Last Event',
      revenueLtv: 'Revenue (LTV)',
      noEventData: 'No event data available',
      notes: 'Notes',
      requestFailed: 'Request Failed',
      loadingData: 'Loading data...',
      loadingFromApi: 'Fetching information from Singular API',
      resultsShownHere: 'Results will be displayed here',
      enterParamsInstruction: 'Enter parameters on the left and click the search button',
      checkApiKeyAndDevice: 'Check that your API Key and Device ID are correct.',
      noSearchHistory: 'No search history.',
      htmlResponseError: 'Received HTML response. Please check the API address.',
      keyspaceTooltip: 'The type of advertising ID:\nIDFA: Used in iOS devices (Identifier for Advertisers)\nIDFV: Used in iOS devices (Identifier for Vendors)\nAIFA: Used in Android devices, also known as GAID\nSDID: Singular Device ID - used for web tracking. You can read the Singular Device ID using singularSdk.getSingularDeviceId() after calling the init method.',
      allFields: 'Please enter API Key, Device ID, and Keyspace.',
      idFAUpperCase: 'IDFA/IDFV should be entered in uppercase.',
      gaIDLowerCase: 'AIFA(GAID) should be entered in lowercase.',
      appName: 'App Name',
      selectKeyspace: 'Please select',
      androidDevice: 'Android',
      iOSDevice: 'iOS',
      footer: '2025 DK'
    },
    zh: {
      title: 'Singular 归因调试器',
      apiKeyLabel: 'API 密钥',
      deviceIdLabel: '设备 ID',
      keyspaceLabel: '键空间',
      searchButton: '搜索',
      noResults: '没有结果',
      loading: '加载中...',
      error: '发生错误',
      copySuccess: '已复制',
      sortAsc: '升序排序',
      sortDesc: '降序排序',
      touchData: '触点数据',
      campaignData: '活动数据',
      storeLink: '在商店中查看',
      appHeaderTitle: '应用信息',
      queryParams: '查询参数',
      returnToMain: '返回主页',
      returnToMainTooltip: '返回主页',
      historyTitle: '最近搜索历史',
      installNetwork: '安装网络',
      installTime: '安装时间',
      infoMissing: '无信息',
      eventListTitle: '事件列表',
      lastEvent: '最后事件',
      totalRevenue: '总收入',
      eventName: '事件名称',
      eventCount: '次数',
      firstEvent: '首次事件',
      lastEventColumn: '最后事件',
      revenueLtv: '收入(LTV)',
      noEventData: '没有可用的事件数据',
      notes: '注意事项',
      requestFailed: '请求失败',
      loadingData: '加载数据中...',
      loadingFromApi: '从 Singular API 获取信息',
      resultsShownHere: '结果将显示在这里',
      enterParamsInstruction: '在左侧输入参数并点击搜索按钮',
      checkApiKeyAndDevice: '请检查您的 API 密钥和设备 ID 是否正确。',
      noSearchHistory: '没有搜索历史。',
      htmlResponseError: '收到 HTML 响应。请检查 API 地址。',
      keyspaceTooltip: '广告 ID 类型:\nIDFA: 用于 iOS 设备 (广告商标识符)\nIDFV: 用于 iOS 设备 (供应商标识符)\nAIFA: 用于 Android 设备，也称为 GAID\nSDID: Singular 设备 ID - 用于网络跟踪。您可以在调用 init 方法后使用 singularSdk.getSingularDeviceId() 读取 Singular 设备 ID。',
      allFields: '请输入 API 密钥、设备 ID 和键空间。',
      idFAUpperCase: 'IDFA/IDFV 应该使用大写字母输入。',
      gaIDLowerCase: 'AIFA(GAID) 应该使用小写字母输入。',
      appName: '应用名称',
      selectKeyspace: '请选择',
      androidDevice: 'Android',
      iOSDevice: 'iOS',
      footer: '2025 DK'
    }
  };

  // 현재 선택된 언어에 대한 번역 텍스트
  const t = translations[language];

  // 모바일 화면 여부 감지
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * 다크 모드 토글 함수
   * 다크 모드를 켜거나 끄고 설정을 로컬 스토리지에 저장합니다.
   */
  const toggleDarkMode = () => {  
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };
  
  /**
   * 히스토리 토글 함수
   * 검색 히스토리 표시를 켜거나 끕니다.
   */
  const toggleHistory = () => setHistoryOpen(!historyOpen);

  // ===== 생명주기 함수 =====
  
  /**
   * 컴포넌트 마운트 시 실행되는 효과
   * 페이지 새로고침 시 로컬 스토리지 데이터를 초기화하고 저장된 히스토리를 불러옵니다.
   */
  useEffect(() => {
    // 페이지 새로고침 시 localStorage 데이터 초기화
    localStorage.removeItem("singular_result");
    setResult(null);
    setHasSearched(false);
    
    // 저장된 히스토리 불러오기
    const savedHistory = localStorage.getItem("singular_history");
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("히스토리 불러오기 오류:", e);
        setSearchHistory([]);
      }
    }
  }, []);

  /**
   * 결과 변경 시 실행되는 효과
   * API 응답 결과를 로컬 스토리지에 저장합니다.
   */
  useEffect(() => {
    if (result) {
      localStorage.setItem("singular_result", JSON.stringify(result));
    }
  }, [result]);

  /**
   * 시스템 테마 변경 시 실행되는 효과
   * 시스템 테마에 따라 다크 모드를 설정합니다.
   */
  useEffect(() => {
    if (systemTheme) {
      setDarkMode(systemTheme === 'dark');
    }
  }, [systemTheme]);

  /**
   * 디바이스 ID 유효성 검사 함수
   * 키스페이스에 따라 디바이스 ID 형식이 올바른지 확인합니다.
   * 
   * @returns {boolean} 유효성 검사 결과
   */
  const validateDeviceId = () => {
    if (!deviceId || !keyspace) return true;
    
    if ((keyspace === "idfa" || keyspace === "idfv") && deviceId !== deviceId.toUpperCase()) {
      setDeviceIdError(t.idFAUpperCase);
      return false;
    }
    
    if (keyspace === "android_advertising_id" && deviceId !== deviceId.toLowerCase()) {
      setDeviceIdError(t.gaIDLowerCase);
      return false;
    }
    
    setDeviceIdError("");
    return true;
  };
  
  /**
   * 디바이스 ID 변경 처리 함수
   * 디바이스 ID 입력값이 변경될 때 호출되며, 즉시 유효성을 검사합니다.
   * 
   * @param {Object} e - 이벤트 객체
   */
  const handleDeviceIdChange = (e) => {
    const newDeviceId = e.target.value;
    setDeviceId(newDeviceId);
    
    // 즉시 검증
    if (keyspace === "idfa" || keyspace === "idfv") {
      if (newDeviceId !== newDeviceId.toUpperCase()) {
        setDeviceIdError(t.idFAUpperCase);
      } else {
        setDeviceIdError("");
      }
    } else if (keyspace === "android_advertising_id") {
      if (newDeviceId !== newDeviceId.toLowerCase()) {
        setDeviceIdError(t.gaIDLowerCase);
      } else {
        setDeviceIdError("");
      }
    }
  };
  
  /**
   * 키스페이스 변경 처리 함수
   * 키스페이스 선택이 변경될 때 호출되며, 디바이스 ID의 유효성을 다시 검사합니다.
   * 
   * @param {Object} e - 이벤트 객체
   */
  const handleKeyspaceChange = (e) => {
    const newKeyspace = e.target.value;
    setKeyspace(newKeyspace);
    
    // 키스페이스 변경 시 디바이스 ID 검증
    if (deviceId) {
      if ((newKeyspace === "idfa" || newKeyspace === "idfv") && deviceId !== deviceId.toUpperCase()) {
        setDeviceIdError(t.idFAUpperCase);
      } else if (newKeyspace === "android_advertising_id" && deviceId !== deviceId.toLowerCase()) {
        setDeviceIdError(t.gaIDLowerCase);
      } else {
        setDeviceIdError("");
      }
    }
  };

  /**
   * 앱 아이콘 가져오기 함수
   * 앱 패키지명을 기반으로 앱 아이콘을 가져옵니다.
   * 여러 단계의 폴백 메커니즘을 통해 항상 아이콘이 표시되도록 합니다.
   */
  const fetchAppIcon = async () => {
    try {
      setLogoIsLoading(true);
      
      // 앱 패키지명이 없는 경우 기본 아이콘 사용
      if (!appLongName) {
        console.log('앱 패키지명이 없어 아이콘을 가져올 수 없습니다.');
        setLogoIsLoading(false);
        // 앱 패키지명이 없을 경우 로컬 스마트폰 앱 아이콘 사용
        setAppIcon('/app-icon.png');
        return;
      }

      // 캐시된 아이콘이 있는 경우 사용 (가장 빠름)
      if (appIconCache[appLongName]) {
        console.log(`캐시된 앱 아이콘 사용: ${appLongName}`);
        setAppIcon(appIconCache[appLongName]);
        setLogoIsLoading(false);
        return;
      }

      console.log(`앱 아이콘 가져오기 시작: ${appLongName}`);
      
      // 인기 앱 패키지명에 따른 직접 아이콘 URL 매핑
      const popularAppIcons = {
        'com.instagram.android': 'https://play-lh.googleusercontent.com/c2DcVsBUhJb3a-Q-LOdCIJs5NMhKqO4Hh6KhUAkBr1vNu0XieFqXoQYL8yvDWQYJNj4=s180',
        'com.facebook.katana': 'https://play-lh.googleusercontent.com/ccWDU4A7fX1R24v-vvT480ySh26AYp97g1VrIB_FIdjRcuQB2JP2WdY7h_wVVAeSpg=s180',
        'com.google.android.youtube': 'https://play-lh.googleusercontent.com/lMoItBgdPPVDJsNOVtP26EKHePkwBg-PkuY9NOrc-fumRtTFP4XhpUNk_22syN4Datc=s180',
        'com.twitter.android': 'https://play-lh.googleusercontent.com/wIf3HtczQDjHzHuu7vezhqNs0zXAG85F7VmP7nhsTxO3OHegrVXlqIh_DWBYi86FTIGk=s180',
        'com.spotify.music': 'https://play-lh.googleusercontent.com/UrY7BAZ-XfXGpfkeWg0zCCeo-7ras4DCoRalC_WXXWTK9q5b0Iw7B0YQMsVxZaNB7DM=s180',
        'com.netflix.mediaclient': 'https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI=s180',
        'com.tiktok.tiktok': 'https://play-lh.googleusercontent.com/iBYjvYuNq8BB7EEJHexVtTKILQrWEwHfDKAl-cYPvJ-0ewpGdVTmIbR-C49MKwj3Uw=s180'
      };
      
      // 1. 알려진 인기 앱인 경우 직접 아이콘 URL 사용 (가장 빠름)
      if (popularAppIcons[appLongName]) {
        console.log(`인기 앱 아이콘 발견: ${appLongName}`);
        const iconUrl = popularAppIcons[appLongName];
        setAppIcon(iconUrl);
        appIconCache[appLongName] = iconUrl; // 캐시에 저장
        setLogoIsLoading(false);
        return;
      }
      
      // 2. 직접 URL 생성 (빠름)
      const directIconUrl = `https://play-lh.googleusercontent.com/proxy-app-icons/${appLongName}=s180`;
      
      // 먼저 직접 생성한 URL을 사용하여 UI를 빠르게 업데이트
      setAppIcon(directIconUrl);
      
      // 3. 백그라운드에서 Netlify 함수를 통해 더 정확한 앱 아이콘 가져오기 시도
      fetch(`/.netlify/functions/app-icon?package_name=${encodeURIComponent(appLongName)}`)
        .then(response => {
          console.log('앱 아이콘 API 응답:', response.status, response.statusText);
          if (!response.ok) {
            throw new Error(`Failed to fetch app icon: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('앱 아이콘 데이터:', data);
          if (data && data.icon_url) {
            console.log('앱 아이콘 URL 설정:', data.icon_url);
            setAppIcon(data.icon_url);
            appIconCache[appLongName] = data.icon_url; // 캐시에 저장
          }
        })
        .catch(error => {
          console.error("API 호출 오류:", error);
          // API 호출 실패 시 이미 설정된 directIconUrl 유지
          appIconCache[appLongName] = directIconUrl; // 캐시에 저장
        })
        .finally(() => {
          setLogoIsLoading(false);
        });
      
    } catch (error) {
      console.error("앱 아이콘 가져오기 오류:", error);
      // 모든 오류 발생 시 로컬 스마트폰 앱 아이콘 사용
      setAppIcon('/app-icon.png');
      setLogoIsLoading(false);
    }
  };

  // 앱 헤더 렌더링 함수
  const renderAppHeader = () => {
    if (!result || !result[0]) return null;
    
    const appData = result[0];
    const { app_name, app_long_name, app_store_link } = appData;
    
    return (
      <Card sx={{ mb: 2, mt: 2, overflow: 'visible' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              src={appIcon} 
              alt={app_name || t.appName} 
              sx={{ 
                width: 60, 
                height: 60, 
                mr: 2,
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} 
              variant="rounded"
              onError={(e) => {
                console.log('앱 아이콘 로딩 실패:', e.target.src);
                // 이미지 로딩 실패 시 로컬 스마트폰 앱 아이콘 제공
                e.target.onerror = null; // 무한 루프 방지
                e.target.src = '/app-icon.png';
              }}
            />
            <Box>
              <Typography variant="h6" component="div">
                {app_name || t.infoMissing}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                {app_long_name || t.infoMissing}
              </Typography>
              {app_store_link && (
                <Button 
                  size="small" 
                  startIcon={keyspace === 'android_advertising_id' ? <ShopTwo /> : <Apple />}
                  href={app_store_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 1 }}
                >
                  {t.storeLink}
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  /**
   * Singular API를 통해 어트리뷰션 데이터를 가져오는 함수
   * API 키, 디바이스 ID, 키스페이스를 사용하여 Singular API에 요청을 보냅니다.
   */
  const fetchAttribution = async () => {
    // 필수 필드 검증
    if (!apiKey || !deviceId || !keyspace) {
      setSnackbarMessage(t.allFields);
      setOpenSnackbar(true);
      return;
    }
    
    // 디바이스 ID 형식 검증
    if (!validateDeviceId()) {
      setOpenSnackbar(true);
      setSnackbarMessage(deviceIdError);
      return;
    }

    // 로딩 상태 설정 및 이전 결과 초기화
    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    // 디바이스 ID 형식 처리 (iOS는 대문자, Android는 소문자)
    let formattedDeviceId = deviceId;
    if (keyspace === "idfa" || keyspace === "idfv") {
      formattedDeviceId = deviceId.toUpperCase();
    } else if (keyspace === "android_advertising_id") {
      formattedDeviceId = deviceId.toLowerCase();
    }
    
    // 키스페이스 API 형식으로 변환 (android_advertising_id는 AIFA로 변경)
    let apiKeyspace = keyspace.toUpperCase();
    if (keyspace === "android_advertising_id") {
      apiKeyspace = "AIFA";
    }
    
    // 테스트 모드 처리 (목업 데이터 사용)
    if (useMockData || deviceId === "test" || deviceId === "테스트") {
      setTimeout(() => {
        setResult(mockData);
        
        // 검색 히스토리에 추가
        addToSearchHistory(formattedDeviceId, keyspace, mockData);

        // 앱 아이콘 가져오기
        const appData = mockData[0];
        const { app_long_name } = appData;
        setAppLongName(app_long_name);
        fetchAppIcon();
        
        setLoading(false);
      }, 1000);
      return;
    }
    
    // Singular API URL 생성
    const singularApiUrl = `https://api.singular.net/api/attribution/attribution_details?api_key=${apiKey}&device_id=${formattedDeviceId}&keyspace=${apiKeyspace}`;

    try {
      // CORS 이슈 해결을 위한 프록시 서비스 목록
      const corsProxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(singularApiUrl)}`,
        `https://cors-anywhere.herokuapp.com/${singularApiUrl}`,
        `https://corsproxy.io/?${encodeURIComponent(singularApiUrl)}`,
        `https://proxy.cors.sh/${singularApiUrl}`
      ];
      
      console.log("다양한 CORS 프록시를 통한 API 요청 시작");
      
      let response = null;
      let error = null;
      
      // 프록시 순차적으로 시도
      for (const proxyUrl of corsProxies) {
        try {
          console.log(`프록시 시도: ${proxyUrl}`);
          response = await axios.get(proxyUrl, {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json',
              'x-requested-with': 'XMLHttpRequest'
            }
          });
          
          if (response.status === 200) {
            console.log(`프록시 성공: ${proxyUrl}`);
            break;
          }
        } catch (e) {
          console.error(`프록시 실패: ${proxyUrl}`, e);
          error = e;
        }
      }
      
      // 모든 프록시 요청 실패 시 오류 발생
      if (!response) {
        throw error || new Error("모든 CORS 프록시 요청이 실패했습니다.");
      }
      
      console.log("CORS 프록시 응답 수신:", response.status);
      
      // 응답 데이터 처리: allOrigins 형식 또는 직접 응답
      let actualData;
      if (response.data && response.data.contents) {
        // allOrigins 형식 응답
        try {
          actualData = JSON.parse(response.data.contents);
        } catch (parseErr) {
          console.error("JSON 파싱 오류:", parseErr);
          throw new Error("응답 데이터 파싱 오류: " + parseErr.message);
        }
      } else if (response.data) {
        // 직접 응답
        actualData = response.data;
      } else {
        throw new Error("응답에 유효한 데이터가 없습니다.");
      }
      
      // 결과 설정
      setResult(actualData);
      
      // 검색 히스토리에 추가
      addToSearchHistory(formattedDeviceId, keyspace, actualData);

      // 앱 아이콘 가져오기
      const appData = actualData[0];
      const { app_long_name } = appData;
      setAppLongName(app_long_name);
      fetchAppIcon();
      
    } catch (err) {
      console.error("API 요청 오류:", err);
      setError({ 
        message: "API 요청 실패", 
        detail: err.message || "요청이 실패했습니다." 
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * 검색 히스토리에 항목을 추가하는 함수
   * 
   * @param {string} formattedDeviceId - 형식이 적용된 디바이스 ID
   * @param {string} keyspace - 키스페이스
   * @param {Object} data - API 응답 데이터
   */
  const addToSearchHistory = (formattedDeviceId, keyspace, data) => {
    // 히스토리 항목 생성
    const historyItem = {
      apiKey,
      deviceId: formattedDeviceId,
      keyspace,
      timestamp: new Date().toISOString(),
      result: data
    };
    
    // 중복 제거: 동일한 keyspace와 deviceId를 가진 항목 필터링
    const filteredHistory = searchHistory.filter(
      item => !(item.keyspace === keyspace && item.deviceId === formattedDeviceId)
    );
    
    // 최신 항목 추가 및 최대 10개 유지
    const updatedHistory = [historyItem, ...filteredHistory.slice(0, 9)];
    setSearchHistory(updatedHistory);
    localStorage.setItem("singular_history", JSON.stringify(updatedHistory));
  };

  /**
   * 스낵바 닫기 함수
   */
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // 키스페이스 툴팁 텍스트
  const keyspaceTooltip = t.keyspaceTooltip;

  /**
   * 테마 설정
   * 다크 모드 여부에 따라 Material UI 테마를 생성합니다.
   */
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: darkMode ? '#0a0e16' : '#f5f5f5',
        paper: darkMode ? '#151d2a' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#1a1a2e',
        secondary: darkMode ? '#b0b0b0' : '#666666',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'all 0.3s ease',
          },
        },
      },
    },
  }), [darkMode]);

  // Singular 로고 Base64 인코딩 (로고 이미지를 직접 소스 코드에 포함)
  const singularLogoBase64 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvfg-L9ImP6SiqLRxJc03e_jSvaR25KybCHw&s";
  
  // Singular 아이콘 Base64 인코딩
  const singularIconBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggZD0iTTEwLjQgMTEuMkMxMC40IDE3LjUgMCAxNy4zIDAgMjMuN2MwIDQuNCAzIDYuMiA2LjMgNi4yIDUuNCAwIDguNy00LjEgOC43LTlWN2g1LjF2MTMuOWMwIDEwLjEtNy42IDE0LTQuOSAyMy4xLTEuOS0uNi0xNC00LjQtMTQtMTNDMS4zIDIzLjcgMTEgMTQuNCAxMiAxMS4yYzAtMi42LTEuNi0zLTkuMy0yQzMuMiAxLjMgMTEuNSAwIDE2LjEgMGM0LjUgMCA3LjYgMi44IDcuNiA2LjIgMCAzLTIgNS01IDVzLTYtMi42LTYtNS4ydjUuMmMwIDIuNyAyLjIgNC45IDQuOSA0LjlzNS0yLjIgNS00LjlWMEgyNlY2SDEwLjQiIGZpbGw9IiMwMDM5Y2IiLz48L3N2Zz4=";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        transition: 'background-color 0.3s ease'
      }}>
        <AppBar 
          position="static" 
          color="primary"
          elevation={0}
          sx={{ 
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary
          }}
        >
          <Toolbar>
            <Box 
              component="div" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                flexGrow: 1,
                cursor: 'pointer' 
              }}
              onClick={() => {
                // 홈으로 이동 (페이지 새로고침)
                window.location.href = '/';
              }}
            >
              <img 
                src={singularIconBase64} 
                alt="Singular Logo" 
                style={{ 
                  height: '30px', 
                  marginRight: '10px',
                  filter: darkMode ? 'brightness(0.8)' : 'none'
                }} 
              />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  flexGrow: 1,
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
                }}
              >
                {t.title}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={toggleDarkMode} 
                color="inherit" 
                sx={{ 
                  ml: 1, 
                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                  }
                }}
                aria-label="toggle dark mode"
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <FormControl variant="standard" sx={{ ml: 2, minWidth: 80 }}>
                <Select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    localStorage.setItem('language', e.target.value);
                  }}
                  sx={{ 
                    color: darkMode ? '#fff' : '#333',
                    '&:before': { borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                    '&:after': { borderColor: darkMode ? '#fff' : '#333' },
                  }}
                >
                  <MenuItem value="ko">한국어</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="zh">简体中文</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Toolbar>
        </AppBar>
        {/* ... */}
      </Box>
    </ThemeProvider>
  );
}