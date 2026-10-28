// Refresh/session stability for Willow Lantern Pay.
// app.js owns authentication; this module only prevents stale/login UI from flashing
// while Supabase restores the persisted session.
const style=document.createElement('style')
style.id='refresh-stability-style'
style.textContent=`html.willow-auth-loading #auth-panel{display:none!important}html.willow-auth-loading #dashboard{visibility:hidden!important}html.willow-auth-loading #dashboard-menu-button{display:none!important}`
document.head.append(style)
document.documentElement.classList.add('willow-auth-loading')

let authResolved=false
const reveal=()=>{authResolved=true;document.documentElement.classList.remove('willow-auth-loading')}

// Do not use the initial hidden attributes as proof that auth has resolved: those
// attributes come from the static HTML and caused the previous refresh race.
window.addEventListener('willow-auth-resolved',reveal,{once:true})

// Fallback: wait until app.js has actually populated an authenticated dashboard.
const timer=setInterval(()=>{
 const dashboard=document.querySelector('#dashboard')
 const auth=document.querySelector('#auth-panel')
 const signedIn=dashboard&&!dashboard.hidden&&(document.querySelector('#welcome')?.textContent||'').trim().length>0
 const signedOut=auth&&!auth.hidden&&dashboard?.hidden
 if(signedIn||signedOut){clearInterval(timer);reveal()}
},75)

// iOS/Safari may restore an old DOM snapshot. Hide it immediately, then let app.js
// re-check Supabase rather than showing the stale snapshot to the user.
window.addEventListener('pageshow',event=>{
 if(!event.persisted)return
 authResolved=false
 document.documentElement.classList.add('willow-auth-loading')
 setTimeout(()=>location.reload(),0)
})

// Never leave the page permanently hidden if a network/auth request fails.
setTimeout(()=>{if(!authResolved)reveal()},8000)
