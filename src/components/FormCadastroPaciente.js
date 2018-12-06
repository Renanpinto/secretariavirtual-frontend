import React from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';

export default class Menu extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      phone: '',
    };
    this.enviaForm = this.enviaForm.bind(this);
    this.setName = this.setName.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPhone = this.setPhone.bind(this);
    this.enviaForm = this.enviaForm;
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

  enviaForm(event) {
    event.preventDefault();
    console.log("dados sendo enviados");
    $.ajax({
      url:"http://ema-api.herokuapp.com/api/customers",
      contentType: 'application/json',
      dataType:'json',
      type:'post',
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
        this.setState({ name:'', email:'', phone:'' });
      }.bind(this),
      error: function(resposta){
          console.log("erro");
      }
  })
}


    render() {
        return (
          <section className='form-box'>
         <form className="form" onSubmit={this.enviaForm} method="post">
           <h2>Cadastro de Clientes</h2>
           <label>
             <span>Nome</span>
             <input type="text" value={this.state.name} onChange={this.setName}/>
           </label>
           <label>
             <span>Email</span>
             <input type="email" value={this.state.email} onChange={this.setEmail}/>
           </label>
           <label>
             <span>Telefone</span>
             <input type="tel" value={this.state.phone} onChange={this.setPhone}/>
           </label>
           <button type="submit" className="submit">Cadastrar</button>
         </form> 
     </section>
        ); 
    }
}