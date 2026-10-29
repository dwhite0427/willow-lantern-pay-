import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.102.0'

// One shared browser client for dashboard modules. Reusing it avoids competing
// auth locks, refresh timers, and duplicate session restoration work.
export const supabase=globalThis.__willowSupabase||(globalThis.__willowSupabase=createClient('https://vrgimzvmdwwrstonrbcf.supabase.co','sb_publishable_8ex4YVbGREfk93IGLBMG-g_hyZZRmLl',{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}}))

let lastUserId=null
let resolving=null
let currentSession=null

function setUi(session){
 currentSession=session||null
 const auth=document.querySelector('#auth-panel')
 const dashboard=document.querySelector('#dashboard')
 const signOut=document.querySelector('#sign-out')
 const user=session?.user||null
 if(auth)auth.hidden=!!user
 if(dashboard)dashboard.hidden=!user
 if(signOut)signOut.hidden=true
 if(user){
  const email=document.querySelector('#account-email')
  if(email)email.textContent=user.email||''
  lastUserId=user.id
 }else lastUserId=null
 document.documentElement.classList.remove('willow-auth-loading')
 window.dispatchEvent(new CustomEvent('willow-auth-resolved',{detail:{authenticated:!!user,userId:user?.id||null,session:currentSession}}))
}

export async function resolveSession(){
 if(resolving)return resolving
 resolving=(async()=>{
  try{
   const {data,error}=await supabase.auth.getSession()
   if(error)throw error
   setUi(data.session)
   return data.session
  }catch(error){
   console.error('Willow auth restore failed',error)
   document.documentElement.classList.remove('willow-auth-loading')
   window.dispatchEvent(new CustomEvent('willow-auth-resolved',{detail:{authenticated:false,error:true}}))
   return null
  }finally{resolving=null}
 })()
 return resolving
}

export async function getSession(){return currentSession||await resolveSession()}
export async function getCurrentUser(){return (await getSession())?.user||null}

supabase.auth.onAuthStateChange((event,session)=>{
 if(event==='INITIAL_SESSION'||event==='SIGNED_IN'||event==='SIGNED_OUT'||event==='TOKEN_REFRESHED'||event==='USER_UPDATED')setUi(session)
})

window.addEventListener('pageshow',()=>resolveSession())
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',resolveSession,{once:true});else resolveSession()
