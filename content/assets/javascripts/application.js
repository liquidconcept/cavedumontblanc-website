// =require jquery
// =require jquery-ui
// =require jquery.h5validate
// =require underscore

(function($, undefined) {

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
      $('#promotions .balls').on('click', function(event) {
        event.preventDefault();

        var index = Math.abs($(this).siblings().andSelf().index(this) - $(this).siblings().andSelf().length + 1);

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
      var visibleBallIndex = Math.abs($(this.items).index(visibleItem) - this.items.length + 1);
      var nextBallIndex = Math.abs($(this.items).index(nextItem) - this.items.length + 1);

      // animate balls
      _.each([$('#promotions .balls').slice(visibleBallIndex, visibleBallIndex + 1), $('#promotions .balls').slice(nextBallIndex, nextBallIndex + 1)], function(ball) {
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
  var overlayToggle = window.overlayToggle = function(el) {
    el = $(el);
    if (el.has('.overlay').length === 0) {
      el.css('position', 'relative');
      $('<div class="overlay"><div class="background" /><div class="loader" /></div>').appendTo(el).fadeIn();
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

  // init
  $(function() {
    // slider
    var slider = window.slider = new Slider();
    slider.start();

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
        },
        error: function(xhr, status, error) {
          overlayToggle($('#command'));
        },
        dataType: 'text'
      });
    });
  });
})(jQuery);
