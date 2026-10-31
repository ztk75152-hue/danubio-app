(function() {
  if (!Injector.isGameFrame()) return;
  function clickLeaveButton(node) {
    const leaveBtn = node.querySelector('[data-hook="leave"]');
    if (leaveBtn) leaveBtn.click();
  }
  Injector.onView("leave-room-view", function(node) {
    clickLeaveButton(node);
  });
})();