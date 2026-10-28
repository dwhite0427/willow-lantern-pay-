// Refresh/session stability for Willow Lantern Pay.
// Restore the persisted Supabase session directly on page load so an iPhone/Safari
// refresh cannot expose the static login screen while app.js is still resolving auth.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.102.0'

const supabase=createClient('https://vrgimzvmdwwrstonrbcf.supabase.co','sb_publishable_8ex4YVbGREfk93IGLBMG-g_hyZZRmLl',{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}})
const style=document.createElement('style')
style.id='refresh-stability-style'
style.textContent=`html.willow-auth-loading #auth-panel{display:none!important}html.willow-auth-loading #dashboard{visibility:hidden!important}html.willow-auth-loading #dashboard-menu-button{display:none!important}`
document.head.append(style)
document.documentElement.classList.add('willow-auth-loading')

const auth=document.querySelector('#auth-panel')
const dashboard=document.querySelector('#dashboard')
const signOut=document.querySelector('#sign-out')
let resolved=false

function applySession(session){
 const signedIn=!!session?.user
 if(auth)auth.hidden=signedIn
 if(dashboard)dashboard.hidden=!signedIn
 if(signOut)signOut.hidden=!signedIn
 if(signedIn){
  const email=document.querySelector('#account-email')
  const welcome=document.querySelector('#welcome')
  if(email)email.textContent=session.user.email||''
  if(welcome)welcome.textContent=session.user.user_metadata?.full_name?`Welcome, ${session.user.user_metadata.full_name}`:'Your money overview'
 }
 resolved=true
 document.documentElement.classList.remove('willow-auth-loading')
 window.dispatchEvent(new CustomEvent('willow-auth-resolved',{detail:{signedIn}}))
}

async function restore(){
 try{
  const {data,error}=await supabase.auth.getSession()
  if(error)throw error
  applySession(data.session)
 }catch(_error){
  // A genuine session-read failure should not destroy a locally persisted session
  // or force a sign-out. Let app.js retry while keeping the auth surface hidden.
  setTimeout(async()=>{
   try{const {data}=await supabase.auth.getSession();applySession(data.session)}
   catch(_){resolved=true;document.documentElement.classList.remove('willow-auth-loading')}
  },1200)
 }
}

supabase.auth.onAuthStateChange((_event,session)=>applySession(session))
restore()

// Safari's back-forward cache can restore stale DOM. Re-read the persisted session
// instead of reloading into the static logged-out markup.
window.addEventListener('pageshow',event=>{
 if(!event.persisted)return
 resolved=false
 document.documentElement.classList.add('willow-auth-loading')
 restore()
})

setTimeout(()=>{if(!resolved)document.documentElement.classList.remove('willow-auth-loading')},8000)
