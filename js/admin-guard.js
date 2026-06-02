import { supabase } from './supabase.js'

async function checkAdmin() {

    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (!user) {

        window.location.href = 'login.html'

        return
    }

    const {
        data,
        error
    } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (error || !data) {

        window.location.href = 'index.html'

        return
    }

    if (data.role !== 'admin') {

        window.location.href = 'index.html'

        return
    }

}

checkAdmin()