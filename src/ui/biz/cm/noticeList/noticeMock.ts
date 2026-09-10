// 일반공지사항 목업 데이터 — 목록(NoticeListPage)과 상세(NoticeDtlPage)가 공유한다.
// 상세의 이전글/다음글은 이 목록에서 현재 글의 앞/뒤 항목으로 계산한다. 추후 API(cmService) 로 교체.
import { inflateNotice } from './noticeBoard'
import type { MockNoticeListItem, MockNoticeDetail } from '@/types/mock/cm'
import sampleImage from '@/assets/images/mainBanner1.svg' // 본문 이미지 더미(에디터 업로드 이미지 대체)

// 목업 seed(dl_resultList) — 설계서 항목명·형식 그대로.
export const NOTICE_SEEDS: MockNoticeListItem[] = [
  {
    no: 1,
    contsNo: '000101',
    bizFldCd: '공통',
    emrg: '긴급',
    upFix: 'Y',
    bbsTtl: '간편인증 로그인 시 브라우저 오류 안내',
    fileCnt: 1,
    tkcgDeptNm: '총무부',
    wrtrNm: '홍길동',
    regDt: '2026-05-11',
    inqCnt: 2010,
  },
  {
    no: 2,
    contsNo: '000102',
    bizFldCd: '공통',
    emrg: '일반',
    upFix: 'N',
    bbsTtl: '5월 웹브라우저 업데이트에 따른 권한 허용 설정 안내 (PC사용자)',
    fileCnt: 2,
    tkcgDeptNm: '정보화팀',
    wrtrNm: '이정보',
    regDt: '2026-05-11',
    inqCnt: 512,
  },
  {
    no: 3,
    contsNo: '000103',
    bizFldCd: '공통',
    emrg: '일반',
    upFix: 'N',
    bbsTtl: '전자입찰 시스템 정기점검 안내 (05.15 02:00~06:00)',
    fileCnt: 2,
    tkcgDeptNm: '운영지원팀',
    wrtrNm: '김운영',
    regDt: '2026-05-10',
    inqCnt: 887,
  },
  {
    no: 4,
    contsNo: '000104',
    bizFldCd: '공통',
    emrg: '일반',
    upFix: 'N',
    bbsTtl: '지문·안면 생체인증 등록 방법 안내',
    fileCnt: 1,
    tkcgDeptNm: '인증관리팀',
    wrtrNm: '박인증',
    regDt: '2026-05-09',
    inqCnt: 431,
  },
  {
    no: 5,
    contsNo: '000105',
    bizFldCd: '공통',
    emrg: '일반',
    upFix: 'N',
    bbsTtl: '모바일 앱 신규 버전(v1.2.0) 배포 안내',
    fileCnt: 2,
    tkcgDeptNm: '정보화팀',
    wrtrNm: '이정보',
    regDt: '2026-05-08',
    inqCnt: 1204,
  },
  {
    no: 6,
    contsNo: '000106',
    bizFldCd: '공통',
    emrg: '일반',
    upFix: 'N',
    bbsTtl: '국외조달 전자서명 인증서 갱신 관련 협조 요청',
    fileCnt: 3,
    tkcgDeptNm: '해외조달팀',
    wrtrNm: '최해외',
    regDt: '2026-05-07',
    inqCnt: 256,
  },
]
export const NOTICE_MOCK: MockNoticeListItem[] = inflateNotice(NOTICE_SEEDS, 100)

// 방위사업청 공지 목업 seed (MUI-CM-04-M25/M22).
export const D2B_NOTICE_SEEDS: MockNoticeListItem[] = [
  {
    no: 1,
    contsNo: '000201',
    bizFldCd: '사업',
    emrg: '긴급',
    upFix: 'Y',
    bbsTtl: '2026년 방위사업청 조달업무 설명회 개최 안내',
    fileCnt: 2,
    tkcgDeptNm: '계약관리본부',
    wrtrNm: '정방사',
    regDt: '2026-05-12',
    inqCnt: 1740,
  },
  {
    no: 2,
    contsNo: '000202',
    bizFldCd: '사업',
    emrg: '일반',
    upFix: 'N',
    bbsTtl: '방위사업 계약일반조건 개정 사항 안내',
    fileCnt: 1,
    tkcgDeptNm: '계약제도과',
    wrtrNm: '한제도',
    regDt: '2026-05-11',
    inqCnt: 963,
  },
  {
    no: 3,
    contsNo: '000203',
    bizFldCd: '사업',
    emrg: '일반',
    upFix: 'N',
    bbsTtl: '중소기업 참여 확대 방안 시행 공고',
    fileCnt: 1,
    tkcgDeptNm: '방산진흥국',
    wrtrNm: '오진흥',
    regDt: '2026-05-09',
    inqCnt: 421,
  },
  {
    no: 4,
    contsNo: '000204',
    bizFldCd: '사업',
    emrg: '일반',
    upFix: 'N',
    bbsTtl: '국방규격 자료 열람 절차 변경 안내',
    fileCnt: 3,
    tkcgDeptNm: '규격관리팀',
    wrtrNm: '서규격',
    regDt: '2026-05-08',
    inqCnt: 588,
  },
]
export const D2B_NOTICE_MOCK: MockNoticeListItem[] = inflateNotice(D2B_NOTICE_SEEDS, 100)

// 수요부대별 공지 목업 seed (MUI-CM-04-M27/M24).
export const DMDFRC_NOTICE_SEEDS: MockNoticeListItem[] = [
  {
    no: 1,
    contsNo: '000301',
    bizFldCd: '부대',
    emrg: '긴급',
    upFix: 'Y',
    bbsTtl: '제00사단 피복류 조달 요구서 제출 기한 안내',
    fileCnt: 1,
    tkcgDeptNm: '군수참모부',
    wrtrNm: '강군수',
    regDt: '2026-05-12',
    inqCnt: 402,
  },
  {
    no: 2,
    contsNo: '000302',
    bizFldCd: '부대',
    emrg: '일반',
    upFix: 'N',
    bbsTtl: '해군 정비부품 수요조사 협조 요청',
    fileCnt: 2,
    tkcgDeptNm: '해군군수사',
    wrtrNm: '문정비',
    regDt: '2026-05-10',
    inqCnt: 233,
  },
  {
    no: 3,
    contsNo: '000303',
    bizFldCd: '부대',
    emrg: '일반',
    upFix: 'N',
    bbsTtl: '공군 항공유 계약 관련 부대 담당자 안내',
    fileCnt: 1,
    tkcgDeptNm: '공군군수사',
    wrtrNm: '유항공',
    regDt: '2026-05-08',
    inqCnt: 178,
  },
  {
    no: 4,
    contsNo: '000304',
    bizFldCd: '부대',
    emrg: '일반',
    upFix: 'N',
    bbsTtl: '수요부대 조달요구 시스템 사용자 교육 일정',
    fileCnt: 3,
    tkcgDeptNm: '교육훈련과',
    wrtrNm: '임교육',
    regDt: '2026-05-06',
    inqCnt: 311,
  },
]
export const DMDFRC_NOTICE_MOCK: MockNoticeListItem[] = inflateNotice(DMDFRC_NOTICE_SEEDS, 100)

// 목록 아이템(요약) → 상세(dm_noticeInfo). 목록에 없는 상세 필드(게시기간·내용·첨부)는 목업 본문으로 보완.
// 추후 API: tssCmService.selectNoticeDtl(contsNo). 목록에서 넘어온 값(state)으로 상단은 즉시 표시.
// 내용(bbsCn)은 에디터 HTML(텍스트+이미지) — 상세에서 sanitizeHtml 후 삽입.
export function toNoticeDetail(item: MockNoticeListItem): MockNoticeDetail {
  return {
    contsNo: item.contsNo,
    bbsTtl: item.bbsTtl,
    emrg: item.emrg,
    upFix: item.upFix,
    wrtrNm: item.wrtrNm,
    tkcgDeptNm: item.tkcgDeptNm,
    bizFldCd: item.bizFldCd,
    pstgBgngYmd: '2026-05-01',
    pstgEndYmd: '2026-05-31',
    bbsCn:
      '<p>안녕하세요. 국방전자조달시스템 담당자입니다.</p>' +
      `<p><strong>"${item.bbsTtl}"</strong></p>` +
      '<p>관련하여 안내드립니다. 자세한 내용은 아래 이미지와 첨부파일을 참고하여 주시기 바랍니다.</p>' +
      `<p><img src="${sampleImage}" alt="안내 이미지" /></p>` +
      '<p>문의사항은 고객센터(<a href="tel:1577-1118">1577-1118</a>)로 연락 주시기 바랍니다.</p>' +
      '<p>감사합니다.</p>',
    files: Array.from({ length: item.fileCnt }, (_, i) => ({
      fileSn: String(i + 1),
      fileName: `첨부파일_${i + 1}.hwp`,
      fileSize: '786KB',
    })),
  }
}
