function fetchShifts() {
    fetch("http://localhost:3000/api/shifts")
        .then((response) => response.json())
        .then((shifts) => {
            const shiftsTableBody = document.getElementById("shifts-table-body");
            shiftsTableBody.innerHTML = ""; // Clear existing table rows

            shifts.forEach((shift) => {
                const row = document.createElement("tr");

                // Add the data to the row
                row.innerHTML = `
                    <td>${shift.type}</td>
                    <td>${shift.shift_date}</td>
                    <td>${shift.time}</td>
                    <td>${shift.location}</td>
                    <td>${shift.spots_available}</td>
                    <td>
                        <button class="btn btn-secondary" 
                                onclick="showUpdateForm(${shift.id}, '${shift.type}', '${shift.shift_date}', '${shift.time}', '${shift.location}', ${shift.spots_available})">
                            Update
                        </button>
                        <button class="btndelete btn-danger" 
                                onclick="deleteShift(${shift.id})">
                            Delete
                        </button>
                    </td>
                `;

                // Append the row to the table body
                shiftsTableBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error fetching shifts:", error);
            alert("Something went wrong while fetching the shifts.");
        });
}

// Function to show the update form with pre-filled data
function showUpdateForm(id, type, date, time, location, spots) {
    const updateForm = `
        <tr>
            <td><input type="text" id="update-type" value="${type}" required></td>
            <td><input type="date" id="update-date" value="${date}" required></td>
            <td><input type="time" id="update-time" value="${time}" required></td>
            <td><input type="text" id="update-location" value="${location}" required></td>
            <td><input type="number" id="update-spots" value="${spots}" required></td>
            <td>
                <button class="btn btn-success" onclick="updateShift(${id})">Save</button>
                <button class="btn btn-secondary" onclick="fetchShifts()">Cancel</button>
            </td>
        </tr>
    `;

    // Display only the update form in the table
    const shiftsTableBody = document.getElementById("shifts-table-body");
    shiftsTableBody.innerHTML = updateForm;
}

// Function to handle the update request
function updateShift(id) {
    const updatedShift = {
        type: document.getElementById("update-type").value,
        shift_date: document.getElementById("update-date").value,
        time: document.getElementById("update-time").value,
        location: document.getElementById("update-location").value,
        spots_available: document.getElementById("update-spots").value,
    };

    fetch(`http://localhost:3000/api/update-shift/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedShift),
    })
        .then((response) => response.text())
        .then((message) => {
            alert(message); // Show success message
            fetchShifts(); // Reload the table with updated data
        })
        .catch((error) => {
            console.error("Error updating shift:", error);
            alert("Something went wrong while updating the shift.");
        });
}

// Function to delete a shift by ID
function deleteShift(shiftId) {
    if (confirm("Are you sure you want to delete this shift?")) {
        fetch(`http://localhost:3000/api/delete-shift/${shiftId}`, {
            method: "DELETE",
        })
            .then((response) => response.text())
            .then((message) => {
                alert(message); // Show success message
                fetchShifts(); // Refresh the table
            })
            .catch((error) => {
                console.error("Error deleting shift:", error);
                alert("Something went wrong while deleting the shift.");
            });
    }
}

// Fetch and display shifts when the page loads
document.addEventListener("DOMContentLoaded", fetchShifts);
