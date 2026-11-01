"use strict";
// HaxBall's bundled client reads Modernizr in the page's main JS world.
// runtime.js is an isolated content script, so its globals are invisible there.
if (!window.Modernizr) {
  window.Modernizr = {
    canvas: true,
    datachannel: true,
    dataview: true,
    es6collections: true,
    peerconnection: true,
    promises: true,
    websockets: true
  };
}
