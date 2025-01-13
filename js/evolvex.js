var auth = "-Q5uMi-QHnvEVeL8745C1JXZb6EUeKWt";
let stateLampu;

function cekMode(auth) {
    $.ajax({
        url: "https://blynk.cloud/external/api/get?token=" + auth + "&dataStreamId=" + 1,
        type: "GET",
        dataType: "text",
        success: function(data) {
            if (data == 1) {
                $("#mode").html("Automated");
                $("#toggleSwitch").prop("checked", true); // Set switch to checked
            } else {
                updateData("v1", 0);
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
                
            } else {
                alert("Failed to update data.");
            }
        },
        error: function(data) {
            
        }
    });
}

function cekLampu(id){
    $.ajax({
        url: "https://blynk.cloud/external/api/get?token=" + auth + "&dataStreamId=" + id,
        type: "GET",
        dataType: "json",
        success: function(data) {
            if (data == 1) {
                stateLampu = 1;
                $("#eris").attr("src", "https://hosting.tigerengine.id/mv3j9o.png");
            } else {
                stateLampu = 0;
                $("#eris").attr("src", "https://hosting.tigerengine.id/l5o9ty.png");
            }
        },
        error: function() {
            alert("Failed to fetch lampu data.");
        }
    });
}

function toggleLampu(pin){
    if (stateLampu == 1) {
        updateData("v1", 0);
    } else {
        updateData("v1", 1);
    }
}


$(document).ready(function() {
    $("#djload").show(); // Show loading icon
    setTimeout(function() {
        cekKonek(auth);      // Check connection status
        cekMode(auth);
        cekLampu(2);          // Check mode 
        $("#djload").hide(); // Hide loading icon
    }, 1000);

    // Set interval to keep checking connection and mode
    setInterval(() => {
        cekMode(auth);
        cekLampu(2);
    }, 500); // Check every 5 seconds

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
