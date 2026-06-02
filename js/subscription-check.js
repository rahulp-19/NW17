import { supabase } from './supabase.js'

export async function hasActiveSubscription() {

    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
        return false
    }

    const { data } = await supabase
        .from('users')
        .select('subscription_active, subscription_expiry')
        .eq('id', user.id)
        .single()

    if (!data) {
        return false
    }

    if (!data.subscription_active) {
        return false
    }

    const expiry =
        new Date(data.subscription_expiry)

    return expiry > new Date()
}