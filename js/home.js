import { supabase }
from './supabase.js'

const videoGrid =
document.getElementById(
'videoGrid'
)

const searchInput =
document.getElementById(
'searchInput'
)

const categoryFilter =
document.getElementById(
'categoryFilter'
)

let videos = []

function setVideos(v) {
    videos = v
}

const fetchVideos = async () => {

const {
    data,
    error
} =
await supabase
.from('videos')
.select('*')
.order(
    'created_at',
    {
        ascending:false
    }
)

console.log('DATA:', data)
console.log('ERROR:', error)

if(error){

    console.error(error)

    return
}

videoGrid.innerHTML = ''

if(!data || data.length === 0){

    const storageVideos = await loadVideosFromStorage()

    if(storageVideos.length === 0){

        videoGrid.innerHTML =

        `
        <h2>
        No videos uploaded yet.
        </h2>
        `

        return
    }

    setVideos(storageVideos)
    renderVideos(videos)
    loadCategories(videos)
    return
}

setVideos(data)
renderVideos(videos)
loadCategories(videos)

}

async function loadVideosFromStorage(){
    const files = await listAllFiles('')

    if(files.length === 0){
        return []
    }

    return await Promise.all(
        files.map(async file => {
            const name = file.path || file.name
            const title = name.replace(/\.[^/.]+$/, '')
            const {
                data: urlData,
                error: urlError
            } = await supabase
                .storage
                .from('videos')
                .createSignedUrl(name, 60 * 60)

            if(urlError){
                console.error('Signed URL error for', name, urlError)
            }

            return {
                id: null,
                title,
                description: '',
                thumbnail_url: 'https://via.placeholder.com/400x225/111111/ff9a33?text=Video',
                video_url: urlData?.signedUrl || '',
                category: '',
                storage_file: name
            }
        })
    )
}

async function listAllFiles(path){
    const {
        data,
        error
    } = await supabase
        .storage
        .from('videos')
        .list(path, {
            limit: 100,
            offset: 0
        })

    if(error){
        console.error('Storage list error:', error)
        return []
    }

    if(!data || data.length === 0){
        return []
    }

    let files = []

    for(const item of data){
        if(item.is_dir){
            const nestedFiles = await listAllFiles(item.path)
            files = files.concat(nestedFiles)
        } else {
            files.push(item)
        }
    }

    return files
}

function loadCategories(videos){

    const categories =
    [...new Set(
        videos.map(
            v=>v.category
        )
    )]

    categories.forEach(cat=>{

        if(!cat) return

        const option =
        document.createElement(
        'option'
        )

        option.value = cat

        option.textContent = cat

        categoryFilter.appendChild(
        option
        )

    })

}

function renderVideos(list){

    videoGrid.innerHTML=''

    list.forEach(video=>{

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

        </div>
        `

        card.onclick=()=>{
            const target = video.id ?
                `watch.html?id=${video.id}` :
                `watch.html?file=${encodeURIComponent(video.storage_file)}`

            window.location.href=
            target

        }

        videoGrid.appendChild(card)

    })

}

function filterVideos(){

    const search =
    searchInput.value
    .toLowerCase()

    const category =
    categoryFilter.value

    const filtered =
    videos.filter(video=>{

        const matchesTitle =
        video.title
        .toLowerCase()
        .includes(search)

        const matchesCategory =

        !category ||

        video.category === category

        return matchesTitle
        &&
        matchesCategory

    })

    renderVideos(filtered)

}

searchInput.addEventListener(
'input',
filterVideos
)

categoryFilter.addEventListener(
'change',
filterVideos
)

fetchVideos()
