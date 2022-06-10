const apiAxios = axios.create({
    baseURL: "https://api.thecatapi.com/v1"
})
apiAxios.defaults.headers.common["X-API-KEY"] = "6356b3f9-8233-456a-8a52-74e39720f373"

const API_URL = "https://api.thecatapi.com/v1/images/search?&order=Desc"
const API_FAV = "https://api.thecatapi.com/v1/favourites?"
const API_KEY = "6356b3f9-8233-456a-8a52-74e39720f373"
const API_FAV_DEL = (id) => `https://api.thecatapi.com/v1/favourites/${id}`
const API_UPLOAD = "https://api.thecatapi.com/v1/images/upload"

recharge_button.onclick = getRandomCats
btn_fav.onclick = postFavMichi

async function getRandomCats(){
    try {
        const response = await fetch(API_URL)
        const data = await response.json()
        const img1 = document.getElementById("random_img")
        const btn1 = document.getElementById("btn_fav")
        if (response.status === 200){
            console.log("Random cats -> " + data)
            img1.src = data[0].url
            btn1.onclick = () => postFavMichi(data[0].id)
        } else {
            throw new Error ('Conection failed')
        }
    } catch (error){
        console.log(error)
    }
}

async function getFavoritesMichis(){
    try {
        const response = await fetch(API_FAV,{
            method: "GET",
            headers: {
                "X-API-KEY": API_KEY
            }
        });
        const data = await response.json();
        if (response.status === 200){
            console.log("Favorite cats -> ", data)
            const section = document.getElementById("favMichis")
            section.innerHTML = ""

            data.forEach(michi => {
                const article = document.createElement("article")
                const img = document.createElement("img")
                const btn = document.createElement("button")
                const btnText = document.createTextNode("Eliminar Michi de Favoritos")

                img.src = michi.image.url
                img.width = 200
                btn.appendChild(btnText)
                btn.onclick = () => deleteFavMichi(michi.id)
                article.appendChild(img)
                article.appendChild(btn)
                section.appendChild(article)
            })
        } else {
            throw new Error ('Conection failed')
        }
    } catch (error) {
        console.log(error)
    }
}

async function postFavMichi(id){
    const { data, status } = await apiAxios.post("/favourites", {
        image_id: id
    })
    // const response = await fetch(API_FAV, {
    //     method: "POST",
    //     headers: {
    //         "content-type": "application/json",
    //         "X-API-KEY": API_KEY
    //     },
    //     body: JSON.stringify({
    //         image_id: id
    //     })
    // });
    // const data = await response.json()

    if (status === 200){
        console.log(`Save success -> ${status} ${data.message}`)
        getFavoritesMichis()
    } else {
        throw new Error ('Conection failed')
    }
}

async function deleteFavMichi(id){
    const response = await fetch(API_FAV_DEL(id), {
        method: "DELETE",
        headers: {
            "X-API-KEY": API_KEY
        }
    });
    const data = await response.json()

    if (response.status === 200){
        console.log(`Delete success -> ${response.status} ${data.message}`)
        getFavoritesMichis()
    } else {
        throw new Error ('Conection failed')
    }
}

async function uploadMichiphoto() {
    const form = document.getElementById("uploadingForm")
    const formData = new FormData(form)
    const response = await fetch(API_UPLOAD, {
        method: "POST",
        headers: {
            "content-type": "multipart/form-data",
            "X-API-KEY": API_KEY
        },
        body: formData
    })
    const data = await response.json()

    if (response.status === 200){
        console.log(`Delete success -> ${response.status} ${data.message}`)
        getFavoritesMichis()
    } else {
        console.log(response.status)
        console.log(data.message)
        throw new Error ('Conection failed')
    }
}

getRandomCats()
getFavoritesMichis()