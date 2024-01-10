if(document.getElementById("Signup") !== null){
    var submitBtn = document.getElementById("Signup")
    var pass = document.getElementById("password");
    var confirmPass = document.getElementById("Confirm-password");
    var uName = document.getElementById("Username");


    submitBtn.onclick = function(e){
        var link = `http://localhost:3000/auth/checkNames/${uName.value}`
        var response = $.ajax({
          url: link,
          dataType: "text",
          async: false
          }).responseText;

        if(response !== "Status: ok"){
            e.preventDefault();
            alert(response);
        }
        if(pass.value !== confirmPass.value){
            e.preventDefault();
            alert("Passwords do not match");
        }
    }

}else if(document.getElementById("login-header") !== null){
    var header = document.getElementById("login-header");
    var error = header.getAttribute("data-error");
    if( error !== ""){
        alert(error);
    }
    
    
}