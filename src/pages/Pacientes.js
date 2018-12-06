import React, { Component } from 'react';
import $ from 'jquery';
import { Scrollbars } from 'react-custom-scrollbars';
import PubSub from 'pubsub-js';
import Modal from 'react-responsive-modal';
import FormCadastroPaciente from '../components/FormCadastroPaciente';
import FormEdicaoPaciente from '../components/FormEdicaoPaciente';
import FormEdicaoPreco from '../components/FormEdicaoPreco';
import '../css/pacientes.css';
import Icon from '@material-ui/core/Icon';


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
      $.ajax({
        url: 'http://ema-api.herokuapp.com/api/customers',
        crossDomain: true,
        dataType: 'json',
        success: function(resultado){
          console.log('resultado', resultado);
          this.setState({lista: resultado})
          this.filteredPacientes = this.state.lista;
        }.bind(this),
        error: function(resultado) {
          console.log("deu ruim pacientes: ", resultado);
        }
      });
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
                            <Icon color="disabled">
                              build
                            </Icon>
                          </button>
                          <button id={paciente.id} onClick={this.onOpenModalPreco}>
                            <Icon color="disabled">
                              attach_money
                            </Icon>
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
