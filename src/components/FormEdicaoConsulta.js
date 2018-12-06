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
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      lista: [],
      selectedDate: new Date(),
      name: '',
      customerId: '',
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
      url: `http://ema-api.herokuapp.com/api/appointments/${this.props.id}`,
      crossDomain: true,
      dataType: 'json',
      success: function(response){
        console.log('resultado', response);
        this.setState({ customerId: response.customer_id });
        this.setState({ name: response.customer});
        this.setState({ selectedDate: response.start_time });
        console.log( 'api', this.state)
      }.bind(this),
      error: function(resultado) {
        console.log("deu ruim: ", resultado);
      }
      
    });

    $.ajax({
      url: 'http://ema-api.herokuapp.com/api/customers',
      crossDomain: true,
      dataType: 'json',
      success: function (resultado) {
        console.log('resultado ', resultado)
        this.setState({ lista: resultado })
      }.bind(this),
      error: function (resultado) {
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
    this.setState({ name: event.target.value })
  }

  enviaForm(event) {
    event.preventDefault();
    
    console.log("dados sendo enviados");
    $.ajax({
      url:`http://ema-api.herokuapp.com/api/appointments/${this.props.id}`,
      contentType: 'application/json',
      dataType:'json',
      type:'put',
      data:JSON.stringify({
        customer_id: this.state.customerId,
        start_time: this.state.selectedDate, 
      }),
      success: function(response){
        console.log(JSON.stringify({
          customer_id: this.state.customerId,
          start_time: this.state.selectedDate, 
        }))
        console.log(response);
        console.log("enviado com sucesso");
        this.setState({ open: true })
      }.bind(this),
      error: function(resposta){
          console.log("erro");
      }
    },
  );
  console.log(this.state)
}


    render() {
      const { selectedDate, customerId } = this.state;
        return (
          <section className='form-box-config'>
          
         <form className="form-config" onSubmit={this.enviaForm} method="put">
           <h2>Configuração</h2>
           <InputLabel htmlFor="paciente" className="td-consulta">Paciente</InputLabel>
        <Select
            value={customerId}
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