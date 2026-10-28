function mountProfileCenter(){
  const form=document.querySelector('#profile-form')
  if(!form||document.querySelector('#profile-center-card'))return
  const card=form.closest('article.card,.card')||form.parentElement
  if(card)card.id='profile-center-card'
  const heading=card?.querySelector('h2')
  if(heading)heading.textContent='Profile & Preferences'
  const note=document.createElement('p')
  note.className='section-note profile-center-note'
  note.textContent='Manage your profile, dashboard preferences, reminders, privacy, and account security.'
  if(heading&&!card.querySelector('.profile-center-note'))heading.insertAdjacentElement('afterend',note)

  const extra=document.createElement('section')
  extra.id='profile-preferences'
  extra.innerHTML=`
    <div class="profile-section">
      <h3>App preferences</h3>
      <label>Default dashboard page
        <select id="profile-default-page">
          <option value="overview">Overview</option><option value="entries">Income & Expenses</option><option value="budgets">Budgets</option><option value="savings">Savings Goals</option><option value="bills">Bills</option><option value="shared">Shared Expenses</option><option value="education">Financial Education</option><option value="profile">Profile</option>
        </select>
      </label>
      <label>Currency
        <select id="profile-currency"><option value="USD">USD — U.S. Dollar</option></select>
      </label>
      <label>Start of week
        <select id="profile-week-start"><option value="sunday">Sunday</option><option value="monday">Monday</option></select>
      </label>
    </div>
    <div class="profile-section">
      <h3>Reminder preferences</h3>
      <label>Default bill reminder
        <select id="profile-reminder-days"><option value="1">1 day before</option><option value="3">3 days before</option><option value="5">5 days before</option><option value="7">7 days before</option></select>
      </label>
      <label class="profile-check"><input type="checkbox" id="profile-goal-reminders"> Show savings-goal reminders in the app</label>
      <label class="profile-check"><input type="checkbox" id="profile-budget-alerts"> Show budget progress alerts in the app</label>
    </div>
    <div class="profile-section">
      <h3>Privacy</h3>
      <label class="profile-check"><input type="checkbox" id="profile-hide-amounts"> Hide money amounts on the Overview page</label>
      <p class="section-note">These display preferences apply to this browser and do not change your underlying financial records.</p>
    </div>
    <div class="profile-section profile-save-section">
      <button type="button" class="btn secondary" id="save-profile-preferences">Save preferences</button>
      <p class="section-note" id="profile-preference-message" aria-live="polite"></p>
    </div>
    <div class="profile-section">
      <h3>Security</h3>
      <p class="section-note">Change your password using the secure account-recovery flow.</p>
      <button type="button" class="btn secondary" id="profile-reset-password">Reset password</button>
    </div>
    <div class="profile-section">
      <h3>Session</h3>
      <p class="section-note">Sign out of Willow Lantern Pay on this device when you are finished.</p>
      <button type="button" class="btn secondary" id="profile-sign-out">Sign out</button>
    </div>`
  card.append(extra)

  const $=id=>document.getElementById(id)
  $('profile-default-page').value=localStorage.getItem('willow-default-page')||'overview'
  $('profile-currency').value=localStorage.getItem('willow-currency')||'USD'
  $('profile-week-start').value=localStorage.getItem('willow-week-start')||'sunday'
  $('profile-reminder-days').value=localStorage.getItem('willow-reminder-days')||'3'
  $('profile-goal-reminders').checked=localStorage.getItem('willow-goal-reminders')!=='false'
  $('profile-budget-alerts').checked=localStorage.getItem('willow-budget-alerts')!=='false'
  $('profile-hide-amounts').checked=localStorage.getItem('willow-hide-amounts')==='true'

  $('save-profile-preferences').onclick=()=>{
    localStorage.setItem('willow-default-page',$('profile-default-page').value)
    localStorage.setItem('willow-currency',$('profile-currency').value)
    localStorage.setItem('willow-week-start',$('profile-week-start').value)
    localStorage.setItem('willow-reminder-days',$('profile-reminder-days').value)
    localStorage.setItem('willow-goal-reminders',String($('profile-goal-reminders').checked))
    localStorage.setItem('willow-budget-alerts',String($('profile-budget-alerts').checked))
    localStorage.setItem('willow-hide-amounts',String($('profile-hide-amounts').checked))
    $('profile-preference-message').textContent='Profile preferences saved.'
  }
  $('profile-reset-password').onclick=()=>{const reset=document.querySelector('#show-reset');document.querySelector('#sign-out')?.click();setTimeout(()=>reset?.click(),250)}
  $('profile-sign-out').onclick=()=>document.querySelector('#sign-out')?.click()

  const style=document.createElement('style')
  style.id='profile-center-style'
  style.textContent=`#profile-preferences{display:grid;gap:18px;margin-top:24px}.profile-section{padding-top:20px;border-top:1px solid rgba(0,0,0,.1)}.profile-section h3{margin:0 0 12px}.profile-section label{display:grid;gap:7px;margin:12px 0;font-weight:700}.profile-section select{width:100%;padding:11px 12px;border:1px solid rgba(0,0,0,.16);border-radius:10px;background:#fff;font:inherit}.profile-check{grid-template-columns:auto 1fr!important;align-items:center;justify-content:start}.profile-check input{width:18px;height:18px;margin:0}.profile-save-section{display:flex;flex-wrap:wrap;align-items:center;gap:14px}`
  if(!document.querySelector('#profile-center-style'))document.head.append(style)
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountProfileCenter,{once:true});else mountProfileCenter()
