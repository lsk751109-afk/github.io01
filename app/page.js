'use client';

import { useState } from 'react';

const careTypes = ['병원 간병', '요양원 간병', '가정 간병', '시간제 간병'];

export default function Home() {
  const [type, setType] = useState(careTypes[0]);
  const [vip, setVip] = useState(false);
  const [message, setMessage] = useState('');

  function searchCaregiver(formData) {
    const region = formData.get('region');
    const startDate = formData.get('startDate');
    if (!region || !startDate) {
      setMessage('간병 지역과 시작일을 선택해주세요.');
      return;
    }
    setMessage(`${region} · ${type}${vip ? ' · VIP 전담간병' : ''} 조건으로 접수되었습니다.`);
  }

  return (
    <>
      <header className="header">
        <div className="container nav">
          <a className="brand" href="#top"><span className="logoMark">C</span><span><b>케어택</b><small>간병 전문 매칭 플랫폼</small></span></a>
          <nav><a href="#services">서비스</a><a href="#matching">간병인 찾기</a><a href="#jobs">간병 일자리</a><a href="#vip">VIP 전담간병</a><a href="#guide">이용안내</a></nav>
          <button className="primary">상담 신청</button>
        </div>
      </header>

      <main id="top">
        <section className="hero" id="matching">
          <div className="container heroGrid">
            <div className="heroCopy">
              <span className="badge">전국 간병인 매칭 플랫폼 케어택</span>
              <h1>내 가족을 돌볼 간병인,<br/><em>직접 보고 선택하세요.</em></h1>
              <p>검증된 간병인의 경력과 후기, 예상 간병비를 비교하고 가족에게 꼭 맞는 분을 안심하고 선택하세요.</p>
              <div className="heroActions"><a className="primary" href="#matchingForm">간병인 찾기</a><a className="secondary" href="#jobs">간병 일자리 찾기</a></div>
              <div className="trust"><div><b>신원·경력 검증</b><span>3단계 검증 시스템</span></div><div><b>실제 이용 후기</b><span>평점과 후기 확인</span></div><div><b>안심 매칭</b><span>전담 상담 지원</span></div></div>
            </div>

            <form id="matchingForm" className="searchCard" action={searchCaregiver}>
              <h2>어떤 간병인이 필요하세요?</h2>
              <div className="typeGrid">{careTypes.map(item => <button type="button" key={item} className={item === type ? 'type active' : 'type'} onClick={() => setType(item)}>{item}<small>{item === '시간제 간병' ? '시간제' : '24시간'}</small></button>)}</div>
              <button type="button" className={vip ? 'vip active' : 'vip'} onClick={() => setVip(!vip)}>♛ VIP 전담간병 <span>{vip ? '사용' : '선택'}</span></button>
              <div className="fields"><label>간병 지역<select name="region" defaultValue=""><option value="">지역 선택</option><option>서울특별시</option><option>인천광역시</option><option>경기도</option><option>부산광역시</option></select></label><label>시작일<input type="date" name="startDate" /></label></div>
              <button className="primary wide" type="submit">간병인 검색하기</button>
              {message && <p className="message">{message}</p>}
            </form>
          </div>
        </section>

        <section className="section" id="services"><div className="container"><div className="sectionTitle"><span>케어택이 특별한 이유</span><h2>체계적인 시스템으로 안심 간병을 제공합니다.</h2></div><div className="featureGrid">
          {[['검증된 간병인','신원·경력·자격증 확인'],['실제 이용 후기','후기와 평점의 투명한 비교'],['합리적인 간병비','조건별 예상 비용 제공'],['전담 상담 지원','매칭부터 사후관리까지'],['VIP 전담간병','전담 매니저와 프리미엄 케어']].map(([title,desc],i)=><article className={i===4?'feature vipCard':'feature'} key={title}><span>{['♙','★★★★★','▣','♧','♛'][i]}</span><h3>{title}</h3><p>{desc}</p></article>)}
        </div></div></section>

        <section className="section soft" id="jobs"><div className="container"><div className="sectionTitle"><span>맞춤 서비스</span><h2>보호자와 간병인을 위한 핵심 기능</h2></div><div className="serviceGrid">
          <article><h3>보호자용 간병인 찾기</h3><p>지역, 일정, 경력, 후기 조건으로 간병인을 비교하고 매칭을 신청합니다.</p></article>
          <article><h3>간병 일자리 찾기</h3><p>간병인이 경력과 근무 가능 지역을 등록하고 적합한 일자리에 지원합니다.</p></article>
          <article id="vip" className="gold"><h3>VIP 전담간병</h3><p>전담 매니저 배정, 우선 추천, 일일 케어리포트와 교대 관리를 제공합니다.</p></article>
          <article><h3>케어택 안심제도</h3><p>신고 관리, 분쟁 상담, 보험 연계 안내로 안전한 이용을 지원합니다.</p></article>
        </div></div></section>

        <section className="section" id="guide"><div className="container"><div className="sectionTitle"><span>이용 절차</span><h2>간단한 4단계로 간병인을 만나보세요.</h2></div><div className="steps">{[['1','간병 신청'],['2','간병인 추천'],['3','선택 및 결제'],['4','간병 시작']].map(([n,t])=><article key={n}><b>{n}</b><h3>{t}</h3></article>)}</div></div></section>
      </main>

      <footer><div className="container footerGrid"><div><h2>케어택</h2><p>가족같은 마음으로 책임감 있는 케어를 약속드립니다.</p></div><div><h3>고객센터</h3><strong>031-868-2436</strong><p>평일 09:00~18:00</p></div></div><div className="container company">상호: 마켓하우스 · 대표: 이승규 · 전화: 031-868-2436<br/>주소: 인천광역시 옹진군 선재로265번길 51 나동 117호<br/>© 2026 CARETAEK. All rights reserved.</div></footer>
    </>
  );
}
