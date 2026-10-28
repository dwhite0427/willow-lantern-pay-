function syncSubscription(){
  const status=document.querySelector('#profile-subscription-status')
  const billing=document.querySelector('#profile-subscription-renewal')
  const action=document.querySelector('#profile-subscription-action')
  const premiumButton=document.querySelector('#premium-upgrade')
  const premiumMessage=document.querySelector('#premium-message')
  if(!status||!action)return
  const active=premiumButton?.disabled||/premium active/i.test(premiumButton?.textContent||'')
  status.textContent=active?'Premium':'Free'
  billing.textContent=active?(premiumMessage?.textContent?.trim()||'Active'):'—'
  action.textContent=active?'Premium Active':'Upgrade to Premium'
  action.disabled=!!active
}

function syncAccount(){
  const source=document.querySelector('#account-email')
  const target=document.querySelector('#profile-account-email')
  if(target)target.textContent=source?.textContent?.trim()||'—'
}

function mountProfileCenter(){
  const form=document.querySelector('#profile-form')
  if(!form||document.querySelector('#profile-center-card'))return
  const card=form.closest('article.card,.card')||form.parentElement
  if(card)card.id='profile-center-card'
  const heading=card?.querySelector('h2');if(heading)heading.textContent='Profile'

  const extra=document.createElement('section');extra.id='profile-preferences'
  extra.innerHTML=`
    <div class="profile-section profile-identity"><div class="profile-avatar" id="profile-avatar">WL</div><div><h3 id="profile-name-preview">My Profile</h3><span id="profile-handle-preview">Willow Lantern Pay</span></div></div>
    <div class="profile-section"><h3>Personal details</h3><label>Display name<input id="profile-display-name" type="text" autocomplete="name" placeholder="Display name"></label><label>Phone number<input id="profile-phone" type="tel" autocomplete="tel" placeholder="Phone number"></label><label>Payment username<input id="profile-payment-username" type="text" placeholder="Username"></label><label>Time zone<select id="profile-timezone"><option value="America/New_York">Eastern Time</option><option value="America/Chicago">Central Time</option><option value="America/Denver">Mountain Time</option><option value="America/Los_Angeles">Pacific Time</option></select></label></div>
    <div class="profile-section"><h3>Account</h3><div class="profile-info-grid"><div><span>Email</span><strong id="profile-account-email">—</strong></div></div></div>
    <div class="profile-section" id="profile-subscription-section"><h3>Subscription</h3><div class="profile-subscription-card"><div><span>Plan</span><strong id="profile-subscription-status">Free</strong></div><div><span>Billing</span><strong id="profile-subscription-renewal">—</strong></div><button type="button" class="btn secondary" id="profile-subscription-action">Upgrade to Premium</button></div></div>
    <div class="profile-section"><h3>App preferences</h3><label>Default page<select id="profile-default-page"><option value="overview">Overview</option><option value="entries">Income & Expenses</option><option value="budgets">Budgets</option><option value="savings">Savings Goals</option><option value="bills">Bills</option><option value="shared">Shared Expenses</option><option value="education">Financial Education</option><option value="profile">Profile</option></select></label><label>Currency<select id="profile-currency"><option value="USD">USD — U.S. Dollar</option></select></label><label>Start of week<select id="profile-week-start"><option value="sunday">Sunday</option><option value="monday">Monday</option></select></label></div>
    <div class="profile-section"><h3>Notifications</h3><label>Bill reminder<select id="profile-reminder-days"><option value="1">1 day before</option><option value="3">3 days before</option><option value="5">5 days before</option><option value="7">7 days before</option></select></label><label class="profile-check"><input type="checkbox" id="profile-goal-reminders"> Savings goal reminders</label><label class="profile-check"><input type="checkbox" id="profile-budget-alerts"> Budget alerts</label><label class="profile-check"><input type="checkbox" id="profile-bill-alerts"> Bill alerts</label></div>
    <div class="profile-section"><h3>Privacy & display</h3><label class="profile-check"><input type="checkbox" id="profile-hide-amounts"> Hide amounts on Overview</label><label class="profile-check"><input type="checkbox" id="profile-compact-mode"> Compact dashboard layout</label></div>
    <div class="profile-section profile-save-section"><button type="button" class="btn secondary" id="save-profile-preferences">Save profile</button><span id="profile-preference-message" aria-live="polite"></span></div>
    <div class="profile-section"><h3>Security</h3><div class="profile-action-grid"><button type="button" class="btn secondary" id="profile-reset-password">Reset password</button><button type="button" class="btn secondary" id="profile-sign-out">Sign out</button></div></div>`
  card.append(extra)
  const $=id=>document.getElementById(id),get=(key,fallback='')=>localStorage.getItem(key)??fallback
  $('profile-display-name').value=get('willow-display-name');$('profile-phone').value=get('willow-phone');$('profile-payment-username').value=get('willow-payment-username');$('profile-timezone').value=get('willow-timezone','America/New_York');$('profile-default-page').value=get('willow-default-page','overview');$('profile-currency').value=get('willow-currency','USD');$('profile-week-start').value=get('willow-week-start','sunday');$('profile-reminder-days').value=get('willow-reminder-days','3');$('profile-goal-reminders').checked=get('willow-goal-reminders','true')!=='false';$('profile-budget-alerts').checked=get('willow-budget-alerts','true')!=='false';$('profile-bill-alerts').checked=get('willow-bill-alerts','true')!=='false';$('profile-hide-amounts').checked=get('willow-hide-amounts','false')==='true';$('profile-compact-mode').checked=get('willow-compact-mode','false')==='true'
  const updatePreview=()=>{const name=$('profile-display-name').value.trim()||'My Profile';$('profile-name-preview').textContent=name;const initials=name==='My Profile'?'WL':name.split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()||'').join('');$('profile-avatar').textContent=initials||'WL';$('profile-handle-preview').textContent=$('profile-payment-username').value.trim()||'Willow Lantern Pay'}
  updatePreview();$('profile-display-name').addEventListener('input',updatePreview);$('profile-payment-username').addEventListener('input',updatePreview)
  $('save-profile-preferences').onclick=()=>{const values={'willow-display-name':$('profile-display-name').value.trim(),'willow-phone':$('profile-phone').value.trim(),'willow-payment-username':$('profile-payment-username').value.trim(),'willow-timezone':$('profile-timezone').value,'willow-default-page':$('profile-default-page').value,'willow-currency':$('profile-currency').value,'willow-week-start':$('profile-week-start').value,'willow-reminder-days':$('profile-reminder-days').value,'willow-goal-reminders':String($('profile-goal-reminders').checked),'willow-budget-alerts':String($('profile-budget-alerts').checked),'willow-bill-alerts':String($('profile-bill-alerts').checked),'willow-hide-amounts':String($('profile-hide-amounts').checked),'willow-compact-mode':String($('profile-compact-mode').checked)};Object.entries(values).forEach(([k,v])=>localStorage.setItem(k,v));updatePreview();$('profile-preference-message').textContent='Saved';setTimeout(()=>{$('profile-preference-message').textContent=''},1800)}
  $('profile-subscription-action').onclick=()=>{const upgrade=document.querySelector('#premium-upgrade');if(upgrade&&!upgrade.disabled)upgrade.click()}
  $('profile-reset-password').onclick=()=>{const reset=document.querySelector('#show-reset');document.querySelector('#sign-out')?.click();setTimeout(()=>reset?.click(),250)}
  $('profile-sign-out').onclick=()=>document.querySelector('#sign-out')?.click()
  const style=document.createElement('style');style.id='profile-center-style';style.textContent=`#profile-preferences{display:grid;gap:18px;margin-top:24px}.profile-section{padding-top:20px;border-top:1px solid rgba(0,0,0,.1)}.profile-section h3{margin:0 0 12px}.profile-section label{display:grid;gap:7px;margin:12px 0;font-weight:700}.profile-section input[type=text],.profile-section input[type=tel],.profile-section select{width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid rgba(0,0,0,.16);border-radius:10px;background:#fff;font:inherit}.profile-identity{display:flex;align-items:center;gap:14px;border-top:0;padding-top:0}.profile-avatar{width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:#eef4ef;font-weight:850;font-size:1.15rem}.profile-identity h3{margin:0 0 4px}.profile-identity span,.profile-info-grid span,.profile-subscription-card span{font-size:.82rem;color:#66756c}.profile-info-grid{display:grid;grid-template-columns:1fr;gap:10px}.profile-info-grid>div,.profile-subscription-card{padding:14px;border:1px solid rgba(0,0,0,.1);border-radius:12px}.profile-info-grid strong,.profile-subscription-card strong{display:block;margin-top:5px;word-break:break-word}.profile-subscription-card{display:grid;grid-template-columns:1fr 1fr auto;align-items:center;gap:12px}.profile-check{grid-template-columns:auto 1fr!important;align-items:center;justify-content:start}.profile-check input{width:18px;height:18px;margin:0}.profile-save-section{display:flex;flex-wrap:wrap;align-items:center;gap:14px}.profile-action-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:600px){.profile-action-grid,.profile-subscription-card{grid-template-columns:1fr}}`;if(!document.querySelector('#profile-center-style'))document.head.append(style)
  syncAccount();syncSubscription();setTimeout(()=>{syncAccount();syncSubscription()},800)
  const observer=new MutationObserver(()=>{syncAccount();syncSubscription()});const premium=document.querySelector('#premium-upgrade')?.parentElement;if(premium)observer.observe(premium,{subtree:true,childList:true,characterData:true,attributes:true})
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountProfileCenter,{once:true});else mountProfileCenter()
