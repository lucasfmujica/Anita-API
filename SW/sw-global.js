

// Extract "GET" parameters from a JS include querystring
function getParams(script_name) {
  // Find all script tags
  var scripts = document.getElementsByTagName("script");

  // Look through them trying to find ourselves
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src.indexOf("/" + script_name) > -1) {
      // Get an array of key=value strings of params
      var pa = scripts[i].src.split("?").pop().split("&");

      // Split each key=value into array, the construct js object
      var p = {};
      for (var j = 0; j < pa.length; j++) {
        var kv = pa[j].split("=");
        p[kv[0]] = kv[1];
      }
      return p;
    }
  }

  // No scripts match
  return {};
}







function custom_day(date_value) {

  split1 = date_value.slice(0, 2);

  if (split1.slice(0, 1) == 0) {
    split1 = split1.replace('0', '');
  } else {
    split1 = split1;
  }

  return split1;
}

function custom_day_nr(date_value) {

  split1 = date_value.slice(0, 2);

  return split1;
}

function custom_month(date_value) {

  split1 = date_value.slice(0, 5);
  split2 = split1.slice(-2);

  if (split2 == '01') { split_name = 'Januar'; }
  if (split2 == '02') { split_name = 'Februar'; }
  if (split2 == '03') { split_name = 'Mars'; }
  if (split2 == '04') { split_name = 'April'; }
  if (split2 == '05') { split_name = 'Mai'; }
  if (split2 == '06') { split_name = 'Juni'; }
  if (split2 == '07') { split_name = 'Juli'; }
  if (split2 == '08') { split_name = 'August'; }
  if (split2 == '09') { split_name = 'September'; }
  if (split2 == '10') { split_name = 'Oktober'; }
  if (split2 == '11') { split_name = 'November'; }
  if (split2 == '12') { split_name = 'Desember'; }

  split_name = split_name.slice(0, 3);

  return split_name.toLowerCase();

}

function custom_month_nr(date_value) {

  split1 = date_value.slice(0, 5);
  split2 = split1.slice(-2);

  return split2;

}

function custom_year(date_value) {

  split2 = date_value.slice(-4);

  return split2;
}


function custom_weekday(date_value) {

  split1 = '' + custom_month_nr(date_value) + '/' + custom_day_nr(date_value) + '/' + custom_year(date_value) + '';

  const d = new Date(split1);
  let day = d.getDay();

  if (day == '1') { weekday_name = 'Mandag'; }
  if (day == '2') { weekday_name = 'Tirsdag'; }
  if (day == '3') { weekday_name = 'Onsdag'; }
  if (day == '4') { weekday_name = 'Torsdag'; }
  if (day == '5') { weekday_name = 'Fredag'; }
  if (day == '6') { weekday_name = 'LÃ¸rdag'; }
  if (day == '0') { weekday_name = 'SÃ¸ndag'; }

  return weekday_name;
}




function custom_dates(add_days) {



  var date_var = new Date();
  date_var.setDate(date_var.getDate() + add_days);
  var yyyy_var = date_var.getFullYear(date_var);  // Add days
  let mm_var = date_var.getMonth(date_var) + 1; // Months start at 0!
  let dd_var = date_var.getDate(date_var);
  if (dd_var < 10) dd_var = '0' + dd_var;
  if (mm_var < 10) mm_var = '0' + mm_var;
  var formatted_date = yyyy_var + '-' + mm_var + '-' + dd_var;  // Format Y-m-d

  return formatted_date;
}

function date_ymd(date_value) {


  var formatted_date = custom_year(date_value) + '-' + custom_month_nr(date_value) + '-' + custom_day_nr(date_value);  // Format Y-m-d

  return formatted_date;
}




function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
};
