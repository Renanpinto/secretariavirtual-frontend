import React, {
  PureComponent,
  Fragment
} from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import {
  InlineDateTimePicker
} from 'material-ui-pickers/DateTimePicker';

export default class Menu extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      phone: '',
      customer: '',
      lista: [],
      selectedDate: new Date('2018-01-01T18:54'),
    };
    this.enviaForm = this.enviaForm.bind(this);
    this.setName = this.setName.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPhone = this.setPhone.bind(this);
    this.enviaForm = this.enviaForm;
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  enviaForm(event) {
    event.preventDefault();
    console.log("dados sendo enviados");
    $.ajax({
      url: "http://ema-api.herokuapp.com/api/appointments",
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: JSON.stringify({
        name: this.state.name,
        selectedDate: this.state.selectedDate
      }),
      success: function (resposta) {
        console.log(resposta);
        console.log("enviado com sucesso");
        const data = this.state;
        PubSub.publish('atualiza-consultas', data);
        this.setState({
          name: '',
          email: '',
          phone: ''
        });
      }.bind(this),
      error: function (resposta) {
        console.log("erro");
      }

    })

  }

  // componentDidMount() {
  //   PubSub.subscribe('lista-pacientes', function(topico, data) {
  //     console.log('didmount');
  //     this.state.lista.push(data);
  //     console.log(this.state)
  //     const retorno = Object.assign(this.state.lista, data);
  //     this.setState({lista: retorno});
  //   }.bind(this));
  // }

  componentDidMount() {
    $.ajax({
      url: 'http://ema-api.herokuapp.com/api/customers',
      crossDomain: true,
      dataType: 'json',
      success: function (resultado) {
        console.log('resultado', resultado);
        this.setState({
          lista: resultado
        })
        console.log('res', this.state);
        const data = this.state;
        PubSub.publish('lista-pacientes', data);
      }.bind(this),
      error: function (resultado) {
        console.log("deu ruim: ", resultado);
      }

    });
  }

  handleDateChange(date) {
    this.setState({
      selectedDate: date,
    });
    console.log(this.state.selectedDate),
  }

  render() {
    const {
      selectedDate
    } = this.state;
    return ( 
      <section>
        <form className = "form-consulta" onSubmit = { this.enviaForm } method = "post" >
        <TextField select label = "Paciente" helperText = "Selecione o paciente" margin = "normal">
          {
            this.state.lista.map((paciente, i) => ( 
              <MenuItem key = { paciente.name } value = { paciente.name }>
               {paciente.name} 
              </MenuItem>
              ))
          } 
          </TextField>

        <MuiPickersUtilsProvider utils = { MomentUtils } >
        <InlineDateTimePicker keyboard label = "Data da consulta" value = { selectedDate }
        onChange = { this.handleDateChange }
        format = "DD/MM/YYYY"
        mask = { [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] } />


        </MuiPickersUtilsProvider> 
        <button type = "submit" className = "submit" > Cadastrar </button> 
        </form> 
      </section>
    );
  }
}