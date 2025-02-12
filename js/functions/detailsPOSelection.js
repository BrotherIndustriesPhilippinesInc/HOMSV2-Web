import appendParameterToURL from "./appendParameterToUrl.js";

$(function () {
    $(".po-button").on("click", function (e) {
        appendParameterToURL('po', $(this).data("po-id"));
    });

    popoverInitialize();
});
function popoverInitialize() {
    const popoverTrigger = document.querySelector(".popover-trigger");
    const content = document.querySelector("#popover-stops").innerHTML;

    new bootstrap.Popover(popoverTrigger, {
        html: true,
        sanitize: false,
        content: function () {
            return content;
        }
    });
}


