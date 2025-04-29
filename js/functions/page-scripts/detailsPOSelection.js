import appendParameterToURL from "./../appendParameterToUrl.js";
import redirect from "./../redirect.js";
import apiCall from "./../apiCall.js";
import { search } from "../helperFunctions.js";

$(function () {
    const section = JSON.parse(localStorage.getItem('user'))['Section'];

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

    $(document).on("click", ".po-button", async function (e) {
        const poId = $(this).data("po-id");
    
        let details = await apiCall('/homs/API/uploading/getPODetails.php?section=' + section + '&po=' + poId, 'GET');
    
        if(details){
            $("#details-container").removeClass("d-none");
            $("#details-container").addClass("d-flex");
        }

        $("#po_number span").text(details.data.prd_order_no);
        $("#material span").text(details.data.material);
        $("#description span").text(details.data.description);

        const modal = bootstrap.Modal.getInstance(document.getElementById('poModal'));
        if (modal) modal.hide();


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

        
        const wc = new URLSearchParams(window.location.search).get('wc');

        let data = await apiCall('/homs/API/uploading/getPOList.php?section=' + section + '& wc=' + wc, 'GET');
        let response = await apiCall('/homs/helpers/componentAPI/poButtons.php', 'POST', { data: data.data });

        container.innerHTML = response.html;
    }


});
