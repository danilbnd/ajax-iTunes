'use strict';

function msToTime(duration) {
	var milliseconds = parseInt((duration % 1000) / 100),
		seconds = parseInt((duration / 1000) % 60),
		minutes = parseInt((duration / (1000 * 60)) % 60),
		hours = parseInt((duration / (1000 * 60 * 60)) % 24);
	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;
	return minutes + ":" + seconds;
}

document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelectorAll('.parallax');
	var instances = M.Parallax.init(elems);
 });


 let searchForm = document.querySelector('[data-search-form]');

function sendRequest(event) {
	event.preventDefault();
	
	let term = searchForm.query.value; //Get value from search file
	let url = `https://itunes.apple.com/search?term=${term}&limit=20 `;
	
	console.log('ajax');

	fetch(url)
	.then(response => response.json())
	.then(showList)

	
}


 searchForm.addEventListener('submit', sendRequest);

 let listEl = document.querySelector('[data-list]');
 let tuneTmpl = document.querySelector('[data-tune-tmpl]').innerHTML;

 //Show tune card from ajax data
 function showList(data) {
	 console.log(data);

	 let items = data.results;


	 console.log(items);
	 

	 let tunesHTML = ''

	 items.forEach( tune => {
			
		let duration = msToTime(tune.trackTimeMillis);
;
		tunesHTML += tuneTmpl
									.replace(/{{artist}}/gi, tune.artistName)
									.replace(/{{song}}/gi, tune.trackName)
									.replace(/{{album}}/gi, tune.collectionName)
									.replace(/{{genre}}/gi, tune.primaryGenreName)
									.replace(/{{collection-url}}/gi, tune.collectionViewUrl)
									.replace(/{{price}}/gi, tune.collectionPrice)
									.replace(/{{cover}}/gi, tune.artworkUrl100)
									.replace(/{{duration}}/gi, duration)
									.replace(/{{audio}}/gi, tune.previewUrl)
									.replace(/{{trackId}}/gi, tune.trackId)
									.replace(/100x100/gi, '400x400')
									;


	 });

	 listEl.innerHTML = tunesHTML;

 }

 listEl.addEventListener('click', (event) => {
	 let playBtn = event.target;

	 let songId = playBtn.dataset.play;
	 
	 if(songId === undefined) return; //if we clicked not on button do nothing

	 let currentAudio = document.getElementById(songId);
// get all audios and pause them
	 let audioTracks = listEl.querySelectorAll('audio');

	 audioTracks.forEach(audio =>{
		if(audio != currentAudio){ //if not current audio pause
			audio.pause();
		}
	 });

	 currentAudio.paused ? currentAudio.play() : currentAudio.pause();

	 let pulsingBtn = listEl.querySelector('.pulse');
	 //If playing not curent button remove pulsing
	 if (pulsingBtn != playBtn && pulsingBtn !== null) {
      pulsingBtn.classList.remove('pulse');
   }
   playBtn.classList.toggle('pulse');

  });