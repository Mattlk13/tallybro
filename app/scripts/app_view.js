App.Views.AppView = Backbone.View.extend({
  el: $('#root'),

  events: {
    'submit #new-player': 'createPlayer'
  },

  initialize: function() {
    this.listenTo(App.players, 'add', this.addOne);
    this.listenTo(App.players, 'reset', this.addAll);

    App.players.fetch();
  },

  addOne: function(player) {
    var view = new App.Views.PlayerView({ model: player });
    this.$("#players").append(view.render().el);
  },

  addAll: function() {
    App.players.each(this.addOne, this);
  },

  createPlayer: function(e) {
    e.preventDefault();
    App.players.create($(e.target).serializeObject());
  }

});
