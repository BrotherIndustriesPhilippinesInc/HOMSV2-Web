import appendParameterToURL from "./../appendParameterToUrl.js";
import redirect from "./../redirect.js";
import apiCall from "./../apiCall.js";
import { search } from "../helperFunctions.js";

$(function () {
    getPOList();

    $(".po-button").on("click", function (e) {
        appendParameterToURL('po', $(this).data("po-id"));
    });

    $("#searchPO").on("input", function (e) {
        search($("#po_list")[0], this, "po-button");
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

async function getPOList() {
    const container = document.getElementById('po_list');

    const section = JSON.parse(localStorage.getItem('user'))['Section'];
    const wc = new URLSearchParams(window.location.search).get('wc');

    let data = await apiCall('/homs/API/uploading/getPOList.php?section=' + section + '& wc=' + wc, 'GET');
    let response = await apiCall('/homs/helpers/componentAPI/poButtons.php', 'POST', { data: data.data });

    container.innerHTML = response.html;
}