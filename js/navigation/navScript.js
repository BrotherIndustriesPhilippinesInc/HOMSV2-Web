export function navigation() {
    expand();
    linkHover();
    removeBackdrop();
    navRestrictions();
}

function expand(){

    $(".nav-link").on("click", function (e) {
        let submenu = $(this).find(".nav-submenu");

        if (submenu.hasClass("open")) {
            submenu.removeClass("open").stop().animate({ maxHeight: "0px" }, 300);
        } else {
            submenu.addClass("open").stop().animate({ maxHeight: submenu.prop("scrollHeight") + "px" }, 300);
        }

        // Toggle arrow icons
        $(this).find(".arrow").toggleClass("d-none");
    });
}

function linkHover(){
    $(".nav-button").on("mouseenter", function () {
        $(this).removeClass("text-decoration-none").addClass("text-decoration-underline");
    });

    $(".nav-button").on("mouseleave", function () {
        $(this).removeClass("text-decoration-underline").addClass("text-decoration-none");
    });
}

function removeBackdrop(){
    document.addEventListener('show.bs.offcanvas', function () {
        document.querySelectorAll('.offcanvas-backdrop').forEach(backdrop => backdrop.remove());
    });
}

function navRestrictions() {
    const section = JSON.parse(localStorage.getItem('user'))['Section'];
    if(section !== "Printer 1"){
        $(".pr1-nav").addClass("d-none");
    }else{
        //$(".wc-selection-nav").addClass("d-none");
    }
    
}