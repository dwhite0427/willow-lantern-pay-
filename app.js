import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.102.0'

const supabaseUrl = 'https://vrgimzvmdwwrstonrbcf.supabase.co'
const supabasePublishableKey = 'sb_publishable_8ex4YVbGREfk93IGLBMG-g_hyZZRmLl'

const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

const authPanel = document.querySelector('#auth-panel')
const accountPanel = document.querySelector('#account-panel')
const authMessage = document.querySelector('#auth-message')
const accountEmail = document.querySelector('#account-email')
const loginForm = document.querySelector('#login-form')
const signupForm = document.querySelector('#signup-form')
const resetForm = document.querySelector('#reset-form')
const signOutButton = document.querySelector('#sign-out')
const showLogin = document.querySelector('#show-login')
const showSignup = document.querySelector('#show-signup')
const showReset = document.querySelector('#show-reset')

function message(text, isError = false) {
  authMessage.textContent = text
  authMessage.className = isError ? 'message error' : 'message success'
}

function showForm(name) {
  loginForm.hidden = name !== 'login'
  signupForm.hidden = name !== 'signup'
  resetForm.hidden = name !== 'reset'
  authMessage.textContent = ''
}

async function renderAuth() {
  const { data, error } = await supabase.auth.getClaims()
  const claims = error ? null : data?.claims
  const loggedIn = Boolean(claims?.sub)
  authPanel.hidden = loggedIn
  accountPanel.hidden = !loggedIn
  accountEmail.textContent = loggedIn ? (claims.email || 'Signed in') : ''
}

showLogin.addEventListener('click', () => showForm('login'))
showSignup.addEventListener('click', () => showForm('signup'))
showReset.addEventListener('click', () => showForm('reset'))

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const button = loginForm.querySelector('button[type="submit"]')
  button.disabled = true
  const email = loginForm.email.value.trim()
  const password = loginForm.password.value
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  button.disabled = false
  if (error) return message(error.message, true)
  message('Signed in successfully.')
  await renderAuth()
})

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const button = signupForm.querySelector('button[type="submit"]')
  button.disabled = true
  const fullName = signupForm.full_name.value.trim()
  const email = signupForm.email.value.trim()
  const password = signupForm.password.value
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: window.location.origin,
    },
  })
  button.disabled = false
  if (error) return message(error.message, true)
  if (data.session) {
    message('Account created and signed in.')
    await renderAuth()
  } else {
    message('Account created. Check your email to confirm your address, then return here to sign in.')
  }
})

resetForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const button = resetForm.querySelector('button[type="submit"]')
  button.disabled = true
  const email = resetForm.email.value.trim()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  })
  button.disabled = false
  if (error) return message(error.message, true)
  message('Password reset email requested. Check your inbox.')
})

signOutButton.addEventListener('click', async () => {
  signOutButton.disabled = true
  const { error } = await supabase.auth.signOut({ scope: 'local' })
  signOutButton.disabled = false
  if (error) return alert(error.message)
  showForm('login')
  await renderAuth()
})

supabase.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') {
    const newPassword = window.prompt('Enter your new Willow Lantern Pay password:')
    if (newPassword && newPassword.length >= 8) {
      supabase.auth.updateUser({ password: newPassword }).then(({ error }) => {
        if (error) alert(error.message)
        else alert('Password updated successfully.')
      })
    }
  }
  setTimeout(renderAuth, 0)
})

showForm('login')
renderAuth()
