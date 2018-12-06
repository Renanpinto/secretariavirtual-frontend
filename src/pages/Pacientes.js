import React, { Component } from 'react';
import $ from 'jquery';
import { Scrollbars } from 'react-custom-scrollbars';
import PubSub from 'pubsub-js';
import Modal from 'react-responsive-modal';
import FormCadastroPaciente from '../components/FormCadastroPaciente';
import FormEdicaoPaciente from '../components/FormEdicaoPaciente';
import FormEdicaoPreco from '../components/FormEdicaoPreco';
import '../css/pacientes.css';


class Pacientes extends Component {
  constructor() {
    super();
    this.state = {
      lista: [],
      isHidden: true,
      phone: '',
      search: '',
      openPaciente: false,
      openPreco: false,
      pacienteId: '',
    };
    this.updateSearch = this.updateSearch.bind(this);
    this.onOpenModalPaciente=this.onOpenModalPaciente.bind(this);
    this.onOpenModalPreco=this.onOpenModalPreco.bind(this);
    this.onCloseModal=this.onCloseModal.bind(this)
  }

  componentDidMount() {
    $.ajax({
      url: 'http://ema-api.herokuapp.com/api/customers',
      crossDomain: true,
      dataType: 'json',
      success: function(resultado){
        console.log('resultado', resultado);
        this.setState({lista: resultado})
        console.log('res', this.state);
        const data = this.state;
        console.log('data', data);
        PubSub.publish('lista-pacientes', data);
      }.bind(this),
      error: function(resultado) {
        console.log("deu ruim pacientes: ", resultado);
      }
      
    });
    PubSub.subscribe('atualiza-lista', function(topico, data) {
      this.state.lista.push(data);
      console.log('data', data)
      console.log('lista1', this.state.lista)

      const retorno = Object.assign(this.state.lista, data);
      this.setState({lista: retorno});
      console.log('lista2', this.state.lista)
    }.bind(this));

    PubSub.subscribe('atualiza-busca', function(topico,data) {
      console.log('data :',data)
        this.updateSearch(data)
      }.bind(this));

  }


  onOpenModalPaciente(event) {
    this.setState({ openPaciente: true , pacienteId: event.currentTarget.id });
  }

  onOpenModalPreco(event) {
    this.setState({ openPreco: true , pacienteId: event.currentTarget.id });
  }

  onCloseModal() {
    this.setState({ openPaciente: false, openPreco: false });
  }

  toggleHidden() {
    console.log('hidden', this.state.isHidden);
    this.setState({isHidden: !this.state.isHidden })
  }

  
  updateSearch(event) {
    this.setState({search: event.substr(0, 20) });
  }

  render() {

    let filteredPacientes = this.state.lista.filter(
      (paciente) =>{
        return paciente.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
      }      
    );

    const { openPaciente, openPreco } = this.state;

    let formularioPaciente;
    if (!this.state.isHidden) {
      formularioPaciente = <FormCadastroPaciente/>
    } 

    return (
          <main className="content-wrap">

            <header className="content-head">
              <h1>Clientes</h1>
            
              <div className="action">
                <button onClick={this.toggleHidden.bind(this)}>
                  Cadastrar
                </button>
              </div>
            </header>
        
            <div className="content">
              <Scrollbars
              onScroll={this.handleScroll}
              onScrollFrame={this.handleScrollFrame}
              onScrollStart={this.handleScrollStart}
              onScrollStop={this.handleScrollStop}
              onUpdate={this.handleUpdate}
              renderView={this.renderView}
              renderTrackHorizontal={this.renderTrackHorizontal}
              renderTrackVertical={this.renderTrackVertical}
              renderThumbHorizontal={this.renderThumbHorizontal}
              renderThumbVertical={this.renderThumbVertical}
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={200}
              autoHeight
              autoHeightMin={0}
              autoHeightMax={430}
              thumbMinSize={30}
              universal={true}>
              
              {formularioPaciente}
         
              <div>
                <Modal
                  open={openPaciente}
                  onClose={this.onCloseModal}
                  center
                  classNames={{
                    transitionEnter: 'transition-enter',
                    transitionEnterActive: 'transition-enter-active',
                    transitionExit: 'transition-exit-active',
                    transitionExitActive: 'transition-exit-active',
                  }}
                  animationDuration={500}>
                <div>
                  <FormEdicaoPaciente id={this.state.pacienteId}/>
                </div>
                </Modal>
                <Modal
                  open={openPreco}
                  onClose={this.onCloseModal}
                  center
                  classNames={{
                    transitionEnter: 'transition-enter',
                    transitionEnterActive: 'transition-enter-active',
                    transitionExit: 'transition-exit-active',
                    transitionExitActive: 'transition-exit-active',
                  }}
                  animationDuration={500}>
                <div>
                  <FormEdicaoPreco id={this.state.pacienteId}/>
                </div>
                </Modal>

              </div>
              <section className="person-boxes">
              {
                filteredPacientes.map(function(paciente, i){
                console.log('paciente', paciente.name);
                return (
                  <div key={paciente.id} >
                      <div className="person-box">
                        <div className="box-avatar">
                          <img src="http://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png" alt={paciente.name}/>
                        </div>
    
                        <div className="box-bio">
                          <h2 className="bio-name">{paciente.name} </h2>
                          <p className="bio-position">{paciente.email}</p>
                        </div>
                        <div className="box-actions">
                          <button id={paciente.id} onClick={this.onOpenModalPaciente}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6.855 14.365l-1.817 6.36a1.001 1.001 0 0 0 1.517 1.106L12 18.202l5.445 3.63a1 1 0 0 0 1.517-1.106l-1.817-6.36 4.48-3.584a1.001 1.001 0 0 0-.461-1.767l-5.497-.916-2.772-5.545c-.34-.678-1.449-.678-1.789 0L8.333 8.098l-5.497.916a1 1 0 0 0-.461 1.767l4.48 3.584zm2.309-4.379c.315-.053.587-.253.73-.539L12 5.236l2.105 4.211c.144.286.415.486.73.539l3.79.632-3.251 2.601a1.003 1.003 0 0 0-.337 1.056l1.253 4.385-3.736-2.491a1 1 0 0 0-1.109-.001l-3.736 2.491 1.253-4.385a1.002 1.002 0 0 0-.337-1.056l-3.251-2.601 3.79-.631z"/></svg>
                          </button>
                          <button id={paciente.id} onClick={this.onOpenModalPreco}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18 18H6V6h7V4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8h-2v7z"/><path d="M17.465 5.121l-6.172 6.172 1.414 1.414 6.172-6.172 2.12 2.121L21 3h-5.657z"/></svg>
                          </button>
                        </div>
                      </div>
                  </div>
                  );
                }.bind(this))
              }
              </section>
            </Scrollbars>
          </div>
        </main>
    );
  }
}

export default Pacientes;
