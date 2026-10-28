import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.102.0'

const supabase=createClient('https://vrgimzvmdwwrstonrbcf.supabase.co','sb_publishable_8ex4YVbGREfk93IGLBMG-g_hyZZRmLl',{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}})
const LIVE_PREMIUM_PRICE_ID='price_1UVXGM9YRt0uwgLPsgmIcMfB'

export async function getPremiumEntitlement(){
  const {data:{user},error:userError}=await supabase.auth.getUser()
  if(userError||!user)return {active:false,reason:'signed_out'}
  const {data,error}=await supabase.from('premium_subscriptions').select('status,stripe_price_id,current_period_end,cancel_at_period_end').eq('user_id',user.id).maybeSingle()
  if(error||!data)return {active:false,reason:error?'lookup_error':'no_subscription'}
  const status=String(data.status||'').toLowerCase()
  const active=['active','trialing'].includes(status)&&data.stripe_price_id===LIVE_PREMIUM_PRICE_ID
  return {active,status,priceId:data.stripe_price_id,currentPeriodEnd:data.current_period_end,cancelAtPeriodEnd:!!data.cancel_at_period_end}
}

export { LIVE_PREMIUM_PRICE_ID }
