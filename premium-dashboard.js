import './premium-features.js'

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

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountPremiumInsights,{once:true});else mountPremiumInsights()
