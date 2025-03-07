import appendParameterToURL from "./../appendParameterToUrl.js";
import redirect from "./../redirect.js";

$(function () {
    $(".po-button").on("click", function (e) {
        appendParameterToURL('po', $(this).data("po-id"));
    });

    popoverInitialize();

    $(".homsView").on("click", function (e) {
        redirect("/homs/production/output");
    });
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


