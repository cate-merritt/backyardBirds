// Wrap your code in an IIFE (Immediately Invoked Function Expression) to create a new scope
(function () {
    // Define the API endpoint outside any function to make it global
    const API_ENDPOINT = "https://65a317d3a54d8e805ed3683b.mockapi.io/api/week_12/backyardBirds";

    /** CREATE */
    $("#addForm").on("submit", (e) => {
        e.preventDefault();
        // Gather bird data from the form
        const birdData = {
            name: $("#birdInput").val(),
            date: $("#dateInput").val(),
            location: $("#locationInput").val(),
            notes: $("#notesInput").val(),
        };

        // Send a POST request to create a new bird entry
        $.post(API_ENDPOINT, birdData)
            .then(() => {
                // Fetch updated data after creating a new entry
                getData();
                // Reset the form after submission
                document.getElementById("addForm").reset();
            })
            .catch((error) => {
                // Log an error if there's an issue with creating an observation
                console.error("Error adding observation:", error);
            });
    });

    /** READ */
    // Fetch and display data when the page loads
    getData();
    function getData() {
        // Fetch bird data from the API
        $.get(API_ENDPOINT).then((data) => {
            // Clear the table body before populating it with new data
            $("tbody").empty();
            // Iterate through each bird and append a new row to the table
            data.map((bird) => {
                $("tbody").append(
                    $(`
          <tr>
            <td>${bird.id}</td>
            <td>${bird.name}</td>
            <td>${bird.date}</td>
            <td>${bird.location}</td>
            <td>${bird.notes}</td>
            <td> 
            <button class="btn btn-warning btn-sm updateButton" data-id="${bird.id}" data-bs-toggle="modal" data-bs-target="#updateModal"><strong>Edit</strong></button> 
            </td>
            <td> 
            <button class="btn btn-danger btn-sm deleteButton" data-id="${bird.id}"><strong>Delete</strong></button>  
            </td>
          </tr>
        `)
                );
            });

            // Add event listeners for dynamically generated buttons
            $(".deleteButton").on("click", function () {
                // Call the deleteBird function when a delete button is clicked
                deleteBird($(this).data("id"));
            });

            $(".updateButton").on("click", function () {
                // Call the openUpdateModal function when an update button is clicked
                openUpdateModal($(this).data("id"));
            });
        });
    }

    /** UPDATE - Open Modal */
    function openUpdateModal(id) {
        // Fetch the details of the selected bird by its ID
        $.get(`${API_ENDPOINT}/${id}`).then((bird) => {
            // Set the values in the modal form based on the clicked bird's data
            $("#updateId").val(bird.id);
            $("#birdUpdate").val(bird.name);
            $("#dateUpdate").val(bird.date);
            $("#locationUpdate").val(bird.location);
            $("#notesUpdate").val(bird.notes);

            // Show the modal
            $("#updateModal").modal("show");
        });
    }

    /** UPDATE - Handle form submission */
    function updateBird(e) {
        e.preventDefault();
        // Get the ID of the bird to be updated
        let id = $("#updateId").val();
        // Send a PUT request to update the bird data
        $.ajax(`${API_ENDPOINT}/${id}`, {
            method: "PUT",
            data: {
                name: $("#birdUpdate").val(),
                date: $("#dateUpdate").val(),
                location: $("#locationUpdate").val(),
                notes: $("#notesUpdate").val(),
            },
        })
            .then(() => {
                // Fetch updated data after updating a bird entry
                getData();
                // Hide the update modal
                $("#updateModal").modal("hide");
            });
    }

    // Add event listener for the update form submission
    $("#updateForm").on("submit", (e) => {
        updateBird(e);
        // Reset the update form after submission
        document.getElementById("updateForm").reset();
    });

    // Add event listener for the update button in the modal
    $("#updateModal").on("click", "#modalUpdateButton", function () {
        // Call the updateBird function when the modal update button is clicked
        updateBird(event);
    });

    /** DELETE */
    function deleteBird(id) {
        // Send a DELETE request to delete the selected bird entry
        $.ajax(`${API_ENDPOINT}/${id}`, {
            method: "DELETE",
        })
        // Fetch updated data after deleting a bird entry
        .then(getData);
    }

})();

