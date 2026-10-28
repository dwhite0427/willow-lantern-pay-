import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.102.0'

const supabase=createClient('https://vrgimzvmdwwrstonrbcf.supabase.co','sb_publishable_8ex4YVbGREfk93IGLBMG-g_hyZZRmLl',{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}})
const el=document.querySelector('#bill-payment-history-items')
const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format((Number(c)||0)/100)
let channel=null

function empty(text){if(!el)return;el.innerHTML='';const row=document.createElement('div');row.className='item';row.textContent=text;el.append(row)}
function formatDateTime(value){if(!value)return'';const d=new Date(value);return Number.isNaN(d.getTime())?'':d.toLocaleString()}
function render(rows){if(!el)return;el.innerHTML='';if(!rows.length)return empty('No bill payments recorded yet.');for(const x of rows){const row=document.createElement('div');row.className='item';const main=document.createElement('div');main.className='item-main';const title=document.createElement('div');title.className='item-title';title.textContent=x.bill_name||'Bill';const sub=document.createElement('div');sub.className='item-sub';const recurrence=x.recurrence&&x.recurrence!=='NONE'?` · ${String(x.recurrence).toLowerCase()}`:'';sub.textContent=`Due ${x.due_date}${recurrence} · Marked paid ${formatDateTime(x.recorded_paid_at)}`;main.append(title,sub);const actions=document.createElement('div');actions.className='item-actions';const amount=document.createElement('strong');amount.textContent=money(x.amount_cents);actions.append(amount);row.append(main,actions);el.append(row)}}
async function load(){const {data:{user}}=await supabase.auth.getUser();if(!user)return empty('Sign in to view bill payment history.');const {data,error}=await supabase.from('bill_payments').select('id,bill_name,amount_cents,due_date,recurrence,recorded_paid_at').eq('user_id',user.id).order('recorded_paid_at',{ascending:false}).limit(100);if(error)return empty('Bill payment history is temporarily unavailable.');render(data||[])}
async function subscribe(){if(channel){await supabase.removeChannel(channel);channel=null}const {data:{user}}=await supabase.auth.getUser();if(!user)return;channel=supabase.channel(`bill-payment-history-${user.id}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'bill_payments',filter:`user_id=eq.${user.id}`},()=>load()).subscribe()}
supabase.auth.onAuthStateChange(()=>setTimeout(async()=>{await load();await subscribe()},0));
load();subscribe();
