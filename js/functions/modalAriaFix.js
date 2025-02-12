export default function modalAriaFix(){
    document.addEventListener("DOMContentLoaded", function () {
        let modal = document.getElementById("poModal");
    
        modal.addEventListener("show.bs.modal", function () {
            this.removeAttribute("inert"); // Enable interaction when modal is opening
        });
    
        modal.addEventListener("hidden.bs.modal", function () {
            this.setAttribute("inert", ""); // Disable interaction when modal is closed
        });
    });
    
}

/* NOT WORKING */