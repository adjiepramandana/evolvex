var auth = "GTXTkWCFpuAEeoyCEaLRugbqSY87CktR";
function cekKonek(auth){
    $.ajax({
        url: "https://blynk.cloud/external/api/isHardwareConnected?token="+auth,
        type: "GET",
        dataType: "json",
        success: function(data) {
            if(data == true){
                $("#efus").html("Connected");
                $("#efus").css("color", "#66BB6A");
                $("#djload").hide();
            }
            else{
                $("#efus").html("Offline");
                $("#djload").hide();
            }
        },
        error: function(data) {
            $("#efus").html("Offline");
            $("#djload").hide();
        }
    });
}

$(document).ready(function() {
    $("#djload").show();
    cekKonek(auth);
});
