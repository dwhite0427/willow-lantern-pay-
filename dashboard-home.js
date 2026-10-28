import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.102.0'

const supabase=createClient('https://vrgimzvmdwwrstonrbcf.supabase.co','sb_publishable_8ex4YVbGREfk93IGLBMG-g_hyZZRmLl',{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}})
const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format((Number(c)||0)/100)
let channel=null

function render(entries=[]){
 const balance=entries.reduce((sum,row)=>sum+(row.kind==='INCOME'?Number(row.amount_cents||0):-Number(row.amount_cents||0)),0)
 const income=entries.filter(x=>x.kind==='INCOME').reduce((s,x)=>s+Number(x.amount_cents||0),0)
 const expenses=entries.filter(x=>x.kind==='EXPENSE').reduce((s,x)=>s+Number(x.amount_cents||0),0)
 const value=document.querySelector('#overview-balance-value'),incomeEl=document.querySelector('#overview-income-value'),expenseEl=document.querySelector('#overview-expense-value')
 if(value)value.textContent=money(balance);if(incomeEl)incomeEl.textContent=money(income);if(expenseEl)expenseEl.textContent=money(expenses)
}

async function load(){
 const {data:{user}}=await supabase.auth.getUser();if(!user){render([]);return}
 const {data,error}=await supabase.from('entries').select('kind,amount_cents').eq('user_id',user.id)
 if(!error)render(data||[])
 if(channel)await supabase.removeChannel(channel)
 channel=supabase.channel(`overview-balance-${user.id}`).on('postgres_changes',{event:'*',schema:'public',table:'entries',filter:`user_id=eq.${user.id}`},()=>load()).subscribe()
}

function mountDashboardHome(){
 const dashboard=document.querySelector('#dashboard');if(!dashboard||document.querySelector('#dashboard-home-card'))return
 const card=document.createElement('article');card.id='dashboard-home-card';card.className='card'
 card.innerHTML=`<span class="eyebrow">Overview</span><h2>Balance</h2><div class="overview-balance"><div class="overview-balance-main"><span>Current recorded balance</span><strong id="overview-balance-value">$0.00</strong></div><div class="overview-balance-stats"><div><span>Income</span><strong id="overview-income-value">$0.00</strong></div><div><span>Expenses</span><strong id="overview-expense-value">$0.00</strong></div></div></div>`
 const first=dashboard.querySelector('.pay-hub');if(first)first.insertAdjacentElement('beforebegin',card);else dashboard.prepend(card)
 const style=document.createElement('style');style.textContent=`.overview-balance{display:grid;gap:16px;margin-top:20px}.overview-balance-main{padding:24px;border:1px solid #dde7df;border-radius:18px;background:#f7faf7}.overview-balance-main span,.overview-balance-stats span{display:block;color:#66756c;font-size:.85rem;margin-bottom:7px}.overview-balance-main strong{display:block;font-size:2.35rem;line-height:1.1}.overview-balance-stats{display:grid;grid-template-columns:1fr 1fr;gap:12px}.overview-balance-stats>div{padding:16px;border:1px solid #e2e8e3;border-radius:14px}.overview-balance-stats strong{font-size:1.15rem}@media(max-width:600px){.overview-balance-stats{grid-template-columns:1fr}.overview-balance-main strong{font-size:2rem}}`;document.head.append(style)
 load()
}

supabase.auth.onAuthStateChange(()=>setTimeout(load,0))
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountDashboardHome,{once:true});else mountDashboardHome()
