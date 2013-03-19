App.Views.NewPlayerView = Backbone.View.extend({
  el: $('#new-player'),

  events: {
    'dragover .headshot': 'dragOver',
    'dragleave .headshot': 'dragEnd',
    'drop .headshot': 'drop',
    'click .headshot': 'triggerFileSelect',
    'submit': 'createPlayer'
  },

  initialize: function() {
    this.fileUploadInput();
  },

  triggerFileSelect: function(e) {
    e.preventDefault();
    this.$el.find('input[type=file]').click();
  },

  fileUploadInput: function() {
    var that = this;

    this.$el.on('change', 'input[type=file]', function(e) {
      that.readFiles(e.target.files);
    });
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

    reader.onload = function (e) {
      var $bg = $('<div>', {
        'class': 'bg',
        'style': 'background-image: url('+ e.target.result +')'
      });

      that.$el.find('.headshot').html($bg);
      that.$el.find('input[name=headshot]').val(e.target.result);
    };

    reader.readAsDataURL(file);
  },

  createPlayer: function(e) {
    e.preventDefault();
    App.players.create($(e.target).serializeObject());

    e.target.reset();
    this.$el.find('.headshot').html('Add photo');

    this.fileUploadInput();
  }
});