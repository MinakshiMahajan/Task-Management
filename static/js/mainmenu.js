function onload(){
    var today = new Date();
    document.getElementById("fromdate").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    document.getElementById("todate").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    showtaskdata();
}
function addtask(){
    document.getElementById("addtaskdig").style.display="block";
    const favDialog = document.getElementById('addtaskdialog');
    if (typeof favDialog.showModal === "function") {
        favDialog.showModal();
        retriveadmin();
        retriveuser();
    }else{
        return alert("Sorry, the <dialog> API is not supported by this browser.") 
    }
}
function closedig(){
    document.getElementById("addtaskdig").style.display="none";
    const favDialog = document.getElementById('addtaskdialog');
    favDialog.close();
}
function retriveadmin(){
    $.ajax({
        url: "/1/mainmenu",
        type: 'POST',
        data: {
            action: 'retriveadmin',
        },
        cache: false,
        success: function savecaller(res) {
            var slsn1 = document.getElementById("fromid")
            if(slsn1!=null){
                slsn1.length = 0
                slsn1[slsn1.length] = new Option('Select')
                for (i = 0; i < res.length; i++) {
                    var myOption = document.createElement("option");
                    try{
                        var x=JSON.parse(res[i]);
                        myOption.text = x.username;
                        myOption.value = x.id;
                        slsn1.add(myOption);
                    }catch(err){
                        
                    }
                }
            }      
        }
    })
}
function retriveuser(){
    $.ajax({
        url: "/1/mainmenu",
        type: 'POST',
        data: {
            action: 'retriveuser',
        },
        cache: false,
        success: function savecaller(res) {
            var slsn1 = document.getElementById("touserid")
            if(slsn1!=null){
                slsn1.length = 0
                slsn1[slsn1.length] = new Option('Select')
                for (i = 0; i < res.length; i++) {
                    var myOption = document.createElement("option");
                    try{
                        var x=JSON.parse(res[i]);
                        myOption.text = x.username;
                        myOption.value = x.id;
                        slsn1.add(myOption);
                    }catch(err){
                        
                    }
                }
            }      
        }
    })
}
function retriveadmin1(){
    $.ajax({
        url: "/1/mainmenu",
        type: 'POST',
        data: {
            action: 'retriveadmin',
        },
        cache: false,
        success: function savecaller(res) {
            var slsn1 = document.getElementById("fromid1")
            if(slsn1!=null){
                slsn1.length = 0
                slsn1[slsn1.length] = new Option('Select')
                for (i = 0; i < res.length; i++) {
                    var myOption = document.createElement("option");
                    try{
                        var x=JSON.parse(res[i]);
                        myOption.text = x.username;
                        myOption.value = x.id;
                        slsn1.add(myOption);
                    }catch(err){
                        
                    }
                }
            }      
        }
    })
}
function retriveuser1(){
    $.ajax({
        url: "/1/mainmenu",
        type: 'POST',
        data: {
            action: 'retriveuser',
        },
        cache: false,
        success: function savecaller(res) {
            var slsn1 = document.getElementById("touserid1")
            if(slsn1!=null){
                slsn1.length = 0
                slsn1[slsn1.length] = new Option('Select')
                for (i = 0; i < res.length; i++) {
                    var myOption = document.createElement("option");
                    try{
                        var x=JSON.parse(res[i]);
                        myOption.text = x.username;
                        myOption.value = x.id;
                        slsn1.add(myOption);
                    }catch(err){
                        
                    }
                }
            }      
        }
    })
}
function sendtask(){
    if($("#fromid option:selected").text()=='Select'){
        return alert("Please Select From")
    }
    if($("#touserid option:selected").text()=='Select'){
        return alert("Please Select To")
    }
    if($("#subjectid").val()==''){
        return alert("Please Enter Subject")
    }
    if($("#description").val()==''){
        return alert("Please Enter Description")
    }
    if($("#dateid").val()==''){
        return alert("Please Enter Start Date")
    }
    if($("#duedateid").val()==''){
        return alert("Please Enter Due Date")
    }
    if($("#statusid").val()==''){
        return alert("Please Enter Status")
    }
    if($("#priorityid option:selected").text()=='Select'){
        return alert("Please Select Priority")
    }
    $.ajax({
        url: "/1/mainmenu",
        type: 'POST',
        data: {
            action:'sendtask',
            fromid:$("#fromid option:selected").text(),
            touserid:$("#touserid option:selected").text(),
            subjectid:$("#subjectid").val(),
            description:$("#description").val(),
            dateid:$("#dateid").val(),
            duedateid:$("#duedateid").val(),
            statusid:$("#statusid").val(),
            priorityid:$("#priorityid").val(),
        },
        cache: false,
        success: function savecaller(res) {
            alert(res);
            cleardata();
            showtaskdata();
        }
    })
}
function cleardata(){
    let $select=document.querySelector("#fromid");
    $select.value='Select'
    let $select1=document.querySelector("#touserid");
    $select1.value='Select'
    document.getElementById("subjectid").value="";
    document.getElementById("description").value="";
    document.getElementById("dateid").value="";
    document.getElementById("duedateid").value="";
    let $select2=document.querySelector("#statusid");
    $select2.value='Select'
    let $select3=document.querySelector("#priorityid");
    $select3.value='Select'
}
function showtaskdata(){
    $.ajax({
        url: "/1/mainmenu",
        type: 'POST',
        data: {
            action:'showtaskdata',
            sdate:$("#fromdate").val(),
            edate:$("#todate").val(),
        },
        cache: false,
        success: function savecaller(res) {
            document.getElementById("showtaskdata1").innerHTML = res;
        }
    })
}
function openeditdigbox(taskid){
    document.getElementById("edittaskdig").style.display="block";
    const favDialog = document.getElementById('edittaskdig1');
    if (typeof favDialog.showModal === "function") {
        favDialog.showModal();
        retriveadmin1();
        retriveuser1();
        document.getElementById("hiddentaskid").value=taskid;
    }else{
        return alert("Sorry, the <dialog> API is not supported by this browser.") 
    }    
}
function closeedittaskb(){
    document.getElementById("edittaskdig").style.display="none";
    const favDialog = document.getElementById('edittaskdig1');
    favDialog.close();
}
function edittaskdetails(){
  
    if($("#fromid1 option:selected").text()=='Select'){
        return alert("Please Select From")
    }
    if($("#touserid1 option:selected").text()=='Select'){
        return alert("Please Select To")
    }
    if($("#subjectid1").val()==''){
        return alert("Please Enter Subject")
    }
    if($("#description1").val()==''){
        return alert("Please Enter Description")
    }
    if($("#dateid1").val()==''){
        return alert("Please Enter Start Date")
    }
    if($("#duedateid1").val()==''){
        return alert("Please Enter Due Date")
    }
    if($("#statusid1").val()==''){
        return alert("Please Enter Status")
    }
    if($("#priorityid1 option:selected").text()=='Select'){
        return alert("Please Select Priority")
    }
    $.ajax({
        url: "/1/mainmenu",
        type: 'POST',
        data: {
            action:'edittaskdetails',
            fromid:$("#fromid1 option:selected").text(),
            touserid:$("#touserid1 option:selected").text(),
            subjectid:$("#subjectid1").val(),
            description:$("#description1").val(),
            dateid:$("#dateid1").val(),
            duedateid:$("#duedateid1").val(),
            statusid:$("#statusid1").val(),
            priorityid:$("#priorityid1").val(),
            taskid:$("#hiddentaskid").val(),
        },
        cache: false,
        success: function savecaller(res) {
            alert(res);
            document.getElementById("hiddentaskid").value='';
            showtaskdata();
            cleardata1();
        }
    })
}
function cleardata1(){
    let $select=document.querySelector("#fromid1");
    $select.value='Select'
    let $select1=document.querySelector("#touserid1");
    $select1.value='Select'
    document.getElementById("subjectid1").value="";
    document.getElementById("description1").value="";
    document.getElementById("dateid1").value="";
    document.getElementById("duedateid1").value="";
    let $select2=document.querySelector("#statusid1");
    $select2.value='Select'
    let $select3=document.querySelector("#priorityid1");
    $select3.value='Select'
}
function deletetaskbtn(taskid){
    var conf=confirm("Do You Want To Delete Task ?")
    if(conf === true){
        $.ajax({
            url: "/1/mainmenu",
            type: 'POST',
            data: {
                action:'deletetaskbtn',
                taskid:taskid,
            },
            cache: false,
            success: function savecaller(res) {
                alert(res);
                showtaskdata();
            }
        })
    }
}