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