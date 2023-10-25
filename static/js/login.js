function loginbutton(){
    if($("#username").val()==''){
        return alert("Please Enter User Name")
    }
    if($("#userpassword").val()==''){
        return alert("Please Enter Password")
    }
    $.ajax({
        url: "/1/login",
        type: 'POST',
        data: {
            action: 'loginbutton',
            username: $("#username").val(),
            password:$("#userpassword").val(),
        },
        cache: false,
        success: function savecaller(res) {
            if(res=='login'){
                window.location.replace('/1/mainmenu');
            }else{
                alert(res)
                return;
            }
        }
    })
}