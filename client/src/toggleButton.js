'use strict';

obtain([], function () {
  if (!customElements.get('tog-gle')) {
    class Toggle extends HTMLImageElement {
      constructor() {
        super();
      };

      connectedCallback() {
        var _this = this;
        _this.active = false;
        var activeSrc = µ('|>active', _this);
        var inactiveSrc = µ('|>inactive', _this);

        _this.src = inactiveSrc;

        _this.onSet = () => {};

        _this.onReset = () => {};

        _this.set = function () {
          _this.active = true;
          _this.src = activeSrc;
        };

        _this.reset = function () {
          _this.active = false;
          _this.src = inactiveSrc;
        };

        _this.toggle = () => {
          if (_this.active) {
            console.log('reset');
            _this.reset();
            _this.onReset();
          } else {
            console.log('set');
            _this.set();
            _this.onSet();
          }
        };

        _this.onmousedown = (e)=> {
          e.preventDefault();
        };

        _this.onclick = function (e) {
          e.preventDefault();
          _this.toggle();
        };
      };
    };

    customElements.define('tog-gle', Toggle, { extends: 'img' });
  }

  exports.Toggle = customElements.get('tog-gle');

  provide(exports);
});
