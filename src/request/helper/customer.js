import $ from 'jquery';
import { resolve } from 'bluebird';

export default {
  getCustomers() {
    let result;
    return fetch('http://ema-api.herokuapp.com/api/customers')
    .then(response => resolve(response))
    // $.ajax({
    //     url: 'http://ema-api.herokuapp.com/api/customers',
    //     crossDomain: true,
    //     dataType: 'json',
    //     success: function(resultado){
    //       console.log(resultado)
    //       result = resultado;
    //     },
    //     error: function(resultado) {
    //       console.log("deu ruim API: ", resultado);
    //     }
    //   });
    //   console.log(result)
    //   return result;
    },

    getConsulta() {
      return true
    },
};