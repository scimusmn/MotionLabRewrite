'use strict';

obtain([], function () {
  if (!customElements.get('thumb-nail')) {

    class thumbnail extends HTMLElement {

      constructor() {
        super();
        var _this = this;

        _this.onSelect = () => {};

        //grabs the middle image from the set for the thumbnail image.
        _this.setImage = ()=> {
          _this.style.backgroundImage = `url('${_this.setName}/400.jpg?${Math.random()}')`;
        };

        //clears the class name, gets rid of 'active' class.
        _this.reset = () => {
          _this.className = '';
        };

        _this.refreshSet = function () {
          _this.setName = µ('|>setName', _this);
          _this.setImage();
        };
      }

      connectedCallback() {
        var _this = this;

        //these callbacks were used when the thumbgroup could scroll, not really used now.
        _this.onMouseStart = (which) => {};

        _this.onMouseFinish = () => {};

        _this.setName = µ('|>setName', _this);
        _this.start = { x: 0, y: 0 };
        _this.init = { x: 0, y: 0 };


        //when clicked, set the document mouseup to the thumbnail mouseup, do callbacks
        _this.onmousedown = (e) => {
          e.preventDefault();
          console.log('click down');
          _this.clicked = true;
          document.onmouseup = _this.onmouseup;
          _this.onMouseStart(_this);
        };

        //if we click up on the same thumb as we clicked down on,
        // set this thumbnail as selected, and do the select callback
        _this.onmouseup = function (e) {
          if (_this.clicked) {
            var rest = µ('thumb-nail');
            for (var i = 0; i < rest.length; i++) {
              rest[i].reset();
            }

            _this.className = 'active';
            _this.onSelect();
          }

          _this.onMouseFinish();

          _this.clicked = false;
          document.onmouseup = null;
          document.onmousemove = null;
        };

      };

      //if we see the 'setname' attribute for the set change, refresh the thumbnail
      // and store the new set name.
      attributeChangedCallback(attr, oldVal, newVal) {
        var _this = this;
        if (attr == 'setname') {
          _this.setName = newVal;
          _this.setImage();
        }
      };
    };

    customElements.define('thumb-nail', thumbnail);

    // custom element to hold all of the thumbnails
    class thumbGroup extends HTMLElement {
      constructor () {
        super();
        var _this = this;

        _this.player = µ('#' + µ('|>player', _this)); //grab the element used to play back videos.
        _this.max = parseInt(µ('|>max', _this));      //store the max number of sequences to display
        //check if the 'scrollable' flag is set
        _this.scrollable = (µ('|>scrollable', _this) == 'true');
        _this.activeThumb = null;       //var to store which thumb was clicked at mousedown
        _this.start = { x: 0, y: 0 };
        _this.init = { x: 0, y: 0 };

        _this.resetActive = ()=> {
          var actives = µ('.active', _this);
          if (actives.length) {
            for (var i = 0; i < actives.length; i++) {
              actives[i].className = '';
            }
          }
        };

        //this function handles new or changed sets, based on their directory name
        _this.handleSetChange = function (setName) {
          var set = null;

          // if this group has an element with the setname attribute matching 'setName'
          if (µ('[setName="' + setName + '"]') && µ('[setName="' + setName + '"]').length) {
            //tell the thumbnails to refresh the image, and pop the thumbnail element
            set = µ('[setName="' + setName + '"]')[0];
            set.setAttribute('setName', setName);
            set.refreshSet();
            _this.removeChild(set);
          } else {  //else, if there is not a set with that name
            //delete the oldest set if we have too many displayed
            if (_this.childNodes.length >= _this.max) _this.removeChild(_this.lastChild);

            // and create a new thumbnail with the appropriate set name.
            set = µ('+thumb-nail');
            set.setAttribute('setName', setName);

            set.refreshSet();

            //tell the thumbnail to load the set into the player when clicked,
            // and do the onChoose callback.
            set.onSelect = function () {
              _this.onChoose(set);
              _this.player.loadSet(set.setName + '/');
            };

            //tell the set to report back to the group when clicked
            set.onMouseStart = _this.logThumb;
            set.onMouseFinish = _this.onmouseup;
          }

          //insert the set to the beginning of the child elements of this
          if (_this.childNodes.length > 1) {
            _this.insertBefore(set, _this.firstChild);
          } else {
            _this.appendChild(set);
          }
        };
      }

      attachedCallback() {
        var _this = this;

        //not really used anymore, but if the group is scrollable, store the
        //initial mouse location, and set the clicked flag.
        _this.onmousedown =  (e) => {
          if (_this.scrollable) {
            _this.clicked = true;
            _this.start.y = e.clientY - extractNumber(_this.style.marginTop);
            _this.init.y = e.clientY;
          }
        };

        //moves the contents of this element, if scrollable. Not actively used, still enabled.
        _this.onmousemove = function (e) {
          if (_this.scrollable && _this.clicked && _this.scrollHeight > _this.parentNode.clientHeight) {
            if (Math.abs(e.clientY - _this.init.y) > 20 && _this.activeThumb)
              _this.activeThumb.clicked = false;
            var offset = e.clientY - _this.start.y;
            var max = _this.parentNode.clientHeight - _this.scrollHeight;
            if (offset > 0) offset = 0;
            else if (offset < max) offset = max;
            _this.style.marginTop = offset + 'px';

            _this.onMoved();
          }
        };

        _this.onmouseup = () => {
          _this.clicked = false;
        };
      }

      logThumb(aTh) {
        _this.activeThumb = aTh;
      };

      onMoved() {};

      onChoose (set) {};
    };

    customElements.define('thumb-group', thumbGroup);
  }

  exports.ThumbGroup = customElements.get('thumb-group');
  exports.Thumbnail = customElements.get('thumb-nail');

  provide(exports);
});
