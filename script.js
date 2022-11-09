//You can edit ALL of the code here
const ROOTELEM = document.getElementById("root");
let container = document.querySelector(".container");
let inputContainer = document.querySelector(".input-container");
let selectElement = document.querySelector(".pisodes-select");
let ShowSelect = document.querySelector(".show-select");
let TotalEpisodeNo = document.querySelector(".total-episodes");

function setup() {
  // const ALLEPISODES = getAllEpisodes();

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((res) => res.json())
    .then((data) => {
      const ALLEPISODES = data;
      makePageForEpisodes(ALLEPISODES);
    })
    .catch((error) => console.error("Something went wrong:", error));

  const ALLSHOWS = getAllShows();
  selectShow(ALLSHOWS);
}

function makePageForEpisodes(ALLEPISODES) {
  CreateEpisodeCard(ALLEPISODES);
  numberOfSearchedEpisodes(ALLEPISODES);
  SearchInputResult(ALLEPISODES);
  SelectResult();
}
//Show select creation
function selectShow(ALLSHOWS) {
  ALLSHOWS.forEach((show) => {
    let option = document.createElement("option");
    option.innerText = show.name;
    option.value = show.id;
    ShowSelect.appendChild(option);
  });

  //Search Result for Shows
  ShowSelect.addEventListener("change", (event) => {
    console.log(typeof Number(event.target.value));

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
}
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
}

function numberOfSearchedEpisodes(ALLEPISODES) {
  TotalEpisodeNo.innerText = `${0} / ${ALLEPISODES.length}`;
}

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
}

//Select episode creation
function SelectResult() {
  /**Clear the drop down every time you seclect a show and then dow the new episodes of that show*/
  selectElement.innerText = "";
  let getListofHeaderContents = [
    ...document.querySelectorAll(".content-header"),
  ];
  let getListOfContent = [...document.querySelectorAll(".content")];
    let getSelectAllEpisodes = document.createElement("option");
    console.log(getSelectAllEpisodes);
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
window.onload = setup;

/**
api files to use to build another project 
https://jsonplaceholder.typicode.com/users
*/

/**More features to be implemented
1. In the drop down select, display oly the searched episodes
2.Create an extra card and show it when there is no search result from the input 
 */
