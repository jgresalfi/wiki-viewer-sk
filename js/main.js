'use strict';

document.addEventListener("DOMContentLoaded", function() {
  //Event listener to reveal search field on magnifying glass click
  var clicker = document.getElementById("clicker"),
    searchBox = document.getElementById("search"),
    randomizer = document.getElementById("randomizer");

  function searchReveal() {
    searchBox.classList.toggle("reveal");
    searchReset.classList.toggle("reveal");
    if (searchBox.classList.contains("reveal")) {
      searchBox.focus();
    } else {
      searchBox.blur();
    }
  }

  function searchClear() {
    searchBox.value = searchBox.defaultValue;
  }

  clicker.onclick = searchReveal;
  randomizer.onlick = searchClear;
  //End search field click event code

  //AJAX call and response callback function
  function getResponse(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('GET', url, true);
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        console.log(this.status);
        callback(this.response);
      } else {
        console.log(this.error);
      }
    }; //End xhr.onload
    xhr.send();
  } //End getResponse

  //Callback function after ajax data is returned to write response to page
  var data,
    resultDiv = document.getElementById("result"),
    contBtn = document.createElement("button"),
    searchReset = document.getElementById("searchReset"),
    contBtnCont = document.getElementById("continue-button");

  function responseWrite(response) {
    console.log(JSON.parse(response));
    var contDiv = document.getElementById("continue-button");
    data = JSON.parse(response);
    if (data.query.search.length === 0) {
      searchBox.value = searchBox.defaultValue;
      searchBox.placeholder = "Please try your search again...";
    } else {
      for (var i = 0; i < data.query.search.length; i++) {
        var artTitle = document.createElement("h3"),
          artSnip = document.createElement("p"),
          artDiv = document.createElement("div"),
          artLink = document.createElement("a"),
          artURL = "https://en.wikipedia.org/wiki/" + data.query.search[i].title;

        artLink.setAttribute("href", artURL);
        artLink.setAttribute("target", "_blank");
        artLink.classList.add("wiki-link");
        artDiv.classList.add("wiki-entry", "two", "column");
        artTitle.innerHTML = data.query.search[i].title;
        artSnip.innerHTML = data.query.search[i].snippet;
        artDiv.append(artTitle, artSnip, artLink);
        resultDiv.append(artDiv);
      }
      if (data.query.searchinfo.totalhits > 12) {
        contBtn.setAttribute("id", "contButton");
        contBtn.innerHTML = "More...";
        contDiv.append(contBtn);
      }

    }

  } //End responseWrite callback

  //Fires getResponse() and responseWrite() to get data and write it to page
  searchBox.onchange = function() {
    var ajaxURL = "https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + searchBox.value + "&srlimit=12&format=json&continue=";
    resultDiv.innerHTML = "";
    getResponse(ajaxURL, responseWrite);
  };

  //Search results continue button
  contBtn.onclick = function() {

    var contURL = "https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=12&format=json&sroffset=" + data.continue.sroffset + "&continue=-||&srsearch=" + searchBox.value;
    contBtnCont.removeChild(contBtn);
    resultDiv.innerHTML = "";
    getResponse(contURL, responseWrite);
  }

  //Search field reset button
  searchReset.onclick = function() {
    searchBox.value = searchBox.defaultValue;
    resultDiv.innerHTML = "";
    contBtn.remove();
    searchBox.placeholder = "Search...";
  }

}) //End docready
