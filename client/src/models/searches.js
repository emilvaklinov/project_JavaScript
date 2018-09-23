const PubSub = require('../helpers/pub_sub');
const Request = require('../helpers/request');

const Searches = function(url){
  this.url = url;
  this.request = new Request(this.url);
  this.APIrequest = new Request('http://localhost:3000/api/search-results');
}

Searches.prototype.bindEvents = function(){
  PubSub.subscribe('FormView:search-term-submitted', (event)=>{
    this.postSearch(event.detail);
    this.getSearchResults(event.detail);
  })
  PubSub.subscribe('ListView:delete-clicked', (event) => {
    this.deleteSearch(event.detail);
  })
}

Searches.prototype.getData = function(){
  this.request.get()
  .then((searches)=>{
    PubSub.publish('Searches:searches-data-loaded', searches);
  })
  .catch(console.error);
}

Searches.prototype.getSearchResults = function(){
  this.APIrequest.get()
    .then((tweets) => {
      PubSub.publish('Searches:tweet-data-loaded', tweets);
    })
    .catch(console.error);
};

Searches.prototype.postSearch = function(search){
  this.request.post(search)
    .then((searches)=>{
      PubSub.publish('Searches:searches-data-loaded', searches);
    })
    .catch(console.error);
}

Searches.prototype.deleteSearch = function(listItemId){
this.request.delete(listItemId)
.then((searches)=> {
  PubSub.publish('Searches:searches-data-loaded', searches);
})
.catch(console.error);
}


module.exports = Searches;