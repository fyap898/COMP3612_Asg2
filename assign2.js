/*
   Author: Felix Yap
   Course: COMP 3612
   Instructor: Randy Connolly
*/

/* url of song api --- https versions hopefully a little later this semester */	
const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';


let genresList;

fetch('genres.json')
.then(response => {
   if(!response.ok){
      throw new Error('genreList: Failed to fetch data');
   }
   return response.json();
})
.then(data => {
   const genreData = JSON.stringify(data);
   genresList = JSON.parse(genreData);

   console.log(genresList);
})
.catch(error => {
   console.error('genreList: Failed to fetch');
});



let artistsList;

fetch('artists.json')
.then(response => {
   if(!response.ok){
      throw new Error('artistsList: Failed to fetch data');
   }
   return response.json();
})
.then(data => {
   const artistData = JSON.stringify(data);
   artistsList = JSON.parse(artistData);

   console.log(artistsList);
})
.catch(error => {
   console.error('artistList: Failed to fetch');
});



let dataList;

fetch(api)
.then(response => {
   if(!response.ok){
      throw new Error('dataList: Failed to fetch data');
   }
   return response.json();
})
.then(data => {
   const songData = JSON.stringify(data);
   dataList = JSON.parse(songData);

   console.log(dataList);

   loadMain();

})
.catch(error => {
   console.error('dataList: Failed to fetch');
});

//variables
let topGenreList = [];
let topArtistList = [];
let topSongList = [];
let radarCreated = false;
let radarChart;
let filteredList = [];
let playlistAdded = [];
let titleAscending = false;
let artistAscending = false;
let yearAscending = false;
let genreAscending = false;


//Playlist's function

function viewPlaylist()
{

   loadPlaylist();
   displayPlaylist();
}

/*
   Description: Load added songs from the playlist.
*/
function loadPlaylist()
{
   const pl_title = document.querySelector('#playlist_title_list');
   const pl_artist = document.querySelector('#playlist_artist_list');
   const pl_year = document.querySelector('#playlist_year_list');
   const pl_genre = document.querySelector('#playlist_genre_list');
   const pl_remove = document.querySelector('#playlist_remove_list');


   pl_title.innerHTML = '';
   pl_artist.innerHTML = '';
   pl_year.innerHTML = '';
   pl_genre.innerHTML = '';
   pl_remove.innerHTML = '';

   if(playlistAdded)
   {
      playlistAdded.forEach(element => {
         const title_li = document.createElement('li');
         const artist_li = document.createElement('li');
         const year_li = document.createElement('li');
         const genre_li = document.createElement('li');
         const rm_li = document.createElement('li');
         const rmBtn = document.createElement('input');

         rmBtn.type = 'button';
         rmBtn.value = 'Remove';
         rmBtn.className = 'rmBtn';

         title_li.textContent = formatTitle(element.title);
         artist_li.textContent = element.artist;
         year_li.textContent = element.year;
         genre_li.textContent = element.genre;

         rm_li.appendChild(rmBtn);
         pl_remove.appendChild(rm_li);
         pl_year.appendChild(year_li);
         pl_title.appendChild(title_li);
         pl_artist.appendChild(artist_li);
         pl_genre.appendChild(genre_li);
         
         rmBtn.addEventListener('click', function()
         {
            rmSong(element);
         });
      });
   }
}

/*
   Description: Remove a song from existing playlist.
*/
function rmSong(song)
{
   //chatGPT
   for (let i = playlistAdded.length - 1; i >= 0; i--) {
      if (playlistAdded[i].title === song.title) {
        playlistAdded.splice(i, 1);
      }
    }
   loadPlaylist();
}

function clearPlaylist()
{
   playlistAdded = [];
   loadPlaylist();
}



//Search / Browse Songs' function

/*
   Description: Load the search page without any filters
*/
function loadSearch()
{
   init_radioBtn();
   load_search_artist();
   load_search_genre();

   displaySearch();
}

/*
   Description: Sort title in ascending order.
*/
function sortTitle()
{
   if(!titleAscending)
   {
      filteredList.sort((a,b) => a.title.localeCompare(b.title));
      loadFiltered();
      titleAscending = true;
      artistAscending = false;
      yearAscending = false;
      genreAscending = false;
   }
}

/*
   Description: Sort artist in ascending order.
*/
function sortArtist()
{
   if(!artistAscending)
   {
      filteredList.sort((a,b) => a.artist.localeCompare(b.artist));
      loadFiltered();
      titleAscending = false;
      artistAscending = true;
      yearAscending = false;
      genreAscending = false;
   }
}

/*
   Description: Sort year in ascending order.
*/
function sortYear()
{
   if(!yearAscending)
   {
      filteredList.sort((a,b) => a.year - b.year);
      loadFiltered();
      titleAscending = false;
      artistAscending = false;
      yearAscending = true;
      genreAscending = false;
   }
}

/*
   Description: Sort genre in ascending order.
*/
function sortGenre()
{
   if(!genreAscending)
   {
      filteredList.sort((a,b) => a.genre.localeCompare(b.genre));
      loadFiltered();
      titleAscending = false;
      artistAscending = false;
      yearAscending = false;
      genreAscending = true;
   }
}

/*
   Description: Add selected song to playlist
*/
function addPlaylist(song)
{
   let index = playlistAdded.length;

   playlistAdded[index] = song;
   popSnackbarForAdd();
}

/*
   Description: An indicator that shows up when a song is successfully added.
*/
function popSnackbarForAdd()
{
   let snackbar = document.querySelector('#snackbar');
   snackbar.className = 'show';
   setTimeout(function(){
      snackbar.className = '';
   }, 3000);
}

/*
   Description: Filter with selected criteria (only when radio button is selected)
*/
function filterSearch()
{
   const titleRadio = document.querySelector('#title_radio');
   const artistRadio = document.querySelector('#artist_radio');
   const genreRadio = document.querySelector('#genre_radio');

   const title_search_box = document.querySelector('#title_search_box');
   const artist_search_list = document.querySelector('#artist_search_box');
   const genre_search_list = document.querySelector('#genre_search_box');

   const artIndex = artist_search_list.selectedIndex;
   const genreIndex = genre_search_list.selectedIndex;

   const artObj = artist_search_list.options[artIndex];
   const genObj = genre_search_list.options[genreIndex];

   titleInput = title_search_box.value.toLowerCase();
   artistInput = artObj.value;
   genreInput = genObj.value;

   titleRadio.checked ? filterSongs('title', titleInput):null;
   artistRadio.checked ? filterSongs('artist', artistInput):null;
   genreRadio.checked ? filterSongs('genre', genreInput):null;

   loadFiltered();
}

/*
   Description: Format the title to at most 25 characters
*/
function formatTitle(title)
{
   if(title.length <= 25)
   {
      return `${title}`;
   } else {
      return `${title.substring(0,25)}&hellip;`;
   }
}

function showTitle(title) {
   const tooltiptext = document.querySelector('#tooltiptext');
   const tooltip = document.querySelector('#tooltip');
   tooltiptext.textContent = title;
   tooltip.classList.add('show');
   setTimeout(() => {
       tooltiptext.textContent = '';
       tooltip.classList.remove('show');
   }, 5000);
}

/*
   Description: Load and display the filtered songs' list.
*/
function loadFiltered()
{
   const title = document.querySelector('#result_title_list');
   const artist = document.querySelector('#result_artist_list');
   const year = document.querySelector('#result_year_list');
   const genre = document.querySelector('#result_genre_list');
   const addList = document.querySelector('#result_add_list');

   title.innerHTML = '';
   artist.innerHTML = '';
   year.innerHTML = '';
   genre.innerHTML = '';
   addList.innerHTML = '';

   filteredList.forEach(element => {
      const titleLi = document.createElement('li');
      const artistLi = document.createElement('li');
      const yearLi = document.createElement('li');
      const genreLi = document.createElement('li');
      const addLi = document.createElement('li');
      const addBtn = document.createElement('input');

      addBtn.type = 'button';
      addBtn.value = 'Add';
      addBtn.className = 'addBtn';

      titleLi.innerHTML = formatTitle(element.title);
      artistLi.textContent = element.artist;
      yearLi.textContent = element.year;
      genreLi.textContent = element.genre;
      
      addLi.appendChild(addBtn);
      addList.appendChild(addLi);
      title.appendChild(titleLi);
      artist.appendChild(artistLi);
      year.appendChild(yearLi);
      genre.appendChild(genreLi);

      //Direct to Single Song's View
      titleLi.addEventListener('click', function(){
         let song = {};
         for(let i = 0; i< dataList.length; i++)
         {
            if(dataList[i].song_id == element.song_id)
            {
               song = dataList[i];
               break;
            }
         }
         viewSingleSong(song);
      });

      titleLi.addEventListener('mouseover', function(){
         showTitle(element.title);
      });

      //Add song to playlist
      addBtn.addEventListener('click', function(){
         let found = playlistAdded.find(item => item.title === element.title)
         if(!found){
            addPlaylist(element);
         }
      });
   });
}

/*
   Description: Main filter function.
*/
function filterSongs(type, keyword)
{
   // Clear the filtered list before populating it
   filteredList = [];
   let i = 0;

   titleAscending = false;
   artistAscending = false;
   yearAscending = false;
   genreAscending = false;

   switch (type) {
      case 'title':
         dataList.forEach(element => {
            if (element.title.includes(keyword)) {
               filteredList[i] = {
                  song_id: element.song_id,
                  title: element.title,
                  artist: element.artist.name,
                  year: element.year,
                  genre: element.genre.name
               };
               i++;
            }
         });
         break;

      case 'artist':
         dataList.forEach(element => {
            if (element.artist.name.includes(keyword)) {
               filteredList[i] = {
                  song_id: element.song_id,
                  title: element.title,
                  artist: element.artist.name,
                  year: element.year,
                  genre: element.genre.name
               };
               i++;
            }
         });
         break;

      case 'genre':
         dataList.forEach(element => {
            if (element.genre.name.includes(keyword)) {
               filteredList[i] = {
                  song_id: element.song_id,
                  title: element.title,
                  artist: element.artist.name,
                  year: element.year,
                  genre: element.genre.name
               };
               i++;
            }
         });
         break;

      default:
         console.log('Invalid type');
   }

}

/* 
   Description: Initialises the radio button and the 
                respective boxes
*/
function init_radioBtn()
{
   const title_radio_text = document.querySelector('#title_radio_text');
   const artist_radio_text = document.querySelector('#artist_radio_text');
   const genre_radio_text = document.querySelector('#genre_radio_text');

   const title_search_box = document.querySelector('#title_search_box');
   const artist_search_list = document.querySelector('#artist_search_box');
   const genre_search_list = document.querySelector('#genre_search_box');

   title_radio_text.style.opacity = 0.5;
   artist_radio_text.style.opacity = 0.5;
   genre_radio_text.style.opacity = 0.5;

   title_search_box.disabled = true;
   artist_search_list.disabled = true;
   genre_search_list.disabled = true;
}

/*
   Description: Update the radio button and the availability
                of the field to filter
*/
function radioBtn_enable(type)
{
   const titleRadio = document.querySelector('#title_radio');
   const artistRadio = document.querySelector('#artist_radio');
   const genreRadio = document.querySelector('#genre_radio');

   const title_search_box = document.querySelector('#title_search_box');
   const artist_search_list = document.querySelector('#artist_search_box');
   const genre_search_list = document.querySelector('#genre_search_box');

   const title_radio_text = document.querySelector('#title_radio_text');
   const artist_radio_text = document.querySelector('#artist_radio_text');
   const genre_radio_text = document.querySelector('#genre_radio_text');

   if(type === 'title')
   {
      artistRadio.checked = false;
      genreRadio.checked = false;

      title_radio_text.style.opacity = 1;
      artist_radio_text.style.opacity = 0.5;
      genre_radio_text.style.opacity = 0.5;

      title_search_box.disabled = false;
      artist_search_list.disabled = true;
      genre_search_list.disabled = true;

   } else if(type === 'artist')
   {
      titleRadio.checked = false;
      genreRadio.checked = false;

      title_radio_text.style.opacity = 0.5;
      artist_radio_text.style.opacity = 1;
      genre_radio_text.style.opacity = 0.5;

      title_search_box.disabled = true;
      artist_search_list.disabled = false;
      genre_search_list.disabled = true;

   } else if(type === 'genre')
   {
      titleRadio.checked = false;
      artistRadio.checked = false;

      title_radio_text.style.opacity = 0.5;
      artist_radio_text.style.opacity = 0.5;
      genre_radio_text.style.opacity = 1;

      title_search_box.disabled = true;
      artist_search_list.disabled = true;
      genre_search_list.disabled = false;   
   }


}

/*
   Description: Clear the applied filter
*/
function clearSearch()
{
   // const clear = document.querySelector('#clear_search');
   // clear.addEventListener('click', function(){
      const titleRadio = document.querySelector('#title_radio');
      const artistRadio = document.querySelector('#artist_radio');
      const genreRadio = document.querySelector('#genre_radio');

      const title_radio_text = document.querySelector('#title_radio_text');
      const artist_radio_text = document.querySelector('#artist_radio_text');
      const genre_radio_text = document.querySelector('#genre_radio_text');

      const title_search_box = document.querySelector('#title_search_box');
      const artist_search_list = document.querySelector('#artist_search_box');
      const genre_search_list = document.querySelector('#genre_search_box');

      //Reset checked radio buttons
      titleRadio.checked = false;
      artistRadio.checked = false;
      genreRadio.checked = false;

      // Reset radio text opacity
      title_radio_text.style.opacity = 0.5;
      artist_radio_text.style.opacity = 0.5;
      genre_radio_text.style.opacity = 0.5;

      // Disable search boxes
      title_search_box.disabled = true;
      artist_search_list.disabled = true;
      genre_search_list.disabled = true;

      // Reset selected options in select elements
      title_search_box.value = '';
      artist_search_list.selectedIndex = 0;
      genre_search_list.selectedIndex = 0;

      filteredList = [];
   // });
}

/*
   Description: Load the choice of genre to filter
*/
function load_search_genre()
{
   const search_genre_list = document.querySelector('#genre_search_box');
   const genreSet = new Set();

   genresList.forEach(element => {
      if(!genreSet.has(element.name))
      {
         const opt = document.createElement('option');
         opt.textContent = element.name;
         opt.value = element.name;
         genreSet.add(element.name);
         search_genre_list.appendChild(opt);
      }
   });
}

/*
   Description: Load the choice of artist to filter
*/
function load_search_artist()
{
   const search_artist_list = document.querySelector('#artist_search_box');
   const artistSet = new Set();

   artistsList.forEach(element => {
      if(!artistSet.has(element.name))
      {
         const opt = document.createElement('option');
         opt.textContent = element.name;
         opt.value = element.name;
         artistSet.add(element.name);
         search_artist_list.appendChild(opt);
      }
   });

}



//Single Song View's function

function viewSingleSong(song)
{
   formatSongDuration(song);
   fillSongDetail(song);
   fillAnalyseData(song);
   makeRadar(song);
   displaySingleSong();
}

/*
   Description: Format the duration of a song to minutes and seconds
*/
function formatSongDuration(song)
{
   let duration = song.details.duration;
   let minute = Math.floor(duration / 60);
   let second = duration % 60;

   return `${minute} : ${second < 10 ? '0' : ''}${second} `;
}

/*
   Description: Fill the analytic data of the song
*/
function fillAnalyseData(song)
{
   const bpm = document.querySelector('#bpm_analysis');
   const energy = document.querySelector('#energy_analysis');
   const dance = document.querySelector('#dance_analysis');
   const live = document.querySelector('#live_analysis');
   const val = document.querySelector('#val_analysis');
   const acou = document.querySelector('#acou_analysis');
   const speech = document.querySelector('#speech_analysis');
   const pop = document.querySelector('#pop_analysis');

   bpm.textContent = song.details.bpm;
   energy.textContent = song.analytics.energy;
   dance.textContent = song.analytics.danceability;
   live.textContent = song.analytics.liveness;
   val.textContent = song.analytics.valence;
   acou.textContent = song.analytics.acousticness;
   speech.textContent = song.analytics.speechiness;
   pop.textContent = song.details.popularity;
}

/*
   Description: Fill the song's detail
*/
function fillSongDetail(song)
{
   const title = document.querySelector('#title_detail');
   const name = document.querySelector('#name_detail');
   const type = document.querySelector('#type_detail');
   const genre = document.querySelector('#genre_detail');
   const year = document.querySelector('#year_detail');
   const duration = document.querySelector('#duration_detail');

   title.textContent = song.title;
   name.textContent = song.artist.name;
   type.textContent = artistsList[song.artist.id - 1].type;
   genre.textContent = song.genre.name;
   year.textContent = song.year;
   duration.textContent = formatSongDuration(song);

}

/*
   Description: Create a song's radar chart
*/
function makeRadar(song) {
   if (radarCreated) {
      radarChart.destroy();
   } 
   
   const radarData = {
      labels: ['Energy', 'Danceability', 'Liveness', 'Valence', 'Acousticness', 'Speechiness'],
      datasets: [{
         label: 'Song Properties',
         data: [
            song.analytics.energy,
            song.analytics.danceability,
            song.analytics.liveness,
            song.analytics.valence,
            song.analytics.acousticness,
            song.analytics.speechiness
         ]
      }]
   };


   const radarOptions = {
      scale: {
         ticks: {
            beginAtZero: true,
            max: 100
         }
      }
   };

   const radar_chart = document.querySelector('#radar_chart');
   radarChart = new Chart(radar_chart, {
      type: 'radar',
      data: radarData,
      options: radarOptions
   });
   radarCreated = true;

}



//Home's function

function loadMain()
{
   const home = document.querySelector('#homelink');
   home.addEventListener('click', displayMain);
   popCredit();

   topGenre();
   topArtist();
   mostPopSong();

   populateGenre();
   populateArtist();
   populatePopSongs();

   displayMain();
}

/*
   Description: Handler for pop up credit panel.
*/
function popCredit()
{
   let credBtn = document.querySelector('#credit_btn');
   credBtn.addEventListener('mouseover', function(){
      let popUp = document.querySelector('#popUp');
      popUp.classList.remove('hidden');

      setTimeout(function(){
         popUp.classList.add('hidden');
      }, 5000);

   });
   
}

/*
   Description: Load a list of songs with selected genre in Home page.
*/
function loadGenreSearch(genre)
{
   filterSongs('genre', genre);
   init_radioBtn()
   loadFiltered();
   displaySearch();
}

/*
   Description: Load a list of songs with selected artist in Home page.
*/
function loadArtistSearch(artist)
{
   filterSongs('artist', artist);
   init_radioBtn();
   loadFiltered();
   displaySearch();
}

/*
   Description: To populate the Top Popular Song's list in Home view from the api.
*/
function populatePopSongs()
{
   //Populating popular song list
   const pop_songs = document.querySelector('#pop_song');
   const songText = document.createElement('span');
   songText.id = "popSong_text";
   songText.textContent = 'Most Popular Songs';
   const ulSongEle = document.createElement('ul');
   ulSongEle.id = 'popSong_list';
   let countSong = 0;
   let songSet = new Set();

   topSongList.forEach(element => {
      if(countSong < 15)
      {
         if(!songSet.has(element.title))
         {
            const liSongEle = document.createElement('li');
            liSongEle.className = 'popSong_li';
            const songLink = document.createElement('span');
            songLink.textContent = element.title;
            liSongEle.appendChild(songLink);
            ulSongEle.appendChild(liSongEle);
            countSong++;
            songSet.add(element.title);
            songLink.addEventListener('click', function(){
               let song = {};
               for(let i = 0; i< dataList.length; i++)
               {
                  if(dataList[i].title == element.title)
                  {
                     song = dataList[i];
                     break;
                  }
               }
               viewSingleSong(song);
            });
            
         }
      }
   });
   pop_songs.appendChild(songText);
   pop_songs.appendChild(ulSongEle);
} 

/*
   Description: To populate the artist's list in Home view from the api.
*/
function populateArtist()
{
   //Populating artist list
   const artists = document.querySelector('#artist');
   const artistsText = document.createElement('span');
   artistsText.id = 'artist_text';
   artistsText.textContent = 'Top Artists';
   const ulArtistEle = document.createElement('ul');
   ulArtistEle.id = 'artist_list';
   let countArtist = 0;
   let artistSet = new Set();
   
   topArtistList.forEach(element => {
      if(countArtist < 15)
      {
         if(!artistSet.has(element.artist))
         {
            const liArtistEle = document.createElement('li');
            liArtistEle.className = 'popArt_li';
            const artistLink = document.createElement('span');
            artistLink.textContent = element.artist;
            liArtistEle.appendChild(artistLink);
            ulArtistEle.appendChild(liArtistEle);
            countArtist++;
            artistSet.add(element.artist);
            artistLink.addEventListener('click', function(){
               loadArtistSearch(artistLink.textContent);
            });
         }
      }
   });
   artists.appendChild(artistsText);
   artists.appendChild(ulArtistEle);
}

/*
   Description: To populate the genre's list in Home view from the api.
*/
function populateGenre()
{
   //Populating genre list
   const genres = document.querySelector('#genre');
   const genreText = document.createElement('span');
   genreText.id = 'genre_text';
   genreText.textContent = 'Top Genres';
   const ulGenreEle = document.createElement('ul');
   ulGenreEle.id = 'genre_list';
   let countGenre = 0;
   let genreSet = new Set();

   topGenreList.forEach(element => {
      if(countGenre < 15)
      {
         if(!genreSet.has(element.genre))
         {
            const liGenreEle = document.createElement('li');
            liGenreEle.className = 'popGen_li';
            const genreLink = document.createElement('span');
            genreLink.textContent = element.genre;
            liGenreEle.appendChild(genreLink);
            ulGenreEle.appendChild(liGenreEle);
            countGenre++;
            genreSet.add(element.genre);
            genreLink.addEventListener('click', function(){
               loadGenreSearch(genreLink.textContent);
            })
         }
      }
   });
   genres.appendChild(genreText);
   genres.appendChild(ulGenreEle);
}

/*
   Description: Sort the songs by popularity
*/
function mostPopSong()
{
   let i = 0;

   dataList.forEach(element =>{

      topSongList[i] = {};

      topSongList[i].popularity = element.details.popularity;
      topSongList[i].title = element.title;
      topSongList[i].id = element.id;
      i++;
   })

   //sorting by popularity(higher popularity will be in the top artist list)
   topSongList.sort((a, b) => b.popularity - a.popularity);
}

/*
   Description: Sort the artists by popularity
*/
function topArtist()
{
   let i = 0;

   dataList.forEach(element =>{

      topArtistList[i] = {};

      topArtistList[i].popularity = element.details.popularity;
      topArtistList[i].artist = element.artist.name;
      i++;
   })

   //sorting by popularity(higher popularity will be in the top artist list)
   topArtistList.sort((a, b) => b.popularity - a.popularity);
}

/*
   Description: Sort the genres by popularity
*/
function topGenre()
{
   let i = 0;

   dataList.forEach(element =>{

      topGenreList[i] = {};

      topGenreList[i].popularity = element.details.popularity;
      topGenreList[i].genre = element.genre.name;
      i++;
   })

   //sorting by popularity(higher popularity will be in the top genre list)
   topGenreList.sort((a, b) => b.popularity - a.popularity);
}



/*
   Description: Display functions for each page
*/

function displayMain()
{
   const search = document.querySelector('#search');
   search.style.display = 'none';
   const home = document.querySelector('#home');
   home.style.display = 'flex';
   const single_song = document.querySelector('#single_song');
   single_song.style.display = 'none';
   const playlist = document.querySelector('#playlist');
   playlist.style.display = 'none';
}

function displaySearch()
{
   const search = document.querySelector('#search');
   search.style.display = 'flex';
   const home = document.querySelector('#home');
   home.style.display = 'none';
   const single_song = document.querySelector('#single_song');
   single_song.style.display = 'none';
   const playlist = document.querySelector('#playlist');
   playlist.style.display = 'none';
}

function displaySingleSong()
{
   const search = document.querySelector('#search');
   search.style.display = 'none';
   const home = document.querySelector('#home');
   home.style.display = 'none';
   const single_song = document.querySelector('#single_song');
   single_song.style.display = 'flex';
   const playlist = document.querySelector('#playlist');
   playlist.style.display = 'none';
}

function displayPlaylist()
{
   const search = document.querySelector('#search');
   search.style.display = 'none';
   const home = document.querySelector('#home');
   home.style.display = 'none';
   const single_song = document.querySelector('#single_song');
   single_song.style.display = 'none';
   const playlist = document.querySelector('#playlist');
   playlist.style.display = 'flex';
}

/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/
