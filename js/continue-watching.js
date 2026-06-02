import { supabase }
from './supabase.js'

const container =
document.getElementById(
'continueWatching'
)

async function loadContinueWatching(){

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
    .select(`
        *,
        videos(*)
    `)
    .eq('user_id',user.id)
    .order(
        'updated_at',
        {
            ascending:false
        }
    )
    .limit(10)

    if(!data) return

    container.innerHTML=''

    data.forEach(item=>{

        const video =
        item.videos

        const card =
        document.createElement('div')

        card.className =
        'video-card'

        card.innerHTML=
        `
        <img
        src="${video.thumbnail_url}"
        class="video-thumbnail">

        <div class="video-info">

            <div class="video-title">

            ${video.title}

            </div>

            <div>

            Resume at
            ${Math.floor(
                item.watched_seconds
            )} sec

            </div>

        </div>
        `

        card.onclick=()=>{

            window.location.href=
            `watch.html?id=${video.id}`

        }

        container.appendChild(card)

    })

}

loadContinueWatching()