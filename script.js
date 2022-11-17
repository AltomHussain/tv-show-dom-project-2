//You can edit ALL of the code here
const ROOTELEM = document.getElementById("root");
let container = document.querySelector(".container");
let inputContainer = document.querySelector(".input-container");
let selectElement = document.querySelector(".pisodes-select");
let ShowSelect = document.querySelector(".show-select");
let TotalEpisodeNo = document.querySelector(".total-episodes");
let TotalShows = document.querySelector(".total-show");
let backToShow = document.getElementById("back-to-show");
let episodeSearch = document.getElementById("episode-search");
let showSearch = document.getElementById("show-search");
let EpisodeSelect = document.getElementById("episode-select");
// let showSelect = document.getElementById("show-select");
function setup() {
  const ALLSHOWS = getAllShows();
  CreateShowCart(ALLSHOWS);
  GobackToDisplayShows(ALLSHOWS);
  selectShow(ALLSHOWS);
  EpisodeSelectResult();
  ShowSearchInput();
}

/**Display shows  */
function CreateShowCart(listOfShows) {
  container.innerHTML = "";
  listOfShows.forEach((showObj) => {
    let showContent = document.createElement("div");
    //Hide go back button
    backToShow.style.display = "none";
    //Hide episode serch
    episodeSearch.style.display = "none";
    //show search search
    showSearch.style.display = "block";
    //Hide episode select dropdown when create shows
    selectElement.style.display = "none";
    //Show total
    TotalShows.style.display = "block";
    //Hide Total numbr of episodes
    TotalEpisodeNo.style.display = "none";

    ///Inside loop
    let ShowHeader = document.createElement("h3");
    let castingContainer = document.createElement("div");
    let MiddleCountainer = document.createElement("div");
    MiddleCountainer.className = "image-sum-gen-container";
    showContent.className = "show-content";

    let rated = document.createElement("p");
    let genres = document.createElement("p");
    let status = document.createElement("p");
    let runtime = document.createElement("p");
    let summary = document.createElement("p");

    let image = document.createElement("img");
    summary.className = "summary";
    image.className = "image-show";
    image.id = `${showObj.id}`;
    castingContainer.className = "casting-container";
    rated.className = "rated";
    genres.className = "genres";
    status.className = "status";
    runtime.className = "runtime";
    ShowHeader.className = "show-header";

    ShowHeader.innerText = showObj.name;
    rated.innerText = `Rated : ${showObj.rating.average}`;
    genres.innerText = `Genres : ${showObj.genres
      .toString()
      .replace(/,/g, " || ")}`;
    status.innerText = `Status : ${showObj.status}`;
    runtime.innerText = `Runtime : ${showObj.runtime}`;

    summary.innerHTML = showObj.summary;
    image.src =
      showObj.image == null
        ? "https://wanderlustwithlisa.com/wp-content/uploads/2022/01/Friends-TV-Show-1024x577.png"
        : showObj.image.medium;

    showContent.appendChild(ShowHeader);
    castingContainer.appendChild(rated);
    castingContainer.appendChild(genres);
    castingContainer.appendChild(status);
    castingContainer.appendChild(runtime);
    MiddleCountainer.appendChild(castingContainer);

    MiddleCountainer.appendChild(summary);
    MiddleCountainer.appendChild(image);

    showContent.appendChild(MiddleCountainer);
    container.appendChild(showContent);
  });
  TotalShows.innerText = `Found ${0} Of ${listOfShows.length}`;
  let showContents = [...document.querySelectorAll(".image-show")];
  selectShowToDisplayEpisodes(showContents);
}

function selectShowToDisplayEpisodes(listOfShowsContents) {
  listOfShowsContents.forEach((show) => {
    show.addEventListener("click", (e) => {
      const showId = e.target.id;
      //Show go back button
      backToShow.style.display = "block";
      //Show episode search
      episodeSearch.style.display = "block";
      //Hide show Search when show is clicked
      showSearch.style.display = "none";
      ///Show episode select dropdown
      selectElement.style.display = "block";
      //Show total
      TotalShows.style.display = "none";
      //Show the total number of episodes
      TotalEpisodeNo.style.display = "block";

      fetch(`https://api.tvmaze.com/shows/${Number(showId)}/episodes`)
        .then((res) => res.json())
        .then((data) => {
          const ALLEPISODES = data;
          makePageForEpisodes(ALLEPISODES);
        })
        .catch((error) => console.error("Something went wrong:", error));
    });
  });
}

function makePageForEpisodes(ALLEPISODES) {
  CreateEpisodeCard(ALLEPISODES);
  numberOfSearchedEpisodes(ALLEPISODES);
  SearchInputResult(ALLEPISODES);
  EpisodeSelectResult();
}

//Show select creation
function selectShow(ALLSHOWS) {
  ALLSHOWS.forEach((show) => {
    let option = document.createElement("option");
    option.innerText = show.name;
    option.value = show.id;
    ShowSelect.appendChild(option);
  });

  //Select Result for Shows
  ShowSelect.addEventListener("change", (event) => {
    //show go back
    backToShow.style.display = "block";
    //Show episode search
    episodeSearch.style.display = "block";
    //Hide show Search when show is clicked
    showSearch.style.display = "none";
    //Show Episode secelt dropdown when going to episodes page
    selectElement.style.display = "block";
    //Hide total
    TotalShows.style.display = "none";
    TotalEpisodeNo.style.display = "block";

    fetch(`https://api.tvmaze.com/shows/${Number(event.target.value)}/episodes`)
      .then((res) => res.json())
      .then((data) => {
        const ALLEPISODES = data;
        makePageForEpisodes(ALLEPISODES);
      })
      .catch((error) =>
        console.error(
          `Something went wrong with the show No: ${event.target.value} `,
          error
        )
      );
  });
}

function CreateEpisodeCard(ALLEPISODES) {
  /**Clear the list of episodes and load the new episodes when you select new show */
  container.innerHTML = "";
  ALLEPISODES.forEach(({ name, number, season, image, summary }, index) => {
    let EpisodeNo = index + 1;
    let content = document.createElement("div");
    let headerContainer = document.createElement("div");
    let header = document.createElement("h3");
    let paragraph = document.createElement("p");
    let Createmage = document.createElement("img");
    let span = document.createElement("span");

    let holdSeasonNum = "";
    let holdEpisodeNum = "";
    content.className += "content";
    headerContainer.className = "content-header";
    headerContainer.style.display = "block";
    paragraph.className = "paragraph";
    Createmage.className = "image";
    span.className = "span";
    season < 10
      ? (holdSeasonNum = `0${season}`)
      : (holdSeasonNum = `${season}`);

    number < 10
      ? (holdEpisodeNum = `0${number}`)
      : (holdEpisodeNum = `${number}`);
    EpisodeNo < 10 ? (EpisodeNo = `0${EpisodeNo}`) : (EpisodeNo = EpisodeNo);

    header.innerText = `${name} - S${holdSeasonNum}E${holdEpisodeNum}`;
    Createmage.src = `${image.medium}`;
    span.innerText = `Episode No: ${EpisodeNo}`;
    let trimText = summary.split(" ").slice(0, 10).join(" ");
    let readLess = document.createElement("span");
    let readMore = document.createElement("span");

    readMore.className = "read-more";
    readMore.innerText = "Read More";
    readLess.className = "read-less";

    ReadMore(readMore, readLess, paragraph, summary, EpisodeNo);
    ReadLess(readMore, readLess, paragraph, trimText, EpisodeNo);

    paragraph.innerHTML = `${trimText}`;

    headerContainer.appendChild(header);
    content.appendChild(headerContainer);
    content.appendChild(Createmage);
    content.appendChild(paragraph);
    content.appendChild(span);
    content.appendChild(readMore);
    content.appendChild(readLess);

    container.appendChild(content);
  });

  ROOTELEM.appendChild(container);
}
/** Read More*/
function ReadMore(readMore, readLess, paragraph, summary, EpisodeNo) {
  readMore.addEventListener("click", () => {
    readMore.style.display = "none";
    readLess.innerText = "Read Less";
    readLess.style.display = "block";
    let selectdElem = [...document.querySelectorAll(".content-header")].filter(
      (p, i) => i + 1 == Number(EpisodeNo)
    );
    selectdElem.forEach((elem) => {
      elem.style.backgroundColor = "#00FF00";
      elem.style.color = "white";
    });
    paragraph.innerHTML = `${summary}`;
  });
} /** Read More*/

/** Read Less*/
function ReadLess(readMore, readLess, paragraph, trimText, EpisodeNo) {
  readLess.addEventListener("click", () => {
    readLess.style.display = "none";
    readMore.style.display = "block";
    paragraph.innerHTML = `${trimText}`;
    let selectdElem = [...document.querySelectorAll(".content-header")].filter(
      (p, i) => i + 1 == Number(EpisodeNo)
    );
    selectdElem.forEach((elem) => {
      elem.style.backgroundColor = "";
      elem.style.color = "";
    });
  });
} /** Read Less*/

function numberOfSearchedEpisodes(ALLEPISODES) {
  TotalEpisodeNo.innerText = `${0} / ${ALLEPISODES.length}`;
}
/**Episode input search  */
function SearchInputResult(ALLEPISODES) {
  let getListOfContents = [...document.querySelectorAll(".content")];
  let searchBar = document.querySelector(".search");

  searchBar.addEventListener("keyup", (e) => {
    let searchTerm = e.target.value.toLowerCase();
    getListOfContents.forEach((item) => {
      if (item.innerText.toLowerCase().includes(searchTerm)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });

    let filteredEpisodes = getListOfContents.filter(
      (value) => value.style.display === "block"
    );

    TotalEpisodeNo.innerText = `${
      searchTerm == "" ? 0 : filteredEpisodes.length
    } / ${ALLEPISODES.length}`;
  });
} /**Episode input search  */

//Select episode creation
function EpisodeSelectResult() {
  /**Clear the drop down every time you seclect a show and then dow the new episodes of that show*/
  selectElement.innerText = "";
  let getListofHeaderContents = [
    ...document.querySelectorAll(".content-header"),
  ];
  let getListOfContent = [...document.querySelectorAll(".content")];
  let getSelectAllEpisodes = document.createElement("option");
  getSelectAllEpisodes.innerText = "All Epidodes";
  getSelectAllEpisodes.value = "select all";
  selectElement.appendChild(getSelectAllEpisodes);
  selectElement.className = "episodes-select";
  getListofHeaderContents.forEach((content, index) => {
    let option = document.createElement("option");
    option.innerText = `${content.innerText}`;
    option.value = `${index + 1}`;
    selectElement.appendChild(option);
  });

  //Filter selected
  getListOfContent.forEach((content, index) => {
    selectElement.addEventListener("change", (e) => {
      let selectedTerm = e.target.value;
      if (index + 1 == Number(selectedTerm) || selectedTerm == "select all") {
        content.style.display = "block";
      } else {
        content.style.display = "none";
      }

      let filteredEpisodes = getListOfContent.filter(
        (value) => value.style.display === "block"
      );
      TotalEpisodeNo.innerText = `${
        selectedTerm == "select all" ? 0 : filteredEpisodes.length
      } / ${getListofHeaderContents.length}`;
    });
  });
}
//Go back function
function GobackToDisplayShows(ListOfAllShows) {
  backToShow.addEventListener("click", (e) => {
    CreateShowCart(ListOfAllShows);
  });
}

/**Search Show input */
function ShowSearchInput() {
  let ShowInput = document.getElementById("show-search");
  let ListOfShows = [...document.querySelectorAll(".show-content")];
  ShowInput.addEventListener("keyup", (event) => {
    let searchValue = event.target.value.toLowerCase();
    ListOfShows.forEach((show) => {
      let IncludesResult = show.innerText.toLowerCase().includes(searchValue);
      if (IncludesResult) {
        show.style.display = "block";
      } else {
        show.style.display = "none";
      }
    });
    let filterShows = ListOfShows.filter(
      (show) => show.style.display == "block"
    );
    TotalShows.innerText = `Found ${filterShows.length} Of ${ListOfShows.length}`;
  });
}

window.onload = setup;

/**
api files to use to build another project 
https://jsonplaceholder.typicode.com/users
*/

/**More features to be implemented
1. In the drop down select, display oly the searched episodes
2.Create an extra card and show it when there is no search result from the input 
 */

/**
Add show search and toggle between the search episode input */

//Tomorrow
//Work in the serch input for shows

//Nicd colors => #04AA6D & #D9EEE1
