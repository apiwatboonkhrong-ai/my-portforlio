/* ========================================
   MOBILE MENU
======================================== */

const menuButton = document.getElementById("menuButton");
const navMenu = document.querySelector(".nav-menu");

if (menuButton && navMenu) {

    menuButton.addEventListener("click", function () {

        navMenu.classList.toggle("mobile-open");

    });

    document.querySelectorAll(".nav-menu a").forEach(function (link) {

        link.addEventListener("click", function () {

            navMenu.classList.remove("mobile-open");

        });

    });

}


/* ========================================
   CERTIFICATE FILTER
======================================== */

const filterButtons =
    document.querySelectorAll(".filter-button");

const certificateCards =
    document.querySelectorAll(".certificate-card");


filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const filter =
            button.getAttribute("data-filter");

        /* เปลี่ยนปุ่ม Active */

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });

        button.classList.add("active");


        /* แสดง / ซ่อนการ์ด */

        certificateCards.forEach(function (card) {

            const category =
                card.getAttribute("data-category");

            if (
                filter === "all" ||
                category === filter
            ) {

                card.style.display = "";

                requestAnimationFrame(function () {

                    card.style.opacity = "1";
                    card.style.transform =
                        "translateY(0)";

                });

            } else {

                card.style.opacity = "0";
                card.style.transform =
                    "translateY(10px)";

                setTimeout(function () {

                    card.style.display = "none";

                }, 250);

            }

        });

    });

});


/* ========================================
   CERTIFICATE MODAL
======================================== */

const modal =
    document.getElementById("certificateModal");

const modalClose =
    document.getElementById("modalClose");

const modalBackdrop =
    document.querySelector(".modal-backdrop");

const modalTitle =
    document.getElementById("modalTitle");

const modalDescription =
    document.getElementById("modalDescription");

const modalOrganization =
    document.getElementById("modalOrganization");

const modalDate =
    document.getElementById("modalDate");

const modalCategory =
    document.querySelector(".modal-category");


certificateCards.forEach(function (card) {

    card.addEventListener("click", function () {

        const title =
            card.querySelector("h3").textContent.trim();

        const description =
            card.querySelector("p").textContent.trim();

        const organization =
            card.querySelector(
                ".certificate-meta span:first-child"
            ).textContent.trim();

        const date =
            card.querySelector(
                ".certificate-meta span:last-child"
            ).textContent.trim();

        const category =
            card.querySelector(
                ".certificate-category"
            ).textContent.trim();


        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalOrganization.textContent = organization;
        modalDate.textContent = date;
        modalCategory.textContent = category;


        modal.classList.add("active");

        document.body.style.overflow = "hidden";

    });

});


/* CLOSE MODAL */

function closeCertificateModal() {

    modal.classList.remove("active");

    document.body.style.overflow = "";

}


modalClose.addEventListener(
    "click",
    closeCertificateModal
);

modalBackdrop.addEventListener(
    "click",
    closeCertificateModal
);


/* กด ESC เพื่อปิด */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("active")
        ) {

            closeCertificateModal();

        }

    }
);