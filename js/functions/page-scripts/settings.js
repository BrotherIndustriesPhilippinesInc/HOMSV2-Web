import dataTablesInitialization from './../dataTablesInitialization.js';
import apiCall from './../apiCall.js';
import { receiveFromWebView, sendToWebView } from '../WebViewInteraction.js';
import { resetFields, validateFields, formatTimeOnlyToPostgres } from '../helperFunctions.js';

$(async function () {
    /* INITIALIZATION */
    const section = JSON.parse(localStorage.getItem('user'))['Section'];
    const userId = JSON.parse(localStorage.getItem('user'))["EmpNo"];
    const work_center = localStorage.getItem('wc');
    const user = JSON.parse(localStorage.getItem("user"));

    let globalSettings;
    await getGlobalSettings();
    
    

    /* EVENTS */
    $(".form-check-input").on("change", function () {
        /* BUILD DATA OF SECTIONS IF ENABLED OR NOT */
        const sections = {
            "Ink Head": $("#inkHeadID").is(":checked"),
            "Toner": $("#tonerID").is(":checked"),
            "PCBA": $("#pcbaID").is(":checked"),
            "Printer 1": $("#printer1ID").is(":checked"),
            "Printer 2": $("#printer2ID").is(":checked"),
            "P-Touch": $("#pTouchID").is(":checked"),
            "Ink Cartridge": $("#inkCartridgeID").is(":checked"),
            "Tape Cassette": $("#tapeCassetteID").is(":checked")
        };
        /* UPDATE HOURLY UPDATES */
        updateHourlyUpdates(sections);


    });


    /* FUNCTIONS */
    async function getGlobalSettings() {
        const result = await apiCall('/homs/api/admin/getGlobalSettings.php', 'GET');
        if (result['status'] === 'error') {
            alert(result['message']);
            return;
        }

        globalSettings = result;
        /* console.log(globalSettings.data[0].settings); */

        assignHourlyUpdates(globalSettings.data[0].settings.hourlyUpdates.sections);
    }

    function assignHourlyUpdates(sections){
        sections["Ink Head"]? $("#inkHeadID").prop("checked", true) : $("#inkHeadID").prop("checked", false);
        sections["Toner"]? $("#tonerID").prop("checked", true) : $("#tonerID").prop("checked", false);
        sections["PCBA"]? $("#pcbaID").prop("checked", true) : $("#pcbaID").prop("checked", false);
        sections["Printer 1"]? $("#printer1ID").prop("checked", true) : $("#printer1ID").prop("checked", false);
        sections["Printer 2"]? $("#printer2ID").prop("checked", true) : $("#printer2ID").prop("checked", false);
        sections["P-Touch"]? $("#pTouchID").prop("checked", true) : $("#pTouchID").prop("checked", false);
        sections["Ink Cartridge"]? $("#inkCartridgeID").prop("checked", true) : $("#inkCartridgeID").prop("checked", false);
        sections["Tape Cassette"]? $("#tapeCassetteID").prop("checked", true) : $("#tapeCassetteID").prop("checked", false);
    }

    function updateHourlyUpdates(sections){
        const data = {
            "sections": sections,
            "creator": userId
        };

        apiCall('/homs/api/admin/updateHourlyUpdates.php', 'POST', data)
            .then(result => {
                if (result['status'] === 'error') {
                    alert(result['message']);
                } else {
                    alert("Hourly updates settings updated successfully.");
                }
            })
            .catch(error => {
                console.error("Error updating hourly updates:", error);
            });
    }
    
});