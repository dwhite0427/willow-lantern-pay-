const PAGE_GROUPS={
  overview:['#dashboard-home-card','.pay-hub','.payment-grid','#reminder-card','.summary','#financial-coach-card','#spending-insights-card','#monthly-cash-flow-card','#premium-insights-card'],
  entries:['#entry-form'],
  budgets:['#budget-form'],
  savings:['#goal-form'],
  bills:['#bill-form','#bill-payment-history-items'],
  shared:['#split-form'],
  profile:['#profile-form']
}
const TITLES={overview:'Overview',entries:'Income & Expenses',budgets:'Budgets',savings:'Savings Goals',bills:'Bills',shared:'Shared Expenses',profile:'Profile'}

function cardFor(selector){const el=document.querySelector(selector);if(!el)return null;if(el.matches('article.card,.card,.pay-hub,.summary,.payment-grid'))return el;return el.closest('article.card,.card')||el}
function allPageCards(){const set=new Set();for(const selectors of Object.values(PAGE_GROUPS))for(const s of selectors){const c=cardFor(s);if(c)set.add(c)}return [...set]}
function showPage(name='overview'){
  const dashboard=document.querySelector('#dashboard');if(!dashboard)return
  const valid=TITLES[name]?name:'overview';const selected=new Set()
  for(const s of PAGE_GROUPS[valid]){const c=cardFor(s);if(c)selected.add(c)}
  for(const c of allPageCards())c.hidden=!selected.has(c)
  const tools=dashboard.querySelector('.tools');if(tools){const visible=[...tools.children].some(x=>!x.hidden);tools.hidden=!visible}
  dashboard.dataset.page=valid
  const title=document.querySelector('#welcome');if(title)title.textContent=TITLES[valid]
  history.replaceState(null,'',`#${valid}`)
  window.scrollTo({top:0,behavior:'smooth'})
}

function wireMenu(){
  const menu=document.querySelector('#dashboard-menu');if(!menu)return
  const map=[['Overview','overview'],['Income & Expenses','entries'],['Budgets','budgets'],['Savings Goals','savings'],['Bills','bills'],['Shared Expenses','shared'],['Profile','profile']]
  for(const [label,page] of map){const b=[...menu.querySelectorAll('.dashboard-menu-item')].find(x=>x.textContent.trim()===label);if(b)b.onclick=()=>{showPage(page);menu.hidden=true;document.querySelector('#dashboard-menu-button')?.setAttribute('aria-expanded','false')}}
}

function mount(){
  const dashboard=document.querySelector('#dashboard');if(!dashboard)return
  const style=document.createElement('style');style.textContent=`#dashboard[data-page]>.tools{display:grid}#dashboard[data-page] .card[hidden],#dashboard[data-page] .summary[hidden],#dashboard[data-page] .payment-grid[hidden],#dashboard[data-page] .pay-hub[hidden]{display:none!important}`;document.head.append(style)
  const init=()=>{wireMenu();showPage(location.hash.slice(1)||'overview')}
  setTimeout(init,500)
  window.addEventListener('hashchange',()=>showPage(location.hash.slice(1)||'overview'))
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount()
