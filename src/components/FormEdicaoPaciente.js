import React from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import '../css/form-config.css';
import { TextField } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default class Menu extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.customer = []
    this.state = {
      name: '',
      email: '',
      phone: '',
      open: false,
    };
    this.enviaForm = this.enviaForm.bind(this);
    this.setName = this.setName.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPhone = this.setPhone.bind(this);
    this.handleClose = this.handleClose.bind(this);
    
  }
  
  componentDidMount() {
    console.log(this.props.id)
    $.ajax({
      url: `http://ema-api.herokuapp.com/api/customers/${this.props.id}`,
      crossDomain: true,
      dataType: 'json',
      success: function(resultado){
        console.log('resultado', resultado);
        this.setState({ name: resultado.name });
        this.setState({ email: resultado.email});
        this.setState({ phone: resultado.phone});
      }.bind(this),
      error: function(resultado) {
        console.log("deu ruim: ", resultado);
      }
      
    });
  }

  setName(event){
    this.setState({name:event.target.value});
  }
  
  setEmail(event){
    this.setState({email:event.target.value});
  }
  
  setPhone(event){
    this.setState({phone:event.target.value});
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  }

  enviaForm(event) {
    event.preventDefault();
    console.log("dados sendo enviados");
    $.ajax({
      url:`http://ema-api.herokuapp.com/api/customers/${this.props.id}`,
      contentType: 'application/json',
      dataType:'json',
      type:'put',
      data:JSON.stringify({
        name: this.state.name, 
        email: this.state.email, 
        phone: this.state.phone
      }),
      success: function(resposta){
        console.log(resposta);
        console.log("enviado com sucesso");
        const data = this.state;
        PubSub.publish('atualiza-lista', data);
        this.setState({ open: true })
      }.bind(this),
      error: function(resposta){
          console.log("erro");
      }
  })
}


    render() {
        return (
          <section className='form-box-config'>
         <form className="form-config" onSubmit={this.enviaForm} method="put">
           <h2>Edição de paciente</h2>
           <TextField id="nome" label="Nome" value={this.state.name} 
           onChange={this.setName}
            type="text" margin="normal" />
            <TextField id="email" label="Email" value={this.state.email} 
           onChange={this.setEmail}
            type="email" margin="normal" />
            <TextField id="telefone" label="Telefone" value={this.state.phone} 
           onChange={this.setPhone}
            type="tel" margin="normal" />
            <TextField id="foto" label="Foto" 
            type="file" margin="normal" />
           <button type="submit" className="submit">Alterar</button>
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