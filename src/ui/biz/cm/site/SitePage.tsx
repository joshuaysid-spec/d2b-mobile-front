// 관련사이트 — MUI-CM-05-M15. Figma 10020-85148 / 설계서 00.공통 v0.83 slide352·363.
// 이용안내 > 관련사이트 하위의 정적 안내(가이드) 페이지. 고정 링크 목록이라 목업/API 경계 없음.
// 구성: 그룹별 섹션(제목 + 사이트 링크 네비게이션 리스트) + 하단 만족도평가(SatisfactionSurvey 재사용).
// 링크 항목 = <a>(사이트명 Medium 19px) + arrow_forward_ios chevron + 상/하 divider(#d1d7e0=border-divider).
// [[cm-preparation01-m07]] 안내 페이지 계열. 만족도평가는 IntroducePage 와 공통(SatisfactionSurvey).
import { Icon } from '@/ui/common/base/Icon'
import { SatisfactionSurvey } from '@/ui/biz/cm/introduce/SatisfactionSurvey'

interface SiteLink {
  name: string
  href: string
}
interface SiteGroupData {
  title: string
  items: SiteLink[]
}

// 관련사이트 그룹별 링크 (Figma 10020-85148 그대로 — 사이트명·URL).
const SITE_GROUPS: SiteGroupData[] = [
  {
    title: '방위사업청',
    items: [
      { name: '청 홈페이지', href: 'http://www.dapa.go.kr/' },
      { name: '국방통합원가시스템', href: 'https://vpn.dapa.go.kr/' },
      { name: '국방표준종합정보시스템', href: 'http://kdsis.dapa.go.kr/' },
      // Figma 원본 href 는 'hhttps://…' 오타 → 동작 가능하도록 'https://' 로 교정.
      { name: '통합사업관리정보체계', href: 'https://vpn.dapa.go.kr/' },
      { name: '방산수출입지원시스템', href: 'https://d4b.dapa.go.kr/index.do' },
    ],
  },
  {
    title: '국방 관련 사이트',
    items: [
      { name: '국방부', href: 'http://mnd.go.kr/' },
      { name: '국군재정관리단', href: 'http://www.fmc.mil.kr/' },
      { name: '국방시설본부', href: 'http://www.dia.mil.kr/' },
      { name: '육군군수사령부', href: 'http://www.logcmd.mil.kr/' },
      { name: '해군군수사령부', href: 'http://www.navylogicom.mil.kr/' },
      { name: '공군군수사령부', href: 'http://www.aflc.mil.kr/' },
      { name: '국방과학연구소', href: 'http://add.re.kr/' },
      { name: '국방기술품질원', href: 'http://www.dtaq.re.kr/' },
    ],
  },
  {
    title: '전자조달 시스템 (타기관)',
    items: [
      { name: '조달청(나라장터)', href: 'http://www.g2b.go.kr/' },
      { name: '한국전력공사', href: 'http://srm.kepco.net/' },
      { name: '한전KDN', href: 'http://www.power-ec.com/' },
      { name: '한국철도공사', href: 'http://ebid.korail.com/' },
      { name: '한국철도시설공사', href: 'http://www.kr.or.kr/' },
      { name: '한국수자원공사', href: 'http://ebid.kwater.or.kr/' },
      { name: '한국수력원자력', href: 'http://ebiz.khnp.co.kr/' },
      { name: '한국도로공사', href: 'http://ebid.ex.co.kr/' },
      { name: '한국국토정보공사', href: 'http://ebid.lx.or.kr/' },
      { name: '한국토지주택공사', href: 'http://ebid.ih.or.kr/' },
      { name: '한국지역난방공사', href: 'http://econtract.kdhc.co.kr/' },
      { name: '인천국제공항공사', href: 'http://ebid.airport.kr/' },
      { name: '한국석유공사', href: 'http://ebid.knoc.co.kr/' },
      { name: '한국가스공사', href: 'http://bid.kogas.or.kr/' },
      { name: '한국조폐공사', href: 'http://ebid.komsco.com/' },
      { name: '강원랜드', href: 'http://ebd.high1.co.kr/' },
      { name: '한국마사회', href: 'http://dbid.kra.co.kr/' },
      { name: '한국농수산식품유통공사', href: 'http://www.atbid.co.kr/' },
      { name: '한국전자통신연구원', href: 'http://bid.etri.re.kr/' },
      { name: '한국전기연구원', href: 'http://ebid.keri.re.kr/' },
      { name: '한국국제협력단', href: 'http://ebid.koica.go.kr/' },
      { name: '한국과학기술연구원', href: 'http://ebid.kist.re.kr:4442/intro/index_seller.jsp' },
      { name: '한국교직공제회(S2B 학교장터)', href: 'http://www.s2b.kr/' },
    ],
  },
  {
    title: '조달 관련 사이트',
    items: [
      { name: '행정정보공동이용센터', href: 'http://www.pisc.go.kr/' },
      { name: '홈택스', href: 'http://www.hometax.go.kr/' },
      { name: '온통조달(공공조달통계시스템)', href: 'http://ppstat.g2b.go.kr/' },
      { name: '온비드', href: 'http://www.onbid.co.kr/' },
      { name: '전자문서진본확인센터', href: 'http://www.gtsa.go.kr/' },
      { name: '공정거래위원회', href: 'http://www.ftc.go.kr/' },
      { name: '공공데이터포탈(군수품 조달정보검색)', href: 'http://www.data.go.kr/' },
    ],
  },
  {
    title: '공인인증 사이트',
    items: [
      { name: '한국정보인증', href: 'http://www.signgate.com/' },
      { name: '한국전자인증', href: 'http://www.crosscert.com/' },
      { name: '금융결제원 전자인증센터', href: 'http://www.yessign.or.kr/' },
      { name: '코스콤 공인인증센터', href: 'http://www.signkorea.com/' },
      { name: '한국무역정보통신 공인인증센터', href: 'http://www.tradesign.net/' },
    ],
  },
  {
    title: '중소 / 여성 / 장애인 기업',
    items: [
      { name: '공공구매 종합정보', href: 'http://www.smpp.go.kr/' },
      { name: '중소기업 공공구매론', href: 'http://www.smpploan.com/' },
      { name: '중소기업 기업마당', href: 'http://www.bizinfo.go.kr/' },
      { name: '중소기업현황정보시스템', href: 'http://sminfo.smba.go.kr/' },
      { name: '여성기업 종합정보포탈', href: 'http://www.wbiz.or.kr/index.do' },
      { name: '장애인기업 판로지원시스템', href: 'http://biz.debc.or.kr/bid/' },
    ],
  },
  {
    title: '전자보증서 발급기관',
    items: [
      { name: '건설공제조합', href: 'http://www.cgbest.co.kr/' },
      { name: '자본재공제조합', href: 'http://www.mic.or.kr/' },
      { name: '기계설비건설공제조합', href: 'http://www.seolbi.com/' },
      { name: '소프트웨어 공제조합', href: 'http://www.ksfc.or.kr/' },
      { name: '서울보증보험', href: 'http://www.sgic.co.kr/' },
      { name: '신용보증기금', href: 'http://www.kodit.co.kr/' },
      { name: '전기공사 공제조합', href: 'http://www.ecfc.co.kr/' },
      { name: '전문건설 공제조합', href: 'http://www.kscfc.co.kr/' },
      { name: '정보통신 공제조합', href: 'http://www.icfc.or.kr/' },
      { name: '엔지니어링 공제조합', href: 'http://www.efc.co.kr/' },
    ],
  },
  {
    title: '신용정보회사',
    items: [
      { name: '서울신용평가정보(주)', href: 'http://www.sci.co.kr/' },
      { name: '한국기업데이터(주)', href: 'http://www.kedkorea.com/' },
      { name: '(주)나이스디앤비', href: 'http://www.nicednb.com/' },
      { name: 'Nice 평가정보(주)', href: 'http://www.niceinfo.co.kr/' },
      { name: '한국기업평가', href: 'http://www.korearating.com/' },
      { name: '한국신용평가', href: 'http://www.kisrating.com/' },
      { name: 'NICE 신용평가', href: 'http://www.nicerating.com/' },
      { name: '(주)이크레더블', href: 'http://www.ecredible.co.kr/' },
    ],
  },
  {
    title: '기타',
    items: [
      { name: '정부24', href: 'http://www.gov.kr/' },
      { name: '대한민국 정보공개 포털', href: 'http://www.open.go.kr/' },
      { name: '민원24', href: 'http://www.minwon.go.kr/' },
      { name: '위택스', href: 'http://www.wetax.go.kr/' },
    ],
  },
]

// 사이트 링크 1행 — 사이트명 + 우측 chevron. 상단 divider(리스트 컨테이너 border-t + 각 항목 border-b).
function NavItem({ name, href }: SiteLink) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex min-h-14 items-center gap-1 border-b border-krds-border-divider py-2.5"
    >
      <span className="min-w-px flex-1 truncate text-[19px] font-medium leading-normal text-krds-text-ink">
        {name}
      </span>
      <Icon name="ArrowForwardIos" size={20} className="shrink-0 text-krds-text-muted" aria-hidden />
    </a>
  )
}

function SiteGroup({ title, items }: SiteGroupData) {
  return (
    <div className="flex flex-col gap-2 p-4">
      <p className="text-[19px] font-bold leading-normal text-krds-text-ink">{title}</p>
      <div className="flex flex-col border-t border-krds-border-divider">
        {items.map((it) => (
          <NavItem key={`${it.name}-${it.href}`} name={it.name} href={it.href} />
        ))}
      </div>
    </div>
  )
}

export function SitePage() {
  return (
    <div className="flex w-full flex-col">
      {SITE_GROUPS.map((g) => (
        <SiteGroup key={g.title} title={g.title} items={g.items} />
      ))}
      {/* 만족도평가 — 국방전자조달 소개/이용안내 공통 */}
      <SatisfactionSurvey />
    </div>
  )
}
SitePage.displayName = 'SitePage'
