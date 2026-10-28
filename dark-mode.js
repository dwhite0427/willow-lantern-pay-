const KEY='willow-theme'

function preferredTheme(){
 const saved=localStorage.getItem(KEY)
 if(saved==='dark'||saved==='light')return saved
 return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'
}

function applyTheme(theme){
 document.documentElement.dataset.theme=theme
 localStorage.setItem(KEY,theme)
 const button=document.querySelector('#theme-toggle')
 if(button){
  button.textContent=theme==='dark'?'Light mode':'Dark mode'
  button.setAttribute('aria-pressed',String(theme==='dark'))
 }
}

function mount(){
 const style=document.createElement('style')
 style.id='willow-dark-mode-style'
 style.textContent=`html[data-theme="dark"]{color-scheme:dark}html[data-theme="dark"] body{background:#101411!important;color:#eef4ef!important}html[data-theme="dark"] main,html[data-theme="dark"] #dashboard{color:#eef4ef!important}html[data-theme="dark"] .card,html[data-theme="dark"] article.card,html[data-theme="dark"] .pay-hub,html[data-theme="dark"] .summary,html[data-theme="dark"] #auth-panel{background:#171d19!important;color:#eef4ef!important;border-color:#2c3830!important;box-shadow:none!important}html[data-theme="dark"] input,html[data-theme="dark"] select,html[data-theme="dark"] textarea{background:#101511!important;color:#f3f7f4!important;border-color:#39473d!important}html[data-theme="dark"] input::placeholder,html[data-theme="dark"] textarea::placeholder{color:#87958b!important}html[data-theme="dark"] button,html[data-theme="dark"] .tab{border-color:#39473d}html[data-theme="dark"] #dashboard-menu-button,html[data-theme="dark"] #dashboard-menu{background:#171d19!important;border-color:#334039!important;box-shadow:0 18px 45px rgba(0,0,0,.42)!important}html[data-theme="dark"] #dashboard-menu-button span{background:#eef4ef!important}html[data-theme="dark"] .dashboard-menu-item{color:#eef4ef!important}html[data-theme="dark"] .dashboard-menu-item:hover,html[data-theme="dark"] .dashboard-menu-item:focus{background:#253029!important}html[data-theme="dark"] .overview-balance-main,html[data-theme="dark"] .overview-balance-stats>div{background:#111713!important;border-color:#334039!important}html[data-theme="dark"] .overview-balance-main span,html[data-theme="dark"] .overview-balance-stats span,html[data-theme="dark"] .eyebrow{color:#a7b7ac!important}#theme-toggle{display:block;width:100%;border:0;background:transparent;text-align:left;padding:12px 14px;border-radius:10px;font:inherit;font-weight:700;cursor:pointer;color:#1d2421}#theme-toggle:hover,#theme-toggle:focus{background:rgba(0,0,0,.055);outline:none}html[data-theme="dark"] #theme-toggle{color:#eef4ef!important}html[data-theme="dark"] #theme-toggle:hover,html[data-theme="dark"] #theme-toggle:focus{background:#253029!important}`
 document.head.append(style)
 const menu=document.querySelector('#dashboard-menu')
 if(menu&&!document.querySelector('#theme-toggle')){
  const button=document.createElement('button');button.id='theme-toggle';button.type='button';button.className='dashboard-menu-item';button.onclick=()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark')
  const signout=menu.querySelector('.dashboard-menu-signout');if(signout)menu.insertBefore(button,signout);else menu.append(button)
 }
 applyTheme(preferredTheme())
}

applyTheme(preferredTheme())
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount()
