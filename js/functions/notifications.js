import apiCall from "./apiCall.js";

import { popoverInitialize } from "/homs/js/functions/helperFunctions.js";
import { renderNotifications } from "/homs/js/functions/page-scripts/linestops.js";
import { receiveFromWebView, sendToWebView } from "/homs/js/functions/WebViewInteraction.js";

/* initialize listener */
$(function () {
    const notificationAlert = new bootstrap.Modal($("#linestop_alert")[0]);
    initializeHeader();
    listenForNotificationUpdates();

    /* SET TIMER */
    setInterval(() => {
        initializeHeader();
    }, 1000);


    // Initialize popover after notifications are loaded (first time only)
    if (!bootstrap.Popover.getInstance(document.querySelector(".notification-popover-trigger"))) {
        popoverInitialize(".notification-popover-trigger", "#notification-popover", "bottom", "notification-popover-class");
    }

    /* EVENTS */
    $(document).on("click", "#btn_dismiss", function () {
        dismissNotification();
    });

    async function initializeHeader() {
        await renderNotifications(".notification-popover-class .popover-body", "#notification-badge");
        // Initialize popover after notifications are loaded (first time only)
    }

    // Listen for updates from the WebView.
    function listenForNotificationUpdates() {
        receiveFromWebView("linestop_details", async (data) => {

            /* LOAD LINESTOP DETAILS */
            let result = await apiCall("/homs/api/production/getProductionDetailsViaID.php?id=" + data.production_id, "GET");
            
            let linestop = result.data;

            /* UPDATE DATA */
            $("#linestop_workcenter").text(linestop.work_center);
            $("#linestop_po").text(linestop.po);
            $("#linestop_area").text(linestop.area);
            $("#linestop_line").text(linestop.line_name);

            notificationAlert.show();
        });
    }

    function  dismissNotification() {
        sendToWebView("dismissNotification");
    }

});