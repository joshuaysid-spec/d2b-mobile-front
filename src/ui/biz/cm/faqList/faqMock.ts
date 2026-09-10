// 자주묻는질문 목업(dl_resultList) — 추후 API(tssCmService.selectFaqList) 로 교체.
// 구분(bizFldCd = FAQCD)은 상단 탭과 배지에 쓰인다. 답변(contsCn)은 에디터 HTML(텍스트+이미지) — 상세에서 sanitize 후 삽입.
import type { MockFaqListItem } from '@/types/mock/cm'
import sampleImage from '@/assets/images/mainBanner3.svg' // 본문 이미지 더미(에디터 업로드 이미지 대체)

const FAQ_SEEDS: MockFaqListItem[] = [
  {
    no: 1,
    bbsId: '000101',
    bizFldCd: '입찰서제출',
    qstnTtl: '공개수의협상 등록심사시점이 어떻게 되나요?',
    regDt: '2025-12-01',
    inqNocs: 99,
    contsCn:
      '<p>안녕하세요. 국방전자조달 담당자입니다.</p>' +
      '<p>공개수의협상의 등록심사시점은 2가지로 나뉘며 <strong>개찰 후 등록심사</strong>와 <strong>개찰 전 등록심사</strong>로 나뉩니다.</p>' +
      `<p><img src="${sampleImage}" alt="등록심사 절차" /></p>` +
      '<ul><li>개찰 후 등록심사: 견적서 제출 후 개찰이 진행되고, 개찰 이후 업체 등록심사를 진행합니다.</li>' +
      '<li>개찰 전 등록심사: 견적서 제출 후 개찰 전 등록심사를 진행한 뒤 등록 확정된 업체로 개찰이 진행됩니다.</li></ul>',
  },
  {
    no: 2,
    bbsId: '000102',
    bizFldCd: '전자입찰일반',
    qstnTtl: '조달요구 등록 후 수정은 어디에서 하나요?',
    regDt: '2025-11-28',
    inqNocs: 152,
    contsCn:
      '<p>조달요구 등록 후 수정은 <strong>조달계획 &gt; 조달계획통합목록</strong>에서 해당 건을 선택해 진행할 수 있습니다.</p>' +
      '<p>단, 공고가 게시된 이후에는 수정이 제한되므로 담당부서에 문의하시기 바랍니다.</p>',
  },
  {
    no: 3,
    bbsId: '000103',
    bizFldCd: '전자계약',
    qstnTtl: '전자계약 체결 시 인증서 오류가 발생합니다.',
    regDt: '2025-11-20',
    inqNocs: 240,
    contsCn:
      '<p>전자계약 체결 시 인증서 오류는 대부분 브라우저 보안 설정 또는 인증서 만료가 원인입니다.</p>' +
      `<p><img src="${sampleImage}" alt="인증서 관리 화면" /></p>` +
      '<p>인증센터 &gt; 인증서 관리에서 인증서 유효기간을 확인하고, 필요 시 갱신 후 다시 시도해 주세요.</p>',
  },
  {
    no: 4,
    bbsId: '000104',
    bizFldCd: '납품대가(방위사업청)',
    qstnTtl: '검사 및 납품조서는 언제까지 제출해야 하나요?',
    regDt: '2025-11-15',
    inqNocs: 88,
    contsCn:
      '<p>검사 및 납품조서는 계약서에 명시된 납품기한 내에 제출하여야 합니다.</p>' +
      '<p>기한 내 제출이 어려운 경우 사전에 발주기관과 협의하여 기한 연장을 신청할 수 있습니다.</p>',
  },
  {
    no: 5,
    bbsId: '000105',
    bizFldCd: '입찰참가신청서제출',
    qstnTtl: '입찰참가신청서 제출 후 취소가 가능한가요?',
    regDt: '2025-11-10',
    inqNocs: 176,
    contsCn:
      '<p>입찰참가신청서는 입찰 마감 전까지 취소가 가능합니다.</p>' +
      '<p>입찰 진행 &gt; 입찰진행목록에서 해당 공고를 선택해 신청 취소를 진행하시기 바랍니다.</p>',
  },
  {
    no: 6,
    bbsId: '000106',
    bizFldCd: '업체등록',
    qstnTtl: '대표품명과 세부품명은 어떻게 다른가요?',
    regDt: '2025-11-05',
    inqNocs: 61,
    contsCn:
      '<p>대표품명은 조달 건을 대표하는 품명이며, 세부품명은 실제 납품되는 개별 품목의 명칭입니다.</p>' +
      '<p>검색 시 대표품명으로 조회하면 관련 세부품명이 포함된 건이 함께 조회됩니다.</p>',
  },
]

export const FAQ_MOCK: MockFaqListItem[] = Array.from({ length: 100 }, (_, i) => {
  const base = FAQ_SEEDS[i % FAQ_SEEDS.length]
  return { ...base, no: i + 1, bbsId: String(101 + i).padStart(6, '0') }
})
