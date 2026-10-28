// Willow Lantern Pay — savings goal progress dashboard
// Software-only planning feature. No money movement or banking activity.

const money = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((Number(cents) || 0) / 100)

export function renderSavingsProgress(goals = []) {
  const host = document.querySelector('#savings-progress-items')
  if (!host) return
  host.innerHTML = ''

  if (!goals.length) {
    host.innerHTML = '<div class="item">Create a savings goal to start tracking progress.</div>'
    return
  }

  for (const goal of goals) {
    const current = Math.max(0, Number(goal.current_cents || 0))
    const target = Math.max(0, Number(goal.target_cents || 0))
    const pct = target ? Math.min(100, Math.round((current / target) * 100)) : 0
    const remaining = Math.max(0, target - current)
    const row = document.createElement('div')
    row.className = 'item'

    const main = document.createElement('div')
    main.className = 'item-main'
    const title = document.createElement('div')
    title.className = 'item-title'
    title.textContent = goal.name || 'Savings goal'
    const sub = document.createElement('div')
    sub.className = 'item-sub'
    const targetDate = goal.target_date ? ` · Target ${goal.target_date}` : ''
    sub.textContent = `${pct}% complete · ${money(remaining)} remaining${targetDate}`
    main.append(title, sub)

    const value = document.createElement('strong')
    value.textContent = `${money(current)} / ${money(target)}`
    row.append(main, value)
    host.append(row)
  }
}

export function mountSavingsProgress() {
  const dashboard = document.querySelector('#dashboard')
  if (!dashboard || document.querySelector('#savings-progress-card')) return

  const card = document.createElement('article')
  card.id = 'savings-progress-card'
  card.className = 'card'
  card.innerHTML = '<span class="eyebrow">Savings</span><h2>Savings Goal Progress</h2><p class="section-note">Track progress toward the savings goals you record in Willow Lantern Pay.</p><div id="savings-progress-items" class="items"><div class="item">Create a savings goal to start tracking progress.</div></div>'

  const spending = document.querySelector('#spending-insights-card')
  if (spending) spending.insertAdjacentElement('afterend', card)
  else dashboard.append(card)
}
