const accessibleSliderBinding = new Shiny.InputBinding();


// An input binding must implement these methods
$.extend(accessibleSliderBinding, {

  // This returns a jQuery object with the DOM element
  find: function(scope) {
    const el = $(scope).find('input[type="range"]');
    this.updateOutput(el[0]);
    return el;
  },

  // return the ID of the DOM element
  getId: function(el) {
    return el.id;
  },

  // Given the DOM element for the input, return the value
  getValue: function(el) {
    return parseFloat(el.value);
  },

  // Given the DOM element for the input, set the value
  setValue: function(el, value) {
    el.value = value;
  },

  // Set up the event listeners so that interactions with the
  // input will result in data being sent to server.
  // callback is a function that queues data to be sent to
  // the server.
  subscribe: function(el, callback) {

    $(el).on('input', () => {
      this.updateOutput(el);
      callback(true);
    });
  },

  // Remove the event listeners
  unsubscribe: function(el) {
    $(el).off();
  },

  // Receive messages from the server.
  // Messages sent by updateUrlInput() are received by this function.
  receiveMessage: function(el, data) {
    if (data.hasOwnProperty('value')) {
      this.setValue(el, data.value);
    }
    $(el).trigger('input');
  },


  getState: function(el) {
    return {
      label: $(el).parent().find('label[for="' + $escape(el.id) + '"]').text(),
      value: el.value
    };
  },

  // The input rate limiting policy
  getRatePolicy: function() {
    return {
      // Can be 'debounce' or 'throttle'
      policy: 'debounce',
      delay: 500
    };
  },

  updateOutput: function(el) {
    const min = parseFloat(el.getAttribute('min'));
    const max = parseFloat(el.getAttribute('max'));
    const value = parseFloat(el.value);

    const leftSide = function(prop) {
      const left = prop  * 100; 
      return {
        left: `${left}%`,
        right: "unset",
        transform: `translate(${-left}%)`,
        tl: `${left / 2}%`,
        tr: "25%"
      }
    }

    const rightSide = function(prop) {
      const right = (1 - prop) * 100;
      return {
        left: 'unset',
        right: `${right}%`,
        transform: `translate(${right}%)`,
        tl: "25%",
        tr: `${right / 2}%`
      }
    }

    const prop = (value - min) / (max - min);
    const func = prop <= 0.5 ? leftSide: rightSide;
    const {left, right, transform, tl, tr} = func(prop);

    $(`#output-${el.id}`)
      .css('left', left)
      .css('right', right)
      .css('transform', transform)
      .css('border-top-left-radius', tl)
      .css('border-top-right-radius', tr)

      .text(value);
  }
});


Shiny.inputBindings.register(accessibleSliderBinding, 'example.nativeInput');