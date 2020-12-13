const apiKey =  "8uX3k2Q3e5ryqHgD8Jv0flcezAM1e9m6";

document.querySelector("form").addEventListener('submit', (event) => {
  event.preventDefault();
  var searchItem = document.getElementById("search").value;
  console.log("search item: " + searchItem);
  const limit = 5;

  const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchItem}&limit=${limit}&offset=0`;  

  fetch(url)
  .then(response => response.json())
  .then(data => {
    for(var i = 0; i < data.data.length; i++) {

      const gifUrl = data.data[i].images.fixed_height_downsampled.url;
      console.log(data)
      let fig= document.createElement("img");
      fig.src = gifUrl;
      
      let out = document.querySelector("#giffy");
      out.insertAdjacentElement('afterend', fig);
    }
  })
  .catch(e => {
    console.log("Got some errors");
    console.log(e);
  })

})