import { supabase } from './supabase.js'

export async function saveProgress(
videoId,
seconds
){

    const {
        data:{user}
    }
    =
    await supabase.auth.getUser()

    if(!user) return

    const {
        data
    }
    =
    await supabase
    .from('watch_history')
    .select('*')
    .eq('user_id',user.id)
    .eq('video_id',videoId)
    .maybeSingle()

    if(data){

        await supabase
        .from('watch_history')
        .update({

            watched_seconds:
            Math.floor(seconds),

            updated_at:
            new Date()
            .toISOString()

        })
        .eq('id',data.id)

    }else{

        await supabase
        .from('watch_history')
        .insert({

            user_id:user.id,

            video_id:videoId,

            watched_seconds:
            Math.floor(seconds)

        })

    }

}

export async function getProgress(
videoId
){

    const {
        data:{user}
    }
    =
    await supabase.auth.getUser()

    if(!user) return 0

    const {
        data
    }
    =
    await supabase
    .from('watch_history')
    .select('*')
    .eq('user_id',user.id)
    .eq('video_id',videoId)
    .maybeSingle()

    return data
    ? data.watched_seconds
    : 0

}