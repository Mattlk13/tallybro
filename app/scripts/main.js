$(function() {
  App.players = new App.Collections.PlayerCollection();
  App.new_player_view = new App.Views.NewPlayerView();
  App.tallyBro = new App.Views.AppView();

});

window.addEventListener('load', function() {
  new FastClick(document.body);
}, false);