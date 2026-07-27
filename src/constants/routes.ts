// frontend-architecture.md §9.2 — 라우트 경로 상수
export const ROUTES = {
  HOME: '/',
  OP: '/op',
  /** 조달계획 상세 (`:id` 파라미터). 이동: `/op/${id}`. */
  OP_DETAIL: '/op/:id',
  /** 사전규격 상세 (`:id` 파라미터). 이동: `/op/spec/${id}`. */
  OP_SPEC_DETAIL: '/op/spec/:id',
  /** 입찰공고 통합목록 (MUI-BD-01-M01). */
  BD: '/bd',
  /** 입찰공고 상세 (`:id` 파라미터). 이동: `/bd/${id}`. */
  BD_DETAIL: '/bd/:id',
  /** 입찰진행 목록 (MUI-BD-03-M01). */
  BD_PRGRS: '/bd/prgrs',
  /** 입찰진행 상세 (MUI-BD-03-M02, `:id`). 이동: `/bd/prgrs/${id}`. */
  BD_PRGRS_DETAIL: '/bd/prgrs/:id',
  /** 입찰등록심사 결과조회 (MUI-BD-03-M05). */
  BD_REG_RSLT: '/bd/reg-rslt',
  /** 사전심사(PQ) 결과조회 (MUI-BD-02-M02). */
  BD_SRNG_RSLT: '/bd/srng-rslt',
  /** 개찰목록 (MUI-BD-08-M01). */
  BD_OPBID: '/bd/opbid',
  /** 계약 통합목록 (MUI-CT-01-M01). */
  CT: '/ct',
  /** 대금지불정보목록 (MUI-CT-01-M15). */
  CT_PYMT: '/ct/pymt',
  /** 입찰결과상세(개찰상세) (MUI-BD-09-M01 · T01~T04(구 M01~M04 — v1.83 재편), `:id` 파라미터). 이동: `/bd/result/${id}`. */
  BD_RESULT_DETAIL: '/bd/result/:id',
  NOTIFICATION: '/notification',
  SUPPORT: '/support',
  /** 일반공지사항(공지사항 목록) (MUI-CM-04-M01). */
  SUPPORT_NOTICE: '/support/notice',
  /** 일반공지사항 상세 (MUI-CM-04-M02, `:contsNo`). 이동: `/support/notice/${contsNo}`. */
  SUPPORT_NOTICE_DETAIL: '/support/notice/:contsNo',
  /** 방위사업청공지사항 (MUI-CM-04-M21). */
  SUPPORT_NOTICE_DAPA: '/support/notice/dapa',
  /** 방위사업청공지사항 상세 (MUI-CM-04-M22, `:contsNo`). */
  SUPPORT_NOTICE_DAPA_DETAIL: '/support/notice/dapa/:contsNo',
  /** 수요부대별공지사항 (MUI-CM-04-M23). */
  SUPPORT_NOTICE_DMDFRC: '/support/notice/dmdfrc',
  /** 수요부대별공지사항 상세 (MUI-CM-04-M24, `:contsNo`). */
  SUPPORT_NOTICE_DMDFRC_DETAIL: '/support/notice/dmdfrc/:contsNo',
  /** 일반자료실 (MUI-CM-04-M25). */
  SUPPORT_ARCHIVE: '/support/archive',
  /** 일반자료실 상세 (MUI-CM-04-M26, `:contsNo`). */
  SUPPORT_ARCHIVE_DETAIL: '/support/archive/:contsNo',
  /** 수요부대별자료실 (MUI-CM-04-M27). */
  SUPPORT_ARCHIVE_DMDFRC: '/support/archive/dmdfrc',
  /** 수요부대별자료실 상세 (MUI-CM-04-M28, `:contsNo`). */
  SUPPORT_ARCHIVE_DMDFRC_DETAIL: '/support/archive/dmdfrc/:contsNo',
  /** 계약관련서식자료실 (MUI-CM-04-M29). */
  SUPPORT_ARCHIVE_CTRT: '/support/archive/ctrt',
  /** 계약관련서식자료실 상세 (MUI-CM-04-M30, `:contsNo`). */
  SUPPORT_ARCHIVE_CTRT_DETAIL: '/support/archive/ctrt/:contsNo',
  /** 시스템개선안내 (MUI-CM-04-M31). */
  SUPPORT_SYS_IMPV: '/support/sys-impv',
  /** 시스템개선안내 상세 (MUI-CM-04-M32, `:contsNo`). */
  SUPPORT_SYS_IMPV_DETAIL: '/support/sys-impv/:contsNo',
  /** 자주묻는질문 (MUI-CM-04-M03). */
  SUPPORT_FAQ: '/support/faq',
  /** 민원서류발급신청 (MUI-CM-04-M04). 고객센터 > 민원서류발급신청 허브. */
  SUPPORT_DCMNT_ISSU_APLY: '/support/dcmnt-issu-aply',
  /** 신청절차 및 안내 (MUI-CM-04-M05). 민원서류발급신청 허브 > 신청 절차 및 안내. */
  SUPPORT_APLY_STEP_INFO: '/support/dcmnt-issu-aply/aply-step-info',
  /** 실적증명서 신청 목록 (MUI-CM-04-M06). 민원서류발급신청 허브 > 실적 증명서 신청 목록. */
  SUPPORT_PRFMNC_PRDOC: '/support/dcmnt-issu-aply/prfmnc-prdoc',
  /** 실적증명서 확인(상세) (MUI-CM-04-M07, `:prfmncRcptNo`). 목록 카드 클릭 진입. */
  SUPPORT_PRFMNC_PRDOC_DTL: '/support/dcmnt-issu-aply/prfmnc-prdoc/:prfmncRcptNo',
  /** 실적증명서 신청 플로우 (MUI-CM-04-P21 계약선택 → M12 신청정보 → T12/T13 실적정보). */
  SUPPORT_PRFMNC_PRDOC_REG: '/support/dcmnt-issu-aply/prfmnc-prdoc/reg',
  /** 국외조달원등록증신청목록 (MUI-CM-04-M21). 민원서류발급신청 허브 > 국외 조달원 등록증 신청 목록. */
  SUPPORT_OVS_SOS_CNFDOC: '/support/dcmnt-issu-aply/ovs-sos-cnfdoc',
  /** 국외조달원등록증신청 (MUI-CM-04-M22). 국외 조달원 등록증 신청 목록 > 신청. */
  SUPPORT_OVS_SOS_CNFDOC_REG: '/support/dcmnt-issu-aply/ovs-sos-cnfdoc/reg',
  /** 법령조회=법령정보 (MUI-CM-04-M24). 고객센터 > 법령조회(법령 목록·외부링크). */
  SUPPORT_STT_INFO_LIST: '/support/stt-info-list',
  /** 인증센터 (MUI-CM-04-M13). 홈 유관기관 바로가기 진입. */
  CERT: '/cert',
  /** 인증서 관리 (MUI-CM-04-M14). 인증센터 > 인증서 관리 진입. */
  CERT_CRTF_MNG: '/cert/manage',
  /** 인증서 가져오기 (MUI-CM-04-M16). */
  CERT_CRTF_RECEIVE: '/cert/receive',
  /** 인증서 내보내기 (MUI-CM-04-M17). */
  CERT_CRTF_SEND: '/cert/send',
  /** 시스템소개 (MUI-CM-05-M01). 국방전자조달 소개 > 시스템소개. */
  INTRO_SYSTEM: '/intro/system',
  /** 주요특징 (MUI-CM-05-M02). 국방전자조달 소개 > 주요특징. */
  INTRO_FEATURE: '/intro/feature',
  /** 연혁 (MUI-CM-05-M03). 국방전자조달 소개 > 연혁. */
  INTRO_HISTORY: '/intro/history',
  /** 관련시스템 (MUI-CM-05-M05). 국방전자조달 소개 > 관련시스템. */
  INTRO_RELATED: '/intro/related',
  /** 이용문의 (MUI-CM-05-M06). 국방전자조달 소개 > 이용문의. */
  INTRO_INQUIRY: '/intro/inquiry',
  /** 사전준비사항 (MUI-CM-05-M07). 이용안내 > 조달사전준비안내 > 사전준비사항. */
  GUIDE_PREPARATION: '/guide/preparation01',
  /** 청렴계약제 (MUI-CM-05-M08). 이용안내 > 국내조달안내 > 청렴계약제. */
  GUIDE_PREPARATION02: '/guide/preparation02',
  /** 국방조달참여절차 (MUI-CM-05-M09). 이용안내 > 국내조달안내 > 국방조달참여절차. */
  GUIDE_DOMESTIC: '/guide/domestic01',
  /** 전자입찰절차(국내) (MUI-CM-05-M10). 이용안내 > 국내조달안내 > 전자입찰절차. */
  GUIDE_DOMESTIC02: '/guide/domestic02',
  /** 전자대금청구절차 (MUI-CM-05-M11). 이용안내 > 국내조달안내 > 전자대금청구절차. */
  GUIDE_DOMESTIC03: '/guide/domestic03',
  /** 국외조달원 등록절차 (MUI-CM-05-M12). 이용안내 > 국외조달안내 > 국외조달원 등록절차. */
  GUIDE_FOREIGN: '/guide/foreign01',
  /** 국외조달원 등록/변경안내 (MUI-CM-05-M13). 이용안내 > 국외조달안내 > 국외조달원 등록/변경안내. */
  GUIDE_FOREIGN02: '/guide/foreign02',
  /** 전자입찰절차(국외) (MUI-CM-05-M14). 이용안내 > 국외조달안내 > 전자입찰절차. */
  GUIDE_FOREIGN03: '/guide/foreign03',
  /** 관련사이트 (MUI-CM-05-M15). 이용안내 > 관련사이트. */
  GUIDE_SITE: '/guide/site',
  MYPAGE: '/mypage',
  /** 업체정보 상세 (MUI-CM-01-M02). 마이페이지 > 업체정보관리 > 상세(업체일반/물품(내자)/시설/국내소재상사 탭). */
  /** 업체정보관리 허브 (MUI-CM-01-M01). 마이페이지 > 업체정보관리(진입 버튼 목록). */
  BZENTY_INFO_MNG: '/mypage/bzenty-info-mng',
  BZENTY_INFO_DTL: '/mypage/bzenty-info',
  /** 국내 조달원 확인서 신청 목록 (MUI-CM-01-M19). 마이페이지 > 업체정보관리 > 국내조달원확인서신청목록(신청 팝업 P20). */
  DMST_SOS_CNFDOC: '/mypage/dmst-sos-cnfdoc',
  /** 추가정보 신청 목록 (MUI-CM-01-M03, addRegInfoAplyList). 마이페이지 > 업체정보관리 > 추가정보 신청 목록(검색필터 P24). */
  ADD_REG_INFO_APLY: '/mypage/add-reg-info-aply',
  /** 추가정보 신청내역상세 (MUI-CM-01-M03 상세, T05/T06, `:id`). 이동: `/mypage/add-reg-info-aply/${id}` + navigate state(항목). */
  ADD_REG_INFO_APLY_DETAIL: '/mypage/add-reg-info-aply/:id',
  /** 업체정보 추가등록 — 물품(내자) (MUI-CM-01-M05, DmstLctnColInfoAddRegPage). 진입점 M01(업체정보관리) 미구현 — route만 등록. */
  BZENTY_ADD_REG_CMDTY: '/mypage/bzenty-add-reg/cmdty',
  /** 업체정보 추가등록 — 담당자정보 (MUI-CM-01-M22, DmstLctnColInfoAddRegPage_Pic). 진입점 M01 미구현 — route만 등록. */
  BZENTY_ADD_REG_PIC: '/mypage/bzenty-add-reg/pic',
  /** 업체정보 추가등록 — 국내소재상사 (MUI-CM-01-M23, DmstLctnColInfoAddRegPage_Cmbz). 진입점 M01 미구현 — route만 등록. */
  BZENTY_ADD_REG_DMS_AGT: '/mypage/bzenty-add-reg/dms-agt',
  /** 국외조달원등록증신청안내 (MUI-CM-01-P21). 마이페이지 > 업체정보관리 > 업체정보 조회/추가정보 진입 안내. */
  OVS_DMST_SOS: '/mypage/ovs-dmst-sos',
  /** 군수품무역대리업 신청 및 발급 목록 (MUI-CM-01-M15). 마이페이지 > 업체정보관리 > 군수품무역대리업 신청 목록(신규/갱신/변경 진입). */
  DF_EQPMNT_TRADE_AGNC: '/mypage/df-eqpmnt-trade-agnc',
  /** 군수품무역대리업 신청 내역 상세 (MUI-CM-01-M16). 목록 > 신청 내역 상세(navigate state). */
  DF_EQPMNT_TRADE_AGNC_DTL: '/mypage/df-eqpmnt-trade-agnc/dtl',
  /** 군수품무역대리업 신규(갱신) 작성 (MUI-CM-01-M17). 목록 > 신규/갱신(navigate state {mode}). */
  DF_EQPMNT_TRADE_AGNC_APLY: '/mypage/df-eqpmnt-trade-agnc/aply',
  /** 군수품무역대리업 변경 작성 (MUI-CM-01-M18). 목록 > 변경. */
  DF_EQPMNT_TRADE_AGNC_CHG: '/mypage/df-eqpmnt-trade-agnc/chg',
  /** 관심입찰공고 (MUI-CM-06-M05). 마이페이지 > 관심입찰공고(즐겨찾기한 입찰공고 목록). */
  ITRST_BID_PBANC: '/mypage/itrst-bid-pbanc',
  /** 업무캘린더 (MUI-CM-06-M06). 마이페이지 > 업무캘린더(즐겨찾기 공고 + 개인 일정 캘린더). */
  TASK_CLDR: '/mypage/task-cldr',
  /** 나의진행업무현황 (MUI-CM-06-M02). 마이페이지 > 나의 진행 업무 현황(진행중 이력 목록 + 세부스텝 P03). */
  MY_PRGRS_HSTRY: '/mypage/prgrs-hstry',
  /** 나의업무이력현황 (MUI-CM-06-M04). 마이페이지 > 나의 업무 이력 현황(종료 이력 목록). */
  MY_TASK_HSTRY: '/mypage/task-hstry',
  /** 개인별수신처 관리 (MUI-CM-06-M12). 마이페이지 > 문서함 > 개인별수신처관리(조회 전용 목록). */
  INDV_RCOFC_MNG: '/mypage/indv-rcofc-mng',
  /** 관심법령 (MUI-CM-06-M13). 마이페이지 > 관심법령(즐겨찾기한 법령 목록). */
  ITRST_STT: '/mypage/itrst-stt',
  /** 나의 게시물 (MUI-CM-06-M17). 마이페이지 > 나의 게시물(내가 작성한 게시물 목록). */
  MY_PST: '/mypage/my-pst',
  /** 디지털캐비닛 (MUI-CM-06-M14). 마이페이지 > 디지털캐비닛(자료 폴더 목록). */
  DIGITAL_CABINET: '/mypage/digital-cabinet',
  /** 폴더 내 파일 목록 (MUI-CM-06-M16, `:fldrSn`). 이동: `/mypage/digital-cabinet/${fldrSn}`. */
  DIGITAL_CABINET_FILES: '/mypage/digital-cabinet/:fldrSn',
  /** 문서함 (MUI-CM-06-M10). 마이페이지 > 문서함(받은/보낸/반려/임시저장 문서 목록). */
  DOC_BOX: '/mypage/doc-box',
  /** 문서함 상세 (MUI-CM-06-M11, `:id`). 이동: `/mypage/doc-box/${id}`. */
  DOC_BOX_DETAIL: '/mypage/doc-box/:id',
  /** 사용자정보관리 허브 (MUI-CM-02-M01, IndvInfoMngPage). 마이페이지 > 사용자 정보관리(진입 버튼 목록). */
  INDV_INFO_MNG: '/mypage/indv-info-mng',
  /** 개인(생체)/비밀번호 인증 (MUI-CM-02-M02, IndvCertPage). 사용자정보관리 > 개인정보 접근 전 본인 인증. */
  INDV_CERT: '/mypage/indv-cert',
  /** 개인정보상세 (MUI-CM-02-M03, IndvInfoDtlPage). 사용자정보관리 > 개인정보 상세(조회). 목록 진입 시 state.from='userList'. */
  INDV_INFO_DTL: '/mypage/indv-info-dtl',
  /** 개인정보수정 (MUI-CM-02-M04, IndvInfoMdfcnPage). 사용자정보관리 > 개인정보수정(비밀번호 인증 게이트). */
  INDV_INFO_MDFCN: '/mypage/indv-info-mdfcn',
  /** 비밀번호 변경 (MUI-CM-02-M05, PswdChgPage). 사용자정보관리 > 비밀번호 변경. */
  PSWD_CHG: '/mypage/pswd-chg',
  /** 개인 신원 확인 (MUI-CM-02-M06, IndvIdntIdntyPage). 사용자정보관리 > 개인신원확인(인증서 기반). */
  INDV_IDNT_IDNTY: '/mypage/indv-idnt-idnty',
  /** 업체 소속 사용자 목록 (MUI-CM-02-M07, PrcmBzentyUserMngPage). 사용자정보관리 > 소속 사용자 목록(상태변경 P08 시트). */
  PRCM_BZENTY_USER_MNG: '/mypage/prcm-bzenty-user-mng',
  /** 회원탈퇴 (MUI-CM-02-P10, MbWithdrawalPage). 사용자정보관리 > 회원탈퇴. */
  MB_WITHDRAWAL: '/mypage/mb-withdrawal',
  /** 알림서비스 신청 및 해지 (MUI-CM-02-M09, NotiSrvcAplyPage). 마이페이지 > 알림 서비스 신청 및 해지. */
  NOTI_SRVC_APLY: '/mypage/noti-srvc-aply',
  /** 앱 실행 스플래시 (MUI-MS-01-M01). 셸(AppLayout) 밖 독립 풀스크린. */
  SPLASH: '/splash',
  /** 앱 접근권한 동의 (MUI-MS-01-M02). 셸 밖 풀스크린. */
  APP_AUTHRT_AGRE: '/app-authrt-agre',
  /** 앱 이용안내 (MUI-MS-01-M06, 구 P06 표기). 셸 밖 풀스크린. */
  APP_GUIDE: '/app-guide',
  /** 챗봇문의 (MUI-MS-01-M11). 외부 챗봇 솔루션 임베드 자리 — BottomNav 챗봇/전체메뉴 챗봇상담 진입. */
  CHATBOT: '/chatbot',
  /** 생체인증 (MUI-CM-03-M14). 로그인 방식선택·전체메뉴 인증센터 > 생체인증 진입. */
  LOGIN_BIOMETRIC: '/login/biometric',
  /** 설정 (MUI-MS-02-M01). 전체메뉴 > 설정. */
  SETTINGS: '/settings',
  /** 개발자용 컴포넌트 가이드 (PC 해상도, 모바일 셸 미적용). */
  GUIDE: '/guide',
} as const

export type RouteKey = keyof typeof ROUTES
