import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.102.0'
const supabase=createClient('https://vrgimzvmdwwrstonrbcf.supabase.co','sb_publishable_8ex4YVbGREfk93IGLBMG-g_hyZZRmLl',{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}})
const $=s=>document.querySelector(s),login=$('#admin-login'),panel=$('#admin-panel'),form=$('#admin-form'),message=$('#message')
function msg(text,error=false){message.textContent=text;message.className='message '+(error?'error':'success')}
async function verifiedUser(){const {data,error}=await supabase.auth.getUser();return error?null:data.user}
function isAdmin(u){return u?.app_metadata?.role==='admin'}
async function render(){const u=await verifiedUser();if(u&&isAdmin(u)){login.hidden=true;panel.hidden=false;$('#admin-email').textContent=u.email||'';return}panel.hidden=true;login.hidden=false;if(u&&!isAdmin(u)){await supabase.auth.signOut({scope:'local'});msg('This account does not have administrator access.',true)}}
form.onsubmit=async e=>{e.preventDefault();msg('');const {error}=await supabase.auth.signInWithPassword({email:form.email.value.trim(),password:form.password.value});if(error)return msg('Unable to sign in with those credentials.',true);const u=await verifiedUser();if(!isAdmin(u)){await supabase.auth.signOut({scope:'local'});return msg('This account does not have administrator access.',true)}await render()}
$('#sign-out').onclick=async()=>{await supabase.auth.signOut({scope:'local'});panel.hidden=true;login.hidden=false;form.reset();msg('Signed out.')}
supabase.auth.onAuthStateChange(()=>setTimeout(render,0));render()