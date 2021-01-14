"use strict";

// http://www.omdbapi.com/?s=guardian&apikey=c26d67ff
(function() {
    window.addEventListener("load", init);
    var searchTitle;
    var searchResults;
    var nominations;
    var nominated = new Set();

    function init() {
        qs('input').addEventListener('keyup', processNewSearch);
        searchTitle = qs('#searchTitle');
        searchResults = qs('#searchResults');
        nominations = qs('#nominations');
    }

    function processNewSearch(e) {
        let search = e.target.value;
        searchTitle.textContent = search;

        fetch(`http://www.omdbapi.com/?s=${search}&type=movie&apikey=c26d67ff`)
          .then(res => res.json())
          .then(renderSearchResults);
    }

    function renderSearchResults(results) {
        if (results.Response === "True") {
            searchResults.innerHTML = "";
            let res = results.Search;
            for (let i = 0; i < 5 && i < res.length; i++) {
                let li = document.createElement('li');

                let div = document.createElement('div');
                div.classList.add('d-flex', 'justify-content-between', 'align-items-center');
                div.textContent = `${res[i].Title} (${res[i].Year})`
                
                let btn = document.createElement('button');
                btn.classList.add('btn', 'btn-primary');
                btn.textContent = 'Nominate';
                btn.addEventListener('click', () => {
                    addNomination(res[i].Title, res[i].Year, res[i].imdbID, btn);
                })

                btn.disabled =  nominated.has(res[i].imdbID);

                div.appendChild(btn);
                li.appendChild(div);
                li.classList.add('m-2');
                searchResults.appendChild(li);
                
            }
        } else {
            searchResults.innerHTML = "No search results yet";
        }
    }

    function addNomination(title, year, id, butn) {
        if (nominated.size === 0) {
            nominations.innerHTML = "";
        }

        nominated.add(id);
        butn.disabled = true;
        let li = document.createElement('li');

        let div = document.createElement('div');
        div.classList.add('d-flex', 'justify-content-between', 'align-items-center');
        div.textContent = `${title} (${year})`
                    
        let btn = document.createElement('button');
        btn.classList.add('btn', 'btn-primary');
        btn.textContent = 'Remove nomination';
        btn.addEventListener('click', () => {
            nominations.removeChild(li);
            nominated.delete(id);
            if (nominated.size === 0) {
                nominations.innerHTML = "No nominations yet";
            }
            butn.disabled = false;
        });

        div.appendChild(btn);
        li.appendChild(div);
        li.classList.add('m-2');
        nominations.appendChild(li);
    }

    function qs(selector) {
        return document.querySelector(selector);
    }
})();