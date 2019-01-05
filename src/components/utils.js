import $ from 'jquery';

export const getCookie = (name)=> {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

export const stringToObject = (value) => {
  var value = JSON.parse(value.replace(/\\054/g, ','));
  value = value.replace(/'/g,'"');
  value = JSON.parse(value);
  return value;
}
