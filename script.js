// =====================================================
// ชมรมเณรไผ่สตูดิโอ
// ระบบจัดการงานชมรม
// =====================================================


// =====================================================
// MEMBERS
// =====================================================

let members = JSON.parse(
    localStorage.getItem("phaiStudioMembers")
) || [
    "เณรเอ",
    "เณรบี",
    "เณรซี",
    "เณรดี",
    "เณรอี",
    "เณรเอฟ"
];


// =====================================================
// JOB DATA
// =====================================================

let jobs = JSON.parse(
    localStorage.getItem("phaiStudioJobs")
) || [

    {
        id: 1,
        title: "งานวันภาษาไทย",
        date: "2026-09-05",
        time: "08:00",
        place: "โรงเรียนวัดไผ่ดำ",

        types: [
            "ถ่ายภาพ",
            "ถ่ายวิดีโอ"
        ],

        photos: [
            "เณรเอ",
            "เณรบี"
        ],

        videos: [
            "เณรซี"
        ],

        editors: [
            "เณรดี"
        ],

        status: "กำลังจะถึง",

        detail: "เก็บภาพกิจกรรมช่วงเช้า"
    },


    {
        id: 2,
        title: "ตามติดชีวิตเณรไผ่ EP.12",
        date: "2026-09-08",
        time: "09:00",
        place: "อาคารเรียน",

        types: [
            "ถ่ายวิดีโอ",
            "ตัดต่อวิดีโอ"
        ],

        photos: [],

        videos: [
            "เณรซี",
            "เณรดี"
        ],

        editors: [
            "เณรอี"
        ],

        status: "กำลังจะถึง",

        detail: "ถ่ายทำรายการ"
    },


    {
        id: 3,
        title: "กิจกรรมวันวิทยาศาสตร์",
        date: "2026-08-28",
        time: "08:30",
        place: "หอประชุม",

        types: [
            "ถ่ายภาพ"
        ],

        photos: [
            "เณรเอ",
            "เณรซี"
        ],

        videos: [],

        editors: [],

        status: "เสร็จแล้ว",

        detail: "งานประชาสัมพันธ์"
    }

];


let editingJobId = null;


// =====================================================
// SAVE
// =====================================================

function saveData() {

    localStorage.setItem(
        "phaiStudioJobs",
        JSON.stringify(jobs)
    );

}


function saveMembers() {

    localStorage.setItem(
        "phaiStudioMembers",
        JSON.stringify(members)
    );

}


// =====================================================
// PAGE
// =====================================================

function showPage(page, button) {

    document
        .querySelectorAll(".page")
        .forEach(p => {
            p.classList.remove("active");
        });


    const target =
        document.getElementById(page);

    if (target) {
        target.classList.add("active");
    }


    document
        .querySelectorAll(".menu-item")
        .forEach(b => {
            b.classList.remove("active");
        });


    if (button) {
        button.classList.add("active");
    }


    const titles = {

        home: [
            "หน้าหลัก",
            "ศูนย์รวมงานของชมรมเณรไผ่สตูดิโอ"
        ],

        jobs: [
            "งานทั้งหมด",
            "ดูและจัดการงานทั้งหมดของชมรม"
        ],

        mine: [
            "งานของฉัน",
            "ค้นหางานจากชื่อสมาชิก"
        ],

        calendar: [
            "ปฏิทินงาน",
            "ดูตารางงานตามวัน"
        ],

        archive: [
            "คลังผลงาน",
            "งานที่ดำเนินการเสร็จแล้ว"
        ],

        stats: [
            "สถิติ",
            "ภาพรวมการทำงานของชมรมเณรไผ่สตูดิโอ"
        ],

        members: [
            "สมาชิกชมรม",
            "จัดการรายชื่อสมาชิก"
        ]

    };


    if (titles[page]) {

        document.getElementById(
            "pageTitle"
        ).innerText = titles[page][0];


        document.getElementById(
            "pageSubtitle"
        ).innerText = titles[page][1];

    }


    if (page === "home")
        renderDashboard();

    if (page === "jobs")
        renderJobs();

    if (page === "mine")
        renderMine();

    if (page === "calendar")
        renderCalendar();

    if (page === "archive")
        renderArchive();

    if (page === "stats")
        renderStats();

    if (page === "members")
        renderMembers();

}


// =====================================================
// HELPERS
// =====================================================

function formatDate(date) {

    if (!date)
        return "-";


    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString(
        "th-TH",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


function getPeople(job) {

    return [
        ...(job.photos || []),
        ...(job.videos || []),
        ...(job.editors || [])
    ].filter(
        (value, index, array) =>
            array.indexOf(value) === index
    );

}


function getStatusClass(status) {

    if (status === "เสร็จแล้ว")
        return "done";

    if (status === "กำลังดำเนินการ")
        return "doing";

    return "soon";

}


function getTypeIcon(type) {

    if (type === "ถ่ายภาพ")
        return "📷";

    if (type === "ถ่ายวิดีโอ")
        return "🎥";

    if (type === "ตัดต่อวิดีโอ")
        return "✂️";

    return "📁";

}


// =====================================================
// JOB CARD
// =====================================================

function jobHTML(job) {

    const people =
        getPeople(job);


    return `

        <div
            class="job-item"
            onclick="openDetail(${job.id})"
        >

            <div>

                <div class="job-title">
                    ${escapeHTML(job.title)}
                </div>


                <div class="job-types">

                    ${job.types
                        .map(type =>
                            `${getTypeIcon(type)} ${type}`
                        )
                        .join(" · ")}

                </div>


                <div class="job-meta">

                    📅 ${formatDate(job.date)}

                    &nbsp; · &nbsp;

                    🕐 ${job.time || "--"} น.

                    <br>

                    📍 ${escapeHTML(job.place || "-")}

                    <br>

                    👥 ${
                        people.length
                            ? people.join(", ")
                            : "ยังไม่ได้มอบหมาย"
                    }

                </div>

            </div>


            <div class="job-card-right">

                <span class="badge ${getStatusClass(job.status)}">
                    ${job.status}
                </span>


                <div class="job-actions">

                    <button
                        onclick="event.stopPropagation(); editJob(${job.id})"
                    >
                        ✏️
                    </button>

                    <button
                        onclick="event.stopPropagation(); deleteJob(${job.id})"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        </div>

    `;

}


// =====================================================
// DASHBOARD
// =====================================================

function renderDashboard() {

    const total =
        document.getElementById("totalJobs");

    const upcoming =
        document.getElementById("upcomingJobs");

    const doing =
        document.getElementById("doingJobs");

    const done =
        document.getElementById("doneJobs");


    if (total)
        total.innerText = jobs.length;


    if (upcoming)
        upcoming.innerText =
            jobs.filter(
                job => job.status === "กำลังจะถึง"
            ).length;


    if (doing)
        doing.innerText =
            jobs.filter(
                job => job.status === "กำลังดำเนินการ"
            ).length;


    if (done)
        done.innerText =
            jobs.filter(
                job => job.status === "เสร็จแล้ว"
            ).length;


    const upcomingJobs =
        jobs
            .filter(
                job => job.status !== "เสร็จแล้ว"
            )
            .sort(
                (a, b) =>
                    a.date.localeCompare(b.date)
            );


    const upcomingBox =
        document.getElementById(
            "upcomingList"
        );


    if (upcomingBox) {

        upcomingBox.innerHTML =
            upcomingJobs.length

                ? upcomingJobs
                    .slice(0, 5)
                    .map(jobHTML)
                    .join("")

                : `
                    <div class="empty">
                        ไม่มีงานที่กำลังจะมาถึง
                    </div>
                `;

    }


    const recent =
        jobs
            .slice()
            .sort(
                (a, b) =>
                    b.id - a.id
            )
            .slice(0, 5);


    const recentBox =
        document.getElementById(
            "recentList"
        );


    if (recentBox) {

        recentBox.innerHTML =
            recent.length

                ? recent.map(jobHTML).join("")

                : `
                    <div class="empty">
                        ยังไม่มีงาน
                    </div>
                `;

    }

}


// =====================================================
// ALL JOBS
// =====================================================

function renderJobs() {

    const search =
        document.getElementById(
            "jobSearch"
        )?.value
        .trim()
        .toLowerCase() || "";


    const type =
        document.getElementById(
            "typeFilter"
        )?.value || "";


    const status =
        document.getElementById(
            "statusFilter"
        )?.value || "";


    const result =
        jobs.filter(job => {

            const text = (

                job.title +
                " " +
                job.place +
                " " +
                getPeople(job).join(" ")

            ).toLowerCase();


            return (

                text.includes(search)

                &&

                (
                    !type ||
                    job.types.includes(type)
                )

                &&

                (
                    !status ||
                    job.status === status
                )

            );

        });


    const container =
        document.getElementById(
            "allJobs"
        );


    if (!container)
        return;


    container.innerHTML =

        result.length

            ? result
                .sort(
                    (a,b) =>
                        a.date.localeCompare(b.date)
                )
                .map(jobHTML)
                .join("")

            : `
                <div class="empty">
                    ไม่พบงานที่ค้นหา
                </div>
            `;

}


// =====================================================
// MY JOBS
// =====================================================

function renderMine() {

    const search =
        document.getElementById(
            "mineSearch"
        )?.value
        .trim()
        .toLowerCase() || "";


    const container =
        document.getElementById(
            "mineJobs"
        );


    if (!container)
        return;


    if (!search) {

        container.innerHTML = `
            <div class="empty">
                พิมพ์ชื่อสมาชิกเพื่อค้นหางาน
            </div>
        `;

        return;

    }


    const result =
        jobs.filter(job =>
            getPeople(job)
                .join(" ")
                .toLowerCase()
                .includes(search)
        );


    container.innerHTML =

        result.length

            ? result.map(jobHTML).join("")

            : `
                <div class="empty">
                    ไม่พบงานของสมาชิกคนนี้
                </div>
            `;

}


// =====================================================
// ARCHIVE
// =====================================================

function renderArchive() {

    const container =
        document.getElementById(
            "archiveJobs"
        );


    if (!container)
        return;


    const result =
        jobs.filter(
            job =>
                job.status === "เสร็จแล้ว"
        );


    container.innerHTML =

        result.length

            ? result.map(jobHTML).join("")

            : `
                <div class="empty">
                    ยังไม่มีงานที่เสร็จแล้ว
                </div>
            `;

}


// =====================================================
// STATISTICS
// =====================================================

function renderStats() {

    const photo =
        document.getElementById(
            "photoCount"
        );

    const video =
        document.getElementById(
            "videoCount"
        );

    const edit =
        document.getElementById(
            "editCount"
        );

    const complete =
        document.getElementById(
            "completeCount"
        );


    if (photo)
        photo.innerText =
            jobs.filter(
                job =>
                    job.types.includes("ถ่ายภาพ")
            ).length;


    if (video)
        video.innerText =
            jobs.filter(
                job =>
                    job.types.includes("ถ่ายวิดีโอ")
            ).length;


    if (edit)
        edit.innerText =
            jobs.filter(
                job =>
                    job.types.includes("ตัดต่อวิดีโอ")
            ).length;


    if (complete)
        complete.innerText =
            jobs.filter(
                job =>
                    job.status === "เสร็จแล้ว"
            ).length;


    const count = {};


    members.forEach(member => {
        count[member] = 0;
    });


    jobs.forEach(job => {

        getPeople(job).forEach(person => {

            count[person] =
                (count[person] || 0) + 1;

        });

    });


    const stats =
        document.getElementById(
            "memberStats"
        );


    if (!stats)
        return;


    stats.innerHTML =

        Object.entries(count)
            .sort(
                (a,b) =>
                    b[1] - a[1]
            )
            .map(
                ([name,total]) => `

                    <div class="member-stat-row">

                        <strong>
                            👤 ${escapeHTML(name)}
                        </strong>

                        <span>
                            ${total} งาน
                        </span>

                    </div>

                `
            )
            .join("");

}


// =====================================================
// CALENDAR
// =====================================================

function renderCalendar() {

    const container =
        document.getElementById(
            "calendarBox"
        );


    if (!container)
        return;


    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        now.getMonth();


    const first =
        new Date(
            year,
            month,
            1
        ).getDay();


    const totalDays =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const monthName =
        now.toLocaleDateString(
            "th-TH",
            {
                month: "long",
                year: "numeric"
            }
        );


    const days = [
        "อา",
        "จ",
        "อ",
        "พ",
        "พฤ",
        "ศ",
        "ส"
    ];


    let html = `

        <h3 class="calendar-title">
            ${monthName}
        </h3>

        <div class="calendar">

    `;


    days.forEach(day => {

        html += `
            <div class="calendar-head">
                ${day}
            </div>
        `;

    });


    for (
        let i = 0;
        i < first;
        i++
    ) {

        html += `
            <div class="calendar-empty"></div>
        `;

    }


    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const date =
            `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;


        const dayJobs =
            jobs.filter(
                job =>
                    job.date === date
            );


        const isToday =
            day === now.getDate();


        html += `

            <div
                class="calendar-day ${
                    isToday ? "today" : ""
                }"
            >

                <strong>
                    ${day}
                </strong>


                ${dayJobs
                    .map(
                        job => `

                            <div
                                class="calendar-event"
                                onclick="openDetail(${job.id})"
                            >

                                ${getTypeIcon(job.types[0])}

                                ${escapeHTML(job.title)}

                            </div>

                        `
                    )
                    .join("")}

            </div>

        `;

    }


    html += "</div>";


    container.innerHTML = html;

}


// =====================================================
// JOB MODAL
// =====================================================

function openModal(job = null) {

    editingJobId =
        job ? job.id : null;


    document.getElementById(
        "modalTitle"
    ).innerText =
        job
            ? "แก้ไขงาน"
            : "เพิ่มงานใหม่";


    document.getElementById(
        "jobTitle"
    ).value =
        job?.title || "";


    document.getElementById(
        "jobDate"
    ).value =
        job?.date || "";


    document.getElementById(
        "jobTime"
    ).value =
        job?.time || "";


    document.getElementById(
        "jobPlace"
    ).value =
        job?.place || "";


    document.getElementById(
        "jobStatus"
    ).value =
        job?.status ||
        "กำลังจะถึง";


    document.getElementById(
        "jobDetail"
    ).value =
        job?.detail || "";


    document
        .querySelectorAll(
            "#jobTypes .choice"
        )
        .forEach(choice => {

            choice.classList.toggle(
                "selected",
                job?.types?.includes(
                    choice.dataset.value
                ) || false
            );

        });


    createMemberChoices(
        "photoMembers",
        job?.photos || []
    );


    createMemberChoices(
        "videoMembers",
        job?.videos || []
    );


    createMemberChoices(
        "editorMembers",
        job?.editors || []
    );


    document
        .getElementById(
            "jobModal"
        )
        .classList.add("show");

}


function closeModal() {

    document
        .getElementById(
            "jobModal"
        )
        .classList.remove("show");

}


// =====================================================
// MEMBER CHOICES
// =====================================================

function createMemberChoices(
    containerId,
    selected = []
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container)
        return;


    container.innerHTML =


        members.length

            ? members
                .map(
                    member => `

                        <button
                            type="button"
                            class="member ${
                                selected.includes(member)
                                    ? "selected"
                                    : ""
                            }"
                            data-value="${escapeHTML(member)}"
                            onclick="this.classList.toggle('selected')"
                        >
                            ${escapeHTML(member)}
                        </button>

                    `
                )
                .join("")

            : `
                <div class="empty">
                    ยังไม่มีสมาชิก
                </div>
            `;

}


function getSelectedMembers(
    containerId
) {

    return [
        ...document.querySelectorAll(
            `#${containerId} .member.selected`
        )
    ].map(
        button =>
            button.dataset.value
    );

}


function toggleChoice(button) {

    button.classList.toggle(
        "selected"
    );

}


// =====================================================
// SAVE JOB
// =====================================================

function saveJob() {

    const title =
        document.getElementById(
            "jobTitle"
        ).value.trim();


    const date =
        document.getElementById(
            "jobDate"
        ).value;


    const time =
        document.getElementById(
            "jobTime"
        ).value;


    const place =
        document.getElementById(
            "jobPlace"
        ).value.trim();


    const status =
        document.getElementById(
            "jobStatus"
        ).value;


    const detail =
        document.getElementById(
            "jobDetail"
        ).value.trim();


    const types =
        [
            ...document.querySelectorAll(
                "#jobTypes .choice.selected"
            )
        ].map(
            button =>
                button.dataset.value
        );


    const photos =
        getSelectedMembers(
            "photoMembers"
        );


    const videos =
        getSelectedMembers(
            "videoMembers"
        );


    const editors =
        getSelectedMembers(
            "editorMembers"
        );


    if (!title) {

        alert(
            "กรุณาใส่ชื่องาน"
        );

        return;

    }


    if (!date) {

        alert(
            "กรุณาเลือกวันที่"
        );

        return;

    }


    if (!types.length) {

        alert(
            "กรุณาเลือกประเภทงาน"
        );

        return;

    }


    const newJob = {

        id:
            editingJobId ||
            Date.now(),

        title,

        date,

        time,

        place,

        types,

        photos,

        videos,

        editors,

        status,

        detail

    };


    if (editingJobId) {

        jobs =
            jobs.map(
                job =>
                    job.id === editingJobId
                        ? newJob
                        : job
            );

    } else {

        jobs.push(
            newJob
        );

    }


    saveData();

    closeModal();

    editingJobId = null;

    renderAll();

}


// =====================================================
// EDIT JOB
// =====================================================

function editJob(id) {

    const job =
        jobs.find(
            job =>
                job.id === id
        );


    if (job) {

        openModal(job);

    }

}


// =====================================================
// DELETE JOB
// =====================================================

function deleteJob(id) {

    const job =
        jobs.find(
            job =>
                job.id === id
        );


    if (!job)
        return;


    const confirmDelete =
        confirm(
            `ต้องการลบงาน "${job.title}" หรือไม่?`
        );


    if (!confirmDelete)
        return;


    jobs =
        jobs.filter(
            job =>
                job.id !== id
        );


    saveData();

    renderAll();

}


// =====================================================
// JOB DETAIL
// =====================================================

function openDetail(id) {

    const job =
        jobs.find(
            job =>
                job.id === id
        );


    if (!job)
        return;


    document.getElementById(
        "detailTitle"
    ).innerText =
        job.title;


    function peopleSection(
        title,
        icon,
        people
    ) {

        return `

            <div class="detail-section">

                <div class="detail-section-title">

                    ${icon}
                    ${title}

                </div>


                <div class="people-list">

                    ${
                        people.length

                            ? people
                                .map(
                                    person => `
                                        <span class="person-tag">
                                            ${escapeHTML(person)}
                                        </span>
                                    `
                                )
                                .join("")

                            : `
                                <span class="no-member">
                                    ยังไม่มีสมาชิก
                                </span>
                            `
                    }

                </div>

            </div>

        `;

    }


    document.getElementById(
        "detailContent"
    ).innerHTML = `

        <div class="detail-section">

            <div class="detail-info-grid">

                <div class="detail-info">

                    <span>
                        📅 วันที่
                    </span>

                    <strong>
                        ${formatDate(job.date)}
                    </strong>

                </div>


                <div class="detail-info">

                    <span>
                        🕐 เวลา
                    </span>

                    <strong>
                        ${job.time || "-"} น.
                    </strong>

                </div>


                <div class="detail-info">

                    <span>
                        📍 สถานที่
                    </span>

                    <strong>
                        ${escapeHTML(job.place || "-")}
                    </strong>

                </div>


                <div class="detail-info">

                    <span>
                        สถานะ
                    </span>

                    <strong>

                        <span
                            class="badge ${getStatusClass(job.status)}"
                        >
                            ${job.status}
                        </span>

                    </strong>

                </div>

            </div>

        </div>


        <div class="detail-section">

            <div class="detail-section-title">
                ประเภทงาน
            </div>


            <div class="people-list">

                ${
                    job.types
                        .map(
                            type => `
                                <span class="person-tag">
                                    ${getTypeIcon(type)}
                                    ${type}
                                </span>
                            `
                        )
                        .join("")
                }

            </div>

        </div>


        ${peopleSection(
            "ผู้ถ่ายภาพ",
            "📷",
            job.photos || []
        )}


        ${peopleSection(
            "ผู้ถ่ายวิดีโอ",
            "🎥",
            job.videos || []
        )}


        ${peopleSection(
            "ผู้ตัดต่อวิดีโอ",
            "✂️",
            job.editors || []
        )}


        <div class="detail-section">

            <div class="detail-section-title">
                รายละเอียดงาน
            </div>


            <div class="detail-description">

                ${
                    escapeHTML(
                        job.detail ||
                        "ไม่มีรายละเอียดเพิ่มเติม"
                    )
                }

            </div>

        </div>

    `;


    document.getElementById(
        "detailEditBtn"
    ).onclick = function() {

        closeDetail();

        editJob(id);

    };


    document
        .getElementById(
            "detailModal"
        )
        .classList.add("show");

}


function closeDetail() {

    document
        .getElementById(
            "detailModal"
        )
        .classList.remove("show");

}


// =====================================================
// MEMBERS PAGE
// =====================================================

function openMemberModal() {

    const input =
        document.getElementById(
            "memberName"
        );


    if (input)
        input.value = "";


    document
        .getElementById(
            "memberModal"
        )
        .classList.add("show");

}


function closeMemberModal() {

    document
        .getElementById(
            "memberModal"
        )
        .classList.remove("show");

}


function saveMember() {

    const input =
        document.getElementById(
            "memberName"
        );


    const name =
        input.value.trim();


    if (!name) {

        alert(
            "กรุณาใส่ชื่อสมาชิก"
        );

        return;

    }


    const exists =
        members.some(
            member =>
                member.toLowerCase() ===
                name.toLowerCase()
        );


    if (exists) {

        alert(
            "มีสมาชิกชื่อนี้อยู่แล้ว"
        );

        return;

    }


    members.push(name);

    saveMembers();

    closeMemberModal();

    renderMembers();

    updateMemberChoices();

    renderStats();

}


function deleteMember(name) {

    const confirmDelete =
        confirm(
            `ต้องการลบ "${name}" หรือไม่?`
        );


    if (!confirmDelete)
        return;


    members =
        members.filter(
            member =>
                member !== name
        );


    saveMembers();

    renderMembers();

    updateMemberChoices();

    renderStats();

}


function renderMembers() {

    const container =
        document.getElementById(
            "membersList"
        );


    if (!container)
        return;


    const search =
        document.getElementById(
            "memberSearch"
        )?.value
        .trim()
        .toLowerCase() || "";


    const filtered =
        members.filter(
            member =>
                member
                    .toLowerCase()
                    .includes(search)
        );


    container.innerHTML =

        filtered.length

            ? filtered
                .map(
                    member => {

                        const total =
                            jobs.filter(
                                job =>
                                    getPeople(job)
                                        .includes(member)
                            ).length;


                        return `

                            <div class="member-card">

                                <div class="member-avatar">

                                    ${escapeHTML(
                                        member.charAt(0)
                                    )}

                                </div>


                                <div class="member-info">

                                    <strong>
                                        ${escapeHTML(member)}
                                    </strong>

                                    <span>
                                        ${total} งาน
                                    </span>

                                </div>


                                <button
                                    class="delete-member"
                                    onclick="deleteMember('${escapeAttribute(member)}')"
                                >
                                    🗑️
                                </button>

                            </div>

                        `;

                    }
                )
                .join("")

            : `
                <div class="empty">
                    ไม่พบสมาชิก
                </div>
            `;

}


function updateMemberChoices() {

    createMemberChoices(
        "photoMembers",
        getSelectedMembersSafe(
            "photoMembers"
        )
    );


    createMemberChoices(
        "videoMembers",
        getSelectedMembersSafe(
            "videoMembers"
        )
    );


    createMemberChoices(
        "editorMembers",
        getSelectedMembersSafe(
            "editorMembers"
        )
    );

}


function getSelectedMembersSafe(
    containerId
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container)
        return [];


    return [
        ...container.querySelectorAll(
            ".member.selected"
        )
    ].map(
        button =>
            button.dataset.value
    );

}


// =====================================================
// GLOBAL SEARCH
// =====================================================

function globalSearch() {

    const input =
        document.getElementById(
            "globalSearch"
        );


    const search =
        input?.value
            .trim()
            .toLowerCase() || "";


    if (!search)
        return;


    showPage(
        "jobs",
        document.querySelector(
            '[data-page="jobs"]'
        )
    );


    const jobSearch =
        document.getElementById(
            "jobSearch"
        );


    if (jobSearch) {

        jobSearch.value =
            search;

        renderJobs();

    }

}


// =====================================================
// RENDER ALL
// =====================================================

function renderAll() {

    renderDashboard();

    renderJobs();

    renderArchive();

    renderStats();

    renderCalendar();

    renderMembers();

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escapeAttribute(value) {

    return String(value)
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'")
        .replaceAll('"', "&quot;");

}


// =====================================================
// CLOSE MODAL WHEN CLICK OUTSIDE
// =====================================================

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            event.target.classList.remove(
                "show"
            );

        }

    }
);


// =====================================================
// START
// =====================================================

renderAll();