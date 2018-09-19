import React from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import MenuItem from '@material-ui/core/MenuItem';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import { InlineDateTimePicker } from 'material-ui-pickers/DateTimePicker';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

export default class Menu extends React.Component {
  constructor() {
    super();
    this.state = {
      lista: [],
      selectedDate: new Date('2018-01-01T18:54'),
      selectedPaciente: '',
      open: false,
    };
    this.enviaForm = this.enviaForm.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlePacienteChange = this.handlePacienteChange.bind(this);
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
          lista: resultado,
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

  enviaForm(event) {
    event.preventDefault();
    console.log("dados sendo enviados");
    $.ajax({
      url: "http://ema-api.herokuapp.com/api/appointments",
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: JSON.stringify({
        customer_id: this.state.selectedPaciente,
        start_time: this.state.selectedDate
      }),
      success: function (resposta) {
        console.log(resposta);
        console.log('json', JSON.stringify({
          customer_id: this.state.selectedPaciente,
          start_time: this.state.selectedDate
        }))
        console.log("enviado com sucesso");
        this.setState({ open: true });
        const data = this.state;
        PubSub.publish('atualiza-consultas', data);
      }.bind(this),
      error: function (resposta) {
        console.log("erro");
      }
    })
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  }

  handleDateChange(date) {
    this.setState({
      selectedDate: date,
    });
  }

  handlePacienteChange(event) {
    this.setState({ selectedPaciente: event.target.value })
  }


  render() {
    const { selectedDate, selectedPaciente } = this.state;
    return ( 
      <section>
        <form className = "form-consulta" onSubmit = { this.enviaForm } method = "post" >
        <FormControl >
        <InputLabel htmlFor="age-simple">Paciente</InputLabel>
        <Select
            value={selectedPaciente}
            onChange={this.handlePacienteChange}
            inputProps={{
              name: 'age',
              id: 'age-simple',
            }}>
          {
            this.state.lista.map((paciente, i) => ( 
              <MenuItem key = { i } value = { paciente.name }>
               {paciente.name} 
              </MenuItem>
              ))
          } 
          </Select>

        <MuiPickersUtilsProvider utils = { MomentUtils } >
        <InlineDateTimePicker keyboard label = "Data da consulta" value = { selectedDate }
        onChange = { this.handleDateChange }
        format = "DD/MM/YYYY"
        mask = { [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] } />


        </MuiPickersUtilsProvider> 
        <button type = "submit" className = "submit" > Cadastrar </button> 
        </FormControl>
        </form> 
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Cadastrado com sucesso</span>}
          action={[
            <IconButton key="close" aria-label="Close" color="inherit" onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </section>
    );
  }
}