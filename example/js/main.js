'use strict';

const autocomplete = new Otom();
autocomplete.init();

const autocomplete01 = new Otom(
  { container: '[data-otom-el=container01]' }
);
autocomplete01.init();

const autocomplete02 = new Otom(
  { container: '[data-otom-el=container02]' }
);
autocomplete02.init();