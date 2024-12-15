let popupWindowId = null; // This variable will store the window ID of the popup

browser.browserAction.onClicked.addListener(function() {
    // Check if a popup window already exists
    if (popupWindowId !== null) {
        browser.windows.get(popupWindowId, {populate: true}).then((window) => {
            if (window) {
                // If the window exists, focus on it
                browser.windows.update(popupWindowId, {focused: true});
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
    browser.windows.create({
        url: browser.runtime.getURL("popup.html"),
        type: "normal",  // Use 'normal' window type to create a separate window
        width: 400,
        height: 300,
        focused: true
    }).then((window) => {
        // Store the window ID for future reference
        popupWindowId = window.id;
    });
}
