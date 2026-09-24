// ============================================
// COLLEGE COMPLAINT PORTAL
// ============================================


// Get complaints from localStorage
let complaints =
    JSON.parse(localStorage.getItem("complaints")) || [];


// ============================================
// MODULE SWITCHING
// ============================================

function showStudent() {

    document.getElementById("studentModule").style.display = "block";
    document.getElementById("adminModule").style.display = "none";

    updateStudentDashboard();
}


function showAdmin() {

    document.getElementById("studentModule").style.display = "none";
    document.getElementById("adminModule").style.display = "block";

    updateAdminDashboard();
}


// Show Student Module initially
showStudent();


// ============================================
// SUBMIT COMPLAINT
// ============================================

document
    .getElementById("complaintForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const studentName =
            document.getElementById("studentName").value;

        const department =
            document.getElementById("department").value;

        const category =
            document.getElementById("category").value;

        const description =
            document.getElementById("description").value;


        // Create complaint object

        const complaint = {

            id: Date.now(),

            studentName: studentName,

            department: department,

            category: category,

            description: description,

            status: "Pending",

            response: "",

            date: new Date().toLocaleDateString()

        };


        // Add complaint

        complaints.push(complaint);


        // Save to localStorage

        localStorage.setItem(
            "complaints",
            JSON.stringify(complaints)
        );


        // Clear form

        document.getElementById("complaintForm").reset();


        alert("Complaint submitted successfully!");


        updateStudentDashboard();

    });


// ============================================
// STUDENT DASHBOARD
// ============================================

function updateStudentDashboard() {

    const total = complaints.length;

    const pending =
        complaints.filter(c => c.status === "Pending").length;

    const resolved =
        complaints.filter(c => c.status === "Resolved").length;


    document.getElementById("totalComplaints")
        .textContent = total;

    document.getElementById("pendingComplaints")
        .textContent = pending;

    document.getElementById("resolvedComplaints")
        .textContent = resolved;


    displayStudentComplaints();
}


// ============================================
// DISPLAY STUDENT COMPLAINTS
// ============================================

function displayStudentComplaints() {

    const container =
        document.getElementById("studentComplaints");


    if (complaints.length === 0) {

        container.innerHTML =
            '<p class="empty">No complaints submitted yet.</p>';

        return;
    }


    container.innerHTML = "";


    complaints.forEach(function(complaint) {

        let statusClass = "pending";


        if (complaint.status === "In Progress") {
            statusClass = "progress";
        }

        if (complaint.status === "Resolved") {
            statusClass = "resolved";
        }


        const complaintHTML = `

            <div class="complaint">

                <h3>
                    Complaint #${complaint.id}
                </h3>

                <p>
                    <strong>Date:</strong>
                    ${complaint.date}
                </p>

                <p>
                    <strong>Student:</strong>
                    ${complaint.studentName}
                </p>

                <p>
                    <strong>Department:</strong>
                    ${complaint.department}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${complaint.category}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${complaint.description}
                </p>

                <p>
                    <strong>Status:</strong>

                    <span class="status ${statusClass}">
                        ${complaint.status}
                    </span>

                </p>


                ${
                    complaint.response
                    ?
                    `
                    <p>
                        <strong>Admin Response:</strong>
                        ${complaint.response}
                    </p>
                    `
                    :
                    `
                    <p>
                        <strong>Admin Response:</strong>
                        Waiting for admin response
                    </p>
                    `
                }

            </div>

        `;


        container.innerHTML += complaintHTML;

    });

}


// ============================================
// ADMIN DASHBOARD
// ============================================

function updateAdminDashboard() {

    const total = complaints.length;

    const pending =
        complaints.filter(c => c.status === "Pending").length;

    const resolved =
        complaints.filter(c => c.status === "Resolved").length;


    document.getElementById("adminTotal")
        .textContent = total;

    document.getElementById("adminPending")
        .textContent = pending;

    document.getElementById("adminResolved")
        .textContent = resolved;


    displayAdminComplaints();
}


// ============================================
// DISPLAY ADMIN COMPLAINTS
// ============================================

function displayAdminComplaints() {

    const container =
        document.getElementById("adminComplaints");


    if (complaints.length === 0) {

        container.innerHTML =
            '<p class="empty">No complaints available.</p>';

        return;
    }


    container.innerHTML = "";


    complaints.forEach(function(complaint) {

        let statusClass = "pending";


        if (complaint.status === "In Progress") {
            statusClass = "progress";
        }

        if (complaint.status === "Resolved") {
            statusClass = "resolved";
        }


        const complaintHTML = `

            <div class="complaint">

                <h3>
                    Complaint #${complaint.id}
                </h3>

                <p>
                    <strong>Student:</strong>
                    ${complaint.studentName}
                </p>

                <p>
                    <strong>Department:</strong>
                    ${complaint.department}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${complaint.category}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${complaint.description}
                </p>

                <p>
                    <strong>Current Status:</strong>

                    <span class="status ${statusClass}">
                        ${complaint.status}
                    </span>

                </p>


                <div class="admin-actions">

                    <select id="status-${complaint.id}">

                        <option value="Pending"
                            ${complaint.status === "Pending" ? "selected" : ""}>
                            Pending
                        </option>

                        <option value="In Progress"
                            ${complaint.status === "In Progress" ? "selected" : ""}>
                            In Progress
                        </option>

                        <option value="Resolved"
                            ${complaint.status === "Resolved" ? "selected" : ""}>
                            Resolved
                        </option>

                    </select>


                    <button
                        onclick="updateStatus(${complaint.id})">
                        Update Status
                    </button>

                </div>


                <div class="response-box">

                    <label>Admin Response</label>

                    <textarea
                        id="response-${complaint.id}"
                        placeholder="Enter response to student..."
                    >${complaint.response}</textarea>


                    <button
                        class="submit-btn"
                        onclick="sendResponse(${complaint.id})">

                        Send Response

                    </button>

                </div>

            </div>

        `;


        container.innerHTML += complaintHTML;

    });

}


// ============================================
// UPDATE COMPLAINT STATUS
// ============================================

function updateStatus(id) {

    const complaint =
        complaints.find(c => c.id === id);


    const newStatus =
        document.getElementById(`status-${id}`).value;


    if (complaint) {

        complaint.status = newStatus;

        localStorage.setItem(
            "complaints",
            JSON.stringify(complaints)
        );


        alert("Complaint status updated!");

        updateAdminDashboard();

    }

}


// ============================================
// SEND ADMIN RESPONSE
// ============================================

function sendResponse(id) {

    const complaint =
        complaints.find(c => c.id === id);


    const response =
        document.getElementById(`response-${id}`).value;


    if (response.trim() === "") {

        alert("Please enter a response.");

        return;
    }


    if (complaint) {

        complaint.response = response;


        // Automatically mark as resolved

        complaint.status = "Resolved";


        localStorage.setItem(
            "complaints",
            JSON.stringify(complaints)
        );


        alert("Response sent to student!");

        updateAdminDashboard();

    }

}