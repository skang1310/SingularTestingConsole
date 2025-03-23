import React, { useState, useEffect } from "react";
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
  Checkbox
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
  Launch
} from "@mui/icons-material";
import axios from "axios";
import { keyframes } from '@mui/system';

export default function SingularDebugger() {
  const [apiKey, setApiKey] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [keyspace, setKeyspace] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [sortField, setSortField] = useState("event_name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [deviceIdError, setDeviceIdError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [useMockData, setUseMockData] = useState(false); // 내부 테스트용 (UI에서는 숨김 처리)
  const [appIcon, setAppIcon] = useState(null);

  // Singular 로고 Base64 인코딩 (로고 이미지를 직접 소스 코드에 포함)
  const singularLogoBase64 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvfg-L9ImP6SiqLRxJc03e_jSvaR25KybCHw&s";
  
  // Singular 아이콘 Base64 인코딩
  const singularIconBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggZD0iTTEwLjQgMTEuMkMxMC40IDE3LjUgMCAxNy4zIDAgMjMuN2MwIDQuNCAzIDYuMiA2LjMgNi4yIDUuNCAwIDguNy00LjEgOC43LTlWN2g1LjF2MTMuOWMwIDEwLjEtNy42IDE0LTQuOSAyMy4xLTEuOS0uNi0xNC00LjQtMTQtMTNDMS4zIDIzLjcgMTIgMTQuNCAxMiAxMS4yYzAtMi42LTEuNi0zLTkuMy0yQzMuMiAxLjMgMTEuNSAwIDE2LjEgMGM0LjUgMCA3LjYgMi44IDcuNiA2LjIgMCAzLTIgNS01IDVzLTYtMi02LTVjMC0yLjktMS40LTQuOC0yLjMtNS4ydjUuMmMwIDIuNyAyLjIgNC45IDQuOSA0LjlzNS0yLjIgNS00LjlWMEgyNlY2SDEwLjQiIGZpbGw9IiMwMDM5Y2IiLz48L3N2Zz4=";

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
          event_name: "purchase",
          event_count: 5,
          first_event_time: "2023-04-16T10:20:30Z",
          last_event_time: "2023-04-20T15:45:22Z",
          revenue_ltv: 25000
        },
        {
          event_name: "app_open",
          event_count: 20,
          first_event_time: "2023-04-15T13:05:12Z",
          last_event_time: "2023-04-21T08:30:15Z",
          revenue_ltv: 0
        },
        {
          event_name: "tutorial_complete",
          event_count: 1,
          first_event_time: "2023-04-15T14:22:18Z",
          last_event_time: "2023-04-15T14:22:18Z",
          revenue_ltv: 0
        },
        {
          event_name: "registration",
          event_count: 1,
          first_event_time: "2023-04-15T13:45:30Z",
          last_event_time: "2023-04-15T13:45:30Z",
          revenue_ltv: 0
        },
        {
          event_name: "subscription",
          event_count: 2,
          first_event_time: "2023-04-18T09:15:42Z",
          last_event_time: "2023-04-19T18:30:10Z",
          revenue_ltv: 15000
        }
      ]
    }
  ];

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2962ff',
      },
      secondary: {
        main: '#ff5722',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h5: {
        fontWeight: 600,
      },
      button: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: 8,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:nth-of-type(odd)': {
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            },
          },
        },
      },
    },
  });

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
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

  const validateDeviceId = () => {
    if (!deviceId || !keyspace) return true;
    
    if ((keyspace === "idfa" || keyspace === "idfv") && deviceId !== deviceId.toUpperCase()) {
      setDeviceIdError("IDFA/IDFV는 대문자로 입력해야 합니다.");
      return false;
    }
    
    if (keyspace === "android_advertising_id" && deviceId !== deviceId.toLowerCase()) {
      setDeviceIdError("AIFA(GAID)는 소문자로 입력해야 합니다.");
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
        setDeviceIdError("IDFA/IDFV는 대문자로 입력해야 합니다.");
      } else {
        setDeviceIdError("");
      }
    } else if (keyspace === "android_advertising_id") {
      if (newDeviceId !== newDeviceId.toLowerCase()) {
        setDeviceIdError("AIFA(GAID)는 소문자로 입력해야 합니다.");
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
        setDeviceIdError("IDFA/IDFV는 대문자로 입력해야 합니다.");
      } else if (newKeyspace === "android_advertising_id" && deviceId !== deviceId.toLowerCase()) {
        setDeviceIdError("AIFA(GAID)는 소문자로 입력해야 합니다.");
      } else {
        setDeviceIdError("");
      }
    }
  };

  const getAppIcon = async (appLongName, isIosApp) => {
    try {
      console.log("앱 아이콘 가져오기 시작:", appLongName, isIosApp ? "iOS" : "Android");
      
      if (isIosApp) {
        // iOS 앱 아이콘을 가져오기 위한 iTunes API 사용
        try {
          // CORS 우회를 위한 프록시 사용
          const corsProxy = "https://corsproxy.io/?";
          const url = `${corsProxy}${encodeURIComponent(`https://itunes.apple.com/lookup?bundleId=${encodeURIComponent(appLongName)}&country=kr`)}`;
          console.log("iOS 앱 조회 URL:", url);
          const response = await axios.get(url);
          
          let actualData;
          if (response.data && typeof response.data === 'string') {
            try {
              actualData = JSON.parse(response.data);
            } catch (e) {
              actualData = response.data;
            }
          } else {
            actualData = response.data;
          }
          
          if (actualData && actualData.results && actualData.results.length > 0) {
            // 가장 큰 크기의 아이콘 이미지 사용
            const iconUrl = actualData.results[0].artworkUrl512 || 
                      actualData.results[0].artworkUrl100 || 
                      actualData.results[0].artworkUrl60;
                      
            console.log("iOS 아이콘 URL 찾음:", iconUrl);
            setAppIcon(iconUrl);
            return;
          } else {
            console.log("iOS 앱 검색 결과 없음, 앱 ID로 재시도");
            // 번들ID로 검색 실패 시 앱 ID로 재시도
            const appIdUrl = `${corsProxy}${encodeURIComponent(`https://itunes.apple.com/lookup?id=${encodeURIComponent(appLongName)}&country=kr`)}`;
            const appIdResponse = await axios.get(appIdUrl);
            
            let appIdData;
            if (appIdResponse.data && typeof appIdResponse.data === 'string') {
              try {
                appIdData = JSON.parse(appIdResponse.data);
              } catch (e) {
                appIdData = appIdResponse.data;
              }
            } else {
              appIdData = appIdResponse.data;
            }
            
            if (appIdData && appIdData.results && appIdData.results.length > 0) {
              const iconUrl = appIdData.results[0].artworkUrl512 || 
                        appIdData.results[0].artworkUrl100 || 
                        appIdData.results[0].artworkUrl60;
                        
              console.log("iOS 앱 ID로 아이콘 URL 찾음:", iconUrl);
              setAppIcon(iconUrl);
              return;
            }
          }
        } catch (iosError) {
          console.error("iOS 앱 아이콘 가져오기 실패:", iosError);
          // 직접 URL 패턴 시도
          try {
            // 직접 앱스토어 아이콘 URL 패턴 사용
            const staticIconUrl = `https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/e7/54/85/e75485a7-2b89-7973-5dd8-0934f5af041a/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.webp`;
            console.log("iOS 고정 아이콘 URL 사용:", staticIconUrl);
            setAppIcon(staticIconUrl);
            return;
          } catch (e) {
            console.error("직접 URL 시도 실패:", e);
          }
        }
      } else {
        // Android 앱의 경우 로컬 Flask 서버를 통해 구글 플레이 스토어에서 앱 아이콘 가져오기
        try {
          console.log("Android 앱 아이콘 가져오기 시도 (Netlify Functions 이용):", appLongName);
          
          // Netlify Functions API 엔드포인트 호출
          const response = await axios.get(`/api/app-icon?package_name=${encodeURIComponent(appLongName)}`);
          
          if (response.data && response.data.icon_url) {
            console.log("Netlify Functions에서 가져온 아이콘 URL:", response.data.icon_url);
            setAppIcon(response.data.icon_url);
            return;
          } else {
            throw new Error("서버리스 함수에서 아이콘을 찾지 못했습니다.");
          }
        } catch (serverError) {
          console.error("서버리스 함수 요청 실패:", serverError);
          
          // 서버 요청 실패 시 알려진 앱 패키지명에 대한 아이콘 URL 매핑 사용
          console.log("대체 방법으로 알려진 아이콘 URL 매핑 사용");
          
          // 알려진 앱 패키지명에 대한 아이콘 URL 매핑
          const knownAppIcons = {
            'com.kakaogames.gdtskr': 'https://i.imgur.com/HzGUkQd.png',
            'com.kakao.talk': 'https://i.imgur.com/0BSuhMw.png',
            'com.nhn.android.search': 'https://i.imgur.com/jY12NMi.png',
            'com.kakao.game.tbm': 'https://i.imgur.com/1oVIxPn.png',
            'com.nhnent.payapp': 'https://i.imgur.com/CrC9k7K.png', 
            'com.naver.vapp': 'https://i.imgur.com/I9BCHW4.png',
            'com.google.android.youtube': 'https://i.imgur.com/Hx6GA5j.png',
            'com.netmarble.lineageII': 'https://i.imgur.com/uHUIG5R.png',
            'com.ncsoft.lineagem': 'https://i.imgur.com/BPyBXYF.png',
            'com.mojang.minecraftpe': 'https://i.imgur.com/uN0dpAL.png',
            'com.facebook.katana': 'https://i.imgur.com/iQ6rHZC.png',
            'com.instagram.android': 'https://i.imgur.com/nrFJF5v.png',
            'com.whatsapp': 'https://i.imgur.com/nq2KXh7.png',
            'com.supercell.clashofclans': 'https://i.imgur.com/JcSyAKK.png',
            'com.kakaogames.odin': 'https://i.imgur.com/JIEzDnO.png'
            // 더 많은 앱 아이콘을 여기에 추가할 수 있음
          };
          
          // 알려진 앱 패키지명에 대해서는 매핑된 URL 사용
          if (knownAppIcons[appLongName]) {
            console.log("알려진 앱 아이콘 URL 사용:", knownAppIcons[appLongName]);
            setAppIcon(knownAppIcons[appLongName]);
            return;
          }
          
          // 알려진 앱이 아닌 경우 패키지명 분석하여 회사명 추출
          const packageParts = appLongName.split('.');
          
          // 1차 시도: 패키지명에서 추출한 회사명을 키워드로 사용
          if (packageParts.length > 1) {
            const companyName = packageParts[1].toLowerCase();
            console.log("회사명 추출:", companyName);
            
            // 회사명으로 알려진 아이콘 URL 매핑
            const companyIcons = {
              'kakaogames': 'https://i.imgur.com/HzGUkQd.png',
              'kakao': 'https://i.imgur.com/0BSuhMw.png',
              'nhn': 'https://i.imgur.com/jY12NMi.png',
              'google': 'https://i.imgur.com/Hx6GA5j.png',
              'naver': 'https://i.imgur.com/I9BCHW4.png',
              'ncsoft': 'https://i.imgur.com/BPyBXYF.png',
              'netmarble': 'https://i.imgur.com/uHUIG5R.png',
              'mojang': 'https://i.imgur.com/uN0dpAL.png',
              'facebook': 'https://i.imgur.com/iQ6rHZC.png',
              'instagram': 'https://i.imgur.com/nrFJF5v.png',
              'supercell': 'https://i.imgur.com/JcSyAKK.png'
              // 더 많은 회사명 아이콘을 여기에 추가할 수 있음
            };
            
            if (companyIcons[companyName]) {
              console.log("회사명으로 아이콘 URL 찾음:", companyIcons[companyName]);
              setAppIcon(companyIcons[companyName]);
              return;
            }
          }
          
          // 2차 시도: 백업용 기본 안드로이드 아이콘
          const defaultAndroidIcon = 'https://i.imgur.com/oTPJLRQ.png';
          console.log("기본 안드로이드 아이콘 사용:", defaultAndroidIcon);
          setAppIcon(defaultAndroidIcon);
          return;
        }
      }
      
      // 아이콘을 가져오지 못한 경우 기본 아이콘 사용
      console.log("앱 아이콘을 가져오지 못했습니다. 기본 아이콘을 사용합니다.");
      setAppIcon('https://i.imgur.com/rDkoZNh.png');
    } catch (error) {
      console.error("앱 아이콘 가져오기 실패:", error);
      setAppIcon('https://i.imgur.com/rDkoZNh.png');
    }
  };

  const fetchAttribution = async () => {
    if (!apiKey || !deviceId || !keyspace) {
      setSnackbarMessage("API Key, Device ID, Keyspace를 모두 입력해주세요.");
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
        getAppIcon(app_long_name, keyspace === 'idfa' || keyspace === 'idfv');
        
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
      await getAppIcon(app_long_name, keyspace === 'idfa' || keyspace === 'idfv');
      
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

  const keyspaceTooltip = `The type of advertising ID:
IDFA: Used in iOS devices (Identifier for Advertisers)
IDFV: Used in iOS devices (Identifier for Vendors)
AIFA: Used in Android devices, also known as GAID
SDID: Singular Device ID - used for web tracking. You can read the Singular Device ID using singularSdk.getSingularDeviceId() after calling the init method or using InitFinishedCallback.`;

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
            결과가 없거나 형식이 올바르지 않습니다.
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
        <Box sx={{ mb: 3, p: 2, bgcolor: darkMode ? 'background.paper' : 'background.default', borderRadius: 2 }}>
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
                      // 이미지 로딩 실패 시 기본 이미지 제공
                      e.target.onerror = null; // 무한 루프 방지
                      e.target.src = 'https://i.imgur.com/rDkoZNh.png';
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
                  <Typography variant="body2" color="text.secondary">앱 이름</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" noWrap sx={{ mr: 1 }}>{app_name || "정보 없음"}</Typography>
                    {!isIos && app_long_name && (
                      <Tooltip title="Google Play에서 보기">
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
                      <Tooltip title="App Store에서 보기">
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
                  <Typography variant="body2" color="text.secondary">설치 네트워크</Typography>
                  <Typography variant="h6" noWrap>{install_info?.network || "정보 없음"}</Typography>
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
                  <Typography variant="body2" color="text.secondary">설치 시간</Typography>
                  <Typography variant="h6">{formatDateTime(install_info?.install_time) || "정보 없음"}</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, mt: 4, alignItems: 'center' }}>
          <Typography variant="h6" color="primary" align="center">이벤트 목록</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box>
            {lastEvent && (
              <Chip 
                label={`최종 이벤트: ${lastEvent.event_name} (${formatDateTime(lastEvent.last_event_time)})`} 
                color="primary" 
                variant="outlined" 
                size="small" 
                sx={{ mr: 1 }}
              />
            )}
            {totalRevenue > 0 && (
              <Chip 
                label={`총 수익: ${formatCurrency(totalRevenue)}`} 
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
            '& .MuiTableRow-root:hover': {
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(103, 80, 164, 0.05)'
            }
          }}
        >
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ 
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.main',
                },
                textAlign: 'center'
              }}>
                <SortableTableHeader field="event_name" label="이벤트명" />
                <SortableTableHeader field="event_count" label="횟수" />
                <SortableTableHeader field="first_event_time" label="첫 이벤트" />
                <SortableTableHeader field="last_event_time" label="마지막 이벤트" />
                <SortableTableHeader field="revenue_ltv" label="수익(LTV)" />
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">이벤트 데이터가 없습니다</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sortedEvents.map((event, index) => (
                  <TableRow 
                    key={index} 
                    sx={{ 
                      bgcolor: index % 2 === 0 ? darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(103, 80, 164, 0.03)' : 'inherit',
                      '&:last-child td, &:last-child th': { border: 0 },
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
          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: darkMode ? 'background.paper' : 'background.default' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <LocalOffer fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              참고 사항
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
      return date.toLocaleString();
    } catch (e) {
      return dateTimeStr;
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "-";
    return new Intl.NumberFormat('ko-KR', { 
      style: 'currency', 
      currency: 'KRW',
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
          getAppIcon(app_long_name, item.keyspace === 'idfa' || item.keyspace === 'idfv');
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
          <ListItemText primary="검색 히스토리가 없습니다." />
        </ListItem>
      );
    }
    
    return searchHistory.map((item, index) => {
      // 앱 이름 가져오기
      const appName = item.result && Array.isArray(item.result) && item.result.length > 0 
        ? item.result[0].app_name 
        : "앱 정보 없음";
      
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        background: darkMode 
          ? 'linear-gradient(to bottom, #121212, #1e1e1e)' 
          : 'linear-gradient(to bottom, #f5f5f5, #ffffff)',
        transition: 'background 0.3s ease'
      }}>
        <AppBar 
          position="static" 
          elevation={0} 
          color="transparent" 
          sx={{ 
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Toolbar>
            <Box display="flex" alignItems="center" 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.9
                }
              }} 
              onClick={() => {
                setResult(null);
                setHasSearched(false);
                setError(null);
                setApiKey("");
                setDeviceId("");
                setKeyspace("");
                setDeviceIdError("");
              }}
            >
              <Box 
                component="img" 
                src={singularLogoBase64}
                alt="Singular Logo" 
                sx={{ 
                  height: 36, 
                  mr: 2,
                  display: { xs: 'none', sm: 'block' } 
                }} 
              />
              <Typography variant="h5" color="primary" fontWeight="bold">
                어트리뷰션 디버거
              </Typography>
            </Box>
            <Box flexGrow={1} />
            {hasSearched && (
              <Tooltip title="메인으로 돌아가기">
                <Button 
                  color="primary" 
                  startIcon={<Home />} 
                  onClick={() => {
                    setResult(null);
                    setHasSearched(false);
                    setError(null);
                    setApiKey("");
                    setDeviceId("");
                    setKeyspace("");
                    setDeviceIdError("");
                  }}
                  sx={{ mr: 2 }}
                >
                  메인으로
                </Button>
              </Tooltip>
            )}
            <Tooltip title={darkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}>
              <IconButton onClick={toggleDarkMode} color="inherit" sx={{ mr: 1 }}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="xl" sx={{ py: 4 }}>
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
                    <Typography variant="h6" gutterBottom color="primary">쿼리 파라미터</Typography>
                    
                    <Box sx={{ position: 'relative', mt: 2 }}>
                      <TextField
                        label="API Key"
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
                        <InputLabel id="keyspace-label">Keyspace</InputLabel>
                        <Select
                          labelId="keyspace-label"
                          value={keyspace}
                          label="Keyspace"
                          onChange={handleKeyspaceChange}
                        >
                          <MenuItem value="" disabled>선택해주세요</MenuItem>
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
                        label="Device ID"
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : "조회하기"}
                      </Button>
                    </Box>

                    {error && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">{error.message}</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                          API 키와 디바이스 ID가 정확한지 확인하세요.
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
                          primary="최근 검색 기록" 
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
                        <Typography variant="h6" gutterBottom color="primary">쿼리 파라미터</Typography>
                        
                        <Box sx={{ position: 'relative', mt: 2 }}>
                          <TextField
                            label="API Key"
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
                            <InputLabel id="keyspace-label">Keyspace</InputLabel>
                            <Select
                              labelId="keyspace-label"
                              value={keyspace}
                              label="Keyspace"
                              onChange={handleKeyspaceChange}
                            >
                              <MenuItem value="" disabled>선택해주세요</MenuItem>
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
                            label="Device ID"
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
                            {loading ? <CircularProgress size={24} color="inherit" /> : "조회하기"}
                          </Button>
                        </Box>

                        {error && (
                          <Alert severity="error" sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">{error.message}</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                              API 키와 디바이스 ID가 정확한지 확인하세요.
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
                              primary="최근 검색 기록" 
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
                      overflow: 'hidden'
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
                      <Typography variant="h6">
                        {result ? "어트리뷰션 결과" : "결과"}
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
                            <Typography variant="body1">데이터 불러오는 중...</Typography>
                            <Typography variant="body2" color="text.secondary">Singular API로부터 정보를 가져오고 있습니다</Typography>
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
                              결과가 여기에 표시됩니다
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: '80%' }}>
                              왼쪽에서 파라미터를 입력하고 조회하기 버튼을 클릭하세요
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
                              요청 실패
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
                                    ? "HTML 응답을 받았습니다. API 주소를 확인하세요." 
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