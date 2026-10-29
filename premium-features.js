import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.102.0'

const supabase=createClient('https://vrgimzvmdwwrstonrbcf.supabase.co','sb_publishable_8ex4YVbGREfk93IGLBMG-g_hyZZRmLl',{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}})
const LIVE_PREMIUM_PRICE_ID='price_1UVXGM9YRt0uwgLPsgmIcMfB'
let channel=null

function isPremium(row){return !!row&&['active','trialing'].includes(String(row.status||'').toLowerCase())&&row.stripe_price_id===LIVE_PREMIUM_PRICE_ID}
function publish(active,row=null){window.dispatchEvent(new CustomEvent('willow-premium-resolved',{detail:{active:!!active,status:row?.status||null,priceId:row?.stripe_price_id||null}}))}
function setGate(active,row=null){document.querySelectorAll('[data-premium-feature]').forEach(el=>{el.hidden=!active;el.setAttribute('aria-hidden',String(!active))});document.querySelectorAll('[data-premium-lock]').forEach(el=>{el.hidden=active;el.setAttribute('aria-hidden',String(active))});publish(active,row)}
async function load(){const {data:{user}}=await supabase.auth.getUser();if(!user){setGate(false);return}const {data,error}=await supabase.from('premium_subscriptions').select('status,stripe_price_id').eq('user_id',user.id).maybeSingle();setGate(!error&&isPremium(data),error?null:data)}
async function subscribe(){if(channel){await supabase.removeChannel(channel);channel=null}const {data:{user}}=await supabase.auth.getUser();if(!user)return;channel=supabase.channel(`premium-feature-gate-${user.id}`).on('postgres_changes',{event:'*',schema:'public',table:'premium_subscriptions',filter:`user_id=eq.${user.id}`},()=>load()).subscribe()}
supabase.auth.onAuthStateChange(()=>setTimeout(async()=>{await load();await subscribe()},0));
load();subscribe();
