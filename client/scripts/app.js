var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },


  toggleLike: function() {
    this.set('like', false);
    // console.log('toggleLike triggered')
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,



  initialize: function() {
    this.on('change', function () {
      this.sort();
    })
    this.comparator = 'title';

  },


  sortByField: function(field) {
    this.comparator = field;
    this.sort();
  }


});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    this.model.on('change', this.render,this);
  },
// dom events
  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    this.model.toggleLike();
    // console.log('handleclick');
  },

  render: function() {
    // console.log(this.$el)
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    var moviesView = this;
    this.collection.on('sort', this.render ,this)
    console.log(this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
