import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.102.0'
import { mountSpendingInsights,renderSpendingInsights } from './spending-insights.js'
import { mountSavingsProgress,renderSavingsProgress } from './savings-progress.js'
import { renderBillReminderSummary } from './bill-reminder-summary.js'
import { renderBudgetProgress } from './budget-progress.js'
import { renderCashFlowSummary } from './cash-flow-summary.js'

const supabase=createClient('https://vrgimzvmdwwrstonrbcf.supabase.co','sb_publishable_8ex4YVbGREfk93IGLBMG-g_hyZZRmLl',{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}})
const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format((Number(c)||0)/100)
const monthStart=()=>new Date().toISOString().slice(0,7)+'-01'
const nextMonthStart=()=>{const d=new Date(`${monthStart()}T12:00:00`);d.setMonth(d.getMonth()+1);return d.toISOString().slice(0,10)}
let entriesChannel=null,goalsChannel=null,billsChannel=null,budgetsChannel=null

function mount(){
 const dashboard=document.querySelector('#dashboard');if(!dashboard||document.querySelector('#financial-coach-card'))return
 const card=document.createElement('article');card.id='financial-coach-card';card.className='card';card.innerHTML='<span class="eyebrow">Planning</span><h2>Monthly Money Checkup</h2><p class="section-note">Software-only planning guidance based on records you enter. It is not banking activity, credit advice, investment advice, or individualized financial advice.</p><div id="financial-coach-items" class="items"><div class="item">Loading your checkup…</div></div>'
 const premium=document.querySelector('#premium-insights-card');if(premium)premium.insertAdjacentElement('beforebegin',card);else dashboard.append(card)
 mountSpendingInsights();mountSavingsProgress();renderBillReminderSummary([]);renderBudgetProgress([],[]);renderCashFlowSummary([]);load()
}

async function subscribe(user){
 if(entriesChannel){await supabase.removeChannel(entriesChannel);entriesChannel=null}
 if(goalsChannel){await supabase.removeChannel(goalsChannel);goalsChannel=null}
 if(billsChannel){await supabase.removeChannel(billsChannel);billsChannel=null}
 if(budgetsChannel){await supabase.removeChannel(budgetsChannel);budgetsChannel=null}
 if(!user)return
 entriesChannel=supabase.channel(`dashboard-entries-${user.id}`).on('postgres_changes',{event:'*',schema:'public',table:'entries',filter:`user_id=eq.${user.id}`},()=>load()).subscribe()
 goalsChannel=supabase.channel(`dashboard-goals-${user.id}`).on('postgres_changes',{event:'*',schema:'public',table:'savings_goals',filter:`user_id=eq.${user.id}`},()=>load()).subscribe()
 billsChannel=supabase.channel(`dashboard-bills-${user.id}`).on('postgres_changes',{event:'*',schema:'public',table:'bills',filter:`user_id=eq.${user.id}`},()=>load()).subscribe()
 budgetsChannel=supabase.channel(`dashboard-budgets-${user.id}`).on('postgres_changes',{event:'*',schema:'public',table:'budgets',filter:`user_id=eq.${user.id}`},()=>load()).subscribe()
}

async function load(){
 const host=document.querySelector('#financial-coach-items');if(!host)return
 const {data:{user}}=await supabase.auth.getUser();if(!user){host.innerHTML='<div class="item">Sign in to view your checkup.</div>';renderSpendingInsights([]);renderSavingsProgress([]);renderBillReminderSummary([]);renderBudgetProgress([],[]);renderCashFlowSummary([]);return}
 const start=monthStart(),end=nextMonthStart()
 const [er,br,gr,bir]=await Promise.all([
  supabase.from('entries').select('kind,amount_cents,category').eq('user_id',user.id).gte('occurred_on',start).lt('occurred_on',end),
  supabase.from('budgets').select('category,limit_cents').eq('user_id',user.id).eq('month_start',start),
  supabase.from('savings_goals').select('name,current_cents,target_cents,target_date').eq('user_id',user.id),
  supabase.from('bills').select('name,amount_cents,due_date,is_paid').eq('user_id',user.id).order('due_date').limit(50)
 ])
 if([er,br,gr,bir].some(x=>x.error)){host.innerHTML='<div class="item">Your checkup is temporarily unavailable.</div>';return}
 const entries=er.data||[],budgets=br.data||[],goals=gr.data||[],bills=bir.data||[];renderSpendingInsights(entries);renderSavingsProgress(goals);renderBillReminderSummary(bills);renderBudgetProgress(budgets,entries);renderCashFlowSummary(entries)
 const income=entries.filter(x=>x.kind==='INCOME').reduce((s,x)=>s+Number(x.amount_cents||0),0),expenses=entries.filter(x=>x.kind==='EXPENSE').reduce((s,x)=>s+Number(x.amount_cents||0),0),budget=budgets.reduce((s,x)=>s+Number(x.limit_cents||0),0),saved=goals.reduce((s,x)=>s+Number(x.current_cents||0),0),target=goals.reduce((s,x)=>s+Number(x.target_cents||0),0)
 const unpaid=bills.filter(x=>!x.is_paid).slice(0,5),rows=[]
 if(!entries.length)rows.push(['Start your monthly picture','Add income and expenses to generate a useful monthly checkup.']);else rows.push(['Cash-flow check',income>=expenses?`${money(income-expenses)} remains after recorded expenses this month.`:`Recorded expenses exceed recorded income by ${money(expenses-income)} this month.`])
 rows.push(['Budget check',budget?`${money(Math.max(0,budget-expenses))} remains across your recorded monthly budget limits.`:'Add budget categories to compare planned spending with recorded expenses.']);rows.push(['Savings progress',target?`${money(saved)} recorded toward ${money(target)} in savings goals.`:'Create a savings goal to track progress over time.']);rows.push(['Upcoming bills',unpaid.length?unpaid.map(x=>`${x.name}: ${money(x.amount_cents)} due ${x.due_date}`).join(' · '):'No unpaid bills are currently recorded.'])
 host.innerHTML='';for(const [title,text] of rows){const row=document.createElement('div');row.className='item';const main=document.createElement('div');main.className='item-main';const h=document.createElement('div');h.className='item-title';h.textContent=title;const p=document.createElement('div');p.className='item-sub';p.textContent=text;main.append(h,p);row.append(main);host.append(row)}
}

supabase.auth.onAuthStateChange((_event,session)=>setTimeout(()=>{subscribe(session?.user||null);load()},0))
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',async()=>{mount();const {data:{user}}=await supabase.auth.getUser();subscribe(user)},{once:true});else{mount();supabase.auth.getUser().then(({data:{user}})=>subscribe(user))}
