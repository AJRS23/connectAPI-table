document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons() {
  var docBod = document.getElementById('docBod');  //Obtain the body
  var docHead = document.getElementById('docHead');
  var f = 1;    //First page
  loadBody(docHead,docBod,f);

  //Next button
  document.getElementById('next').addEventListener('click', function(event){
    if (f < 7) {
      docHead.innerHTML = ""
      docBod.innerHTML = "";    //Reload body
      f++;    //Increase page
      loadBody(docHead,docBod, f);

    }
  });

  //Previous button
  document.getElementById('prev').addEventListener('click', function(event){
    if (f > 1) {
      docHead.innerHTML = ""
      docBod.innerHTML = "";
      f--;    //Decrease page
      loadBody(docHead,docBod,f);
    }
  });
}

function loadBody (docHead, docBod, f){
  var col = ["Name","Climate","Population","Movies"];


  var planetHead = document.createElement('h3');
  docHead.appendChild(planetHead);
  planetHead.textContent = 'Planets Page - ' + f;   //f = page #

  var table = document.createElement("table");

  // CREATE TABLE HEAD .
	var tHead = document.createElement("thead");

	// CREATE ROW FOR TABLE HEAD .
	var hRow = document.createElement("tr");

  // ADD COLUMN HEADER TO ROW OF TABLE HEAD.
	for (var i = 0; i < (col.length); i++) {  //Sin contar Films
			var th = document.createElement("th");
			th.innerHTML = col[i];
			hRow.appendChild(th);
	}
	tHead.appendChild(hRow);
	table.appendChild(tHead);

  // CREATE TABLE BODY .
	var tBody = document.createElement("tbody");

  loadJson(tBody, f);

  table.appendChild(tBody);
  docBod.appendChild(table);

}


function loadJson(tBody , f){

  //Get API
  var req = new XMLHttpRequest();
  var URLhost = 'https://swapi.co/api/planets/?page=' + f;    //Depending of the page
  req.open('GET', URLhost, true);
  //Load JSON
  req.addEventListener('load', function() {
    //In case of an error
    if (req.status >= 200 && req.status < 400) {

      //Parse JSON to an object
      var response = JSON.parse(req.responseText);
      console.log(response);

      for (var k = 0; k < response.results.length; k++) {
        (function(y) {


          var bRow = document.createElement("tr"); // CREATE ROW FOR EACH RECORD

          var tname = document.createElement("td");
          tname.innerHTML = response.results[y].name;
          bRow.appendChild(tname);

          var tclimate = document.createElement("td");
          tclimate.innerHTML = response.results[y].climate;
          bRow.appendChild(tclimate);

          var tpopu = document.createElement("td");
          tpopu.innerHTML = response.results[y].population;
          bRow.appendChild(tpopu);

          var tmovies = document.createElement("td");

          // ------------------- Access to another API ------------------------
          //Verify if the list is empty or not
          if (response.results[y].films.length > 0) {

            var movieList = document.createElement('ol');

            tmovies.appendChild(movieList);
            //Go through the list of films
            for (var e = 0; e < response.results[y].films.length; e++) {
              (function(x) {
                //Access each API
                var newURLhost = response.results[y].films[x];
                var newReq = new XMLHttpRequest();
                newReq.open('GET', newURLhost, true);

                newReq.addEventListener('load', function(){
                  if(newReq.status >= 200 && newReq.status < 400){
                    var newResponse = JSON.parse(newReq.responseText);
                    //Get title of the film
                    var movie = document.createElement('li');
                    movie.textContent = newResponse.title;
                    movieList.appendChild(movie);

                  } else {
                    console.log("Error in network request: " + newReq.statusText);
                  }});
                newReq.send(null);
                event.preventDefault();
              })(e); //Close
            }

          }

          bRow.appendChild(tmovies);
          tBody.appendChild(bRow);

        })(k);
      }
    } else {
      console.log('Error in network request: ' + req.statusText);
    }
  });
  
  req.send(null);
  event.preventDefault();
}
