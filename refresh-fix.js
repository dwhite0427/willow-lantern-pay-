// Refresh/session stability for Willow Lantern Pay.
// Never expose the login screen until Supabase has had time to restore a persisted session.
const style=document.createElement('style')
style.id='refresh-stability-style'
style.textContent=`html.willow-auth-loading #auth-panel{display:none!important}html.willow-auth-loading #dashboard{visibility:hidden}html.willow-auth-loading #dashboard-menu-button{display:none!important}`
document.head.append(style)
document.documentElement.classList.add('willow-auth-loading')

const reveal=()=>document.documentElement.classList.remove('willow-auth-loading')
const settled=()=>{
  const auth=document.querySelector('#auth-panel')
  const dashboard=document.querySelector('#dashboard')
  if(!auth||!dashboard)return false
  return auth.hidden!==dashboard.hidden
}

// app.js owns authentication. Wait for its persisted-session check instead of
// allowing the initial HTML/login state to flash during a reload.
let checks=0
const timer=setInterval(()=>{
  checks++
  if(settled()||checks>=80){clearInterval(timer);reveal()}
},50)

// iOS/Safari can restore an old DOM snapshot from the back-forward cache.
// Revalidate once when that happens so removed features cannot reappear.
window.addEventListener('pageshow',event=>{
  if(event.persisted){
    document.documentElement.classList.add('willow-auth-loading')
    location.reload()
  }
})

setTimeout(reveal,4500)
