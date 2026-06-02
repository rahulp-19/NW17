import { supabase }
from './supabase.js'

const email =
document.getElementById('email')

const subscriptionStatus =
document.getElementById(
'subscriptionStatus'
)

const expiryDate =
document.getElementById(
'expiryDate'
)

const logoutBtn =
document.getElementById(
'logoutBtn'
)

async function loadProfile(){

    const {
        data:{
            user
        }
    }
    =
    await supabase.auth.getUser()

    if(!user){

        window.location.href =
        'login.html'

        return
    }

    email.innerText =
    user.email

    const {
        data
    }
    =
    await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

    if(data){

        subscriptionStatus.innerText =

        data.subscription_active
        ? 'Active'
        : 'Inactive'

        expiryDate.innerText =

        data.subscription_expiry
        || 'Not Available'
    }

}

logoutBtn.onclick =
async ()=>{

    await supabase.auth.signOut()

    window.location.href =
    'login.html'

}

loadProfile()