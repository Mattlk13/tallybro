App.Views.AppView = Backbone.View.extend({
  el: $('#root'),

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
  }

});
