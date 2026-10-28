function mountProfileCenter(){
  const form=document.querySelector('#profile-form')
  if(!form||document.querySelector('#profile-center-card'))return
  const card=form.closest('article.card,.card')||form.parentElement
  if(card)card.id='profile-center-card'
  const heading=card?.querySelector('h2')
  if(heading)heading.textContent='Profile & Preferences'
  const note=document.createElement('p')
  note.className='section-note'
  note.textContent='Manage the personal settings used by your Willow Lantern Pay money-management tools.'
  if(heading&&!card.querySelector('.profile-center-note')){note.classList.add('profile-center-note');heading.insertAdjacentElement('afterend',note)}

  const extra=document.createElement('section')
  extra.id='profile-preferences'
  extra.innerHTML=`
    <div class="profile-section">
      <h3>Account preferences</h3>
      <label>Default dashboard page
        <select id="profile-default-page">
          <option value="overview">Overview</option><option value="entries">Income & Expenses</option><option value="budgets">Budgets</option><option value="savings">Savings Goals</option><option value="bills">Bills</option><option value="shared">Shared Expenses</option><option value="education">Financial Education</option>
        </select>
      </label>
      <label>Currency
        <select id="profile-currency"><option value="USD">USD — U.S. Dollar</option></select>
      </label>
      <button type="button" class="btn secondary" id="save-profile-preferences">Save preferences</button>
      <p class="section-note" id="profile-preference-message" aria-live="polite"></p>
    </div>
    <div class="profile-section">
      <h3>Security</h3>
      <p class="section-note">Use password reset to change the password for this account. A reset link is sent through the existing secure account recovery flow.</p>
      <button type="button" class="btn secondary" id="profile-reset-password">Reset password</button>
    </div>`
  card.append(extra)

  const page=document.querySelector('#profile-default-page')
  const currency=document.querySelector('#profile-currency')
  page.value=localStorage.getItem('willow-default-page')||'overview'
  currency.value=localStorage.getItem('willow-currency')||'USD'
  document.querySelector('#save-profile-preferences').onclick=()=>{
    localStorage.setItem('willow-default-page',page.value)
    localStorage.setItem('willow-currency',currency.value)
    document.querySelector('#profile-preference-message').textContent='Preferences saved.'
  }
  document.querySelector('#profile-reset-password').onclick=()=>{
    const reset=document.querySelector('#show-reset')
    const signOut=document.querySelector('#sign-out')
    if(signOut)signOut.click()
    setTimeout(()=>reset?.click(),250)
  }

  const style=document.createElement('style')
  style.textContent=`#profile-preferences{display:grid;gap:18px;margin-top:24px}.profile-section{padding-top:20px;border-top:1px solid rgba(0,0,0,.1)}.profile-section h3{margin:0 0 12px}.profile-section label{display:grid;gap:7px;margin:12px 0;font-weight:700}.profile-section select{width:100%;padding:11px 12px;border:1px solid rgba(0,0,0,.16);border-radius:10px;background:#fff;font:inherit}`
  document.head.append(style)
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountProfileCenter,{once:true});else mountProfileCenter()
