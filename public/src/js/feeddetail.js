var sharedMomentsArea = document.querySelector('#wrapper-detail-page');

var currentUrl = window.location.href;
var idIndex = currentUrl.indexOf('?id=');
var idValue = null;

if (idIndex !== -1) {
    var idSubstring = currentUrl.substring(idIndex + 4);
    var idParts = idSubstring.split(/[&?]/);
    idValue = idParts[0];
}
console.log('ID Value:', idValue);

function clearCards() {
  while(sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}

function createCard(data) {
  var titleWrapper = document.createElement('div');
  titleWrapper.innerHTML = `<h1 class="detail-title text-center my-4" style="color: aliceblue;">${data.name}</h1>`

  var imageWrapper = document.createElement('div')
  imageWrapper.innerHTML = `<img src="/src/images/${data.image}" class="big-image">`

  var descWrapper = document.createElement('div')
  descWrapper.className = 'description p-3 text-center'
  descWrapper.style.color = 'aliceblue'
  descWrapper.innerHTML = `<p>${data.description}</p>`

  sharedMomentsArea.appendChild(titleWrapper);
  sharedMomentsArea.appendChild(imageWrapper)
  sharedMomentsArea.appendChild(descWrapper)
}

function isDetailDataCached(id) {
  return localStorage.getItem(id) !== null;
}

clearCards();
if (isDetailDataCached(idValue) || !navigator.onLine) {
  var cachedData = JSON.parse(localStorage.getItem(idValue));
  createCard(cachedData);
} else {
  var url = `https://tes1-ambw-c14210048-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${idValue}.json`;
  fetch(url)
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      console.log('Data:', data);
      createCard(data);
      localStorage.setItem(idValue, JSON.stringify(data)); 
    })
    .catch(function(error) {
      console.error('Error:', error);
      window.location.href = '/offline.html';
    });
}
