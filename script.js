//creating wrapper and container parts that hold all the elements
const container = document.createElement("div");
const wrapper = document.createElement("section");

//setting wrapper and container attributes
wrapper.setAttribute("class", "wrapper");
container.setAttribute("class", "container-fluid container-sm container-props");

//writing main page html inside container
container.innerHTML = `
<div class="" id="search--view">
  <div>
    <h1 class="my-3 text-light text-center font--weight">Let's find someone</h1>

    <lottie-player src="https://assets9.lottiefiles.com/packages/lf20_hnw4w2yh.json"  class="offset-sm-3 offset-md-4"
    background="transparent"  speed="1"  style="width: 300px; height: 300px;"  loop  autoplay></lottie-player>
  </div>

  <div class="col-sm-8 col-md-6 col-lg-4 offset-lg-4 offset-md-4 offset-sm-3">
    <label for="search" class="form-label text-white font--weight">Enter Name</label>
    <input class="form-control mb-2 fw-bold" id="search" type="search" placeholder="Search" aria-label="Search">
      <div id="search" class="form-text small--font text-light">
        For multiple names search just type the names seperated by <b>comma e.g abc,xyz,lmn...</b>
      </div>
    <button class="btn btn-primary offset-5 mt-4" onClick="getPersonInfo();">Search</button>
  </div>
</div>
`;
//NOTE: lottie-player tag is for displaying svg in page

//writing async function for api call
async function getPersonInfo() {

  //defining variables and constants for selecting elements for future DOM manipulation
  let resultDom = document.getElementById("search--view");
  const searchValue = document.getElementById("search").value.split(",");
  let url = "https://api.nationalize.io?";

  //initinally showing search icon before fetching the api
  resultDom.innerHTML += `<img src="images/search.gif" class="offset-5 my-5">`;

  //writing url for edge cases and defining url according to documentation
  if (searchValue[0]==='') {
    alert("Please enter atleast one name");
    window.location.reload();

  } else if(searchValue.length > 10) {
    alert("Please Don't enter more than 10 names");
    window.location.reload();

  } else {
    for (let i = 0; i < searchValue.length; i++) {
      url += `name[]=${searchValue[i]}&`;
    }
  }

  //finally start fetching the api
  const res = await fetch(url.slice(0, -1));
  const data = await res.json();

  //DOM manipulation after fetching api
  resultDom.innerHTML = `
  <div class="d-flex col-sm-6 col-lg-4 offset-sm-3 offset-lg-4 mt-5">
    <input class="form-control me-2 fw-bold" type="search" placeholder="Search in results" aria-label="Search" id="search--value">
    <button class="btn btn-outline-light" type="submit" onClick="searchResult()">Search</button>
  </div>

  <div class="my-5" id="result-view">
    <div id="search-results" class="card--group"></div>
    <button class="btn btn-primary col-6 offset-3 my-4" onClick="window.location.reload();"">Search another name</button>
  </div>
  `;

  //selecting cards component to populate it with data we fetch
  const cards = document.getElementById("search-results");

  for (let i = 0; i < data.length; i++) {

  //displaying card of person with two possible countries
  if (data[i].country[1]) {
    cards.innerHTML += `
    <div class="card card-props">
      <div class="card-header font--weight text-center text-dark card-head">
        <b class="personName">${data[i].name}</b>
      </div>
      <div class="card-body">
        <div class="card-text">Hmmm.. There is a probability of <b>${(data[i].country[0].probability * 100).toFixed(2)}%</b> 
        that <b>${data[i].name}</b> is from <b>${countryName(data[i].country[0].country_id)}</b> 
        and <b>${(data[i].country[1].probability * 100).toFixed(2)}%</b> that <b>${data[i].name}</b> 
        is from <b>${countryName(data[i].country[1].country_id)}</b> 
      </div>
    </div> 
    </div>`;

  //displaying card of person with only one possible country
  } else if(data[i].country[0]) {
    cards.innerHTML += `
    <div class="card card-props">
      <div class="card-header font--weight text-center text-dark card-head">
        <b class="personName">${data[i].name}</b>
      </div>
      <div class="card-body">
        <div class="card-text">Hmmm.. There is a probability of <b>${(data[i].country[0].probability * 100).toFixed(2)}%</b> 
        that <b>${data[i].name}</b> is from <b>${countryName(data[i].country[0].country_id)}</b>
      </div>
    </div> 
    </div>`;  

    //displaying no result found svg in case a random input is provided
    } else {
      cards.innerHTML += `
      <div class="card card-props">
        <div class="card-header font--weight text-center text-dark card-head">
          <b class="personName">${searchValue[i]}</b>
        </div>
        <div class="card-body">
          <iframe src="https://embed.lottiefiles.com/animation/108538"></iframe>
        </div>
      </div> 
      </div>`;
    }
  }
}

//function for displaying search results
function searchResult() {
  const searchInput = document.getElementById('search--value').value.toUpperCase();
  const allResultCards = document.querySelectorAll('.card-props');
  const allCardNames = document.querySelectorAll('.card-props .personName');
  const allCardHeader = document.querySelectorAll('.card-props .card-head');

  for(let i=0; i<allResultCards.length; i++) {
    if(searchInput==='') {
      allCardHeader[i].style.backgroundColor = "";
      allResultCards[i].style.display = ''

    } else if(allCardNames[i].innerText.toUpperCase().includes(searchInput)) {
      allResultCards[i].style.display = ''
      allCardHeader[i].style.backgroundColor = "#ff922b";
    }
    
    else {
      allResultCards[i].style.display = 'none'
      allCardHeader[i].style.backgroundColor = "";
    }
  }
}

//displaying a warning on website visit to enter proper names by the way mentioned
alert("Please note that the names that are not in our Database will not be visible");

//finally appending the wrapper and container elements that holds every element
document.body.append(wrapper);
wrapper.append(container);