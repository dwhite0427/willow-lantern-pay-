const lessons=[
 ['Budget basics','A budget gives each dollar a job. Start with monthly income, list essential bills, choose savings amounts, then set realistic limits for flexible spending.'],
 ['Emergency savings','Build a cash cushion for unexpected expenses. Start with a small reachable target, contribute consistently, and increase the target as your budget allows.'],
 ['Understanding cash flow','Cash flow is money coming in compared with money going out. Positive cash flow means recorded income is greater than recorded expenses for the period.'],
 ['Bills and due dates','Record recurring bills and due dates so you can plan ahead. Review upcoming bills before discretionary spending and mark bills paid when completed.'],
 ['Credit fundamentals','Payment history, balances, account age and other factors can affect credit scores. Review information from official credit-report sources and avoid borrowing more than your budget can support.'],
 ['Fraud awareness','Never share passwords or one-time security codes. Verify unexpected payment requests independently and review account activity regularly for transactions you do not recognize.']
]
function mountEducation(){
 const dashboard=document.querySelector('#dashboard');if(!dashboard||document.querySelector('#education-center-card'))return
 const card=document.createElement('article');card.id='education-center-card';card.className='card';card.innerHTML='<span class="eyebrow">Learn</span><h2>Financial Education Center</h2><p class="section-note">Short educational guides for everyday money management. This content is general education, not individualized financial, credit, investment, tax, or legal advice.</p><div class="education-grid"></div>'
 const grid=card.querySelector('.education-grid')
 for(const [title,text] of lessons){const item=document.createElement('details');item.className='education-lesson';item.innerHTML=`<summary>${title}</summary><p>${text}</p>`;grid.append(item)}
 dashboard.append(card)
 const style=document.createElement('style');style.textContent='.education-grid{display:grid;gap:10px;margin-top:16px}.education-lesson{border:1px solid #dde7df;border-radius:14px;background:#f8faf8;padding:0 15px}.education-lesson summary{cursor:pointer;font-weight:750;padding:14px 0}.education-lesson p{color:#596a60;line-height:1.55;margin:0 0 15px}'
 document.head.append(style)
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountEducation,{once:true});else mountEducation()
