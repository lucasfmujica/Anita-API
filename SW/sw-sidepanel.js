
// if open_target, redirect to URL



jQuery(document).on("click", ".open_target", function (e) {



  var target_url = jQuery(this).attr('data-target-url');
  var target_aid = jQuery(this).attr('data-aid');
  var target_userid = jQuery(this).attr('data-userid');
  var target_date = jQuery(this).attr('data-date');
  var target_time = jQuery(this).attr('data-time');
  var target_class = jQuery(this).attr('data-class');
  var target_refurl = jQuery(this).attr('data-page-url');

  if (target_class == 'all') {

    window.open(target_url + '?booking=' + target_aid + '&data-refurl=' + target_refurl + '', '_blank');

  } else {

    window.open(target_url + '?booking=' + target_aid + '&time=' + target_time + '&dentist=' + target_userid + '&date=' + target_date + '&data-refurl=' + target_refurl + '', '_blank');

  }

  return true;


});




// if open sideview panel

jQuery(document).on("click", ".sideview, .trigger_select_dentist, .trigger_clear_dentist", function (e) {

  // clear container

  if (jQuery(this).attr('data-dentist-sel') == '1') {  // dentist select

    jQuery('.dentist_container_sideview').animate({ "right": '-1180px' });
    // jQuery(".dentist_container_sideview").fadeOut();
    jQuery('.sideview_panel').append('<i class="sw_loader"></i>');
    jQuery('.calendar_week_container').addClass('pointerevents_filter');

    var dataclass = 'all';
    var data_label = jQuery(this).attr('data-label');
    var target_username = jQuery(this).attr('data-username');
    var target_aid = jQuery(this).attr('data-bookingtype');
    var target_dentist_selected = '1';


  } else {        // from available times-container (or clear all dentist)


    var dataclass = jQuery(this).attr('data-class');
    var data_label = jQuery(this).parent().attr('data-label');

    if (jQuery(this).attr('data-clear') == '1') {
      var target_aid = jQuery(this).attr('data-bookingtype');
      jQuery('.sideview_panel').append('<i class="sw_loader"></i>');
      jQuery('.calendar_week_container').addClass('pointerevents_filter');
    } else {
      var target_aid = jQuery(this).attr('data-aid');
      jQuery('.sideview_panel').animate({ "right": '0' });
      jQuery(".sideview_panel").html('<i class="sw_loader"></i>');
    }
    var target_dentist_selected = '';



  }





  var target_userid = jQuery(this).attr('data-userid');
  var target_date = jQuery(this).attr('data-date');
  var target_date_no = jQuery(this).attr('data-date-no');
  var target_time = jQuery(this).attr('data-time');
  var target_times = jQuery(this).attr('data-times');
  var target_class = jQuery(this).attr('data-class');
  var target_source = jQuery(this).attr('data-source');


  var target_name = jQuery(this).attr('data-name');
  var target_price = jQuery(this).attr('data-price');



  var target_useragent = window.navigator.userAgent;
  var target_conv_group = '';
  var db_product = '';
  var target_source = jQuery(this).attr('data-source');

  var target_pageurl = jQuery(this).attr('data-page-url');

  var target_username = jQuery(this).attr('data-username');
  var target_usertitle = jQuery(this).attr('data-dentist-title');
  var target_userimage = jQuery(this).attr('data-dentist-imagesrc');

  var fetch_clinic_id = jQuery(this).attr('data-cid');
  var fetch_from = custom_dates(0);
  var fetch_to = custom_dates(60);


  if (getUrlParameter('data-refurl') == '') {
    var target_refurl = jQuery(this).attr('data-page-url');  // in sideview, refer url is the same as current url
  } else {
    var target_refurl = getUrlParameter('data-refurl');   // on bookingpage - the refer url is in the URL as a GET-param (when clicked on top CTA)
  }


  var append_Html_elements = "";

  jQuery.ajax({
    type: "GET",
    url: "https://patientapi.anitadental.no/api/appointments/appointmenttypes/" + fetch_clinic_id + "",
    success: function (data) {

      data.data.map((obj, i) => {
        if (obj.id == target_aid) {

          // iterate all the dates 60 days ahead

          if (target_dentist_selected == '1') {   // dentist selected
            var fetchurl = "https://patientapi.anitadental.no/api/appointments/availabletimes/week?startDate=" + fetch_from + "T00:00:00.000Z&endDate=" + fetch_to + "T23:00:00.000Z&bookingType=" + obj.id + "&clinicid=" + fetch_clinic_id + "&userid=" + target_userid + "";
          } else {
            var fetchurl = "https://patientapi.anitadental.no/api/appointments/availabletimes/week?startDate=" + fetch_from + "T00:00:00.000Z&endDate=" + fetch_to + "T23:00:00.000Z&bookingType=" + obj.id + "&clinicid=" + fetch_clinic_id + "";
          }
          jQuery.ajax({
            type: "GET",
            url: fetchurl,
            success: function (data) {

              var counter = 0;
              var item_date_format;
              var checked_button_class;

              data.data.forEach(function (item) {

                var isLastElement = data.data.length;

                var today_class = ''; var today_name_sunday = '';
                counter++;

                if (counter == 1) {



                  append_Html_elements += '<div class="title">' + obj.name + '</div><div class="price">Kr ' + obj.price + '</div><div class="desc">' + obj.description + '</div>';
                  // build data-attributes
                  // find teamIds
                  var data_attr_teamids = "";
                  obj.teamIds.forEach(function (item_nested_teamids) {

                    data_attr_teamids += '' + item_nested_teamids + ',';

                  });
                  data_attr_teamids = data_attr_teamids.slice(0, -1);   // remove last semikolon


                  var data_attributes = 'data-teamids="' + data_attr_teamids + '" data-label="' + data_label + '" data-cid="' + fetch_clinic_id + '" data-name="' + target_name + '" data-price="' + target_price + '" data-dentist-sel="' + target_dentist_selected + '" data-conv-group="' + target_conv_group + '" data-page-url="' + target_pageurl + '" data-page-step="3" data-page-useragent="' + target_useragent + '" data-bookingtype="' + target_aid + '" data-referurl="' + target_refurl + '" data-source="' + target_source + '"';

                  if (target_dentist_selected == '1') {
                    var display_all_dentist_container = '<div class="dentist_container_clear trigger_clear_dentist" data-clear="1" data-class="all" ' + data_attributes.replace('data-dentist-sel="1"', 'data-dentist-sel=""') + '>Velg alle behandlere</div>';


                    if (target_userimage == '') {
                      photoUrl = '<div class="noimage"></div>';

                    } else {
                      photoUrl = '<img src="' + target_userimage + '" />';

                    }
                    var display_dentist_details = '<div class="dentist_selected_container">' + photoUrl + '<div class="dentist_details">' + target_username + '<span>' + target_usertitle + '</span></div></div>';
                  } else {
                    var display_all_dentist_container = '';
                    display_dentist_details = '';
                  }
                  append_Html_elements += '<div class="dentist_container" ' + data_attributes + '>Velg behandler</div><div class="dentist_container_sideview"></div>' + display_dentist_details + '' + display_all_dentist_container + '';

                  // open calendar container
                  append_Html_elements += '<div class="calendar_fullcontainer"><div class="prev_slide" data-groupid="1"><span style="left: 5px;"><</span></div><div class="next_slide" data-groupid="1"><span style="right: 5px;">></span></div>';
                  // open calendar week container
                  append_Html_elements += '<div class="calendar_week_container">';


                }


                data_datestring = '' + custom_day(item.date) + '.' + custom_month(item.date) + '';
                data_daystring = '' + custom_weekday(item.date) + '';



                append_Html_elements += '<div data-date="' + item_date_format + '" class="d ' + today_class + ' ' + today_name_sunday + '" id="slidegroup_' + counter + '">' + custom_day(item.date) + '.' + custom_month(item.date) + '<span>' + custom_weekday(item.date) + '</span>';

                item.timeranges.forEach(function (item_nested) {
                  var key_time = item_nested.times.slice(0, 5);

                  // format item.date to Y-m-d
                  item_date_format = date_ymd(item.date);

                  if (item_date_format === target_date && key_time == target_time) { checked_button_class = 'checked_time'; } else { checked_button_class = 'inget'; }
                  append_Html_elements += '<div class="e ' + checked_button_class + ' trigger_select_time"  data-label="' + data_label + '" data-cid="' + fetch_clinic_id + '" data-name="' + obj.name + '" data-price="' + obj.price + '" data-dentist-sel="' + target_dentist_selected + '" data-conv-group="' + target_conv_group + '" data-page-url="' + window.location.href + '" data-page-step="1" data-page-useragent="' + target_useragent + '" data-date="' + item_date_format + '" data-datestring="' + data_datestring + '" data-daystring="' + data_daystring + '" data-time="' + item_nested.times.slice(0, 5) + '" data-times="' + item_nested.times + '" data-bookingtype="' + obj.id + '" data-product="' + db_product + '" data-referurl="' + target_refurl + '" data-userid="' + item_nested.userId + '" data-source="' + target_source + '">' + item_nested.times.slice(0, 5) + '</div>';

                });

                append_Html_elements += '</div>';


                if (counter == isLastElement) {

                  // close calendar week container
                  append_Html_elements += '</div>';
                  // close calendar container
                  append_Html_elements += '</div>';



                  // append results to container once

                  jQuery(".sideview_panel").html('<div class="close step1">X</div><div class="calendar_container_sticky"></div><div class="sideview_panel_innerdata fade-in">' + append_Html_elements + '</div>');
                  jQuery('.calendar_week_container').removeClass('pointerevents_filter');
                  // append calendar sticky if timerange is selected


                  if (dataclass === 'all') {  // nothing, do not load sticky
                  } else {



                    jQuery(".calendar_container_sticky").html('');

                    jQuery('.trigger_select_time').each(function (i, obj) {
                      jQuery(this).removeClass('checked');
                    });
                    jQuery(this).addClass('checked');


                    if (jQuery('.calendar_container_sticky').hasClass('container_is_visible')) {

                      jQuery('.calendar_container_sticky').slideUp(300);
                      jQuery('.calendar_container_sticky').removeClass('container_is_visible');
                      jQuery('.calendar_container_sticky').slideDown(300);
                      jQuery('.calendar_container_sticky').addClass('container_is_visible');

                    } else {

                      jQuery('.calendar_container_sticky').slideDown(300);
                      jQuery('.calendar_container_sticky').addClass('container_is_visible');

                    }

                    jQuery(".calendar_container_sticky").append('<i class="sw_loader"></i>');
                    jQuery(".calendar_container_sticky").css('display', 'flex');





                    jQuery(".calendar_container_sticky").append('<i class="sw_loader"></i>');

                    jQuery(".calendar_container_sticky").css('display', 'flex');









                    var append_Html_elements_sticky = "";


                    var v_date = target_date;
                    var v_time = target_time;
                    var v_times = target_times;
                    var v_userid = target_userid;

                    var v_source = target_source;
                    var v_pageurl = target_pageurl;
                    var v_useragent = target_useragent;
                    var v_convgroup = target_conv_group;

                    var v_dentist_selected = '';
                    var v_refurl = target_refurl;
                    var v_name = target_name;
                    var v_price = target_price;


                    data_datestring_sticky = '' + custom_day(target_date_no) + '.' + custom_month(target_date_no) + '';
                    data_daystring_sticky = '' + custom_weekday(target_date_no) + '';



                    jQuery.ajax({
                      type: "GET",
                      url: "https://patientapi.anitadental.no/api/appointments/appointmenttypes/" + fetch_clinic_id + "",
                      success: function (data) {

                        data.data.map((obj_sticky, i) => {
                          if (obj_sticky.id == target_aid) {

                            append_Html_elements_sticky += '<div class="ticket">';

                            append_Html_elements_sticky += '<div id="dialog_slidein_stickydata" style="" class="displayflex-sticky fade-in">';

                            append_Html_elements_sticky += '<div class="ticket_container_top">';

                            append_Html_elements_sticky += '<div class="a">' + data_daystring_sticky.toLowerCase() + ' ' + data_datestring_sticky + '<span class="a1">' + v_time + '</span></div>';
                            append_Html_elements_sticky += '<div class="b">' + obj_sticky.name + '<span class="b1">Kr ' + obj_sticky.price + '</span></div>';

                            append_Html_elements_sticky += '</div>';

                            append_Html_elements_sticky += '<div class="ticket_container_dentist">';

                            append_Html_elements_sticky += '<div class="a">';
                            append_Html_elements_sticky += '<img class="fade-in" src="" />';
                            append_Html_elements_sticky += '</div>';

                            append_Html_elements_sticky += '<div class="b"></div>';

                            append_Html_elements_sticky += '</div>';

                            append_Html_elements_sticky += '<div class="ticket_container_button">';
                            append_Html_elements_sticky += '<div class="button trigger_select_booking" data-label="' + data_label + '" data-cid="' + fetch_clinic_id + '" data-name="' + v_name + '" data-price="' + v_price + '" data-dentist-sel="' + v_dentist_selected + '" data-conv-group="' + v_convgroup + '" data-page-url="' + v_pageurl + '" data-page-step="2" data-page-useragent="' + v_useragent + '" data-date="' + v_date + '" data-datestring="' + data_datestring_sticky + '" data-daystring="' + data_daystring_sticky + '" data-time="' + v_time + '" data-times="' + v_times + '" data-bookingtype="' + target_aid + '" data-referurl="' + v_refurl + '" data-userid="' + v_userid + '" data-username="" data-source="' + v_source + '"><span class="sw_loader" id="button_press"></span>Book time<i class="fal fa-chevron-right"></i></div>';
                            append_Html_elements_sticky += '</div>';

                            append_Html_elements_sticky += '</div><div class="calendar_container_sticky_register_notes"></div><div id="manualregistration_container"></div><div id="term_options_container"><div class="calendar_container_sticky_register_terms"></div><div class="calendar_container_sticky_register_options"></div></div>';

                            append_Html_elements_sticky += '</div>';

                            // find the dentist by id
                            jQuery.ajax({
                              type: "GET",
                              url: "https://patientapi.anitadental.no/api/dictionary/dentists?clinicId=" + fetch_clinic_id + "",
                              success: function (data) {
                                data.data.map((obj_dentist, i_dentist) => {
                                  if (obj_dentist.id == v_userid) {
                                    jQuery(".ticket_container_dentist .b").html('' + obj_dentist.name + '<span>' + obj_dentist.title + '</span>');
                                    if (obj_dentist.photoURL === null) {
                                      jQuery(".ticket_container_dentist img").remove();
                                    } else {
                                      jQuery(".ticket_container_dentist img").attr("src", "https://anitablobprod.blob.core.windows.net/blobphoto/" + obj_dentist.photoURL + "");
                                    }
                                    jQuery(".trigger_select_booking").attr("data-username", obj_dentist.name);
                                  }
                                });
                              },
                              error: function (jqXHR, textStatus, errorThrown) {
                                console.log(jqXHR.status);
                              },
                              dataType: "json",
                            });


                            // append results to container once


                            jQuery(".calendar_container_sticky").html('' + append_Html_elements_sticky + '');





                          }
                        });




                      },
                      error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR.status);
                      },
                      dataType: "json",
                    });

                  } // data class

                }




              });
            }
          });


        }
      });




    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.status);
    },
    dataType: "json",
  });








});

jQuery(document).on("click", ".sideview_panel .close.step1", function (e) {


  jQuery('.sideview_panel').animate({ "right": '-1180px' });
  jQuery(".sideview_panel").html('');

  // Check available times
  Available_Times_Display(1, '');

});




// trigger_select_time



jQuery(document).on("click", ".trigger_select_time", function (e) {


  jQuery(".calendar_container_sticky").html('');

  jQuery('.trigger_select_time').each(function (i, obj) {
    jQuery(this).removeClass('checked');
  });
  jQuery('.trigger_select_time').each(function (i, obj) {
    jQuery(this).removeClass('checked_time');
  });
  jQuery(this).addClass('checked');


  if (jQuery('.calendar_container_sticky').hasClass('container_is_visible')) {

    jQuery('.calendar_container_sticky').slideUp(300);
    jQuery('.calendar_container_sticky').removeClass('container_is_visible');


    jQuery('.calendar_container_sticky').slideDown(300);
    jQuery('.calendar_container_sticky').addClass('container_is_visible');




  } else {


    jQuery('.calendar_container_sticky').slideDown(300);
    jQuery('.calendar_container_sticky').addClass('container_is_visible');


  }

  jQuery(".calendar_container_sticky").append('<i class="sw_loader"></i>');

  jQuery(".calendar_container_sticky").css('display', 'flex');

  var append_Html_elements = "";

  var target_aid = jQuery(this).attr('data-bookingtype');
  var fetch_clinic_id = jQuery(this).attr('data-cid');
  var v_step = '2';
  var v_product = '';
  var v_saleprice = jQuery(this).attr('data-saleprice');
  var v_date = jQuery(this).attr('data-date');
  var v_time = jQuery(this).attr('data-time');
  var v_times = jQuery(this).attr('data-times');
  var v_userid = jQuery(this).attr('data-userid');
  var v_ref = jQuery(this).attr('data-ref');
  var v_source = jQuery(this).attr('data-source');
  var v_pageurl = jQuery(this).attr('data-page-url');
  var v_useragent = jQuery(this).attr('data-page-useragent');
  var v_convgroup = jQuery(this).attr('data-conv-group');
  var v_datestring = jQuery(this).attr('data-datestring');
  var v_daystring = jQuery(this).attr('data-daystring');
  var v_dentist_selected = jQuery(this).attr('data-dentist-sel');
  var v_refurl = jQuery(this).attr('data-referurl');
  var v_name = jQuery(this).attr('data-name');
  var v_price = jQuery(this).attr('data-price');
  var data_label = jQuery(this).attr('data-label');



  jQuery.ajax({
    type: "GET",
    url: "https://patientapi.anitadental.no/api/appointments/appointmenttypes/" + fetch_clinic_id + "",
    success: function (data) {

      data.data.map((obj, i) => {
        if (obj.id == target_aid) {

          append_Html_elements += '<div class="ticket">';

          append_Html_elements += '<div id="dialog_slidein_stickydata" style="" class="displayflex-sticky fade-in">';

          append_Html_elements += '<div class="ticket_container_top">';

          append_Html_elements += '<div class="a">' + v_datestring + ' ' + v_daystring.toLowerCase() + '<span class="a1">' + v_time + '</span></div>';
          append_Html_elements += '<div class="b">' + obj.name + '<span class="b1">Kr ' + obj.price + '</span></div>';

          append_Html_elements += '</div>';

          append_Html_elements += '<div class="ticket_container_dentist">';

          append_Html_elements += '<div class="a">';
          append_Html_elements += '<img class="fade-in" src="" />';
          append_Html_elements += '</div>';

          append_Html_elements += '<div class="b"></div>';

          append_Html_elements += '</div>';

          append_Html_elements += '<div class="ticket_container_button">';
          append_Html_elements += '<div class="button trigger_select_booking" data-label="' + data_label + '" data-cid="' + fetch_clinic_id + '" data-name="' + v_name + '" data-price="' + v_price + '" data-dentist-sel="' + v_dentist_selected + '" data-conv-group="' + v_convgroup + '" data-page-url="' + v_pageurl + '" data-page-step="2" data-page-useragent="' + v_useragent + '" data-date="' + v_date + '" data-datestring="' + v_datestring + '" data-daystring="' + v_daystring + '" data-time="' + v_time + '" data-times="' + v_times + '" data-bookingtype="' + target_aid + '" data-referurl="' + v_refurl + '" data-userid="' + v_userid + '" data-username="" data-source="' + v_source + '"><span class="sw_loader" id="button_press"></span>Book time<i class="fal fa-chevron-right"></i></div>';
          append_Html_elements += '</div>';

          append_Html_elements += '</div><div class="calendar_container_sticky_register_notes"></div><div id="manualregistration_container"></div><div id="term_options_container"><div class="calendar_container_sticky_register_terms"></div><div class="calendar_container_sticky_register_options"></div></div>';

          append_Html_elements += '</div>';

          // find the dentist by id
          jQuery.ajax({
            type: "GET",
            url: "https://patientapi.anitadental.no/api/dictionary/dentists?clinicId=" + fetch_clinic_id + "",
            success: function (data) {
              data.data.map((obj_dentist, i_dentist) => {
                if (obj_dentist.id == v_userid) {
                  jQuery(".ticket_container_dentist .b").html('' + obj_dentist.name + '<span>' + obj_dentist.title + '</span>');
                  if (obj_dentist.photoURL === null) {
                    jQuery(".ticket_container_dentist img").remove();
                  } else {
                    jQuery(".ticket_container_dentist img").attr("src", "https://anitablobprod.blob.core.windows.net/blobphoto/" + obj_dentist.photoURL + "");
                  }
                  jQuery(".trigger_select_booking").attr("data-username", obj_dentist.name);
                }
              });
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(jqXHR.status);
            },
            dataType: "json",
          });


          // append results to container once


          jQuery(".calendar_container_sticky").html('' + append_Html_elements + '');





        }
      });




    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.status);
    },
    dataType: "json",
  });


});


// trigger_select_booking

jQuery(document).on("click", ".trigger_select_booking", function (e) {




  var target_aid = jQuery(this).attr('data-bookingtype');
  var fetch_clinic_id = jQuery(this).attr('data-cid');
  var v_date = jQuery(this).attr('data-date');
  var v_time = jQuery(this).attr('data-time');
  var v_times = jQuery(this).attr('data-times');
  var v_userid = jQuery(this).attr('data-userid');
  var v_username = jQuery(this).attr('data-username');
  var v_ref = jQuery(this).attr('data-ref');
  var v_source = jQuery(this).attr('data-source');
  var v_pageurl = jQuery(this).attr('data-page-url');
  var v_useragent = jQuery(this).attr('data-page-useragent');
  var v_convgroup = jQuery(this).attr('data-conv-group');
  var v_datestring = jQuery(this).attr('data-datestring');
  var v_daystring = jQuery(this).attr('data-daystring');
  var v_dentist_selected = jQuery(this).attr('data-dentist-sel');
  var v_refurl = jQuery(this).attr('data-referurl');
  var v_name = jQuery(this).attr('data-name');
  var v_price = jQuery(this).attr('data-price');
  var data_label = jQuery(this).attr('data-label');

  jQuery('.calendar_container_sticky').addClass('scroll_overflow');

  jQuery('.calendar_container_sticky').animate({ "height": '100vh' }).css('align-items', 'flex-start');
  jQuery('.ticket_container_button').hide();
  // jQuery('.calendar_container_sticky').css('padding-top','30px');
  jQuery('.ticket_container_dentist').css('margin-left', 'auto');
  // jQuery('#dialog_slidein_stickydata').css('padding','20px').css('border','1px solid #ddd').css('border-radius','10px').css('box-shadow','0 2px 12px 1px rgb(0 0 0/20%)');
  jQuery('#dialog_slidein_stickydata').css('margin-bottom', '30px');



  // change class on close-button
  jQuery('.sideview_panel .close').removeClass('step1');
  jQuery('.sideview_panel .close').addClass('step2');

  // display notes, terms and register options containers


  append_Html_elements_notes = '<textarea data-page-url="' + v_pageurl + '" data-bookingtype="' + target_aid + '" data-date="' + v_date + '" data-times="' + v_times + '" data-userid="' + v_userid + '" data-ref="' + v_ref + '" data-source="' + v_source + '" class="notes" id="notes" placeholder="Legg igjen en beskjed til tannlegen her om Ã¸nskelig"></textarea>';

  append_Html_elements = '';
  append_Html_elements += '<div id="check_error_registration_terms" class="global_formerror" style="display: none;">Du mÃ¥ godkjenne avtalevilkÃ¥rene for Ã¥ fortsette</div>';
  append_Html_elements += '<div class="checkbox_container"><div class="a"><input type="checkbox" value="1" id="acceptterms" class="default_cb"></div><div class="b"><label><span id="terms" class="">Ja, jeg har lest og forstÃ¥tt avbestillingsvilkÃ¥rene <i class="fal fa-chevron-up"></i></span></label></div></div>';
  append_Html_elements += '<div class="terms_container" style="display: none;"><ol>';

  append_Html_elements += '<li>Avlysning/endring av avtale mÃ¥ gjÃ¸res&nbsp;per telefon&nbsp;hverdager i Ã¥pningstiden kl. 8-20 mandag til lÃ¸rdag.</li>';
  append_Html_elements += '<li>Flytting&nbsp;av time mÃ¥ skje&nbsp;minst 24 timer&nbsp;fÃ¸r avtalen for Ã¥ unngÃ¥ Ã¥ mÃ¥tte betale 70 % av den oppsatte timens honorar.</li>';
  append_Html_elements += '<li>Avlysning&nbsp;av time mÃ¥ skje&nbsp;minst 48 timer&nbsp;fÃ¸r avtalen for Ã¥ unngÃ¥ Ã¥ mÃ¥tte betale 70 % av den oppsatte timens honorar.</li>';
  append_Html_elements += '<li>Avlysning er dessverre&nbsp;ikke mulig pÃ¥ sÃ¸ndager og helligdager&nbsp;da resepsjonen ikke alltid er bemannet under slike dager. VÃ¦r derfor oppmerksom pÃ¥ telefonÃ¥pningstidene hvis du har time en mandag eller pÃ¥ kveldstid.</li>';
  append_Html_elements += '<li>Ved&nbsp;ikke-mÃ¸tt eller for sen&nbsp;avtaleendring mÃ¥ du betale 70 % av honoraret for avsatt tid.</li>';
  append_Html_elements += '<li>Blir du&nbsp;10 min eller mer forsinket, ber vi deg ringe og si fra. Klinikken har da anledning til Ã¥ vurdere om avtalen mÃ¥ flyttes.</li>';
  append_Html_elements += '<li>Du har selv&nbsp;ansvar for Ã¥ bestille ny time&nbsp;om du ikke stiller til oppsatt time.</li>';
  append_Html_elements += '<li>Ved&nbsp;ikke-mÃ¸tt pÃ¥ gratis konsultasjoner&nbsp;mÃ¥ du betale 299 kr.</li>';
  append_Html_elements += '<li>Ved&nbsp;tannbehandling i narkose&nbsp;mÃ¥ du betale et forskudd pÃ¥ kr 5000. Dette dekker bestilling av eksternt anestesiteam og planleggingstid for behandlingen. Avbestilling mÃ¥ skje minst 7 virkedager fÃ¸r oppsatt time. Da vil pasienten enten fÃ¥ belÃ¸pet tilbakebetalt eller ha det til gode for fremtidig behandling. Forskuddet mistes i sin helhet hvis avtalte timer med narkose som avlyses for sent eller hvis pasienten ikke mÃ¸ter opp.</li>';
  append_Html_elements += '</ol>';

  append_Html_elements += '</div>';



  // build base 64 of json-string
  var data_after_picked_time = { "timerange": "" + v_times + "", "userId": "" + v_userid + "", "date": "" + v_date + "T12:00:00.000Z", "referralCode": "" + v_ref + "", "appointmentTypeId": "" + target_aid + "", "notes": "(Kilde: Vipps-registrering via " + v_pageurl + ")" };

  var e = Base64.encode(JSON.stringify(data_after_picked_time));
  var d = Base64.decode(e);

  // console.log(JSON.stringify(data_after_picked_time));


  // data-attr build
  var data_attributes = 'data-label="' + data_label + '" data-cid="' + fetch_clinic_id + '" data-name="' + v_name + '" data-price="' + v_price + '" data-dentist-sel="' + v_dentist_selected + '" data-conv-group="' + v_convgroup + '" data-page-url="' + v_pageurl + '" data-page-step="3" data-page-useragent="' + v_useragent + '" data-date="' + v_date + '" data-datestring="' + v_datestring + '" data-daystring="' + v_daystring + '" data-time="' + v_time + '" data-times="' + v_times + '" data-bookingtype="' + target_aid + '" data-referurl="' + v_refurl + '" data-userid="' + v_userid + '" data-username="' + v_username + '" data-source="' + v_source + '"';




  append_Html_elements_options = '';
  append_Html_elements_options += '<div data-eid="3" data-bobj="' + e + '" ' + data_attributes + ' class="ticket_container_register trigger_select_register" id="vipps"><img src="https://oslotannlegesenter.no/wp-content/uploads/vipps.png" alt="Vipps"><div class="a1">Vipps<span>Rask og enkel legitimering. Du blir ikke belastet penger.</span></div><div class="a2"><i class="fal fa-chevron-right"></i><i class="sw_loader" id="vipps_button"></i></div></div>';
  append_Html_elements_options += '<div class="ticket_container_register trigger_select_register" id="manuell" ' + data_attributes + '><span class="round"></span><div class="a1">Manuell registrering<span>Fyll ut skjema</span></div><div class="a2"><i class="fal fa-chevron-right"></i></div></div>';

  jQuery(".calendar_container_sticky_register_notes").fadeIn(400).html(append_Html_elements_notes);
  jQuery(".calendar_container_sticky_register_terms").fadeIn(400).html(append_Html_elements);
  jQuery(".calendar_container_sticky_register_options").fadeIn(400).html(append_Html_elements_options);




});


jQuery(document).on("keyup", "textarea#notes", function (e) {

  var notes_form = jQuery(this).val();

  var target_aid = jQuery(this).attr('data-bookingtype');
  var v_date = jQuery(this).attr('data-date');
  var v_times = jQuery(this).attr('data-times');
  var v_userid = jQuery(this).attr('data-userid');
  var v_ref = jQuery(this).attr('data-ref');
  var v_source = jQuery(this).attr('data-source');
  var v_pageurl = jQuery(this).attr('data-page-url');


  // build base 64 of json-string
  var data_after_picked_time = { "timerange": "" + v_times + "", "userId": "" + v_userid + "", "date": "" + v_date + "T12:00:00.000Z", "referralCode": "" + v_ref + "", "appointmentTypeId": "" + target_aid + "", "notes": "" + notes_form + " (Kilde: Vipps-registrering via " + v_pageurl + ")" };

  var e = Base64.encode(JSON.stringify(data_after_picked_time));
  var d = Base64.decode(e);

  // console.log(JSON.stringify(data_after_picked_time));



  jQuery("#vipps.ticket_container_register").attr("data-bobj", e);



});



// trigger_select_register (vipps or manual registration options)


jQuery(document).on("change", "input#acceptterms", function (e) {

  jQuery('#check_error_registration_terms').hide();

});


jQuery(document).on("click", ".ticket_container_register", function (e) {


  if (jQuery("input#acceptterms").is(":not(:checked)")) {

    // general terms not checked, fire error message

    jQuery('#check_error_registration_terms').show();

    // scroll up (important for mobile if term content is visible)
    jQuery('.calendar_container_sticky').animate({ scrollTop: jQuery(".calendar_container_sticky_register_terms").offset().top - 0 }, 'slow');

  } else {



    var target_aid = jQuery(this).attr('data-bookingtype');
    var fetch_clinic_id = jQuery(this).attr('data-cid');
    var v_date = jQuery(this).attr('data-date');
    var v_time = jQuery(this).attr('data-time');
    var v_times = jQuery(this).attr('data-times');
    var v_userid = jQuery(this).attr('data-userid');
    var v_username = jQuery(this).attr('data-username');
    var v_ref = jQuery(this).attr('data-ref');
    var v_source = jQuery(this).attr('data-source');
    var v_pageurl = jQuery(this).attr('data-page-url');
    var v_useragent = jQuery(this).attr('data-page-useragent');
    var v_convgroup = jQuery(this).attr('data-conv-group');
    var v_datestring = jQuery(this).attr('data-datestring');
    var v_daystring = jQuery(this).attr('data-daystring');
    var v_dentist_selected = jQuery(this).attr('data-dentist-sel');
    var v_refurl = jQuery(this).attr('data-referurl');
    var v_name = jQuery(this).attr('data-name');
    var v_price = jQuery(this).attr('data-price');

    var v_eid = jQuery(this).attr('data-eid');
    var v_bobj = jQuery(this).attr('data-bobj');

    var data_label = jQuery(this).attr('data-label');

    // if manual registration, open form container
    if (jQuery(this).attr("id") === 'manuell') {


      // data-attr build
      var data_attributes = 'data-label="' + data_label + '" data-cid="' + fetch_clinic_id + '" data-name="' + v_name + '" data-price="' + v_price + '" data-dentist-sel="' + v_dentist_selected + '" data-conv-group="' + v_convgroup + '" data-page-url="' + v_pageurl + '" data-page-step="3" data-page-useragent="' + v_useragent + '" data-date="' + v_date + '" data-datestring="' + v_datestring + '" data-daystring="' + v_daystring + '" data-time="' + v_time + '" data-times="' + v_times + '" data-bookingtype="' + target_aid + '" data-referurl="' + v_refurl + '" data-userid="' + v_userid + '" data-username="' + v_username + '" data-source="' + v_source + '"';


      jQuery('#term_options_container').hide();

      var birthval = '';
      var phoneval = '+47';
      var sms_code_form = '<div class="formtitle">Skriv inn koden du har mottatt pÃ¥ SMS</div><div id="check_error_manual_registration_sms" class="global_formerror">Gyldig SMS-kode mangler (4 siffer)</div><div id="check_error_manual_registration_sms_json" class="global_formerror">Din SMS-kode er ugyldig/ikke lenger gyldig</div><input type="text" id="manual_form_smscode" maxlength="4" autocomplete="off" class="defaultfields_reg" placeholder="----"><div class="submit_container"><div class="button small trigger_select_manual_step2" ' + data_attributes + ' data-patient-id="" data-patient-mail=""><span class="sw_loader" id="button_press" style="display: none;"></span>Registrer time!<i class="fal fa-chevron-right"></i></div></div></div>';

      jQuery('#manualregistration_container').html('<div class="register_buttons_manual_container"><div class="register_manual_backbutton">Avbryt</div><div id="sms_code_form_container">' + sms_code_form + '</div><div id="persondetails_form_container"><div class="formtitle">FÃ¸dselsnummer *</div><div id="check_error_manual_registration_birth" class="global_formerror">FÃ¸dselsnummer mangler eller er ikke korrekt fyllt ut</div><input type="text" id="manual_form_birth" maxlength="11" autocomplete="off" class="defaultfields_reg" placeholder="DDMMYYXXXXX" value="' + birthval + '"><div class="formtitle">Telefonnummer *</div><div id="check_error_manual_registration_phone" class="global_formerror">Telefonnummer mangler eller er ikke korrekt fyllt ut (husk Ã¥ angi landskode, f eks +47)</div><input value="' + phoneval + '" type="text" id="manual_form_phone" maxlength="15" autocomplete="off" class="defaultfields_reg" value="+47" placeholder=""><div class="formtitle">E-post</div><div id="check_error_manual_registration_mail" class="global_formerror">E-postadresse mangler</div><input type="email" id="manual_form_email" maxlength="100" autocomplete="off" class="defaultfields_reg" value="" placeholder=""><input type="hidden" value="1" id="manual_form_acceptterms"><div class="checkbox_container"><div class="a"><input type="checkbox" value="1" id="manual_form_acceptterms_email" class="default_cb"></div><div class="b"><label for="manual_form_acceptterms_email">Ja, jeg samtykker til nyhetsbrev og tilbud fra Oslo Tannlegesenter</label></div></div><div class="submit_container"><div class="button small trigger_select_manual_step1" ' + data_attributes + '><span class="sw_loader" id="button_press"></span>Fortsett<i class="fal fa-chevron-right"></i></div></div></div></div>').fadeIn(400);


    } else {

      // if vipps registration, redirect

      jQuery('.sideview_panel #vipps_button').show();
      jQuery('.ticket').addClass('pointerevents');



      var v_payment = 'vipps';

      // build convtoken as base64
      var conversion_data_json = { "v_label": "" + data_label + "", "v_payment": "" + v_payment + "", "v_userid": "" + v_userid + "", "v_date": "" + v_date + "", "v_time": "" + v_time + "", "v_bookingtype": "" + target_aid + "", "v_source": "" + v_source + "", "v_convgroup": "" + v_convgroup + "", "v_useragent": "" + v_useragent + "", "v_pageurl": "" + v_pageurl + "", "v_email": "", "v_product": "" + v_name + "", "v_dentist_selected": "" + v_dentist_selected + "", "v_step": "3", "v_userid_name": "" + v_username + "", "v_refurl": "" + v_refurl + "" };
      var conversion_data = Base64.encode(JSON.stringify(conversion_data_json));

      function Base64EncodeUrl(str) {
        return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+jQuery/, '');
      }

      // make the base64 encoded string URL-friendly
      var conversion_data = Base64EncodeUrl(conversion_data);


      window.location.href = "https://booking.anitadental.no/?dname=" + v_username + "&bobj=" + v_bobj + "&eid=" + v_eid + "&clinicid=" + fetch_clinic_id + "&_convtoken=" + conversion_data + "";
      return false;

    }



  }



});


jQuery(document).on("click", ".next_slide", function (e) {



  var leftPos2 = jQuery('.calendar_week_container').scrollLeft();
  var sliderwidth = jQuery('.calendar_week_container').width();
  var sliderwidth = parseInt(sliderwidth) - parseInt('200');

  jQuery(".calendar_week_container").animate({ scrollLeft: leftPos2 + sliderwidth }, 800);



});








jQuery(document).on("click", ".register_manual_backbutton", function (e) {


  jQuery('#term_options_container').fadeIn(400);
  jQuery('#manualregistration_container').hide().html('');



});


jQuery(document).on("click", ".sideview_panel .close.step2", function (e) {


  jQuery('.calendar_container_sticky').removeClass('scroll_overflow');


  jQuery('.calendar_container_sticky').animate({ "height": '220px' }).css('align-items', 'center');
  jQuery('.ticket_container_button').show();
  jQuery('.calendar_container_sticky').css('padding-top', 'auto');
  jQuery('.ticket_container_dentist').css('margin-left', 'unset');
  jQuery('#dialog_slidein_stickydata').css('padding', 'auto').css('border', '0px solid #ddd').css('border-radius', '0').css('box-shadow', 'none');

  // change back class on close-button
  jQuery('.sideview_panel .close').addClass('step1');
  jQuery('.sideview_panel .close').removeClass('step2');

  // close and clear terms and payment options
  jQuery(".calendar_container_sticky_register_notes").hide();
  jQuery(".calendar_container_sticky_register_terms").hide();
  jQuery(".calendar_container_sticky_register_options").hide();


  jQuery('#term_options_container').fadeIn(400);
  jQuery('#manualregistration_container').hide().html('');





});





jQuery(document).on("click", "#terms", function (e) {

  if (jQuery(this).hasClass('active')) {

    jQuery(this).removeClass('active');
    jQuery('.terms_container').slideUp(400);
    jQuery(this).find('i').addClass('fa-chevron-down');
    jQuery(this).find('i').removeClass('fa-chevron-up');

    jQuery('#booking_calendar_module_v4.inline').css('min-height', '600px');
    jQuery('#footer').show();

  } else {

    jQuery(this).addClass('active');
    jQuery('.terms_container').slideDown(400);
    jQuery(this).find('i').addClass('fa-chevron-up');
    jQuery(this).find('i').removeClass('fa-chevron-down');

    jQuery('#booking_calendar_module_v4.inline').css('min-height', '1500px');
    jQuery('#footer').hide();



  }


});

jQuery(document).on("change", "#acceptterms", function (e) {


  if (jQuery("input#acceptterms").is(":not(:checked)")) {

  } else if (jQuery("input#acceptterms").is(":checked")) {


    jQuery("span#terms").removeClass('active');
    jQuery('.terms_container').slideUp(400);
    jQuery(this).find('i').addClass('fa-chevron-down');
    jQuery(this).find('i').removeClass('fa-chevron-up');

  }


});





// trigger_select_manual_step1      - (validate fields, get the SMS-code and open the next container)


// clear error fields on keyup
jQuery(document).on("keyup", "#manual_form_birth", function (e) {
  jQuery('#check_error_manual_registration_birth').hide();
});
jQuery(document).on("keyup", "#manual_form_phone", function (e) {
  jQuery('#check_error_manual_registration_phone').hide();
});
jQuery(document).on("change", "input#manual_form_acceptterms", function (e) {
  if (jQuery("input#manual_form_acceptterms").is(":not(:checked)")) {
  } else if (jQuery("input#manual_form_acceptterms").is(":checked")) {
    jQuery('#check_error_manual_registration_terms').hide();
  }

});
jQuery(document).on("keyup", "#manual_form_email", function (e) {
  jQuery('#check_error_manual_registration_mail').hide();
});



jQuery(document).on("click", ".trigger_select_manual_step1", function (e) {

  // post values
  var value_birth = jQuery('#manual_form_birth').val();
  var value_phone = jQuery('#manual_form_phone').val();
  var value_mail = jQuery('#manual_form_email').val();


  var fetch_clinic_id = jQuery(this).attr('data-cid');
  var v_userid = jQuery(this).attr('data-userid');



  if (jQuery('#manual_form_birth').val().match(/^\d+$/)) {
    var onlydigits_in_birth = 'true';
  } else {
    var onlydigits_in_birth = 'false';
  }

  var cb_terms = 'true';

  // if email newsletter approval but no emailadress
  if (jQuery('input#manual_form_acceptterms_email').is(":checked") && (value_mail == null || value_mail == "")) {
    var cb_validemail = 'false';
  } else {
    var cb_validemail = 'true';
  }



  if (jQuery('#manual_form_birth').val() == '' || jQuery('#manual_form_birth').val().length < 11 || onlydigits_in_birth == 'false') {
    jQuery('#check_error_manual_registration_birth').show();
  } else if (jQuery('#manual_form_phone').val() == '' || jQuery('#manual_form_phone').val().length < 11 || jQuery('#manual_form_phone').val().length > 11) {
    jQuery('#check_error_manual_registration_phone').show();
  } else if (cb_validemail == 'false') {
    jQuery('#check_error_manual_registration_mail').show();
  } else if (cb_terms == 'false') {
    jQuery('#check_error_manual_registration_terms').show();

  } else {

    jQuery('.sideview_panel #button_press').show();
    jQuery('.ticket').addClass('pointerevents');


    // run - get SMS-code and open the final container

    jQuery.ajax({
      type: 'POST',
      url: 'https://ajax.assets.smileworks.no/___Clinic/',
      crossDomain: true,
      data: {
        v_run: 'get_sms_code',
        v_manualstep: '1',
        v_userid: v_userid,
        v_clinicid: fetch_clinic_id,
        value_birth: value_birth,
        value_phone: value_phone,
        value_mail: value_mail,
      },

      dataType: 'json',
      success: function (responseData, textStatus, jqXHR) {
        console.log(responseData);

        const myJSON = responseData.response_anita;
        const myObj = JSON.parse(myJSON);
        var str_Data = myObj.data;
        var str_isSuccess = myObj.isSuccess;  // true/false


        if (str_isSuccess == true) {


          jQuery('#sms_code_form_container').fadeIn(400);
          jQuery('#persondetails_form_container').hide();

          jQuery('.ticket').removeClass('pointerevents');
          jQuery('.sideview_panel #button_press').hide();

          // get patient id from response and add to submit button
          jQuery('.trigger_select_manual_step2').attr('data-patient-id', '' + str_Data + '');

          if (jQuery('input#manual_form_acceptterms_email').is(":checked")) {
            jQuery('.trigger_select_manual_step2').attr('data-patient-mail', '' + value_mail + '');
          }

        } else {

          // nothing

        }

      },
      error: function (responseData, textStatus, errorThrown) {
        console.warn(responseData, textStatus, errorThrown);
        alert('CORS failed - ' + textStatus + '');
      }
    });


  }



});





// trigger_select_manual_step2 (register the manual registration)




// clear error fields
jQuery(document).on("keyup", "#manual_form_smscode", function (e) {
  jQuery('#check_error_manual_registration_sms_json').hide();
  jQuery('#check_error_manual_registration_sms').hide();

  jQuery('.sideview_panel #button_press').hide();
  jQuery('.ticket').removeClass('pointerevents');

});


jQuery(document).on("click", ".trigger_select_manual_step2", function (e) {



  jQuery('.sideview_panel #button_press').show();
  jQuery('.ticket').addClass('pointerevents');




  var target_aid = jQuery(this).attr('data-bookingtype');
  var fetch_clinic_id = jQuery(this).attr('data-cid');
  var v_date = jQuery(this).attr('data-date');
  var v_time = jQuery(this).attr('data-time');
  var v_times = jQuery(this).attr('data-times');
  var v_userid = jQuery(this).attr('data-userid');
  var v_username = jQuery(this).attr('data-username');
  var v_ref = jQuery(this).attr('data-ref');
  var v_source = jQuery(this).attr('data-source');
  var v_pageurl = jQuery(this).attr('data-page-url');
  var v_useragent = jQuery(this).attr('data-page-useragent');
  var v_convgroup = jQuery(this).attr('data-conv-group');

  var v_dentist_selected = jQuery(this).attr('data-dentist-sel');
  var v_refurl = jQuery(this).attr('data-referurl');
  var v_name = jQuery(this).attr('data-name');

  var v_datestring = jQuery(this).attr('data-datestring');
  var v_daystring = jQuery(this).attr('data-daystring');

  var v_notes = jQuery('textarea#notes').val();


  var data_label = jQuery(this).attr('data-label');




  var v_step = '3';

  var value1 = jQuery('#manual_form_smscode').val();
  var value2 = jQuery(this).attr('data-patient-id');

  var v_email = jQuery(this).attr('data-patient-mail');

  var value_userid = v_userid;
  var value_typeid = target_aid;




  if (jQuery('#manual_form_smscode').val().match(/^\d+$/)) {
    var onlydigits_sms = 'true';
  } else {
    var onlydigits_sms = 'false';
  }

  if (jQuery('#manual_form_smscode').val() == '' || jQuery('#manual_form_smscode').val().length < 4 || jQuery('#manual_form_smscode').val().length > 4 || onlydigits_sms == 'false') {



    jQuery('#check_error_manual_registration_sms').show();



    jQuery('.sideview_panel #button_press').hide();
    jQuery('.ticket').removeClass('pointerevents');



  } else {




    // run - register and redirect to confirmation-page

    jQuery.ajax({
      type: 'POST',
      url: 'https://ajax.assets.smileworks.no/___Clinic/',
      crossDomain: true,
      data: {
        v_run: 'register_manual',
        v_manualstep: '2',
        v_step: v_step,
        value1: value1,
        value2: value2,
        value_userid: value_userid,
        value_typeid: value_typeid,
        value_date: v_date,
        value_times: v_times,
        value_ref: v_ref,
        value_confirm_dname: v_username,
        v_pageurl: v_pageurl,
        v_useragent: v_useragent,
        v_convgroup: v_convgroup,
        v_dentist_selected: v_dentist_selected,
        v_notes: v_notes,
        v_clinicid: fetch_clinic_id,
        v_source: v_source,
        v_label: data_label,
      },

      dataType: 'json',
      success: function (responseData, textStatus, jqXHR) {


        const myJSON = responseData.response_anita;
        const myObj = JSON.parse(myJSON);
        var str_Data = myObj.data;
        var str_Otptoken = myObj.errorMessage;
        var str_isSuccess = myObj.isSuccess;  // true/false


        if (str_isSuccess == true) {





          var value_time_format = v_times.substring(0, 5);
          var value_confirm_date = '' + v_daystring.toLowerCase() + ' ' + v_datestring + ' ' + value_time_format + '';


          // redirect to conversion page

          var v_payment = 'manual';
          var v_get_otptoken = str_Otptoken;



          // build convtoken as base64
          var conversion_data_json = { "v_label": "" + data_label + "", "v_payment": "" + v_payment + "", "v_userid": "" + v_userid + "", "v_date": "" + v_date + "", "v_time": "" + v_time + "", "v_bookingtype": "" + target_aid + "", "v_source": "" + v_source + "", "v_convgroup": "" + v_convgroup + "", "v_useragent": "" + v_useragent + "", "v_pageurl": "" + v_pageurl + "", "v_email": "" + v_email + "", "v_product": "" + v_name + "", "v_dentist_selected": "" + v_dentist_selected + "", "v_step": "" + v_step + "", "v_userid_name": "" + v_username + "", "v_refurl": "" + v_refurl + "" };
          var conversion_data = Base64.encode(JSON.stringify(conversion_data_json));


          function Base64EncodeUrl(str) {
            return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+jQuery/, '');
          }

          // make the base64 encoded string URL-friendly
          var conversion_data = Base64EncodeUrl(conversion_data);



          console.log(responseData.response_anita2);


          // redirect to confirmation page
          window.location.href = "https://oslotannlegesenter.no/confirmation/?patientRefCode=&dname=" + v_username + "&date=" + value_confirm_date + "&_convtoken=" + conversion_data + "&potp=" + v_get_otptoken + "";
          return false;




        } else {  // something wrong with the SMS-code or timeout

          console.log(responseData.response_anita);
          console.log(responseData.response_anita2);
          console.log(responseData.response_anita3);

          // throw out error msg
          jQuery('#check_error_manual_registration_sms_json').show();

          // re-enable sms container
          jQuery('.sideview_panel #button_press').hide();
          jQuery('.ticket').removeClass('pointerevents');

        }

      },
      error: function (responseData, textStatus, errorThrown) {
        console.warn(responseData, textStatus, errorThrown);
        alert('CORS failed - ' + textStatus + '');
      }
    });


  } // form validation



});



jQuery(document).on("click", ".dentist_container", function (e) {


  jQuery('.dentist_container_sideview').animate({ "right": '0px' });
  jQuery(".dentist_container_sideview").html('<i class="sw_loader"></i>');


  var append_Html_elements_dentist = "";

  var target_aid = jQuery(this).attr('data-bookingtype');
  var fetch_clinic_id = jQuery(this).attr('data-cid');
  var v_saleprice = jQuery(this).attr('data-saleprice');
  var v_date = jQuery(this).attr('data-date');
  var v_time = jQuery(this).attr('data-time');
  var v_times = jQuery(this).attr('data-times');
  var v_userid = jQuery(this).attr('data-userid');
  var v_ref = jQuery(this).attr('data-ref');
  var v_source = jQuery(this).attr('data-source');
  var v_pageurl = jQuery(this).attr('data-page-url');
  var v_useragent = jQuery(this).attr('data-page-useragent');
  var v_convgroup = jQuery(this).attr('data-conv-group');
  var v_datestring = jQuery(this).attr('data-datestring');
  var v_daystring = jQuery(this).attr('data-daystring');
  var v_dentist_selected = jQuery(this).attr('data-dentist-sel');
  var v_refurl = jQuery(this).attr('data-referurl');
  var v_name = jQuery(this).attr('data-name');
  var v_price = jQuery(this).attr('data-price');
  var data_label = jQuery(this).attr('data-label');
  var v_teamids = jQuery(this).attr('data-teamids');



  function intersection2(nums1, nums2) {
    let set = new Set(nums1);
    let result = [];
    for (let i = 0; i < nums2.length; i++) {
      if (set.has(nums2[i])) {
        result.push(nums2[i]);
        set.delete(nums2[i]);
      }
    }
    return result;
  }




  let str1 = '' + v_teamids + '';
  const nums1 = str1.split(",");



  jQuery.ajax({
    type: "GET",
    url: "https://patientapi.anitadental.no/api/dictionary/dentists?clinicId=" + fetch_clinic_id + "",
    success: function (data) {

      var counter = 0;


      data.data.forEach(function (item) {

        let str2 = '' + item.teamIds + '';
        const nums2 = str2.split(",");


        var isLastElement = data.data.length;


        counter++;

        if (counter == 1) {


          append_Html_elements_dentist += '<div class="dentist_container_title">Velg behandler</div>';


        }




        if (item.photoURL === null) {
          photoURL = '<div class="noimage"></div>';
          photoURL_src = '';
        } else {
          photoURL = '<img src="https://anitablobprod.blob.core.windows.net/blobphoto/' + item.photoURL + '" />';
          photoURL_src = 'https://anitablobprod.blob.core.windows.net/blobphoto/' + item.photoURL + '';
        }


        if (intersection2(nums1, nums2) == "") {
          // the dentists teamids do not match with any of the appointment types teamids - do not display
        } else {

          // data-attr build
          var data_attributes = 'data-dentist-imagesrc="' + photoURL_src + '" data-dentist-title="' + item.title + '" data-app-teamids="' + nums1 + '" data-dentist-teamids="' + nums2 + '" data-label="' + data_label + '" data-cid="' + fetch_clinic_id + '" data-name="' + v_name + '" data-price="' + v_price + '" data-dentist-sel="1" data-conv-group="' + v_convgroup + '" data-page-url="' + v_pageurl + '" data-page-step="2" data-page-useragent="' + v_useragent + '" data-date="' + v_date + '" data-datestring="' + v_datestring + '" data-daystring="' + v_daystring + '" data-time="' + v_time + '" data-times="' + v_times + '" data-bookingtype="' + target_aid + '" data-referurl="' + v_refurl + '" data-userid="' + item.id + '" data-username="' + item.name + '" data-source="' + v_source + '"';

          append_Html_elements_dentist += '<div class="trigger_select_dentist_cols"><div class="trigger_select_dentist" ' + data_attributes + '>' + photoURL + '<div class="dentist_details">' + item.name + '<span>' + item.title + '</span></div></div></div>';

        }

        if (counter == isLastElement) {



          // append results to container once

          jQuery(".dentist_container_sideview").fadeIn(300).html('<div class="close step3">X</div>' + append_Html_elements_dentist + '');

          // append calendar sticky if timerange is selected



        }




      });
    }
  });




});



jQuery(document).on("click", ".sideview_panel .close.step3", function (e) {


  jQuery('.dentist_container_sideview').animate({ "right": '-1180px' });
  jQuery(".dentist_container_sideview").html('');

  // change back class on close-button
  jQuery('.sideview_panel .close').addClass('step1');
  jQuery('.sideview_panel .close').removeClass('step3');



});




jQuery(document).on("click", ".prev_slide", function (e) {

  var current_groupid = jQuery(this).attr('data-groupid');
  var jumpsteps = '9';

  var next_position_groupid = parseInt(current_groupid) + parseInt(jumpsteps);

  jQuery(this).attr('data-groupid', next_position_groupid);


  // jQuery('.calendar_week_container').animate({scrollLeft:jQuery('#slidegroup_10').offset().left});

  var leftPos2 = jQuery('.calendar_week_container').scrollLeft();
  var sliderwidth = jQuery('.calendar_week_container').width();
  var sliderwidth = parseInt(sliderwidth) - parseInt('200');




  jQuery(".calendar_week_container").animate({ scrollLeft: leftPos2 - sliderwidth }, 800);



});


// jQuery(document).ready - section



jQuery(document).ready(function (jQuery) {




  // Check available times
  Available_Times_Display(1, '');

  // Add sideview container to body
  jQuery("body").append('<div class="sideview_panel"></div>');





});
