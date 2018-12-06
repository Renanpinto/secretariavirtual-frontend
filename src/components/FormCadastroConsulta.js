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
      selectedDate: new Date(),
      selectedPaciente: '',
      open: false,
    };
    this.enviaForm = this.enviaForm.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlePacienteChange = this.handlePacienteChange.bind(this);
  }

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
    console.log("dados sendo enviados", JSON.stringify({
      customer_id: this.state.selectedPaciente,
      start_time: this.state.selectedDate,
    }));
    $.ajax({
      url: "http://ema-api.herokuapp.com/api/appointments",
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: JSON.stringify({
        customer_id: this.state.selectedPaciente,
        start_time: this.state.selectedDate,
      }),
      success: function (resposta) {
        console.log(resposta);
        console.log('json', JSON.stringify({
          customer_id: this.state.selectedPaciente,
          start_time: this.state.selectedDate
        }))
        console.log("enviado com sucesso");
        this.setState({ open: true,
              selectedDate: new Date(),
              selectedPaciente: '', 
          });
        const data = this.state;
        PubSub.publish('atualiza-consultas', data);
      }.bind(this),
      error: function (resposta) {
        console.log("erro: ", resposta);
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
      <section >
        <form className = "form-consulta" onSubmit = { this.enviaForm } method = "post" >
        <FormControl >
        <InputLabel htmlFor="paciente" className="td-consulta">Paciente</InputLabel>
        <Select
            value={selectedPaciente}
            onChange={this.handlePacienteChange}
            inputProps={{ id: 'paciente' }}
            className="td-consulta"
            >
          {
            this.state.lista.map((paciente, i) => ( 
              <MenuItem key = { i } value = { paciente.id }>
               {paciente.name} 
              </MenuItem>
              ))
          } 
          </Select>

        <MuiPickersUtilsProvider utils = { MomentUtils } >
        <InlineDateTimePicker keyboard label = "Data da consulta" value = { selectedDate }
        onChange = { this.handleDateChange }
        format = "DD/MM/YYYY HH:mm"
        />


        </MuiPickersUtilsProvider> 
        <button type = "submit" className = "btn-cadastro" > Cadastrar </button> 
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