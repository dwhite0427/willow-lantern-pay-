import { getPremiumEntitlement } from './premium-entitlement.js'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.102.0'

const supabase=createClient('https://vrgimzvmdwwrstonrbcf.supabase.co','sb_publishable_8ex4YVbGREfk93IGLBMG-g_hyZZRmLl',{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}})
const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format((Number(c)||0)/100)
const monthStart=()=>new Date().toISOString().slice(0,7)+'-01'

async function loadPremiumInsights(){
  const entitlement=await getPremiumEntitlement()
  const host=document.querySelector('#premium-insights')
  if(!host)return
  host.innerHTML=''
  if(!entitlement.active){
    host.innerHTML='<p class="section-note">Premium insights are locked. A server-confirmed live Premium subscription is required.</p>'
    return
  }
  const {data:{user}}=await supabase.auth.getUser()
  if(!user)return
  const start=monthStart()
  const [entriesResult,budgetsResult]=await Promise.all([
    supabase.from('entries').select('kind,amount_cents,category,occurred_on').eq('user_id',user.id).gte('occurred_on',start),
    supabase.from('budgets').select('category,limit_cents,month_start').eq('user_id',user.id).eq('month_start',start)
  ])
  if(entriesResult.error||budgetsResult.error){host.textContent='Premium insights are temporarily unavailable.';return}
  const entries=entriesResult.data||[],budgets=budgetsResult.data||[]
  const income=entries.filter(x=>x.kind==='INCOME').reduce((s,x)=>s+Number(x.amount_cents||0),0)
  const expenses=entries.filter(x=>x.kind==='EXPENSE').reduce((s,x)=>s+Number(x.amount_cents||0),0)
  const budget=budgets.reduce((s,x)=>s+Number(x.limit_cents||0),0)
  const byCategory={}
  for(const x of entries.filter(x=>x.kind==='EXPENSE'))byCategory[x.category||'Uncategorized']=(byCategory[x.category||'Uncategorized']||0)+Number(x.amount_cents||0)
  const top=Object.entries(byCategory).sort((a,b)=>b[1]-a[1]).slice(0,3)
  const savingsRate=income>0?Math.max(0,(income-expenses)/income*100):0
  const remaining=budget-expenses
  const wrapper=document.createElement('div')
  wrapper.className='items'
  const rows=[
    ['Monthly cash-flow insight',`${money(income-expenses)} net · ${savingsRate.toFixed(1)}% recorded savings rate`],
    ['Budget insight',budget?`${money(remaining)} remaining across recorded monthly budgets`:'No monthly budgets recorded yet.'],
    ['Top spending categories',top.length?top.map(([name,cents])=>`${name}: ${money(cents)}`).join(' · '):'No expenses recorded this month.']
  ]
  for(const [title,text] of rows){const row=document.createElement('div');row.className='item';const main=document.createElement('div');main.className='item-main';const h=document.createElement('div');h.className='item-title';h.textContent=title;const p=document.createElement('div');p.className='item-sub';p.textContent=text;main.append(h,p);row.append(main);wrapper.append(row)}
  host.append(wrapper)
}

supabase.auth.onAuthStateChange(()=>setTimeout(loadPremiumInsights,0))
loadPremiumInsights()
