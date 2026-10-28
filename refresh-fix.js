// Refresh/session stability for Willow Lantern Pay.
// Authentication itself is owned by auth-stability.js. This module only prevents
// the static signed-out markup from flashing while the persisted session resolves.
const style=document.createElement('style')
style.id='refresh-stability-style'
style.textContent=`html.willow-auth-loading #auth-panel{display:none!important}html.willow-auth-loading #dashboard{visibility:hidden!important}html.willow-auth-loading #dashboard-menu-button{display:none!important}`
document.head.append(style)
document.documentElement.classList.add('willow-auth-loading')

let resolved=false

function reveal(){
 resolved=true
 document.documentElement.classList.remove('willow-auth-loading')
}

window.addEventListener('willow-auth-resolved',reveal)

// Safari's back-forward cache can restore stale DOM. Put the UI back into its
// loading guard and let auth-stability.js re-read the persisted session.
window.addEventListener('pageshow',event=>{
 if(!event.persisted)return
 resolved=false
 document.documentElement.classList.add('willow-auth-loading')
})

// Fail open visually if authentication cannot resolve, without changing session state.
setTimeout(()=>{if(!resolved)reveal()},8000)
