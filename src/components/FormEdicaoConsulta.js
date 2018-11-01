import React from 'react';
import $ from 'jquery';
import '../css/form-config.css'
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import { InlineDateTimePicker } from 'material-ui-pickers/DateTimePicker';

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
    this.handleClose = this.handleClose.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handlePacienteChange = this.handlePacienteChange.bind(this);
    this.enviaForm = this.enviaForm;
    
  }
  
  componentDidMount() {
    $.ajax({
      url: ``,
      crossDomain: true,
      dataType: 'json',
      success: function(response){
        console.log('resultado', response);
        this.setState({ selectedDate: response.duracao });
        this.setState({ selectedPaciente: response.reajuste});
      }.bind(this),
      error: function(resultado) {
        console.log("deu ruim: ", resultado);
      }
      
    });
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  }

  handleDateChange(date) {
    this.setState({ selectedDate: date });
  }

  handlePacienteChange(event) {
    this.setState({ selectedPaciente: event.target.value })
  }

  enviaForm(event) {
    event.preventDefault();
    console.log(this.state)
    console.log("dados sendo enviados");
    $.ajax({
      url:``,
      contentType: 'application/json',
      dataType:'json',
      type:'put',
      data:JSON.stringify({
        name: this.state.duracao, 
        email: this.state.reajuste, 
      }),
      success: function(response){
        console.log(response);
        console.log("enviado com sucesso");
        this.setState({ open: true })
      }.bind(this),
      error: function(resposta){
          console.log("erro");
      }
    },
  );
}


    render() {
      const { selectedDate, selectedPaciente } = this.state;
        return (
          <section className='form-box-config'>
          
         <form className="form-config" onSubmit={this.enviaForm} method="put">
           <h2>Configuração</h2>
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
        format = "DD/MM/YYYY"
        mask = { [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] } />


        </MuiPickersUtilsProvider> 
          
           <button type="submit" className="submit">Gravar</button>
         </form> 
         <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.open}
          autoHideDuration={3000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Alterado com sucesso</span>}
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