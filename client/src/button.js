'use strict';

obtain([], ()=> {
  if (!customElements.get('but-ton')) {
    class Button extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        var _this = this;

        var inactiveSrc = _this.src;
        var dot = _this.src.lastIndexOf('.');
        var activeSrc = _this.src.substring(0, dot) + '-active' + _this.src.substring(dot);

        _this.src = inactiveSrc;

        _this.onClick = () => {};

        _this.onmouseup = () => {
          if (_this.pressed) _this.onClick();
          _this.pressed = false;
          if (document.onmouseup == _this.onmouseup) document.onmouseup = null;
          _this.src = inactiveSrc;
        };

        _this.onmousedown = function (e) {
          e.preventDefault();
          _this.pressed = true;
          document.onmouseup = _this.onmouseup;
          _this.src = activeSrc;
        };
      };
    };

    customElements.define('but-ton', Button);
  }

  exports.Button = customElements.get('but-ton');

  provide(exports);
  //var ButtonTag = document.registerElement('but-ton', { prototype: buttonTag.prototype, extends: 'img' });
});
