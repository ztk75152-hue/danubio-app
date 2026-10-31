(function() {
  if (window.__DANUBIO_FPS_LIMITER__) return;
  window.__DANUBIO_FPS_LIMITER__ = true;

  var storageKey = "danubio.fpsLimit";
  var supportedLimits = [ 0, 30, 60, 75, 120, 144, 165, 240, 300 ];
  var limit = 0;
  try {
    var saved = Number(localStorage.getItem(storageKey));
    if (supportedLimits.indexOf(saved) !== -1) limit = saved;
  } catch (e) {}

  var nativeRequest = window.requestAnimationFrame.bind(window);
  var nativeCancel = window.cancelAnimationFrame.bind(window);
  var nextId = 1073741824;
  var pending = Object.create(null);
  var lastFrameTime = 0;
  var lastAllowedTimestamp = -1;

  function request(callback) {
    var id = nextId++;
    if (nextId > 2147483646) nextId = 1073741824;
    var task = { nativeId: 0, canceled: false };
    pending[id] = task;

    function schedule() {
      task.nativeId = nativeRequest(function(timestamp) {
        if (task.canceled) return;
        var interval = limit > 0 ? 1000 / limit : 0;
        var samePaint = timestamp === lastAllowedTimestamp;
        if (!interval || samePaint || !lastFrameTime || timestamp - lastFrameTime >= interval - 0.25) {
          delete pending[id];
          lastFrameTime = timestamp;
          lastAllowedTimestamp = timestamp;
          callback.call(window, timestamp);
          return;
        }
        schedule();
      });
    }

    schedule();
    return id;
  }

  function cancel(id) {
    var task = pending[id];
    if (!task) {
      nativeCancel(id);
      return;
    }
    task.canceled = true;
    nativeCancel(task.nativeId);
    delete pending[id];
  }

  window.requestAnimationFrame = request;
  window.cancelAnimationFrame = cancel;
  window.addEventListener("danubio:fps-limit-change", function(event) {
    var next = Number(event.detail);
    limit = supportedLimits.indexOf(next) !== -1 ? next : 0;
    lastFrameTime = 0;
    lastAllowedTimestamp = -1;
  });
})();