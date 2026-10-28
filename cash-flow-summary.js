const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format((Number(c)||0)/100)

export function renderCashFlowSummary(entries=[]){
 const dashboard=document.querySelector('#dashboard');if(!dashboard)return
 let card=document.querySelector('#cash-flow-summary-card')
 if(!card){card=document.createElement('article');card.id='cash-flow-summary-card';card.className='card';card.innerHTML='<span class="eyebrow">Cash Flow</span><h2>Monthly Cash Flow</h2><p class="section-note">A software-only summary of income and expenses you record in Willow Lantern Pay.</p><div id="cash-flow-summary-items" class="items"></div>';const coach=document.querySelector('#financial-coach-card');if(coach)coach.insertAdjacentElement('beforebegin',card);else dashboard.append(card)}
 const host=card.querySelector('#cash-flow-summary-items');if(!host)return
 const income=entries.filter(x=>x.kind==='INCOME').reduce((s,x)=>s+Number(x.amount_cents||0),0)
 const expenses=entries.filter(x=>x.kind==='EXPENSE').reduce((s,x)=>s+Number(x.amount_cents||0),0)
 const net=income-expenses
 const rows=[['Recorded income',money(income)],['Recorded expenses',money(expenses)],['Net cash flow',`${net<0?'-':''}${money(Math.abs(net))}`]]
 host.innerHTML=''
 for(const [title,value] of rows){const row=document.createElement('div');row.className='item';const main=document.createElement('div');main.className='item-main';const h=document.createElement('div');h.className='item-title';h.textContent=title;const sub=document.createElement('div');sub.className='item-sub';sub.textContent=title==='Net cash flow'?(net>0?'Recorded income is above recorded expenses this month.':net<0?'Recorded expenses are above recorded income this month.':'Recorded income and expenses are equal this month.'):'Current month';const strong=document.createElement('strong');strong.textContent=value;main.append(h,sub);row.append(main,strong);host.append(row)}
}
