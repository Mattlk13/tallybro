App.Views.NewPlayerView = Backbone.View.extend({
  el: $('#new-player'),

  events: {
    'dragover .headshot': 'dragOver',
    'dragleave .headshot': 'dragEnd',
    'drop .headshot': 'drop',
    'submit': 'createPlayer'
  },

  initialize: function() {
    this.fileUploadInput();
  },

  fileUploadInput: function() {
    var that = this;

    if (!Modernizr.draganddrop || Modernizr.touch) {
      var $file_upload_input = $('<input>', {
        type: 'file',
        name: 'headshot'
      });
      this.$el.find('.headshot').html($file_upload_input);

      this.$el.on('change', $file_upload_input, function(e) {
        that.readFiles(e.target.files);
      });
    }
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
      var image = new Image();
      image.src = e.target.result;

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

    this.fileUploadInput();
  }
});