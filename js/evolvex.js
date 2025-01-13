var auth = "GTXTkWCFpuAEeoyCEaLRugbqSY87CktR";

function cekMode(auth) {
    $.ajax({
        url: "https://blynk.cloud/external/api/get?token=" + auth + "&dataStreamId=" + 5,
        type: "GET",
        dataType: "json",
        success: function(data) {
            if (data == 1) {
                $("#mode").html("Automated");
                $("#toggleSwitch").prop("checked", true); // Set switch to checked
            } else {
                $("#mode").html("Manual");
                $("#toggleSwitch").prop("checked", false); // Set switch to unchecked
            }
        },
        error: function() {
            alert("Failed to fetch mode data.");
        }
    });
}

function cekKonek(auth) {
    $.ajax({
        url: "https://blynk.cloud/external/api/isHardwareConnected?token="+auth,
        type: "GET",
        dataType: "json",
        success: function(data) {
            if (data == true) {
                $("#efus").html("🟢 Online");
                $("#efus").css("color", "#66BB6A");
            } else {
                $("#efus").html("🔴 Offline");
                $("#efus").css("color", "#FF0000");
            }
        },
        error: function() {
            console.error("Failed to check connection status.");
        }
    });
}

function updateData(pin, value) {
    $.ajax({
        url: "https://blynk.cloud/external/api/update?token=" + auth + "&" + pin + "=" + value,
        type: "GET",
        dataType: "json",
        success: function(data) {
            if (data == 1) {
                // Beri waktu untuk memastikan perubahan diterapkan di server
                setTimeout(() => cekMode(auth), 500); // Delay 500ms
            } else {
                alert("Failed to update data.");
            }
        },
        error: function() {
            console.log(data);
            alert("Error occurred during update.");
        }
    });
}

$(document).ready(function() {
    $("#djload").show(); // Show loading icon
    setTimeout(function() {
        cekKonek(auth);      // Check connection status
        cekMode(auth);          // Check mode 
        $("#djload").hide(); // Hide loading icon
    }, 1000);

    // Set interval to keep checking connection and mode
    setInterval(() => {
        cekKonek(auth);
        cekMode(auth);
    }, 200); // Check every 5 seconds
});

function refresh() {
    let timerInterval;
    Swal.fire({
        title: "Please wait",
        html: "Mengambil data.....",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason) {
            console.log("Closed by timer");
        }
    });

    setTimeout(function() {
        cekKonek(auth);
    }, 2000);
}

// Event listener for toggle switch
document.getElementById('toggleSwitch').addEventListener('change', function(event) {
    if (event.target.checked) {
        updateData("v0", 1);
    } else {
        updateData("v0", 0);
    }
});
