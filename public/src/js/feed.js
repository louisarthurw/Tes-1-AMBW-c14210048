var shareImageButton = document.querySelector('#install');
var createPostArea = document.querySelector('#create-post');
var sharedMomentsArea = document.querySelector('#wrapper-workout');

function openCreatePostModal() {
  console.log('test')
  console.log(deferredPrompt)
  // createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  } else {
    alert("Coba di broswer lain / pakai extension vscode Live Server")
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

// Currently not in use, allows to save assets in cache on demand otherwise
function onSaveButtonClicked(event) {
  console.log('clicked');
  if ('caches' in window) {
    caches.open('user-requested')
      .then(function(cache) {
        cache.add('https://httpbin.org/get');
        cache.add('/src/images/sf-boat.jpg');
      });
  }
}

function clearCards() {
  while(sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}

function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'col-lg-4 col-md-6 mb-4 d-flex justify-content-center';
  cardWrapper.innerHTML = `<div class="card" style="width: 20rem; background-color: rgb(11,62,69);">
  <img src="/src/images/${data.image}" class="card-img-top" alt="...">
  <div class="card-body text-center">
    <h5 class="card-title" style="color: aliceblue;">${data.name}</h5>
    <a href="detail.html?id=${data.id}" class="btn btn-primary">Details</a>
  </div>
</div>`

  sharedMomentsArea.appendChild(cardWrapper);
}

function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
}

var url = 'https://tes1-ambw-c14210048-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json';
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    clearCards();
    for (var key in data) {
      dataArray.push(data[key]);
    }
    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('posts')
    .then(function(data) {
      if (!networkDataReceived) {
        console.log('From cache', data);
        updateUI(data);
      }
    });
}