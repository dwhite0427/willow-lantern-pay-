import './premium-features.js'
import './financial-coach.js'
import './spending-insights.js'
import './dashboard-home.js'
import './financial-education.js'
import './dashboard-pages.js'

function simplifyLanding(){
  const hero=document.querySelector('.hero')
  if(hero)hero.remove()
  const auth=document.querySelector('#auth-panel')
  if(!auth)return
  const heading=auth.querySelector('h2')
  if(heading)heading.textContent='Willow Lantern Pay'
  const navBrand=document.querySelector('.nav .brand')
  if(navBrand)navBrand.classList.add('landing-nav-brand')
  const tabs=auth.querySelector('.tabs')
  const message=document.querySelector('#auth-message')
  if(tabs){tabs.classList.add('auth-actions-bottom');if(message)auth.insertBefore(tabs,message);else auth.append(tabs)}
  const style=document.createElement('style')
  style.id='landing-layout-style'
  style.textContent=`body:has(#auth-panel:not([hidden])) .landing-nav-brand{visibility:hidden}#auth-panel{margin:42px auto 40px;max-width:520px}#auth-panel>h2{text-align:center;font-size:2.15rem;margin:0 0 24px;font-weight:850}#auth-panel form{margin:0}#auth-panel .auth-actions-bottom{display:grid;grid-template-columns:1fr;gap:10px;margin:16px 0 0}#auth-panel .auth-actions-bottom .tab{width:100%;padding:12px 16px;font-weight:750;cursor:pointer}#auth-panel #show-login{display:none}#auth-panel #show-signup{display:block}#auth-panel #show-reset{display:block}@media(min-width:560px){#auth-panel{margin-top:58px}}`
  if(!document.querySelector('#landing-layout-style'))document.head.append(style)
}

function cleanDashboardHeader(){
  const dashboard=document.querySelector('#dashboard')
  if(!dashboard)return
  const email=document.querySelector('#account-email')
  if(email)email.style.display='none'
  const walker=document.createTreeWalker(dashboard,NodeFilter.SHOW_ELEMENT)
  const remove=[]
  while(walker.nextNode()){
    const el=walker.currentNode
    if(el.children.length===0&&el.textContent.trim().toUpperCase()==='AUTHENTICATED DASHBOARD')remove.push(el)
  }
  remove.forEach(el=>el.remove())
}

function mountDashboardMenu(){
  const dashboard=document.querySelector('#dashboard')
  if(!dashboard||document.querySelector('#dashboard-menu-button'))return
  const button=document.createElement('button');button.id='dashboard-menu-button';button.type='button';button.setAttribute('aria-label','Open dashboard menu');button.setAttribute('aria-expanded','false');button.innerHTML='<span></span><span></span><span></span>'
  const menu=document.createElement('nav');menu.id='dashboard-menu';menu.setAttribute('aria-label','Dashboard pages');menu.hidden=true
  for(const label of ['Overview','Income & Expenses','Budgets','Savings Goals','Bills','Shared Expenses','Financial Education','Profile']){const link=document.createElement('button');link.type='button';link.className='dashboard-menu-item';link.textContent=label;menu.append(link)}
  const signOut=document.querySelector('#sign-out')
  if(signOut){const logout=document.createElement('button');logout.type='button';logout.className='dashboard-menu-item dashboard-menu-signout';logout.textContent='Sign out';logout.onclick=()=>{menu.hidden=true;button.setAttribute('aria-expanded','false');signOut.click()};menu.append(logout)}
  button.onclick=e=>{e.stopPropagation();menu.hidden=!menu.hidden;button.setAttribute('aria-expanded',String(!menu.hidden))};menu.onclick=e=>e.stopPropagation();document.addEventListener('click',()=>{if(!menu.hidden){menu.hidden=true;button.setAttribute('aria-expanded','false')}});document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.hidden=true;button.setAttribute('aria-expanded','false')}});document.body.append(button,menu)
  const style=document.createElement('style');style.id='dashboard-menu-style';style.textContent=`#dashboard-menu-button{position:fixed;top:18px;left:18px;z-index:1001;width:46px;height:46px;border:1px solid rgba(0,0,0,.12);border-radius:12px;background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.12);display:none;align-items:center;justify-content:center;flex-direction:column;gap:5px;cursor:pointer}#dashboard-menu-button span{display:block;width:22px;height:2px;background:#1d2421;border-radius:2px}#dashboard-menu{position:fixed;top:72px;left:18px;z-index:1000;width:min(290px,calc(100vw - 36px));padding:10px;background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:16px;box-shadow:0 18px 45px rgba(0,0,0,.16)}#dashboard-menu[hidden]{display:none}.dashboard-menu-item{display:block;width:100%;border:0;background:transparent;text-align:left;padding:12px 14px;border-radius:10px;font:inherit;font-weight:700;cursor:pointer;color:#1d2421}.dashboard-menu-item:hover,.dashboard-menu-item:focus{background:rgba(0,0,0,.055);outline:none}.dashboard-menu-signout{margin-top:6px;border-top:1px solid rgba(0,0,0,.08);border-radius:0 0 10px 10px}body:has(#dashboard:not([hidden])) #dashboard-menu-button{display:flex}body:has(#auth-panel:not([hidden])) #dashboard-menu-button,body:has(#auth-panel:not([hidden])) #dashboard-menu{display:none}`;document.head.append(style)
}

function mountPremiumInsights(){const dashboard=document.querySelector('#dashboard');if(!dashboard||document.querySelector('#premium-insights-card'))return;const anchor=document.querySelector('#bill-payment-history-items')?.closest('article.card')||document.querySelector('#history-items')?.closest('article.card');const card=document.createElement('article');card.id='premium-insights-card';card.className='card';card.innerHTML='<span class="eyebrow">Premium</span><h2>Premium Insights</h2><p class="section-note">Enhanced software-only insights based on your Willow Lantern Pay planning records. These are not bank transactions or individualized financial advice.</p><div data-premium-lock><p class="section-note">Premium insights are locked. Upgrade to Willow Lantern Pay Premium to access them.</p></div><div id="premium-insights" data-premium-feature hidden></div>';if(anchor)anchor.insertAdjacentElement('afterend',card);else dashboard.append(card);import('./premium-insights.js')}
function mount(){simplifyLanding();cleanDashboardHeader();mountDashboardMenu();mountPremiumInsights()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount()
