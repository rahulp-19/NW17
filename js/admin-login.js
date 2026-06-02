import { supabase } from './supabase.js'

document
.getElementById('adminLoginForm')
.addEventListener('submit', async (e) => {

    e.preventDefault()

    const email =
    document.getElementById('email').value

    const password =
    document.getElementById('password').value

    const { error } =
    await supabase.auth.signInWithPassword({
        email,
        password
    })

    if(error){

        alert(error.message)
        return

    }

    const {
        data: { user }
    } =
    await supabase.auth.getUser()

    const { data } =
    await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

    if(data?.role !== 'admin'){

        alert('Not an admin account')

        await supabase.auth.signOut()

        return

    }

    window.location.href =
    'admin.html'

})