App.Collections.PlayerCollection = Backbone.Collection.extend({
  model: App.Models.Player,
  localStorage: new Backbone.LocalStorage("players")
});
