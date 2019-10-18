import React from 'react';
import $ from 'jquery';
import '../css/form-config.css'
import { TextField } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MomentUtils from '@date-io/moment';
import { DateTimePicker } from '@material-ui/pickers';
import MuiPickersUtilsProvider from '@material-ui/pickers/MuiPickersUtilsProvider';

export default class Menu extends React.Component {
  constructor(props) {
    super();
    this.props = props
    this.state = {
      valor: '',
      selectedDate: new Date(),
      open: false,
    };
    this.enviaForm = this.enviaForm.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.enviaForm = this.enviaForm;
    
  }
  
  componentDidMount() {
    const id = this.props.id
    console.log('id', id)
    $.ajax({
      url: `http://ema-api.herokuapp.com/api/customers/${id}/prices`,
      crossDomain: true,
      dataType: 'json',
      success: function(response){
        console.log('resultado', response);
        if(response.length > 0) {
          this.setState({ valor: response[0].price });
          this.setState({ selectedDate: response[0].readjust });
        }
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

  handleValueChange(event) {
    this.setState({ valor: event.currentTarget.value })
  }

  enviaForm(event) {
    event.preventDefault();
    const { id } = this.props
    console.log("dados sendo enviados");
    $.ajax({
      url: `http://ema-api.herokuapp.com/api/customers/${id}/prices`,
      contentType: 'application/json',
      dataType:'json',
      type:'post',
      data:JSON.stringify({
        price: this.state.valor, 
        readjust: this.state.selectedDate, 
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

handleDateChange(date) {
  this.setState({
    selectedDate: date,
  });
}


    render() {
      const { selectedDate, valor } = this.state;
      console.log(this.state.valor)
        return (
          <section className='form-box-config'>
          
         <form className="form-config" onSubmit={this.enviaForm} method="put">
           <h2>Preço</h2>
           <TextField id="valor" label="Valor" value={valor} 
            onChange={this.handleValueChange}
            helperText="R$"
            type="text" margin="normal" />
            <MuiPickersUtilsProvider utils = { MomentUtils } >
            <DateTimePicker keyboard label = "Data de reajuste" value = { selectedDate }
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