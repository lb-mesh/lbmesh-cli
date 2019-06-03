
!function($) {
    "use strict";

    var SweetAlert = function() {};

    //examples 
    SweetAlert.prototype.init = function() {
        
    //Basic
    $('#sa-basic').click(function(){
        swal("Here's a message!");
    });

    // Slogs
    $('#slimlogs').slimScroll({
        position: 'right',
        height: '450px',
        railVisible: true,
        alwaysVisible: true
    });

    //A title with a text under
    $('#sa-title').click(function(){
        swal("Here's a message!", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lorem erat eleifend ex semper, lobortis purus sed.")
    });

    //Success Message
    $('#sa-success').click(function(){
        swal("Good job!", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lorem erat eleifend ex semper, lobortis purus sed.", "success")
    });

    //Warning Message
    $('#sa-warning').click(function(){
        swal({   
            title: "Are you sure?",   
            text: "Update this settings for the " + $('#formService').val() + " container service?",   
            type: "question",   
            showCancelButton: true,   
            focusConfirm: true,
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "Yes, update it!",   
            closeOnConfirm: false 
        }).then( function(isConfirm){   
            if (isConfirm.value) {  
               //$("#formContainerSettings").val("start");
                $("#formContainerSettings").submit();
            } else {     
                return false;   
            } 
        });
    });

    //Parameter
    $('#sa-params-pull').click(function(){

        swal({   
            title: "Are you sure?",   
            text: "You want to pull and setup container for " + $("#service-icon").attr("data") + " ?",   
            type: "warning",   
            showCancelButton: true,   
            showConfirmButton: true,
            showLoaderOnConfirm: true,
            confirmButtonColor: "#DD6B55",   
            preConfirm: () => {
                
                return fetch((( $('#formCategory').val() == "db")? "/databases/":"/integrations/") + 'pull', {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                  },
                body: JSON.stringify({
                    "nextstep": "pull",
                    "category": $('#formCategory').val(),
                    "service": $('#formService').val()
                })
            })
                .then(response => {
                    return response.json();
 
                }).then(data => {
                    console.log( data );
                    if( data.result == "success"){
                        window.location.href= ((data.category == "db")? "/databases/":"/integrations/") + data.service + "/manage.html?status="+ data.result;
                    } else {
                        swal("Problem with the Image Pull", data.message, "error")
                    }
                   
                })
                .catch(error => {
                    swal.showValidationMessage(`Request failed: ${error}`);
                })
            },
            focusConfirm: true,
            confirmButtonText: "Yes, Pull Image!",
            cancelButtonText: "Cancel"
        });
    });

    $('#sa-params-start').click(function(){

        swal({   
            title: "Are you sure?",   
            text: "Want to start the " + $("#service-icon").attr("data") + " container service ?",   
            type: "question",   
            showCancelButton: true,   
            showConfirmButton: true,
            confirmButtonColor: "#DD6B55",   
            focusConfirm: true,
 
            confirmButtonText: "Yes, Start Pls!",
            cancelButtonText: "Cancel"
        }).then( function(isConfirm){   
            if (isConfirm.value) {  
                $("#formPerform").val("start");
                $("#actionForm").submit();
            } else {     
                return false;   
            } 
        });
    });

    $('#sa-params-stop').click(function(){

        swal({   
            title: "Are you sure?",   
            text: "Want to stop the " + $("#service-icon").attr("data") + " container service ?",   
            type: "question",   
            showCancelButton: true,   
            showConfirmButton: true,
            confirmButtonColor: "#DD6B55",   
            focusConfirm: true,
           // imageUrl: "/cdn/logos/" + $("#service-icon").attr("data") + ".png" ,
            confirmButtonText: "Yes, Stop Pls!",
            cancelButtonText: "Cancel"
        }).then( function(isConfirm){   
            if (isConfirm.value) {  
                $("#formPerform").val("stop");
                $("#actionForm").submit();
            } else {     
                return false;   
            } 
        });
    });

    $('#sa-params-remove').click(function(){

        swal({   
            title: "Are you sure?",   
            text: "Want to remove the " + $("#service-icon").attr("data") + " container service ?",   
            type: "question",   
            showCancelButton: true,   
            showConfirmButton: true,
            confirmButtonColor: "#DD6B55",   
            focusConfirm: true,
           // imageUrl: "/cdn/logos/" + $("#service-icon").attr("data") + ".png" ,
            confirmButtonText: "Yes, Remove Pls!",
            cancelButtonText: "Cancel"
        }).then( function(isConfirm){   
            if (isConfirm.value) {  
                $("#formPerform").val("remove");
                $("#actionForm").submit();
            } else {     
                return false;   
            } 
        });
    });

    //Custom Image
    $('#sa-image').click(function(){
        swal({   
            title: "Govinda!",   
            text: "Recently joined twitter",   
            imageUrl: "../assets/images/users/profile.png" 
        });
    });

    //Auto Close Timer
    $('#sa-close').click(function(){
         swal({   
            title: "Auto close alert!",   
            text: "I will close in 2 seconds.",   
            timer: 2000,   
            showConfirmButton: false 
        });
    });


    },
    //init
    $.SweetAlert = new SweetAlert, $.SweetAlert.Constructor = SweetAlert
}(window.jQuery),

//initializing 
function($) {
    "use strict";
    $.SweetAlert.init()
}(window.jQuery);