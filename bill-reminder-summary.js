export function renderBillReminderSummary(bills=[]){
  let card=document.querySelector('#bill-reminder-summary-card')
  const dashboard=document.querySelector('#dashboard')
  if(!dashboard)return
  if(!card){
    card=document.createElement('article')
    card.id='bill-reminder-summary-card'
    card.className='card'
    card.innerHTML='<span class="eyebrow">Planning</span><h2>Upcoming Bill Reminders</h2><p class="section-note">A planning summary based only on bills you record in Willow Lantern Pay.</p><div id="bill-reminder-summary-items" class="items"></div>'
    dashboard.append(card)
  }
  const host=card.querySelector('#bill-reminder-summary-items')
  const today=new Date();today.setHours(0,0,0,0)
  const upcoming=(bills||[]).filter(x=>!x.is_paid&&x.due_date).map(x=>{const due=new Date(`${x.due_date}T12:00:00`);const days=Math.ceil((due-today)/86400000);return {...x,days}}).filter(x=>x.days>=0&&x.days<=30).sort((a,b)=>a.days-b.days)
  host.innerHTML=''
  if(!upcoming.length){host.innerHTML='<div class="item"><div class="item-main"><div class="item-title">No bills due in the next 30 days</div><div class="item-sub">Add or update bills to keep this reminder list current.</div></div></div>';return}
  const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format((Number(c)||0)/100)
  for(const bill of upcoming){
    const row=document.createElement('div');row.className='item'
    const main=document.createElement('div');main.className='item-main'
    const title=document.createElement('div');title.className='item-title';title.textContent=bill.name||'Bill'
    const sub=document.createElement('div');sub.className='item-sub';sub.textContent=`${money(bill.amount_cents)} · due ${bill.due_date} · ${bill.days===0?'due today':bill.days===1?'due tomorrow':`due in ${bill.days} days`}`
    main.append(title,sub);row.append(main);host.append(row)
  }
}
