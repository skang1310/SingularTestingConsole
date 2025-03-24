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

export default function SingularDebugger({ systemTheme }) {
  const [apiKey, setApiKey] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [keyspace, setKeyspace] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    // 시스템 다크모드 설정 감지
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    // 로컬 스토리지에 저장된 사용자 설정 확인
    const savedPreference = localStorage.getItem('darkMode');
    // 저장된 설정이 있으면 그 값 사용, 없으면 시스템 설정 사용
    return savedPreference !== null ? savedPreference === 'true' : systemPrefersDark;
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [sortField, setSortField] = useState("event_name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [deviceIdError, setDeviceIdError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [useMockData, setUseMockData] = useState(false); // 내부 테스트용 (UI에서는 숨김 처리)
  const [appName, setAppName] = useState("");
  const [appIcon, setAppIcon] = useState(null);
  const [appLongName, setAppLongName] = useState("");
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ko');
  const [logoIsLoading, setLogoIsLoading] = useState(true);

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
  const singularIconBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggZD0iTTEwLjQgMTEuMkMxMC40IDE3LjUgMCAxNy4zIDAgMjMuN2MwIDQuNCAzIDYuMiA2LjMgNi4yIDUuNCAwIDguNy00LjEgOC43LTlVN2g1LjF2MTMuOWMwIDEwLjEtNy42IDE0LTQuOSAyMy4xLTEuOS0uNi0xNC00LjQtMTQtMTNDMS4zIDIzLjcgMTEgMTQuNCAxMiAxMS4yYzAtMi42LTEuNi0zLTkuMy0yQzMuMiAxLjMgMTEuNSAwIDE2LjEgMGM0LjUgMCA3LjYgMi44IDcuNiA2LjIgMCAzLTIgNS01IDVzLTYtMi42LTYtNS4ydjUuMmMwIDIuNyAyLjIgNC45IDQuOSA0LjlzNS0yLjIgNS00LjlWMEgyNlY2SDEwLjQiIGZpbGw9IiMwMDM5Y2IiLz48L3N2Zz4=";

  // 언어 관련 텍스트 객체
  const translations = {
    ko: {
      title: 'Singular 어트리뷰션 디버거',
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
      title: 'Singular Attribution Debugger',
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

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Toggle dark mode and save preference to localStorage
  const toggleDarkMode = () => {  
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };
  const toggleHistory = () => setHistoryOpen(!historyOpen);

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

  useEffect(() => {
    if (result) {
      localStorage.setItem("singular_result", JSON.stringify(result));
    }
  }, [result]);

  useEffect(() => {
    if (systemTheme) {
      setDarkMode(systemTheme === 'dark');
    }
  }, [systemTheme]);

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

  const fetchAppIcon = async () => {
    try {
      setLogoIsLoading(true);
      
      if (!appLongName) {
        console.log('앱 패키지명이 없어 아이콘을 가져올 수 없습니다.');
        setLogoIsLoading(false);
        // 앱 패키지명이 없을 경우 로컬 스마트폰 앱 아이콘 사용
        setAppIcon('/app-icon.png');
        return;
      }

      console.log(`앱 아이콘 가져오기 시작: ${appLongName}`);
      
      try {
        // Use the Netlify function to fetch the app icon
        const response = await fetch(`/.netlify/functions/app-icon?package_name=${encodeURIComponent(appLongName)}`);
        
        console.log('앱 아이콘 API 응답:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch app icon: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('앱 아이콘 데이터:', data);
        
        if (data && data.icon_url) {
          console.log('앱 아이콘 URL 설정:', data.icon_url);
          setAppIcon(data.icon_url);
        } else {
          throw new Error('No icon URL in response');
        }
      } catch (fetchError) {
        console.error("API 호출 오류:", fetchError);
        // API 호출 실패 시 로컬 스마트폰 앱 아이콘 사용
        setAppIcon('/app-icon.png');
      }
      
      setLogoIsLoading(false);
    } catch (error) {
      console.error("앱 아이콘 가져오기 오류:", error);
      // 오류 발생 시 로컬 스마트폰 앱 아이콘 사용
      setAppIcon('/app-icon.png');
      setLogoIsLoading(false);
    }
  };

  const fetchAttribution = async () => {
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

    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    // 실제 API URL 생성 - 대소문자 처리
    let formattedDeviceId = deviceId;
    if (keyspace === "idfa" || keyspace === "idfv") {
      formattedDeviceId = deviceId.toUpperCase();
    } else if (keyspace === "android_advertising_id") {
      formattedDeviceId = deviceId.toLowerCase();
    }
    
    // keyspace 값 처리 - android_advertising_id일 경우 AIFA로 변경
    let apiKeyspace = keyspace.toUpperCase();
    if (keyspace === "android_advertising_id") {
      apiKeyspace = "AIFA";
    }
    
    // 테스트 모드일 경우 목업 데이터 사용
    if (useMockData || deviceId === "test" || deviceId === "테스트") {
      setTimeout(() => {
        setResult(mockData);
        
        // 검색 히스토리에 추가
        const historyItem = {
          apiKey,
          deviceId: formattedDeviceId,
          keyspace,
          timestamp: new Date().toISOString(),
          result: mockData
        };
        
        // 중복 제거: 동일한 keyspace와 deviceId를 가진 항목 필터링
        const filteredHistory = searchHistory.filter(
          item => !(item.keyspace === keyspace && item.deviceId === formattedDeviceId)
        );
        
        // 최신 항목 추가 및 최대 10개 유지
        const updatedHistory = [historyItem, ...filteredHistory.slice(0, 9)];
        setSearchHistory(updatedHistory);
        localStorage.setItem("singular_history", JSON.stringify(updatedHistory));

        // 앱 아이콘 가져오기
        const appData = mockData[0];
        const { app_long_name } = appData;
        setAppLongName(app_long_name);
        fetchAppIcon();
        
        setLoading(false);
      }, 1000);
      return;
    }
    
    const singularApiUrl = `https://api.singular.net/api/attribution/attribution_details?api_key=${apiKey}&device_id=${formattedDeviceId}&keyspace=${apiKeyspace}`;

    try {
      // 다양한 CORS 프록시 서비스 시도
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
      
      setResult(actualData);
      
      // 검색 히스토리에 추가
      const historyItem = {
        apiKey,
        deviceId: formattedDeviceId,
        keyspace,
        timestamp: new Date().toISOString(),
        result: actualData
      };
      
      // 중복 제거: 동일한 keyspace와 deviceId를 가진 항목 필터링
      const filteredHistory = searchHistory.filter(
        item => !(item.keyspace === keyspace && item.deviceId === formattedDeviceId)
      );
      
      // 최신 항목 추가 및 최대 10개 유지
      const updatedHistory = [historyItem, ...filteredHistory.slice(0, 9)];
      setSearchHistory(updatedHistory);
      localStorage.setItem("singular_history", JSON.stringify(updatedHistory));

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

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const keyspaceTooltip = t.keyspaceTooltip;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedEvents = (events) => {
    if (!events || !Array.isArray(events)) return [];
    
    return [...events].sort((a, b) => {
      let valueA, valueB;
      
      switch (sortField) {
        case "event_name":
          valueA = a.event_name || "";
          valueB = b.event_name || "";
          break;
        case "event_count":
          valueA = a.event_count || 0;
          valueB = b.event_count || 0;
          break;
        case "first_event_time":
          valueA = a.first_event_time ? new Date(a.first_event_time).getTime() : 0;
          valueB = b.first_event_time ? new Date(b.first_event_time).getTime() : 0;
          break;
        case "last_event_time":
          valueA = a.last_event_time ? new Date(a.last_event_time).getTime() : 0;
          valueB = b.last_event_time ? new Date(b.last_event_time).getTime() : 0;
          break;
        case "revenue_ltv":
          valueA = a.revenue_ltv || 0;
          valueB = b.revenue_ltv || 0;
          break;
        default:
          return 0;
      }
      
      if (typeof valueA === 'string') {
        const comparison = valueA.localeCompare(valueB);
        return sortDirection === "asc" ? comparison : -comparison;
      } else {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }
    });
  };

  const renderExcelTable = () => {
    if (!result || !Array.isArray(result) || result.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {t.noResults}
          </Typography>
        </Box>
      );
    }

    const appData = result[0];
    const { app_name, app_long_name, install_info } = appData;
    const events = appData.events || [];
    const sortedEvents = getSortedEvents(events);

    // 플랫폼 판별 (iOS 또는 Android)
    const isIos = keyspace === 'idfa' || keyspace === 'idfv';
    
    // 총 수익 계산
    const totalRevenue = events.reduce((total, event) => total + (event.revenue_ltv || 0), 0);

    // 마지막 이벤트 찾기
    const lastEvent = sortedEvents.length > 0 
      ? sortedEvents.reduce((latest, event) => {
          if (!latest.last_event_time) return event;
          if (!event.last_event_time) return latest;
          return new Date(event.last_event_time) > new Date(latest.last_event_time) ? event : latest;
        }, { last_event_time: null })
      : null;

    const SortableTableHeader = ({ field, label }) => {
      const isActive = sortField === field;
      
      return (
        <TableCell 
          onClick={() => handleSort(field)}
          sx={{ 
            cursor: 'pointer',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.main',
            },
            textAlign: 'center'
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            {label}
            <Box ml={0.5} display="flex" alignItems="center">
              {isActive ? (
                sortDirection === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
              ) : (
                <Box sx={{ width: 24, height: 24 }} />
              )}
            </Box>
          </Box>
        </TableCell>
      );
    };

    return (
      <>
        <Box sx={{ mb: 3, p: 2, bgcolor: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'background.default', borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={1} sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
                {appIcon ? (
                  <Box 
                    component="img" 
                    src={appIcon} 
                    alt={app_name} 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '12px', 
                      mr: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }} 
                    onError={(e) => {
                      console.log('앱 아이콘 로딩 실패:', e.target.src);
                      // 이미지 로딩 실패 시 로컬 스마트폰 앱 아이콘 제공
                      e.target.onerror = null; // 무한 루프 방지
                      e.target.src = '/app-icon.png';
                    }}
                  />
                ) : (
                  <Avatar 
                    sx={{ 
                      bgcolor: isIos ? '#007AFF' : '#3DDC84', 
                      width: 48, 
                      height: 48,
                      mr: 2
                    }}
                  >
                    {isIos ? <Apple /> : <ShopTwo />}
                  </Avatar>
                )}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary">{t.appName}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" noWrap sx={{ mr: 1 }}>{app_name || t.infoMissing}</Typography>
                    {!isIos && app_long_name && (
                      <Tooltip title={t.storeLink}>
                        <Box
                          component="a"
                          href={`https://play.google.com/store/apps/details?id=${encodeURIComponent(app_long_name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            display: 'flex',
                            ml: 1
                          }}
                        >
                          <Box 
                            component="img" 
                            src="/google.png" 
                            alt="Google Play"
                            sx={{ 
                              height: 28,
                              width: 28,
                              borderRadius: '6px'
                            }} 
                          />
                        </Box>
                      </Tooltip>
                    )}
                    {isIos && app_long_name && (
                      <Tooltip title={t.storeLink}>
                        <Box
                          component="a"
                          href={`https://apps.apple.com/kr/app/id${encodeURIComponent(app_long_name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            display: 'flex',
                            ml: 1
                          }}
                        >
                          <Box 
                            component="img" 
                            src="/apple.png" 
                            alt="App Store"
                            sx={{ 
                              height: 28,
                              width: 'auto'
                            }} 
                          />
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={1} sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    width: 40, 
                    height: 40,
                    mr: 2
                  }}
                >
                  <Share />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">{t.installNetwork}</Typography>
                  <Typography variant="h6" noWrap>{install_info?.network || t.infoMissing}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={1} sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'secondary.main', 
                    width: 40, 
                    height: 40,
                    mr: 2
                  }}
                >
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">{t.installTime}</Typography>
                  <Typography variant="h6">{formatDateTime(install_info?.install_time) || t.infoMissing}</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, mt: 4, alignItems: 'center' }}>
          <Typography variant="h6" color="primary" align="center">{t.eventListTitle}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box>
            {lastEvent && (
              <Chip 
                label={`${t.lastEvent}: ${lastEvent.event_name} (${formatDateTime(lastEvent.last_event_time)})`} 
                color="primary" 
                variant="outlined" 
                size="small" 
                sx={{ mr: 1 }}
              />
            )}
            {totalRevenue > 0 && (
              <Chip 
                label={`${t.totalRevenue}: ${formatCurrency(totalRevenue)}`} 
                color="secondary" 
                variant="outlined" 
                size="small" 
              />
            )}
          </Box>
        </Box>

        <TableContainer 
          component={Paper} 
          elevation={2}
          sx={{ 
            borderRadius: theme.shape.borderRadius,
            overflow: 'hidden',
            mb: 3,
            bgcolor: darkMode ? 'rgba(30, 41, 59, 0.7)' : 'white',
            '& .MuiTableRow-root:hover': {
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(103, 80, 164, 0.05)'
            },
            '& .MuiTableCell-root': {
              color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
              borderBottomColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ 
                bgcolor: darkMode ? 'rgba(25, 50, 100, 0.8)' : 'primary.main',
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(35, 60, 110, 0.9)' : 'primary.dark',
                },
                textAlign: 'center'
              }}>
                <SortableTableHeader field="event_name" label={t.eventName} />
                <SortableTableHeader field="event_count" label={t.eventCount} />
                <SortableTableHeader field="first_event_time" label={t.firstEvent} />
                <SortableTableHeader field="last_event_time" label={t.lastEventColumn} />
                <SortableTableHeader field="revenue_ltv" label={t.revenueLtv} />
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">{t.noEventData}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sortedEvents.map((event, index) => (
                  <TableRow 
                    key={`event-${index}`}
                    sx={{ 
                      bgcolor: index % 2 === 0 
                        ? darkMode 
                          ? 'rgba(30, 40, 60, 0.5)' 
                          : 'rgba(240, 240, 250, 0.5)' 
                        : darkMode 
                          ? 'rgba(25, 35, 55, 0.3)' 
                          : 'white',
                      '&:hover': {
                        bgcolor: darkMode ? 'rgba(40, 50, 70, 0.7)' : 'rgba(230, 230, 250, 0.7)'
                      }
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Chip 
                          size="small" 
                          label={event.event_name} 
                          color={event.revenue_ltv > 0 ? "primary" : "default"}
                          variant="outlined"
                          sx={{ 
                            maxWidth: { xs: '130px', sm: '100%' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            borderRadius: '8px'
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        badgeContent={event.event_count} 
                        color="primary" 
                        max={999}
                        sx={{ '& .MuiBadge-badge': { right: -15, top: 13, borderRadius: '12px' } }}
                      >
                        <Box width={20} />
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(event.first_event_time)}</TableCell>
                    <TableCell>{formatDateTime(event.last_event_time)}</TableCell>
                    <TableCell>
                      {event.revenue_ltv ? (
                        <Typography 
                          variant="body2" 
                          fontWeight={event.revenue_ltv > 0 ? "medium" : "normal"}
                          color={event.revenue_ltv > 0 ? "primary.main" : "text.primary"}
                        >
                          {formatCurrency(event.revenue_ltv)}
                        </Typography>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {install_info?.notes && (
          <Paper elevation={1} sx={{ 
            p: 2, 
            mb: 2, 
            bgcolor: darkMode ? 'rgba(30, 41, 59, 0.7)' : 'background.default',
            color: darkMode ? 'white' : 'inherit',
            borderRadius: '12px',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
          }}>
            <Typography variant="body2" color={darkMode ? "rgba(255, 255, 255, 0.7)" : "text.secondary"} gutterBottom>
              <LocalOffer fontSize="small" sx={{ mr: 1, verticalAlign: 'middle', color: darkMode ? "rgba(255, 255, 255, 0.7)" : "inherit" }} />
              {t.notes}
            </Typography>
            <Typography variant="body1">
              {install_info.notes}
            </Typography>
          </Paper>
        )}
      </>
    );
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "-";
    try {
      const date = new Date(dateTimeStr);
      
      // 선택된 언어에 따라 다른 locale 포맷 적용
      let locale = 'ko-KR';
      let options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true // 모든 언어에서 12시간제 사용
      };
      
      if (language === 'en') {
        locale = 'en-US';
      } else if (language === 'zh') {
        locale = 'zh-CN';
      }
      
      return date.toLocaleString(locale, options);
    } catch (e) {
      return dateTimeStr;
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '-';
    
    // 화폐 표시를 생략하고 숫자만 표시
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  // 히스토리에서 항목 선택
  const selectHistoryItem = (item) => {
    setApiKey(item.apiKey);
    setDeviceId(item.deviceId);
    setKeyspace(item.keyspace);
    
    if (item.result) {
      setResult(item.result);
      setHasSearched(true);
      
      // 앱 아이콘 가져오기
      if (item.result && Array.isArray(item.result) && item.result.length > 0) {
        const appData = item.result[0];
        const { app_long_name } = appData;
        if (app_long_name) {
          setAppLongName(app_long_name);
          fetchAppIcon();
        }
      }
    }
  };

  // 히스토리에서 항목 삭제
  const removeHistoryItem = (index, e) => {
    e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
    
    const updatedHistory = [...searchHistory];
    updatedHistory.splice(index, 1);
    setSearchHistory(updatedHistory);
    localStorage.setItem("singular_history", JSON.stringify(updatedHistory));
  };

  // 히스토리 목록 렌더링
  const renderHistory = () => {
    if (searchHistory.length === 0) {
      return (
        <ListItem>
          <ListItemText primary={t.noSearchHistory} />
        </ListItem>
      );
    }
    
    return searchHistory.map((item, index) => {
      // 앱 이름 가져오기
      const appName = item.result && Array.isArray(item.result) && item.result.length > 0 
        ? item.result[0].app_name 
        : t.infoMissing;
      
      // 키스페이스 표시명 설정
      let keyspaceDisplay = item.keyspace;
      if (item.keyspace === "android_advertising_id") {
        keyspaceDisplay = "GAID";
      }
      
      return (
        <ListItem key={index} disablePadding>
          <ListItemButton onClick={() => selectHistoryItem(item)}>
            <ListItemIcon>
              <History fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary={`${keyspaceDisplay}: ${item.deviceId}`} 
              secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" color="text.primary">
                    {appName}
                  </Typography>
                  <br />
                  {new Date(item.timestamp).toLocaleString()}
                </React.Fragment>
              } 
            />
            <IconButton 
              edge="end" 
              aria-label="delete" 
              onClick={(e) => removeHistoryItem(index, e)}
              size="small"
            >
              <Delete fontSize="small" />
            </IconButton>
          </ListItemButton>
        </ListItem>
      );
    });
  };

  const fadeIn = keyframes`
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  // 언어 변경 시 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // 목업 데이터 - 테스트용
  const mockData = [
    {
      app_name: "샘플 앱",
      app_long_name: "com.example.sampleapp",
      install_info: {
        network: "Facebook",
        install_time: "2023-04-15T12:30:45Z",
        notes: "샘플 앱 어트리뷰션 데이터입니다."
      },
      events: [
        {
          event_name: "App Install",
          event_count: 1,
          first_event_time: "2023-04-15T12:30:45Z",
          last_event_time: "2023-04-15T12:30:45Z",
          revenue_ltv: 0
        },
        {
          event_name: "Level 1 Completed",
          event_count: 1,
          first_event_time: "2023-04-15T12:30:45Z",
          last_event_time: "2023-04-15T12:30:45Z",
          revenue_ltv: 0
        },
        {
          event_name: "Level 2 Completed",
          event_count: 1,
          first_event_time: "2023-04-15T12:30:45Z",
          last_event_time: "2023-04-15T12:30:45Z",
          revenue_ltv: 0
        },
        {
          event_name: "Level 3 Completed",
          event_count: 1,
          first_event_time: "2023-04-15T12:30:45Z",
          last_event_time: "2023-04-15T12:30:45Z",
          revenue_ltv: 0
        },
        {
          event_name: "Level 4 Completed",
          event_count: 1,
          first_event_time: "2023-04-15T12:30:45Z",
          last_event_time: "2023-04-15T12:30:45Z",
          revenue_ltv: 0
        },
        {
          event_name: "Level 5 Completed",
          event_count: 1,
          first_event_time: "2023-04-15T12:30:45Z",
          last_event_time: "2023-04-15T12:30:45Z",
          revenue_ltv: 0
        },
        {
          event_name: "Level 6 Completed",
          event_count: 1,
          first_event_time: "2023-04-15T12:30:45Z",
          last_event_time: "2023-04-15T12:30:45Z",
          revenue_ltv: 0
        },
        {
          event_name: "Level 7 Completed",
          event_count: 1,
          first_event_time: "2023-04-15T12:30:45Z",
          last_event_time: "2023-04-15T12:30:45Z",
          revenue_ltv: 0
        },
        {
          event_name: "Level 8 Completed",
          event_count: 1,
          first_event_time: "2023-04-15T12:30:45Z",
          last_event_time: "2023-04-15T12:30:45Z",
          revenue_ltv: 0
        },
        {
          event_name: "Level 9 Completed",
          event_count: 1,
          first_event_time: "2023-04-15T12:30:45Z",
          last_event_time: "2023-04-15T12:30:45Z",
          revenue_ltv: 0
        },
        {
          event_name: "Level 10 Completed",
          event_count: 1,
          first_event_time: "2023-04-15T12:30:45Z",
          last_event_time: "2023-04-15T12:30:45Z",
          revenue_ltv: 0
        }
      ]
    }
  ];

  // 시스템 다크모드 감지 설정 - useEffect 추가
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 시스템 테마 변경 감지 핸들러
    const handleChange = (e) => {
      // 사용자가 직접 설정한 경우에는 시스템 설정 무시
      const userPreference = localStorage.getItem('darkMode');
      if (userPreference === null) {
        setDarkMode(e.matches);
      }
    };
    
    // 이벤트 리스너 등록
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // 이전 브라우저 지원
      mediaQuery.addListener(handleChange);
    }
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        background: darkMode 
          ? 'linear-gradient(135deg, #0a0e16 0%, #151d2a 100%)' 
          : 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)',
        color: darkMode ? '#ffffff' : '#1a1a2e',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <AppBar 
          position="static" 
          elevation={0} 
          color="transparent" 
          sx={{ 
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            backgroundColor: darkMode ? 'rgba(21, 29, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src={singularLogoBase64} 
                alt="Singular Logo" 
                style={{ 
                  height: '30px', 
                  marginRight: '10px',
                  filter: darkMode ? 'brightness(0.9)' : 'none'
                }} 
              />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                {translations[language].title}
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
        
        <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
          {!hasSearched ? (
            // 첫 화면 - 쿼리 파라미터만 가운데에 표시
            <Fade in={true} timeout={800}>
              <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                <Card 
                  sx={{ 
                    maxWidth: '500px', 
                    width: '100%', 
                    mb: 2,
                    overflow: 'visible',
                    animation: `${fadeIn} 0.5s ease-out`
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="primary">{t.queryParams}</Typography>
                    
                    <Box sx={{ position: 'relative', mt: 2 }}>
                      <TextField
                        label={t.apiKeyLabel}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <Key color="action" sx={{ mr: 1 }} />
                          ),
                        }}
                      />
                    </Box>
                    
                    <Box display="flex" alignItems="center" mt={2}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel id="keyspace-label">{t.keyspaceLabel}</InputLabel>
                        <Select
                          labelId="keyspace-label"
                          value={keyspace}
                          label={t.keyspaceLabel}
                          onChange={handleKeyspaceChange}
                        >
                          <MenuItem value="" disabled>{t.selectKeyspace}</MenuItem>
                          <MenuItem value="idfa">IDFA</MenuItem>
                          <MenuItem value="idfv">IDFV</MenuItem>
                          <MenuItem value="android_advertising_id">AIFA (GAID)</MenuItem>
                          <MenuItem value="custom">SDID</MenuItem>
                        </Select>
                      </FormControl>
                      <Tooltip title={keyspaceTooltip} placement="right" arrow>
                        <IconButton size="small" sx={{ ml: 1, mt: 1 }}>
                          <InfoOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <Box sx={{ position: 'relative' }}>
                      <TextField
                        label={t.deviceIdLabel}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={deviceId}
                        onChange={handleDeviceIdChange}
                        error={!!deviceIdError}
                        helperText={deviceIdError}
                        InputProps={{
                          startAdornment: (
                            <Fingerprint color="action" sx={{ mr: 1 }} />
                          ),
                        }}
                      />
                    </Box>

                    <Box mt={4} display="flex" justifyContent="center">
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={fetchAttribution} 
                        disabled={loading}
                        fullWidth
                        sx={{ 
                          py: 1.5,
                          background: 'linear-gradient(to right, #2962ff, #3d5afe)',
                          '&:hover': {
                            background: 'linear-gradient(to right, #0039cb, #2962ff)'
                          }
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : t.searchButton}
                      </Button>
                    </Box>

                    {error && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">{error.message}</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                          {t.checkApiKeyAndDevice}
                        </Typography>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
                
                {searchHistory.length > 0 && (
                  <Grow in={true} timeout={600} style={{ transformOrigin: '0 0 0' }}>
                    <Card sx={{ maxWidth: '500px', width: '100%', overflow: 'hidden' }}>
                      <ListItemButton onClick={toggleHistory} sx={{ borderRadius: 0 }}>
                        <ListItemIcon>
                          <History color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={t.historyTitle} 
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                        {historyOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={historyOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {renderHistory()}
                        </List>
                      </Collapse>
                    </Card>
                  </Grow>
                )}
              </Box>
            </Fade>
          ) : (
            // 검색 후 레이아웃 - 30:70 분할 화면 (모바일에서는 상하 배치)
            <Grid container spacing={3}>
              {/* 입력 부분 (데스크톱: 30%, 모바일: 100%) */}
              <Grid item xs={12} md={4} sx={{ transition: 'all 0.3s ease' }}>
                <Fade in={true} timeout={500}>
                  <div>
                    <Card elevation={3}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom color="primary">{t.queryParams}</Typography>
                        
                        <Box sx={{ position: 'relative', mt: 2 }}>
                          <TextField
                            label={t.apiKeyLabel}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            sx={{ mb: 2 }}
                          />
                        </Box>
                        
                        <Box display="flex" alignItems="center" mt={2}>
                          <FormControl fullWidth margin="normal">
                            <InputLabel id="keyspace-label">{t.keyspaceLabel}</InputLabel>
                            <Select
                              labelId="keyspace-label"
                              id="keyspace"
                              value={keyspace}
                              label={t.keyspaceLabel}
                              onChange={(e) => setKeyspace(e.target.value)}
                            >
                              <MenuItem value="idfa">IDFA</MenuItem>
                              <MenuItem value="idfv">IDFV</MenuItem>
                              <MenuItem value="android_advertising_id">Android Advertising ID</MenuItem>
                              <MenuItem value="fire_advertising_id">Fire Advertising ID</MenuItem>
                            </Select>
                          </FormControl>
                          <Tooltip title={keyspaceTooltip} placement="right" arrow>
                            <IconButton size="small" sx={{ ml: 1, mt: 1 }}>
                              <InfoOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        
                        <Box sx={{ position: 'relative' }}>
                          <TextField
                            label={t.deviceIdLabel}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={deviceId}
                            onChange={handleDeviceIdChange}
                            error={!!deviceIdError}
                            helperText={deviceIdError}
                            sx={{ mb: 2 }}
                          />
                        </Box>

                        <Box mt={4} display="flex" justifyContent="center">
                          <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={fetchAttribution} 
                            disabled={loading}
                            fullWidth
                            sx={{ 
                              py: 1.5,
                              background: 'linear-gradient(to right, #2962ff, #3d5afe)',
                              '&:hover': {
                                background: 'linear-gradient(to right, #0039cb, #2962ff)'
                              }
                            }}
                          >
                            {loading ? <CircularProgress size={24} color="inherit" /> : t.searchButton}
                          </Button>
                        </Box>

                        {error && (
                          <Alert severity="error" sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">{error.message}</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                              {t.checkApiKeyAndDevice}
                            </Typography>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                    
                    {searchHistory.length > 0 && (
                      <Fade in={true} timeout={800}>
                        <Card elevation={3} sx={{ mt: 3, overflow: 'hidden' }}>
                          <ListItemButton onClick={toggleHistory} sx={{ borderRadius: 0 }}>
                            <ListItemIcon>
                              <History color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={t.historyTitle} 
                              primaryTypographyProps={{ fontWeight: 'medium' }}
                            />
                            {historyOpen ? <ExpandLess /> : <ExpandMore />}
                          </ListItemButton>
                          <Collapse in={historyOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                              {renderHistory()}
                            </List>
                          </Collapse>
                        </Card>
                      </Fade>
                    )}
                  </div>
                </Fade>
              </Grid>

              {/* 결과 부분 (데스크톱: 70%, 모바일: 100%) */}
              <Grid item xs={12} md={8} sx={{ transition: 'all 0.3s ease' }}>
                <Fade in={true} timeout={700}>
                  <Card 
                    elevation={3} 
                    sx={{ 
                      height: '100%', 
                      minHeight: isMobile ? '500px' : '600px',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'white',
                      boxShadow: darkMode ? '0 8px 32px rgba(0, 0, 0, 0.5)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
                      border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                      borderRadius: '12px'
                    }}
                  >
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: darkMode ? 'background.paper' : 'primary.light',
                        color: darkMode ? 'text.primary' : 'white',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        transition: 'background-color 0.3s ease'
                      }}
                    >
                      <Typography variant="h6" component="div" fontWeight="medium" mb={1}>
                        {t.appHeaderTitle}
                      </Typography>
                    </Box>
                    
                    <CardContent 
                      sx={{ 
                        p: 3, 
                        flexGrow: 1,
                        overflowY: 'auto'
                      }}
                    >                    
                      {loading && (
                        <Fade in={loading} timeout={300}>
                          <Box 
                            display="flex" 
                            flexDirection="column"
                            justifyContent="center" 
                            alignItems="center" 
                            sx={{ height: '400px' }}
                          >
                            <CircularProgress size={60} sx={{ mb: 2 }} />
                            <Typography variant="body1">{t.loadingData}</Typography>
                            <Typography variant="body2" color="text.secondary">{t.loadingFromApi}</Typography>
                          </Box>
                        </Fade>
                      )}
                      
                      {result && !loading && (
                        <Fade in={!loading && !!result} timeout={500}>
                          <div>{renderExcelTable()}</div>
                        </Fade>
                      )}
                      
                      {!result && !loading && !error && (
                        <Fade in={!loading && !result && !error} timeout={500}>
                          <Box 
                            display="flex" 
                            flexDirection="column"
                            justifyContent="center" 
                            alignItems="center" 
                            sx={{ 
                              height: '500px', 
                              border: '1px dashed',
                              borderColor: 'divider',
                              borderRadius: 4,
                              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(103, 80, 164, 0.05)' 
                            }}
                          >
                            <Box 
                              component="img" 
                              src={singularIconBase64}
                              sx={{ width: 60, height: 60, opacity: 0.2, mb: 2 }}
                            />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              {t.resultsShownHere}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: '80%' }}>
                              {t.enterParamsInstruction}
                            </Typography>
                          </Box>
                        </Fade>
                      )}
                      
                      {error && !loading && (
                        <Zoom in={!loading && !!error} timeout={500}>
                          <Box 
                            sx={{ 
                              mt: 2, 
                              p: 3, 
                              border: '1px solid',
                              borderColor: 'error.light',
                              borderRadius: 2,
                              bgcolor: 'error.light',
                              color: 'error.contrastText'
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              {t.requestFailed}
                            </Typography>
                            <Typography variant="body1" paragraph>
                              {error.message}
                            </Typography>
                            {error.detail && (
                              <Paper sx={{ p: 2, mt: 2, bgcolor: darkMode ? 'background.paper' : 'background.default' }}>
                                <pre style={{ 
                                  overflowX: 'auto', 
                                  margin: 0,
                                  fontSize: '0.75rem',
                                  fontFamily: 'monospace'
                                }}>
                                  {typeof error.detail === 'string' && error.detail.includes('<!DOCTYPE html>') 
                                    ? t.htmlResponseError 
                                    : JSON.stringify(error.detail, null, 2)}
                                </pre>
                              </Paper>
                            )}
                          </Box>
                        </Zoom>
                      )}
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            </Grid>
          )}
        </Container>
        
        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ 
            py: 2, 
            textAlign: 'center',
            borderTop: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            backgroundColor: darkMode ? 'rgba(21, 29, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            mt: 'auto'
          }}
        >
          <Typography variant="body2" color={darkMode ? 'text.secondary' : 'text.primary'}>
            &copy; {t.footer}
          </Typography>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Zoom}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="warning" 
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}