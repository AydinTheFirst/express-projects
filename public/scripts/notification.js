alert("Notification Module has been loaded!");
window.addEventListener("load", () => {
  // Check
  if (!window.Notification) return alert("Not Supported!");

  Notification.requestPermission().then(sendNotification);
});

const sendNotification = (perm) => {
  var not = new Notification("TEST");
};
