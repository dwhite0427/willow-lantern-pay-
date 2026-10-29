import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.102.0'
const supabase=createClient('https://vrgimzvmdwwrstonrbcf.supabase.co','sb_publishable_8ex4YVbGREfk93IGLBMG-g_hyZZRmLl',{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true,lock:async(name,timeout,fn)=>fn()}})

let currentUser=null
const fmt=d=>d?new Date(d).toLocaleString():'—'

async function refreshSecurity(){
 const {data}=await supabase.auth.getSession();currentUser=data.session?.user||null
 const user=currentUser
 const email=document.querySelector('#security-email'),status=document.querySelector('#security-email-status'),created=document.querySelector('#security-created'),last=document.querySelector('#security-last-signin'),provider=document.querySelector('#security-provider'),session=document.querySelector('#security-session-status')
 if(email)email.textContent=user?.email||'—'
 if(status)status.textContent=user?.email_confirmed_at?'Verified':'Pending'
 if(created)created.textContent=fmt(user?.created_at)
 if(last)last.textContent=fmt(user?.last_sign_in_at)
 if(provider)provider.textContent=(user?.app_metadata?.provider||'email').replace(/^./,x=>x.toUpperCase())
 if(session)session.textContent=user?'Signed in':'Signed out'
}

async function mountAccountSettings(){
 const dashboard=document.querySelector('#dashboard');if(!dashboard||document.querySelector('#account-settings-card'))return
 const card=document.createElement('article');card.id='account-settings-card';card.className='card';card.hidden=true
 card.innerHTML=`<h2>Account & Security</h2><div class="account-settings-grid"><section><h3>Account</h3><div class="account-row"><span>Email</span><strong id="security-email">—</strong></div><div class="account-row"><span>Email status</span><strong id="security-email-status">—</strong></div><div class="account-row"><span>Account created</span><strong id="security-created">—</strong></div><div class="account-row"><span>Last sign in</span><strong id="security-last-signin">—</strong></div><div class="account-row"><span>Sign-in method</span><strong id="security-provider">—</strong></div></section><section><h3>Password</h3><button type="button" class="btn secondary" id="security-reset-password">Reset password</button></section><section><h3>Session</h3><div class="account-row"><span>Status</span><strong id="security-session-status">—</strong></div><button type="button" class="btn secondary" id="security-refresh-session">Refresh session</button><button type="button" class="btn secondary" id="security-signout">Sign out</button></section></div><span id="security-message" aria-live="polite"></span>`
 dashboard.append(card)
 const style=document.createElement('style');style.id='account-settings-style';style.textContent=`#account-settings-card{max-width:760px}.account-settings-grid{display:grid;gap:18px}.account-settings-grid section{padding:16px;border:1px solid rgba(0,0,0,.1);border-radius:14px}.account-settings-grid h3{margin:0 0 12px}.account-row{display:flex;justify-content:space-between;gap:18px;padding:9px 0;border-bottom:1px solid rgba(0,0,0,.07)}.account-row:last-of-type{border-bottom:0}.account-row span{color:#66756c}.account-row strong{text-align:right;word-break:break-word}.account-settings-grid button{margin:8px 8px 0 0}#security-message{display:block;margin-top:12px;min-height:1.2em}@media(max-width:600px){.account-row{display:grid;gap:4px}.account-row strong{text-align:left}.account-settings-grid button{width:100%;margin-right:0}}`;document.head.append(style)
 await refreshSecurity()
 document.querySelector('#security-reset-password').onclick=async()=>{const email=currentUser?.email;if(!email)return;const message=document.querySelector('#security-message');message.textContent='Sending…';const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:location.origin});message.textContent=error?'Unable to send reset email':'Password reset email sent'}
 document.querySelector('#security-refresh-session').onclick=async()=>{const message=document.querySelector('#security-message');message.textContent='Refreshing…';const {error}=await supabase.auth.refreshSession();await refreshSecurity();message.textContent=error?'Unable to refresh session':'Session refreshed'}
 document.querySelector('#security-signout').onclick=()=>document.querySelector('#sign-out')?.click()
 supabase.auth.onAuthStateChange(()=>setTimeout(refreshSecurity,0))
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountAccountSettings,{once:true});else mountAccountSettings()
