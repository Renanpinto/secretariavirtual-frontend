import $ from 'jquery';

export default {
  getCustomers() {
    let result;
    // return fetch('http://ema-api.herokuapp.com/api/customers')
    // .then(response => resolve(response))
    $.ajax({
        url: 'http://ema-api.herokuapp.com/api/customers',
        crossDomain: true,
        dataType: 'json',
        success: function(resultado){
          console.log(resultado)
          result = resultado;
          return result;
        },
        error: function(resultado) {
          console.log("deu ruim API: ", resultado);
        }
      });
    },

    getConsulta() {
      return true
    },
};