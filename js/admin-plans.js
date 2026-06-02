import { supabase }
from './supabase.js'

const planForm =
document.getElementById(
'planForm'
)

const plansContainer =
document.getElementById(
'plansContainer'
)

async function loadPlans(){

const {
data,
error
}
=
await supabase
.from('plans')
.select('*')
.order('price')

if(error){

console.error(error)

return

}

plansContainer.innerHTML=''

data.forEach(plan=>{

const div=
document.createElement('div')

div.className='plan-card'

div.innerHTML=
`
<h3>${plan.name}</h3>

<p>
₹${plan.price}
</p>

<p>
${plan.duration_days}
Days
</p>

<button
class="delete-btn"
data-id="${plan.id}">
Delete
</button>
`

plansContainer.appendChild(div)

})

document
.querySelectorAll('.delete-btn')
.forEach(btn=>{

btn.onclick=async()=>{

await supabase
.from('plans')
.delete()
.eq('id',btn.dataset.id)

loadPlans()

}

})

}

planForm.addEventListener(
'submit',
async e=>{

e.preventDefault()

const name=
document
.getElementById(
'planName'
)
.value

const price=
document
.getElementById(
'planPrice'
)
.value

const duration=
document
.getElementById(
'planDuration'
)
.value

await supabase
.from('plans')
.insert({

name,

price,

duration_days:
duration,

active:true

})

planForm.reset()

loadPlans()

})

loadPlans()