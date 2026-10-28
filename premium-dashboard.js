import './premium-features.js'
import './financial-coach.js'
import './spending-insights.js'

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
  if(tabs){
    tabs.classList.add('auth-actions-bottom')
    if(message)auth.insertBefore(tabs,message)
    else auth.append(tabs)
  }

  const style=document.createElement('style')
  style.id='landing-layout-style'
  style.textContent=`
    body:has(#auth-panel:not([hidden])) .landing-nav-brand{visibility:hidden}
    #auth-panel{margin:42px auto 40px;max-width:520px}
    #auth-panel>h2{text-align:center;font-size:2.15rem;margin:0 0 24px;font-weight:850}
    #auth-panel form{margin:0}
    #auth-panel .auth-actions-bottom{display:grid;grid-template-columns:1fr;gap:10px;margin:16px 0 0}
    #auth-panel .auth-actions-bottom .tab{width:100%;padding:12px 16px;font-weight:750;cursor:pointer}
    #auth-panel #show-login{display:none}
    #auth-panel #show-signup{display:block}
    #auth-panel #show-reset{display:block}
    @media(min-width:560px){#auth-panel{margin-top:58px}}
  `
  if(!document.querySelector('#landing-layout-style'))document.head.append(style)
}

function mountPremiumInsights(){
  const dashboard=document.querySelector('#dashboard')
  if(!dashboard||document.querySelector('#premium-insights-card'))return
  const anchor=document.querySelector('#bill-payment-history-items')?.closest('article.card')||document.querySelector('#history-items')?.closest('article.card')
  const card=document.createElement('article')
  card.id='premium-insights-card'
  card.className='card'
  card.innerHTML='<span class="eyebrow">Premium</span><h2>Premium Insights</h2><p class="section-note">Enhanced software-only insights based on your Willow Lantern Pay planning records. These are not bank transactions or individualized financial advice.</p><div data-premium-lock><p class="section-note">Premium insights are locked. Upgrade to Willow Lantern Pay Premium to access them.</p></div><div id="premium-insights" data-premium-feature hidden></div>'
  if(anchor)anchor.insertAdjacentElement('afterend',card);else dashboard.append(card)
  import('./premium-insights.js')
}

function mount(){simplifyLanding();mountPremiumInsights()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount()
