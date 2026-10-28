const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format((Number(c)||0)/100)

export function renderBudgetProgress(budgets=[],entries=[]){
 let card=document.querySelector('#budget-progress-card');const dashboard=document.querySelector('#dashboard');if(!dashboard)return
 if(!card){card=document.createElement('article');card.id='budget-progress-card';card.className='card';card.innerHTML='<span class="eyebrow">Budgeting</span><h2>Monthly Budget Progress</h2><p class="section-note">Compare your recorded monthly budget categories with expenses you enter in Willow Lantern Pay.</p><div id="budget-progress-items" class="items"></div>';dashboard.append(card)}
 const host=card.querySelector('#budget-progress-items');host.innerHTML=''
 if(!budgets.length){host.innerHTML='<div class="item"><div class="item-main"><div class="item-title">No monthly budgets recorded</div><div class="item-sub">Add a budget category to begin tracking planned versus recorded spending.</div></div></div>';return}
 const spent=new Map();for(const e of entries.filter(x=>x.kind==='EXPENSE')){const k=(e.category||'Other').trim()||'Other';spent.set(k,(spent.get(k)||0)+Number(e.amount_cents||0))}
 for(const b of budgets){const category=(b.category||'Other').trim()||'Other',limit=Number(b.limit_cents||0),used=spent.get(category)||0,remaining=limit-used,pct=limit?Math.round(used/limit*100):0;const row=document.createElement('div');row.className='item';const main=document.createElement('div');main.className='item-main';const title=document.createElement('div');title.className='item-title';title.textContent=category;const sub=document.createElement('div');sub.className='item-sub';sub.textContent=`${money(used)} of ${money(limit)} recorded · ${pct}% used · ${remaining>=0?money(remaining)+' remaining':money(Math.abs(remaining))+' over budget'}`;main.append(title,sub);row.append(main);host.append(row)}
}
