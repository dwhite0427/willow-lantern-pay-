const PAGE_GROUPS={
  overview:['#dashboard-home-card'],
  entries:['#entry-form','#entry-items','#history-items','#history-search','#history-kind','#history-from','#history-to','#history-clear'],
  budgets:['#budget-form','#budget-items'],
  savings:['#goal-form','#goal-items'],
  bills:['#bill-form','#bill-items','#reminder-card','#bill-payment-history-items'],
  shared:['#split-form','#split-items'],
  education:['#education-center-card'],
  profile:['#profile-center-card','#profile-form']
}
const TITLES={overview:'Overview',entries:'Income & Expenses',budgets:'Budgets',savings:'Savings Goals',bills:'Bills',shared:'Shared Expenses',education:'Financial Education',profile:'Profile'}
const PAGE_KEY='willow-current-page'

function cardFor(selector){const el=document.querySelector(selector);if(!el)return null;if(el.matches('article.card,.card,.pay-hub,.summary'))return el;return el.closest('article.card,.card')||el}
function allDashboardCards(){return [...document.querySelectorAll('#dashboard article.card,#dashboard .card,#dashboard .pay-hub,#dashboard .summary')].filter((x,i,a)=>a.indexOf(x)===i)}
function selectedCards(name){const set=new Set();for(const s of PAGE_GROUPS[name]||[]){const c=cardFor(s);if(c)set.add(c)}return set}
function showPage(name='overview',options={}){
  const dashboard=document.querySelector('#dashboard');if(!dashboard)return
  const valid=TITLES[name]?name:'overview',selected=selectedCards(valid)
  for(const c of allDashboardCards())c.hidden=!selected.has(c)
  const tools=dashboard.querySelector('.tools');if(tools){for(const child of tools.children)child.hidden=!selected.has(child);tools.hidden=![...tools.children].some(x=>!x.hidden)}
  const paymentGrid=dashboard.querySelector('.payment-grid');if(paymentGrid){for(const child of paymentGrid.children)child.hidden=!selected.has(child);paymentGrid.hidden=![...paymentGrid.children].some(x=>!x.hidden)}
  dashboard.dataset.page=valid
  localStorage.setItem(PAGE_KEY,valid)
  const title=document.querySelector('#welcome');if(title)title.textContent=TITLES[valid]
  const subtitle=document.querySelector('#account-email');if(subtitle)subtitle.hidden=true
  if(location.hash!==`#${valid}`)history.replaceState(null,'',`#${valid}`)
  if(!options.restore)window.scrollTo({top:0,behavior:'smooth'})
}

function wireMenu(){
  const menu=document.querySelector('#dashboard-menu');if(!menu)return
  const map=[['Overview','overview'],['Profile','profile'],['Income & Expenses','entries'],['Budgets','budgets'],['Savings Goals','savings'],['Bills','bills'],['Shared Expenses','shared'],['Financial Education','education']]
  for(const [label,page] of map){const b=[...menu.querySelectorAll('.dashboard-menu-item')].find(x=>x.textContent.trim()===label);if(b)b.onclick=()=>{showPage(page);menu.hidden=true;document.querySelector('#dashboard-menu-button')?.setAttribute('aria-expanded','false')}}
}

function restoredPage(){const hash=location.hash.slice(1);if(TITLES[hash])return hash;const saved=localStorage.getItem(PAGE_KEY);if(TITLES[saved])return saved;const preferred=localStorage.getItem('willow-default-page');return TITLES[preferred]?preferred:'overview'}
function mount(){
  const dashboard=document.querySelector('#dashboard');if(!dashboard)return
  const style=document.createElement('style');style.id='focused-dashboard-pages';style.textContent=`#dashboard[data-page] .card[hidden],#dashboard[data-page] .summary[hidden],#dashboard[data-page] .payment-grid[hidden],#dashboard[data-page] .pay-hub[hidden],#dashboard[data-page] .tools[hidden]{display:none!important}`;document.head.append(style)
  const init=()=>{wireMenu();showPage(restoredPage(),{restore:true})}
  init();setTimeout(init,250);setTimeout(init,900)
  window.addEventListener('hashchange',()=>showPage(location.hash.slice(1)||localStorage.getItem(PAGE_KEY)||'overview'))
  window.addEventListener('pageshow',()=>setTimeout(()=>showPage(restoredPage(),{restore:true}),0))
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount()
