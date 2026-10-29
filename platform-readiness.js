const SECTIONS=[
 ['Core account','Available',['Session restoration','Profile','Account & Security','Password recovery']],
 ['Money management','Available',['Income & expenses','Budgets','Savings goals','Bills','Shared expenses','Financial education']],
 ['Premium','Available',['Stripe checkout','Entitlement controls','Premium insights']],
 ['Money movement','Provider required',['Real balances','Add/withdraw money','Send/receive/request money','ACH transfers']],
 ['Banking & direct deposit','Provider required',['Account & routing numbers','Direct deposit','Statements','Account lifecycle']],
 ['Debit cards','Provider required',['Virtual/physical cards','Activation & PIN','Freeze/replacement','Card disputes']],
 ['Secured credit','Provider required',['Credit program','Collateral','Statements','Credit reporting']],
 ['Compliance & risk','Provider/program required',['KYC/identity','AML & sanctions','Transaction monitoring','Disputes & error resolution']],
 ['Administration','In development',['Customer support','Audit logs','Risk cases','Provider monitoring']],
 ['Invest','Brokerage provider required',['Brokerage onboarding','Stocks & ETFs','Orders','Portfolio & dividends']]
]
function mountReadiness(){
 const dashboard=document.querySelector('#dashboard');if(!dashboard||document.querySelector('#platform-readiness-card'))return
 const card=document.createElement('article');card.id='platform-readiness-card';card.className='card';card.innerHTML='<h2>Platform Readiness</h2><div id="platform-readiness-list"></div>'
 const list=card.querySelector('#platform-readiness-list')
 for(const [name,status,items] of SECTIONS){const row=document.createElement('section');row.className='readiness-row';row.innerHTML=`<div class="readiness-heading"><strong>${name}</strong><span>${status}</span></div><div class="readiness-items">${items.map(x=>`<span>${x}</span>`).join('')}</div>`;list.append(row)}
 dashboard.append(card)
 const style=document.createElement('style');style.id='platform-readiness-style';style.textContent=`#platform-readiness-list{display:grid;gap:12px}.readiness-row{border:1px solid rgba(0,0,0,.1);border-radius:14px;padding:14px}.readiness-heading{display:flex;justify-content:space-between;gap:12px;align-items:center}.readiness-heading span{font-size:.8rem;font-weight:800;padding:5px 9px;border-radius:999px;background:rgba(0,0,0,.06)}.readiness-items{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}.readiness-items span{font-size:.82rem;padding:5px 8px;border-radius:8px;background:rgba(0,0,0,.04)}@media(max-width:600px){.readiness-heading{align-items:flex-start;flex-direction:column}}`;document.head.append(style)
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountReadiness,{once:true});else mountReadiness()
