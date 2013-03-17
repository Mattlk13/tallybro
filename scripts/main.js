window.App = {
  Models: {},
  Collections: {},
  Views: {}
};

App.Models.Player = Backbone.Model.extend({
  defaults: {
    headshot: '',
    name: '',
    points: 0
  }
});

App.Collections.PlayerCollection = Backbone.Collection.extend({
  model: App.Models.Player,
  localStorage: new Backbone.LocalStorage("players")
});

App.Views.PlayerView = Backbone.View.extend({
  className: "span3 player",
  template: _.template($('#tmpl-player').html()),

  events: {
    'click .controls a': 'updatePoints',
    'click .remove': 'clear'
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  clear: function(e) {
    e.preventDefault();
    var confirmation = confirm('Are you sure you want to remove ' + this.model.get('name'));
    if (confirmation) {
      this.model.destroy();
    }
  },

  animateProgressBar: function() {
    var $progress = this.$el.find('.indicator .progress');

    $progress.stop(true, true).animate({
      width: '100%'
    }, 2000, 'linear', function() {
      $progress.css({
        width: 0
      });
    });
  },

  updateTotal: function(change) {
    this.model.save({
      points: this.model.get('points') + (+change)
    });
  },

  updatePoints: function(e) {
    var $change_by = this.$el.find('.change-by'),
        change = +$change_by.html(),
        increment = 1,
        css_class = 'subtract',
        that = this;

    e.preventDefault();

    if ($(e.target).hasClass('subtract')) {
      increment = -1;
    }

    change += increment;

    if (change >= 0) {
      change = '+' + change;
      css_class = 'add';
    }

    $change_by.html(change)
              .removeClass('add subtract')
              .addClass(css_class);

    clearTimeout(this.timeout);
    this.timeout = setTimeout(function() {
      that.updateTotal(change);
    }, 2000);

    this.animateProgressBar();
  }

});

App.Views.NewPlayerView = Backbone.View.extend({
  el: $('#new-player'),

  events: {
    'dragover .headshot': 'dragOver',
    'dragleave .headshot': 'dragEnd',
    'drop .headshot': 'drop',
    'submit': 'createPlayer'
  },

  dragOver: function(e) {
    $(e.target).addClass('hover');
    return false;
  },

  dragEnd: function(e) {
    $(e.target).removeClass('hover');
    return false;
  },

  drop: function(e) {
    e.preventDefault();
    $(e.target).removeClass('hover');

    this.readFiles(e.originalEvent.dataTransfer.files);
  },

  readFiles: function(files) {
    var formData = new FormData();
    for (var i = 0, len = files.length; i < len; i++) {
      formData.append('file', files[i]);
      this.previewFile(files[i]);
    }
  },

  previewFile: function(file) {
    var reader = new FileReader(),
        that = this;

    reader.onload = function (event) {
      var image = new Image();
      image.src = event.target.result;

      that.$el.find('.headshot').html(image);
      that.$el.find('input[name=headshot]').val(image.src);
    };

    reader.readAsDataURL(file);
  },

  createPlayer: function(e) {
    e.preventDefault();
    App.players.create($(e.target).serializeObject());

    e.target.reset();
    this.$el.find('.headshot').html('Drop photo');
  }
});
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

$(function() {
  App.players = new App.Collections.PlayerCollection();
  App.new_player_view = new App.Views.NewPlayerView();
  App.tallyBro = new App.Views.AppView();

});
