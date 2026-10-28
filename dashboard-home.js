function go(page){location.hash=page}

function mountDashboardHome(){
 const dashboard=document.querySelector('#dashboard');if(!dashboard||document.querySelector('#dashboard-home-card'))return
 const card=document.createElement('article');card.id='dashboard-home-card';card.className='card'
 card.innerHTML=`<span class="eyebrow">Quick access</span><h2>What would you like to do?</h2><p class="section-note">Open a money-management tool without scrolling through the dashboard.</p><div class="dashboard-quick-grid"></div>`
 const grid=card.querySelector('.dashboard-quick-grid')
 const actions=[['Add income or expense','Record money coming in or going out.','entries'],['Set a budget','Create or update monthly category limits.','budgets'],['Update savings','Track progress toward a savings goal.','savings'],['Manage bills','Add bills and review upcoming due dates.','bills'],['Split an expense','Plan how an expense is shared.','shared'],['Account profile','Update your display name and preferences.','profile']]
 for(const [title,text,page] of actions){const b=document.createElement('button');b.type='button';b.className='dashboard-quick-action';b.innerHTML=`<strong>${title}</strong><span>${text}</span>`;b.onclick=()=>go(page);grid.append(b)}
 const first=dashboard.querySelector('.pay-hub');if(first)first.insertAdjacentElement('beforebegin',card);else dashboard.prepend(card)
 const style=document.createElement('style');style.textContent=`.dashboard-quick-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}.dashboard-quick-action{border:1px solid #dde7df;background:#f7faf7;border-radius:16px;padding:17px;text-align:left;cursor:pointer;color:#17231c;font:inherit}.dashboard-quick-action strong{display:block;font-size:1rem;margin-bottom:6px}.dashboard-quick-action span{display:block;color:#66756c;font-size:.82rem;line-height:1.4}.dashboard-quick-action:hover,.dashboard-quick-action:focus{background:#eef4ef;outline:2px solid #cad6cd;outline-offset:2px}@media(max-width:750px){.dashboard-quick-grid{grid-template-columns:1fr}}`;document.head.append(style)
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountDashboardHome,{once:true});else mountDashboardHome()
