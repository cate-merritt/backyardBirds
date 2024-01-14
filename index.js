// Wrap your code in an IIFE (Immediately Invoked Function Expression) to create a new scope
(function () {
    // Define the URL_ENDPOINT outside any function to make it global
    const URL_ENDPOINT = "https://65a317d3a54d8e805ed3683b.mockapi.io/api/week_12/backyardBirds";

    /** CREATE */
    $("#addForm").on("submit", (e) => {
        e.preventDefault();
        const birdData = {
            name: $("#birdInput").val(),
            date: $("#dateInput").val(),
            location: $("#locationInput").val(),
            notes: $("#notesInput").val(),
        };

        $.post(URL_ENDPOINT, birdData)
            .then(() => {
                getData(); // Fetch updated data after creating a new entry
                document.getElementById("addForm").reset(); // Reset the form after submission
            })
            .catch((error) => {
                console.error("Error adding observation:", error);
            });
    });

    /** READ */
    getData();
    function getData() {
        $.get(URL_ENDPOINT).then((data) => {
            $("tbody").empty();
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
              <button class="btn btn-danger btn-sm deleteButton" data-id="${bird.id}">Delete</button> 
            </td>
            <td> 
              <button class="btn btn-info btn-sm updateButton" data-id="${bird.id}" data-bs-toggle="modal" data-bs-target="#updateModal">Update</button> 
            </td>
          </tr>
        `)
                );
            });

            // Add event listeners for dynamically generated buttons
            $(".deleteButton").on("click", function () {
                deleteBird($(this).data("id"));
            });

            $(".updateButton").on("click", function () {
                openUpdateModal($(this).data("id"));
            });
        });
    }

    /** UPDATE - Open Modal */
    function openUpdateModal(id) {
        // Fetch the details of the selected bird by its ID
        $.get(`${URL_ENDPOINT}/${id}`).then((bird) => {
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
        let id = $("#updateId").val();
        $.ajax(`${URL_ENDPOINT}/${id}`, {
            method: "PUT",
            data: {
                name: $("#birdUpdate").val(),
                date: $("#dateUpdate").val(),
                location: $("#locationUpdate").val(),
                notes: $("#notesUpdate").val(),
            },
        })
            .then(getData)
            .then($("#updateModal").modal("hide"));
    }

    $("#updateForm").on("submit", (e) => {
        updateBird(e);
        document.getElementById("updateForm").reset();
    });

    /** DELETE */
    function deleteBird(id) {
        $.ajax(`${URL_ENDPOINT}/${id}`, {
            method: "DELETE",
        }).then(getData);
    }

})();

