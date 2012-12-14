// =require jquery
// =require jquery-ui
// =require jquery.h5validate
// =require underscore
// =require jquery-placeholder

(function($, undefined) {
  var scrollPosition = 0, scrollbarWidth = 0;

  // Params from hash
  var History = function() {
    this._initialize();
  }

  _.extend(History.prototype, {
    _initialize: function() {
      this.params = {};

      // parse location
      this.parseLocation();

      // bind
      _.bindAll(this);
    },

    get: function(key) {
      return this.params[key];
    },

    set: function(key, value) {
      return this.params[key] = value;
    },

    has: function(key) {
      return _.has(this.params, key);
    },

    parseLocation: function() {
      var hash;

      if (hash = window.location.hash.match(/#!(.+)/)) {
        hash = hash[1].split('|');
        while (hash.length > 0) {
          var key = hash.shift();
          var value = hash.shift();
          this.params[key] = value;
        }
      }
    },

    toParams: function() {
      if (!_.isEmpty(this.params)) {
        return '#!' + _.map(_.pairs(this.params), function(pair) {
          return pair.join('|');
        }).join('|');
      } else {
        return '';
      }
    },

    setLocation: function(params) {
      if (_.isObject(params)) {
        this.params = {};

        _.each(_.pairs(params), function(pair) {
          this.params[pair[0]] = pair[1];
        }, this);
      }

      window.location.hash = this.toParams();
    },

    resetLocation: function() {
      this.setLocation({});
    }
  });
  History = new History();

  /* Slider class */

  var Slider = function() {
    this._initialize();
  }
  _.extend(Slider.prototype, {

    slideDuration: 800,
    slideInterval: 4500,

    items: [],

    _timer: null,
    _activeSlide: false,

    // init function
    _initialize: function() {
      // get all items & randomize
      this.items = _.shuffle($('#promotions article.item'));
      $('#promotions section.items').html(this.items);

      // get container width
      this.width = $('#promotions').outerWidth();

      // show only first item
      $(this.items).hide().first().show();

      // bind balls click
      var that = this;
      $('#promotions .ball a').on('click', function(event) {
        event.preventDefault();

        var index = $(this).parent().siblings().andSelf().index($(this).parent());

        var next_item = $('#promotions article.item').slice(index, index + 1);

        that.moveTo(next_item);
      });

      // bind
      _.bindAll(this);
    },

    // start function
    start: function(startAfter) {
      var next = _.bind(function() {
        this._slide();
        this._timer = _.delay(next, this.slideInterval);
      }, this);

      this._timer = _.delay(next, startAfter || this.slideInterval);
    },

    // moveTo function
    moveTo: function(item) {
      item = $(item);

      var next = _.bind(function() {
        if (this._activeSlide) {
          _.delay(next, 100);
        } else {
          clearTimeout(this._timer);

          this._slide(item);
          this.start(this.slideDuration + this.slideInterval * 2);
        }
      }, this);

      next();
    },

    // slide function
    _slide: function(nextItem) {
      var that = this;

      this._activeSlide = true; // slide is active

      // get current item
      var visibleItem = $(this.items).filter(':visible');

      // get item following current item if not set
      if (nextItem === undefined) {
        nextItem = visibleItem.next();

        if (nextItem.length === 0) {
          nextItem = $(this.items).first();
        }
      // interupt slide if next item is already visible
      } else if (nextItem.is(':visible')) {
        this._activeSlide = false; // slide is no more active
        return;
      // else ensure next item is a jQuery collection
      } else {
        nextItem = $(nextItem);
      }

      // move next item at right of current item
      nextItem.css('left', this.width + 'px');

      // find index of balls for current & next item
      var visibleBallIndex = $(this.items).index(visibleItem);
      var nextBallIndex = $(this.items).index(nextItem);

      // animate balls
      _.each([$('#promotions .slider_balls .ball').slice(visibleBallIndex, visibleBallIndex + 1), $('#promotions .slider_balls .ball').slice(nextBallIndex, nextBallIndex + 1)], function(ball) {
        ball.toggleClass('active', this.slideDuration);
      }, this);

      // animate items
      _.each([visibleItem, nextItem], function(item) {
        item.show().animate({
          left:  '-=' + this.width + 'px'
        },
        this.slideDuration,
        function() {
          visibleItem.hide();         // ensure old current item is hidden
          that._activeSlide = false;  // slide is no more active
        });
      }, this);
    }
  });

  // Overlay
  var overlayToggle = window.overlayToggle = function(el, options) {
    options = _.defaults(options || {}, {
      loader: true
    });

    el = $(el);
    if (el.has('.overlay').length === 0) {
      el.css('position', 'relative');
      var overlay = $('<div class="overlay"><div class="background" /></div>');
      if (options.loader) {
        overlay.append('<div class="loader" />');
      }
      overlay.appendTo(el).fadeIn();
    } else {
      el.children('.overlay').fadeOut(function() {
        $(this).remove();
      });
    }
  }

  // Validation
  var initValidation = function() {
    $('#command form').h5Validate({
      submit: false, // performed by custom handler
      keyup: true
    });
  }

  // Wine detail
  var showWineDetail = function() {
    if ($(this).hasClass('item')) {
      var item_class = $(this).first().attr('class').match(/item_\d+/)[0];
    } else {
      var item_class = $(this).parents('article.item').first().attr('class').match(/item_\d+/)[0];
    }
    scrollPosition = $(window).scrollTop();

    $('#details article.' + item_class).show();
    $('section.main > *').wrapAll('<div />').parent()
    .css({
      position: 'fixed',
      top: '0',
      'margin-top': -scrollPosition + 'px',
      width: $('section.main').width()
    });
    $('section.main').css('padding-right', scrollbarWidth + 'px');

    $('body').css({
      height: Math.max($(window).outerHeight() - ($('#details').outerHeight(true) - $('#details').outerHeight()), $('#details').outerHeight()),
      'padding-bottom': $(window).outerHeight() <= $('#details').outerHeight() ? '50px' : '0px'
    });

    overlayToggle($('body'), { loader: false });
    $('body > .overlay').css({
      height: $('section.main > div').outerHeight(),
    });

    $('#details').fadeIn();

    var wine = _.find(wines, function(wine, key) { return wine.index === parseInt(item_class.match(/\d+/)[0]) });
    History.setLocation({wine: wine.key });
    _gaq.push(['_trackPageview', '/wines/' + wine.key]);
  }

  var hideWineDetail = function(){
    overlayToggle($('body'));

    $('#details').fadeOut(function() {
      $('section.main').css('padding-right', 0);
      $('header.main, section.content, footer.main').unwrap();
      $(window).scrollTop(scrollPosition);
      $('#details article.item').hide();
    });

    History.resetLocation();
    _gaq.push(['_trackPageview', '/']);
  }

  // init
  $(function() {
    // scrollbarWidth
    scrollbarWidth = (function() {
      var $inner = jQuery('<div style="width: 100%; height:200px;">test</div>'),
      $outer = jQuery('<div style="width:200px;height:150px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;"></div>').append($inner),
      inner = $inner[0],
      outer = $outer[0];

      jQuery('body').append(outer);
      var width1 = inner.offsetWidth;
      $outer.css('overflow', 'scroll');
      var width2 = outer.clientWidth;
      $outer.remove();

      return (width1 - width2);
    })();

    // slider
    var slider = window.slider = new Slider();
    slider.start();

    // show wine if requested
    if (History.has('wine') && wines[History.get('wine')]) {
      showWineDetail.apply($('article.item_' + wines[History.get('wine')].index));
    } else {
      _gaq.push(['_trackPageview']);
    }

    // validation
    $('#delivery_address').change(function() {
      $('#delivery_address_fields').fadeToggle("fast", "swing");
      $('#delivery_address_fields input').attr("required", function(index, attr) {
        return !attr;
      });
      initValidation();
    });
    initValidation();

    // send form
    $('#command form').on('submit', function(event) {
      event.preventDefault();

      // check validity
      var allValid = $(this).h5Validate('allValid', { revalidate: true });
      if(allValid !== true) {
        return;
      }

      // display overlay
      overlayToggle($('#command'));

      // send command
      $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        success: function(data, status, xhr) {
          $('#command form').fadeOut(function() {
            $('#command ').addClass('success');
            $('<p>Commande envoyée avec succès</p>').hide().appendTo($('#command')).fadeIn();
            overlayToggle($('#command'));
          });

          _gaq.push(['_trackPageview', '/command']);
        },
        error: function(xhr, status, error) {
          overlayToggle($('#command'));
        },
        dataType: 'text'
      });
    });

    // Lightbox wines initialization
    $('article.item > img, article.item > .info, article.item .price_container').on('click', showWineDetail);
    $('#details .close').on('click', hideWineDetail);

    // Placeholder plugin initialization
    $('input[placeholder]').placeholder();
  });
})(jQuery);
