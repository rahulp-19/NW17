import { supabase }
from './supabase.js'

const plansGrid =
document.getElementById(
'plansGrid'
)

async function loadPlans(){

    const {
        data,
        error
    } =
    await supabase
    .from('plans')
    .select('*')
    .eq('active', true)

    if(error){

        console.error(error)

        return
    }

    plansGrid.innerHTML = ''

    data.forEach(plan => {

        const card =
        document.createElement('div')

        card.className =
        'plan-card'

        card.innerHTML =

        `
        <h2>
            ${plan.name}
        </h2>

        <div class="plan-price">
            ₹${plan.price}
        </div>

        <div class="plan-duration">
            ${plan.duration_days}
            Days
        </div>

        <button
        class="subscribe-btn">

            Subscribe
        </button>
        `

        card
        .querySelector(
        '.subscribe-btn'
        )
        .onclick = ()=>{

            alert(
            'Razorpay integration coming next'
            )

        }

        plansGrid
        .appendChild(card)

    })

}

loadPlans()