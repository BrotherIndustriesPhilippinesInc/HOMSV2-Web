$(function () {
    $(".wc-button").on("click", function (e) {
        window.location.href = "/production/details?wc=" + $(this).data("wc-id");
    });
});