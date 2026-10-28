import { initPremiumInsights } from '/premium-insights.js'

const dashboard=document.querySelector('#dashboard')
if(dashboard){
  const card=document.createElement('article')
  card.className='card premium-insights-card'
  card.setAttribute('aria-labelledby','premium-insights-title')
  card.innerHTML=`<span class="eyebrow">Premium software feature</span><h2 id="premium-insights-title">Premium Insights</h2><p class="section-note">Enhanced analysis of your Willow Lantern Pay planning records. This does not analyze or move bank funds.</p><div id="premium-insights" class="items"><div class="item">Checking Premium access…</div></div>`
  const history=document.querySelector('#history-items')?.closest('article')
  if(history) history.insertAdjacentElement('afterend',card)
  else dashboard.append(card)
  initPremiumInsights(document.querySelector('#premium-insights'))
}
