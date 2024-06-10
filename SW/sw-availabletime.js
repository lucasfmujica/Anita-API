function Available_Times_Display(ClinicId, TargetURL) {


  // run if any containers exists on this page

  if (jQuery('.available_times_container').length) {


    // add loader to DOM

    jQuery('.available_times_container .btn').html('<i class="sw_loader available_times_loader"></i>');


    var element_class;

    var start_time = new Date().getTime();
    var start_time_aid = new Date().getTime();

    var fetch_from = custom_dates(0);
    var fetch_to = custom_dates(5);
    var fetch_clinic_id = ClinicId;

    if (TargetURL.length) {
      var target_url = TargetURL;
      var target_class = 'open_target';
    } else {
      var target_url = "";
      var target_class = "sideview";
    }


    jQuery.ajax({
      type: "GET",
      url: "https://patientapi.anitadental.no/api/appointments/appointmenttypes/" + fetch_clinic_id + "",
      success: function (data) {

        data.data.map((obj, i) => {

          // console.log(""+obj.id+"")
          // console.log(obj.id);
          // console.log(obj.clinicId);
          // console.log(obj.name);
          // console.log(obj.price);
          // console.log(obj.description);
          // console.log(obj.teamIds);



          // respons time (ms)
          // var request_time_aid = new Date().getTime() - start_time_aid;
          // jQuery(".clock_aid").html(request_time_aid);



          var fetch_appointment_id = obj.id;
          var fetch_name = obj.name;
          var fetch_price = obj.price;



          jQuery.ajax({
            type: "GET",
            url: "https://patientapi.anitadental.no/api/appointments/availabletimes/week?startDate=" + fetch_from + "T00:00:00.000Z&endDate=" + fetch_to + "T23:00:00.000Z&bookingType=" + fetch_appointment_id + "&clinicid=" + fetch_clinic_id + "",
            success: function (data) {


              var counter = 0;
              var class_element;

              data.data.forEach(function (item) {



                var unique_id = makeid(10);


                // console.log(item.date);
                // console.log(item.timeranges);

                item.timeranges.forEach(function (item_nested) {

                  counter++;

                  // identify cta button 1 and 2
                  if (counter === 1) { class_element = 'first'; } else if (counter === 2) { class_element = 'second'; }

                  if (counter <= 2) {

                    // format item.date to Y-m-d
                    var item_date_format = date_ymd(item.date);


                    data_datestring = '' + custom_day(item.date) + '.' + custom_month(item.date) + '';
                    data_daystring = '' + custom_weekday(item.date) + '';

                    html_dateandday = '<div class="dateandday">' + data_daystring.toLowerCase().slice(0, 3) + ' ' + data_datestring + '</div>';
                    html_thetime = '<div class="thetime">' + item_nested.times.slice(0, 5) + '</div>';

                    console.log(fetch_appointment_id + ": " + item.date + " - format: " + item_date_format + "- " + item_nested.userId + " - " + item_nested.times);

                    // available times cta
                    jQuery('.available_times_container[data-aid="' + fetch_appointment_id + '"] .btn[data-class="' + class_element + '"]').addClass(target_class).attr('data-cid', ClinicId).attr('data-name', fetch_name).attr('data-price', fetch_price).attr('data-target-url', target_url).attr('data-uid', unique_id).attr('data-page-url', window.location.href).attr('data-source', 'cta_times').attr('data-time', item_nested.times.slice(0, 5)).attr('data-date', item_date_format).attr('data-date-no', item.date).attr('data-userid', item_nested.userId).attr('data-times', item_nested.times).attr('data-aid', fetch_appointment_id).attr('data-datestring', data_datestring).attr('data-daystring', data_daystring).html('<div class="display_bl">' + html_dateandday + '' + html_thetime + '</div>');



                  }

                  // display all cta
                  jQuery('.available_times_container[data-aid="' + fetch_appointment_id + '"] .btn[data-class="all"]').addClass(target_class).attr('data-cid', ClinicId).attr('data-name', fetch_name).attr('data-price', fetch_price).attr('data-target-url', target_url).attr('data-uid', unique_id).attr('data-page-url', window.location.href).attr('data-source', 'cta_showall').attr('data-aid', fetch_appointment_id).html('Flere timer');



                });



              });


              // respons time (ms)
              var request_time = new Date().getTime() - start_time;
              request_time_seconds = (request_time / 1000);
              // jQuery(".clock").html(""+request_time_seconds.toFixed(2)+" sekunder");

              // date and response time check
              console.log(fetch_from + " - " + fetch_to + " in " + request_time_seconds.toFixed(2) + " s");



            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(jqXHR.status);
            },
            dataType: "json",
          });


        }); // nested loop

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.status);
      },
      dataType: "json",



    });

  } else {

    // console.log("no av-times container");

  }


  return true;

}
