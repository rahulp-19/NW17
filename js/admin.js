import { supabase } from './supabase.js'

const uploadForm =
document.getElementById('uploadForm')

const uploadStatus =
document.getElementById('uploadStatus')

const videoList =
document.getElementById('videoList')

const logoutBtn =
document.getElementById('logoutBtn')

async function checkAuth(){

    const {
        data: { user }
    } =
    await supabase.auth.getUser()

    if(!user){

        window.location.href =
        'login.html'

        return
    }

}

async function loadVideos(){

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

    videoList.innerHTML = ''

    data.forEach(video => {

        const div =
        document.createElement('div')

        div.className =
        'video-item'

        div.innerHTML =

        `
        <img
        src="${video.thumbnail_url}">

        <div class="video-item-content">

            <h3>
                ${video.title}
            </h3>

            <p>
                ${video.description || ''}
            </p>

            <button
            class="delete-btn"
            data-id="${video.id}">
                Delete
            </button>

        </div>
        `

        videoList.appendChild(div)

    })

    document
    .querySelectorAll('.delete-btn')
    .forEach(button => {

        button.onclick =
        async () => {

            const id =
            button.dataset.id

            await deleteVideo(id)

        }

    })

}

async function deleteVideo(id){

    const {
        error
    } =
    await supabase
    .from('videos')
    .delete()
    .eq('id', id)

    if(error){

        alert(error.message)

        return
    }

    loadVideos()

}

uploadForm.addEventListener(
'submit',
async (e)=>{

    e.preventDefault()

    uploadStatus.innerText =
    'Uploading...'

    const title =
    document
    .getElementById('title')
    .value

    const description =
    document
    .getElementById('description')
    .value

    const category =
    document
    .getElementById(
    'category'
    )
    .value

    const previewStart =
    parseInt(
        document
        .getElementById('previewStart')
        .value
    )

    const previewEnd =
    parseInt(
        document
        .getElementById('previewEnd')
        .value
    )

    const thumbnailFile =
    document
    .getElementById('thumbnail')
    .files[0]

    const videoFile =
    document
    .getElementById('video')
    .files[0]

    const thumbnailName =
    `${Date.now()}-${thumbnailFile.name}`

    const videoName =
    `${Date.now()}-${videoFile.name}`

    const {
        data: thumbData,
        error: thumbError
    }
    =
    await supabase
    .storage
    .from('thumbnails')
    .upload(
        thumbnailName,
        thumbnailFile
    )

    if(thumbError){

        uploadStatus.innerText =
        thumbError.message

        return
    }

    const {
        data: videoData,
        error: videoError
    }
    =
    await supabase
    .storage
    .from('videos')
    .upload(
        videoName,
        videoFile
    )

    if(videoError){

        uploadStatus.innerText =
        videoError.message

        return
    }

    const thumbnailUrl =
    supabase
    .storage
    .from('thumbnails')
    .getPublicUrl(
        thumbData.path
    )
    .data
    .publicUrl

    const videoUrl =
    supabase
    .storage
    .from('videos')
    .getPublicUrl(
        videoData.path
    )
    .data
    .publicUrl

    const {
        error: insertError
    }
    =
    await supabase
    .from('videos')
    .insert({

        title,
        description,
        category,

        thumbnail_url:
        thumbnailUrl,

        video_url:
        videoUrl,

        preview_start:
        previewStart,

        preview_end:
        previewEnd

    })

    if(insertError){

        uploadStatus.innerText =
        insertError.message

        return
    }

    uploadStatus.innerText =
    'Video uploaded successfully'

    uploadForm.reset()

    loadVideos()

})

logoutBtn.onclick =
async ()=>{

    await supabase.auth.signOut()

    window.location.href =
    'login.html'

}

checkAuth()
loadVideos()