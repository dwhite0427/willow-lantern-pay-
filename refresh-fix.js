// Refresh stability: keep the app hidden until Supabase restores the persisted session,
// and force the browser to revalidate the document/modules instead of showing stale UI.
const style=document.createElement('style')
style.id='refresh-stability-style'
style.textContent='html.willow-auth-loading body{visibility:hidden}'
document.head.append(style)

// app.js restores the persisted Supabase session on startup. Give it a short window to
// resolve before revealing either the dashboard or login UI, preventing auth flicker.
document.documentElement.classList.add('willow-auth-loading')
const reveal=()=>document.documentElement.classList.remove('willow-auth-loading')
const ready=()=>{
  const auth=document.querySelector('#auth-panel')
  const dashboard=document.querySelector('#dashboard')
  if(!auth||!dashboard)return false
  // renderAuth has resolved when exactly one of these application states is visible.
  return auth.hidden!==dashboard.hidden
}
let checks=0
const timer=setInterval(()=>{
  checks++
  if(ready()||checks>=40){clearInterval(timer);reveal()}
},50)
window.addEventListener('pageshow',e=>{if(e.persisted)location.reload()})
setTimeout(reveal,2500)
