import React from 'react';
import $ from 'jquery';
import '../css/form-config.css'
import { TextField } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default class Menu extends React.Component {
  constructor() {
    super();
    this.state = {
      duracao: '',
      reajuste: '',
      open: false,
    };
    this.enviaForm = this.enviaForm.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDuracaoChange = this.handleDuracaoChange.bind(this);
    this.handleReajusteChange = this.handleReajusteChange.bind(this);
    this.enviaForm = this.enviaForm;
    
  }
  
  componentDidMount() {
    $.ajax({
      url: 'http://ema-api.herokuapp.com/api/setting',
      crossDomain: true,
      dataType: 'json',
      success: function(response){
        console.log('resultado', response);
        this.setState({ duracao: response.duration/3600 });
        this.setState({ reajuste: response.readjust });
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

  handleDuracaoChange(event) {
    this.setState({ duracao: event.target.value })
  }
  
  handleReajusteChange(event) {
    this.setState({ reajuste: event.target.value })
  }

  enviaForm(event) {
    event.preventDefault();
    console.log(this.state)
    console.log("dados sendo enviados");
    $.ajax({
      url: 'http://ema-api.herokuapp.com/api/setting',
      contentType: 'application/json',
      dataType:'json',
      type:'put',
      data:JSON.stringify({
        duration: this.state.duracao*3600, 
        readjust: this.state.reajuste, 
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
        return (
          <section className='form-box-config'>
          
         <form className="form-config" onSubmit={this.enviaForm} method="put">
           <h2>Configuração</h2>
           <TextField id="duracao" label="Duração da consulta" value={this.state.duracao} 
           onChange={this.handleDuracaoChange}
            helperText="Horas"
            type="number" margin="normal" />
           <TextField id="reajuste" label="Periodo reajuste" value={this.state.reajuste}
            onChange={this.handleReajusteChange}
            helperText="Meses"
            type="number" margin="normal" />
          
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