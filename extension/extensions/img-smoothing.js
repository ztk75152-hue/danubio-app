(function() {
  "use strict";
  if (window.__DerviImgSmoothing) return;
  window.__DerviImgSmoothing = true;
  function isEnabled() {
    try {
      var po = JSON.parse(localStorage.getItem("hbx_perf_opts") || "{}");
      var v = po["tmisc-imgsmoothing"];
      return v === true || v === "true";
    } catch (e) {
      return false;
    }
  }
  var proto = window.CanvasRenderingContext2D && window.CanvasRenderingContext2D.prototype;
  if (!proto) return;
  var desc = Object.getOwnPropertyDescriptor(proto, "imageSmoothingEnabled");
  if (!desc || !desc.configurable) return;
  var nativeGet = desc.get;
  var nativeSet = desc.set;
  if (!nativeGet || !nativeSet) return;
  Object.defineProperty(proto, "imageSmoothingEnabled", {
    configurable: true,
    enumerable: desc.enumerable,
    get: function() {
      return nativeGet.call(this);
    },
    set: function(value) {
      if (isEnabled()) value = false;
      nativeSet.call(this, value);
    }
  });
  function applyToExistingCanvases() {
    if (!isEnabled()) return;
    var canvases = document.getElementsByTagName("canvas");
    for (var i = 0; i < canvases.length; i++) {
      var ctx = canvases[i].getContext && canvases[i].getContext("2d");
      if (ctx) ctx.imageSmoothingEnabled = false;
    }
  }
  window.addEventListener("storage", function(e) {
    if (e.key === "hbx_perf_opts") applyToExistingCanvases();
  });
  window.addEventListener("hbx:perfopts-changed", applyToExistingCanvases);
  applyToExistingCanvases();
})();