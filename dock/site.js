'use strict';
const get = id => document.getElementById(id);
const loads = [6, 8, 10, 12, 15];
const market = 'https://dahuigroup.en.made-in-china.com/product/';
const official = 'https://en.dahuilift.com/products_details/';
const structures = [
  {name:'표준형', info:'일반적인 차량 상하차 작업에 사용하는 경사형 도크입니다.', url:market+'eaUruDPVIqpE/China-Mobile-Loading-Ramp-Dock-Levelers-Yard-Leveller-Container-OEM-ODM.html', models:true},
  {name:'접이식', info:'보관 공간이 제한된 현장에서는 접었을 때의 치수를 확인하세요.', url:market+'ktMYNTRAsqpI/China-Foldable-6-15ton-Loading-Capacity-Mobile-Yard-Ramp-for-Forklift-Use.html', models:true},
  {name:'고하중형', info:'사용 장비와 화물의 합산 중량에 맞춰 사양을 검토합니다.', url:official+'37.html'},
  {name:'휴대형', info:'작업 위치를 자주 옮기는 현장의 이동 경로와 보관 공간을 고려합니다.', url:official+'36.html'},
  {name:'주문형', info:'차량 높이와 작업 폭, 분할 필요 여부를 기준으로 상담합니다.', url:official+'38.html'}
];
const videoRoot = 'https://www.made-in-china.com/video-channel/';
const videos = [
  ['6톤 휴대형 도크', 'amp/dahuigroup_zaYUXgVdhjpP_6-Ton-Portable-Mobile-Dock-Ramp-Movable-Hydraulic-Yard-Ramp-for-Truck-Loading.html'],
  ['10톤 도크 배치', 'amp/dahuigroup_YTornVycJBpU_10-Ton-Forklift-Truck-Loading-Container-Ramp-Mobile-Dock-Leveler.html'],
  ['8~12톤 조절형 도크','dahuigroup_BTWrFHQvEoUZ_OEM-Adjustable-8-12-Ton-Steel-Mobile-Yard-Ramp-for-E-Commerce-Warehouse-Dock-Leveler.html']
];
function el(tag, content, css) {
  const node=document.createElement(tag);
  if(content) node.textContent=content;
  if(css) node.className=css;
  return node;
}
function external(label,url) {
  const link=el('a',label);
  link.href=url;
  link.target='_blank';
  link.rel='noopener noreferrer';
  return link;
}
function modelCode(load){return 'DCQY-'+load+'T';}
function drawModels(selected) {
  for(const filter of get('filters').children) filter.setAttribute('aria-pressed',String(filter.dataset.load===String(selected)));
  get('cards').replaceChildren();
  const matches=selected ? [selected] : loads;
  for(const load of matches){
    const card=el('article',null,'model');
    const title=el('h3',modelCode(load),'code');
    const ton=el('p',String(load),'ton');
    ton.append(el('small','톤'));
    const button=el('button','견적 문의');
    button.type='button';
    button.setAttribute('aria-label',modelCode(load)+' 견적 문의');
    button.append(el('span','↗'));
    button.addEventListener('click',()=>{
      get('type').value='0';
      chooseType();
      get('capacity').value=String(load);
      get('quote').scrollIntoView();
      get('type').focus({preventScroll:true});
    });
    card.append(title,ton,button);
    get('cards').append(card);
  }
  get('results').textContent=matches.length+'개 모델 표시';
}
for(const load of [0,...loads]){
  const button=el('button',load ? load+'톤' : '전체');
  button.type='button';
  button.dataset.load=String(load);
  button.addEventListener('click',()=>drawModels(load));
  get('filters').append(button);
}
drawModels(0);
for(const [i,s] of structures.entries()){
  const row=el('article',null,'typeRow');
  const link=external('제조사 자료 ↗',s.url);
  link.setAttribute('aria-label',s.name+' Dahui 제조사 자료 (새 창)');
  row.append(el('h3',s.name),el('p',s.info),link);
  get('typeList').append(row);
  get('type').add(new Option(s.name,String(i)));
}
for(const [name,path] of videos){
  const link=external('',videoRoot+path);
  link.className='video';
  link.setAttribute('aria-label',name+' 제조사 영상 (새 창)');
  link.append(el('span','▶','play'),el('span',name),el('b','↗'));
  get('videos').append(link);
}
function resetResult(){get('output').hidden=true;get('status').textContent='';}
function chooseType(){
  const type=structures[Number(get('type').value)];
  const capacity=get('capacity');
  capacity.replaceChildren(new Option('상담 후 결정',''));
  for(const load of loads) capacity.add(new Option(load+'톤'+(type.models?' · '+modelCode(load):' 희망'),String(load)));
  resetResult();
}
chooseType();
get('type').addEventListener('change',chooseType);
get('capacity').addEventListener('change',resetResult);
get('note').addEventListener('input',resetResult);
get('composer').addEventListener('submit',event=>{
  event.preventDefault();
  const type=structures[Number(get('type').value)];
  const load=get('capacity').value;
  const note=get('note').value.trim();
  const lines=['안녕하세요. '+type.name+' 이동식 도크 견적을 문의드립니다.','희망 하중: '+(load?load+'톤':'상담 후 결정')];
  if(load && type.models) lines.push('검토 모델: '+modelCode(load));
  if(note) lines.push('현장 조건: '+note);
  lines.push('현장에 맞는 사양과 견적, 납기를 안내해 주세요.');
  get('message').value=lines.join('\n');
  get('output').hidden=false;
  get('status').textContent='';
  get('message').focus();
});
get('copy').addEventListener('click',async()=>{
  const field=get('message');
  try {
    await navigator.clipboard.writeText(field.value);
    get('status').textContent='문의 문안을 복사했습니다.';
  } catch {
    field.focus();field.select();
    get('status').textContent='선택된 문안을 직접 복사해 주세요.';
  }
});
