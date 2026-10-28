const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format((Number(c)||0)/100)

export function renderSpendingInsights(entries=[]){
 const host=document.querySelector('#spending-insights-items');if(!host)return
 const rows=entries.filter(x=>x.kind==='EXPENSE')
 if(!rows.length){host.innerHTML='<div class="item">Add expense records to see your monthly spending breakdown.</div>';return}
 const totals=new Map();let total=0
 for(const row of rows){const category=(row.category||'Other').trim()||'Other',amount=Number(row.amount_cents||0);totals.set(category,(totals.get(category)||0)+amount);total+=amount}
 host.innerHTML=''
 for(const [category,amount] of [...totals.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6)){
  const pct=total?Math.round(amount/total*100):0,row=document.createElement('div'),main=document.createElement('div'),title=document.createElement('div'),sub=document.createElement('div'),value=document.createElement('strong')
  row.className='item';main.className='item-main';title.className='item-title';sub.className='item-sub';title.textContent=category;sub.textContent=`${pct}% of recorded monthly expenses`;value.textContent=money(amount);main.append(title,sub);row.append(main,value);host.append(row)
 }
}

export function mountSpendingInsights(){
 const dashboard=document.querySelector('#dashboard');if(!dashboard||document.querySelector('#spending-insights-card'))return
 const card=document.createElement('article');card.id='spending-insights-card';card.className='card';card.innerHTML='<span class="eyebrow">Spending</span><h2>Spending Breakdown</h2><p class="section-note">See where your recorded expenses are going this month.</p><div id="spending-insights-items" class="items"><div class="item">Add expense records to see your monthly spending breakdown.</div></div>'
 const coach=document.querySelector('#financial-coach-card');if(coach)coach.insertAdjacentElement('afterend',card);else dashboard.append(card)
}
