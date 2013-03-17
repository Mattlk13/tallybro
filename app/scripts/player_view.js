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
