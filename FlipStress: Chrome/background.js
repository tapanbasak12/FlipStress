let popupWindowId = null; // This variable will store the window ID of the popup

chrome.action.onClicked.addListener(function() {
    // Check if a popup window already exists
    if (popupWindowId !== null) {
        chrome.windows.get(popupWindowId, {populate: true}, (window) => {
            if (window) {
                // If the window exists, focus on it
                chrome.windows.update(popupWindowId, {focused: true});
            } else {
                // If the window does not exist (it was closed), create a new one
                createPopupWindow();
            }
        });
    } else {
        // If no window ID is stored, create a new popup window
        createPopupWindow();
    }
});

function createPopupWindow() {
    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 400,
        height: 300
    }, function(window) {
        // Store the window ID for future reference
        popupWindowId = window.id;
    });
}

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
      if (request.action === 'activateExtension') {
        // Perform the activation logic
        sendResponse({status: 'Extension activated'});
      }
    }
  );
