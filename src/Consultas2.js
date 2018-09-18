import React, { Component } from 'react';
import './pacientes.css';
import $ from 'jquery';
import { Scrollbars } from 'react-custom-scrollbars';
import PubSub from 'pubsub-js';
import Modal from 'react-responsive-modal';
import MenuLateral from './components/Menu';
import TopMenu from './components/TopMenu';
import FormCadastroConsulta from './components/FormCadastroConsulta';
// import './custom-animation.css';


class Consultas2 extends Component {
  constructor() {
    super();
    this.state = {
      lista: [],
      isHidden: true,
      phone: '',
      search: '',
      open: false,
    };
    this.updateSearch = this.updateSearch.bind(this);
    // this.onOpenModal=this.onOpenModal.bind(this);
    this.onCloseModal=this.onCloseModal.bind(this)
  }

  componentDidMount() {
    $.ajax({
      url: 'http://ema-api.herokuapp.com/api/appointments',
      crossDomain: true,
      dataType: 'json',
      success: function(resultado){
        console.log('resultado', resultado);
        this.setState({lista: resultado})
      }.bind(this),
      error: function(resultado) {
        console.log("deu ruim: ", resultado);
      }
      
    });
    PubSub.subscribe('atualiza-lista', function(topico, data) {
      this.state.lista.push(data);
      console.log('data', data);
      const retorno = Object.assign(this.state.lista, data);
      this.setState({lista: retorno});
    }.bind(this));
  }


  onOpenModal() {
    console.log('open', this.state.open);
    this.setState({ open: true });
  }

  onCloseModal() {
    this.setState({ open: false });
  }

  toggleHidden() {
    console.log('hidden', this.state.isHidden);
    this.setState({isHidden: !this.state.isHidden })
  }

  updateSearch(event) {
    this.setState({ search: event.target.value.substr(0, 20) });
  }

  render() {
    const { open } = this.state;
    let formularioPaciente;
    if (!this.state.isHidden) {
      formularioPaciente = <FormCadastroConsulta/>
    } 

    return (
      <div className="dashboard">
      <TopMenu onSearch={this.updateSearch}/>
      <MenuLateral/>
      
      <main className="content-wrap">
        <header className="content-head">
          <h1>Consultas</h1>
            
          <div className="action">
            <button onClick={this.toggleHidden.bind(this)}>
              Nova Consulta
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
         
          <div className="example">
      <Modal
          open={open}
          onClose={this.onCloseModal}
          center
          classNames={{
            transitionEnter: 'transition-enter',
            transitionEnterActive: 'transition-enter-active',
            transitionExit: 'transition-exit-active',
            transitionExitActive: 'transition-exit-active',
          }}
          animationDuration={500}
        >
          <p>
          <FormCadastroConsulta/>
          </p>
</Modal>

</div>
      <section className="person-boxes">
              {
               this.state.lista.map(function(paciente, i){
                console.log('paciente', paciente.name);
                return (
                  <div>
                    <button className="btn-modal" onClick={this.onOpenModal.bind(this)}>
                      <div className="person-box" key={paciente.id}>
                        <div className="box-avatar">
                          <img src="http://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png" alt={paciente.name}/>
                        </div>
                      
                        <div className="box-bio">
                          <h2 className="bio-name">{paciente.name}</h2>
                          <p className="bio-position">{paciente.email}</p>
                        </div>
                      </div>
                    </button>
                  </div>
                  );
                 
                }.bind(this))
              }
           </section>
          </Scrollbars>
        </div>
      </main>
    </div>
    );
  }
}

export default Consultas2;
