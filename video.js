const loadCategories = () => {
    const url ="https://openapi.programming-hero.com/api/phero-tube/categories";
    try{
        fetch(url)
        .then((response) => response.json())
        .then((data) =>displayCategories(data.categories));
    }
    catch (error) {
        console.log(error);
    }
}

const removeActiveClass = () => {
  const buttons = document.getElementsByClassName("category-btn");
  for (const button of buttons) {
    button.classList.remove("active");
  }
}
const loadCategoriesVideos = (id) => {
  const url =`https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
    try{
        fetch(url)
        .then((response) => response.json())
        .then((data) =>{ 
          removeActiveClass();
          const activeBtn = document.getElementById(`btn-${id}`);
          activeBtn.classList.add("active");
          displayVideos(data.category)});
    }
    catch (error) {
        console.log(error);
    }
}

const displayCategories = (data) => {
    const categoryContainer = document.getElementById("categories");
    for (const category of data) {
      const buttonDiv = document.createElement("div");
      buttonDiv.innerHTML = 
      `
      <button id="btn-${category.category_id}" onclick="loadCategoriesVideos(${category.category_id})" class="btn m-2 px-6 py-2 category-btn">${category.category}</button>
      `;
      categoryContainer.appendChild(buttonDiv);
    }
}
loadCategories();

const loadVideos = (input="") => {
    const url = `https://openapi.programming-hero.com/api/phero-tube/videos?title=${input}`;
    try{
        fetch(url)
        .then((response) => response.json())
        .then((data) =>displayVideos(data.videos));
    }
    catch (error) {
        console.log(error);
    }
}
document.getElementById("input").addEventListener("keyup", (e)=>{
  loadVideos(e.target.value);
});

function timeString(time) {
  const hours =parseInt(time/3600) ;
  let remainingTime = time %3600;
  const minutes = parseInt(remainingTime/60);
  remainingTime= remainingTime %60;
  const seconds = remainingTime;
  return `${ hours} hour ${minutes} min ${seconds} sec ago`
}

const displayVideos = (data) => {
    const videoContainer = document.getElementById("videos");
    videoContainer.innerHTML = "";

    if(data.length === 0){
      videoContainer.classList.remove("grid");
      videoContainer.innerHTML = 
      `
      <div class="min-h-[300px] flex flex-col items-center justify-center gap-5 mt-20">
        <img src="images/Icon.png" class="w-96" alt="" />
        <h1 class="text-2xl">Oops!! Sorry, There is no content here</h1>`;
    }
    else{
      videoContainer.classList.add("grid");
    }
    for (const video of data) {
      const div = document.createElement("div");
      div.classList.add("col-md-4");
      div.innerHTML = `
      <div class="card">
        <div class="relative">
           <img src="${video.thumbnail}" class="card-img-top h-72 s mb-4 rounded-lg" alt="...">
           ${video.others.posted_date?.length ===0? " ":`<div class="absolute bottom-5 right-2 bg-white text-xs bg-opacity-50 px-2 py-1 rounded-lg">${timeString(video.others.posted_date)}</div>`}
        </div>
        <div class="px-0 py-2 flex justify-start gap-4">
          <div class="w-1/12">
            <img src="${video.authors[0].profile_picture}" class="w-10 h-10 rounded-full object-cover" alt="" />
          </div>
          <div class="w-11/12 space-y-2">
            <h4 class="font-bold text-xl">${video.title}</h4>
            <div class="flex items-center gap-2">
              <p>${video.authors[0].profile_name}</p>
              ${video.authors[0].verified === true ?`<img src="https://image.shutterstock.com/image-vector/check-icon-260nw-414012106.jpg" class="w-10" alt="" />` : ""}
            </div>
            <p>${video.others.views} views</p>
            <p><button onClick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error text-white">Details</button></p>
          </div>
        </div>
      </div>
      `;
      videoContainer.appendChild(div);
    }
  }
loadVideos();

const loadDetails = async (videoId) => {
  console.log(videoId);
  const url =`https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  const response = await fetch(url);
  const data = await response.json();
  displayDetails(data.video);
}

const displayDetails = (data) => {
  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = 
  `
  <img src="${data.thumbnail}" class="w-full h-96 rounded-lg" alt="" />
  <p>"${data.description}"</p>
  `;
  document.getElementById('showModal').click();
}


