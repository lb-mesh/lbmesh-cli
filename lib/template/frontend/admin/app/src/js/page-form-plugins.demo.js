/*   
Template Name: Source Admin - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.7 & Bootstrap 4
Version: 1.4.0
Author: Sean Ngu
Website: http://www.seantheme.com/source-admin-v1.4/admin/
*/

var handleDatepicker = function() {
    "use strict";
    
    $('#datepicker-default').datepicker({
        format: 'yyyy-mm-dd',
        todayHighlight: true
    });
    $('#datepicker-default-1').datepicker({
        format: 'yyyy-mm-dd',
        todayHighlight: true
    });
    $('#datepicker-inline').datepicker({
        todayHighlight: true
    });
    $('.input-daterange').datepicker({
        todayHighlight: true
    });
    $('#datepicker-disabled-past').datepicker({
        todayHighlight: true
    });
    $('#datepicker-autoClose').datepicker({
        todayHighlight: true,
        autoclose: true
    });
};

var handleIonRangeSlider = function() {
    "use strict";
    
    $('#default_rangeSlider').ionRangeSlider({
        min: 0,
        max: 5000,
        type: 'double',
        prefix: "$",
        maxPostfix: "+",
        prettify: false,
        hasGrid: true
    });
    $('#customRange_rangeSlider').ionRangeSlider({
        min: 1000,
        max: 100000,
        from: 30000,
        to: 90000,
        type: 'double',
        step: 500,
        postfix: " €",
        hasGrid: true
    });
    $('#customValue_rangeSlider').ionRangeSlider({
        values: [
            'January', 'February', 'March',
            'April', 'May', 'June',
            'July', 'August', 'September',
            'October', 'November', 'December'
        ],
        type: 'single',
        hasGrid: true
    });
};

var handleFormMaskedInput = function() {
    "use strict";
    
    $("#masked-input-date").mask("99/99/9999");
    $("#masked-input-phone").mask("999-999-9999");
    $("#masked-input-tid").mask("99-9999999");
    $("#masked-input-ssn").mask("999-99-9999");
    $("#masked-input-pno").mask("aaa-9999-a");
    $("#masked-input-pkey").mask("a*-999-a999");
};

var handleFormColorPicker = function () {
    "use strict";
    
    $('#colorpicker').colorpicker({format: 'hex'});
    $('#colorpicker-prepend').colorpicker({format: 'hex'});
    $('#colorpicker-rgba').colorpicker();
};

var handleFormTimePicker = function () {
    "use strict";
    
    $('#timepicker').timepicker();
};

var handleFormPasswordIndicator = function() {
    "use strict";
    
    $("#password-strength").strength({
        strengthClass: 'strength form-control m-b-5',
        strengthMeterClass: 'strength_meter',
        strengthButtonClass: 'button_strength',
        strengthButtonText: 'Show password',
        strengthButtonTextToggle: 'Hide Password'
    });

    $("#password-strength-2").strength({
        strengthClass: 'strength form-control m-b-5',
        strengthMeterClass: 'strength_meter-2',
        strengthButtonClass: 'button_strength-2',
        strengthButtonText: 'Show password',
        strengthButtonTextToggle: 'Hide Password'
    });
};

var handleJqueryAutocomplete = function() {
    "use strict";
    
    var availableTags = [
        'ActionScript',
        'AppleScript',
        'Asp',
        'BASIC',
        'C',
        'C++',
        'Clojure',
        'COBOL',
        'ColdFusion',
        'Erlang',
        'Fortran',
        'Groovy',
        'Haskell',
        'Java',
        'JavaScript',
        'Lisp',
        'Perl',
        'PHP',
        'Python',
        'Ruby',
        'Scala',
        'Scheme'
    ];
    $('#jquery-autocomplete').autocomplete({
        source: availableTags
    });
};

var handleBootstrapCombobox = function() {
    "use strict";
    
    $('.combobox').combobox();
};

var handleTagsInput = function() {
    "use strict";
    
    $('.bootstrap-tagsinput input').focus(function() {
        $(this).closest('.bootstrap-tagsinput').addClass('bootstrap-tagsinput-focus');
    });
    $('.bootstrap-tagsinput input').focusout(function() {
        $(this).closest('.bootstrap-tagsinput').removeClass('bootstrap-tagsinput-focus');
    });
};

var handleSelectpicker = function() {
    "use strict";
    
    $('.selectpicker').selectpicker('render');
};

var handleJqueryTagIt = function() {
    "use strict";
    
    $('#jquery-tagIt-default').tagit({
        availableTags: ["c++", "java", "php", "javascript", "ruby", "python", "c"]
    });
    $('#jquery-tagIt-inverse').tagit({
        availableTags: ["c++", "java", "php", "javascript", "ruby", "python", "c"]
    });
    $('#jquery-tagIt-white').tagit({
        availableTags: ["c++", "java", "php", "javascript", "ruby", "python", "c"]
    });
    $('#jquery-tagIt-primary').tagit({
        availableTags: ["c++", "java", "php", "javascript", "ruby", "python", "c"]
    });
    $('#jquery-tagIt-info').tagit({
        availableTags: ["c++", "java", "php", "javascript", "ruby", "python", "c"]
    });
    $('#jquery-tagIt-success').tagit({
        availableTags: ["c++", "java", "php", "javascript", "ruby", "python", "c"]
    });
    $('#jquery-tagIt-warning').tagit({
        availableTags: ["c++", "java", "php", "javascript", "ruby", "python", "c"]
    });
    $('#jquery-tagIt-danger').tagit({
        availableTags: ["c++", "java", "php", "javascript", "ruby", "python", "c"]
    });
};

var handleDateRangePicker = function() {
    "use strict";
    
    $('#default-daterange').daterangepicker({
        opens: 'right',
        format: 'YYYY-MM-DD',
        separator: ' to ',
        startDate: moment().subtract('days', 29),
        endDate: moment(),
        minDate: '2016-01-01',
        maxDate: '2019-12-28',
    },
    function (start, end) {
        $('#default-daterange input').val(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    });


    $('#advance-daterange span').html(moment().subtract('days', 29).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

    $('#advance-daterange').daterangepicker({
        format: 'MM/DD/YYYY',
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2015',
        dateLimit: { days: 60 },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'right',
        drops: 'down',
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-primary',
        cancelClass: 'btn-default',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            cancelLabel: 'Cancel',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
    }, function(start, end, label) {
        $('#advance-daterange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    });
    
    $('#daterange-singledate').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true
    }, 
    function(start, end, label) {
        //var years = moment().diff(start, 'years');
        //alert("You are " + years + " years old.");
    });
};

var handleSelect2 = function() {
    "use strict";
    
    $(".default-select2").select2();
    $(".multiple-select2").select2({ placeholder: "Select a state" });
};

var handleDateTimePicker = function() {
    "use strict";
    
    $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker({
        format: 'LT'
    });
    $('#datetimepicker3').datetimepicker();
    $('#datetimepicker4').datetimepicker();
    $("#datetimepicker3").on("dp.change", function (e) {
        $('#datetimepicker4').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepicker4").on("dp.change", function (e) {
        $('#datetimepicker3').data("DateTimePicker").maxDate(e.date);
    });
};


/* Application Controller
------------------------------------------------ */
var FormDemo = function () {
	"use strict";
	
	return {
        //main function
        /*
            handleDatepicker();
            handleIonRangeSlider();
            handleFormColorPicker();
            handleFormTimePicker();
            handleJqueryAutocomplete();
            handleBootstrapCombobox();
            handleDateTimePicker();
            handleTagsInput();
            handleJqueryTagIt();
            handleSelectpicker();
            handleSelect2();
            handleDateRangePicker();
        */
		init: function () {
            handleDatepicker();
            //handleDateRangePicker();
            handleFormMaskedInput();
            handleFormPasswordIndicator();
		}
    };
}();