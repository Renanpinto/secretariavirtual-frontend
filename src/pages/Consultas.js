import React, { Component } from 'react';
import ReactTable from 'react-table';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import Button from '@material-ui/core/Button';
import Modal from 'react-responsive-modal';
import FormCadastroConsulta from '../components/FormCadastroConsulta';
import FormEdicaoConsulta from '../components/FormEdicaoConsulta';
import 'react-table/react-table.css';
import '../css/react-table.css';
import '../css/pagamentos.css';
import '../css/consulta.css';


class Consultas extends Component {
  constructor() {
    super();
    this.state = {
      lista: [],
      pagamentos: [],
      search: '',
      isHidden: true,
      open: false,
      pacienteId: '',
    };
    this.onOpenModal=this.onOpenModal.bind(this);
    this.onCloseModal=this.onCloseModal.bind(this);
  }

  componentDidMount() {

    $.ajax({
      url: 'http://ema-api.herokuapp.com/api/appointments',
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

    PubSub.subscribe('atualiza-lista', function(topico, data) {
      this.state.lista.push(data);
      console.log('data', data);
      const retorno = Object.assign(this.state.lista, data);
      this.setState({lista: retorno});
    }.bind(this));

    PubSub.subscribe('atualiza-busca', function(topico,data) {
        this.updateSearch(data)
      }.bind(this));
  }

  onOpenModal(event) {
    this.setState({ open: true, pacienteId: event.target.id });
  }

  onCloseModal() {
    this.setState({ open: false });
  }

  toggleHidden() {
    this.setState({ isHidden: !this.state.isHidden })
  }

  updateSearch(event) {
    console.log('aquiii', event)
    this.setState({ search: event.substr(0, 20) });
  }

  formatarData(data) {
    var d = new Date(data),
        mes = '' + (d.getMonth() + 1),
        dia = '' + d.getDate(),
        ano = d.getFullYear();

    if (mes.length < 2) mes = '0' + mes;
    if (dia.length < 2) dia = '0' + dia;

    return [dia, mes, ano].join('/');
  }

  atenderConsulta(event){
  console.log(event.currentTarget.id);
  $.ajax({
    url: 'http://ema-api.herokuapp.com/api/invoices',
    crossDomain: true,
    contentType: 'application/json',
    dataType: 'json',
    method: 'post',
    data: JSON.stringify({
      appointment_id: event.currentTarget.id,
    }),
    success: function (resultado) {
      console.log('resultado atender', resultado)
      // this.setState({ lista: resultado })
    },
    error: function (resultado) {
      console.log("deu ruim: ", resultado);
    }     
  });
  }

  cancelarConsulta(event){
    $.ajax({
      url: `http://ema-api.herokuapp.com/api/appointment` ,
      crossDomain: true,
      contentType: 'application/json',
      dataType: 'json',
      method: 'delete',
      data: JSON.stringify({
        id: event.currentTarget.id,
      }),
      success: function (resultado, textStatus, xhr) {
        console.log("status: ", xhr.status);
        console.log('resultado ', resultado)
        // this.setState({ lista: resultado })
      },
      error: function (resultado, xhr) {
        console.log("status: ", xhr);
        console.log("deu ruim: ", resultado);
      }     
    });
    }

  render() {
    const { open } = this.state;
    let formularioConsulta;

    if (!this.state.isHidden) {
      formularioConsulta = <FormCadastroConsulta/>
    }
    
    let filteredPayments = this.state.lista.filter(
      (payment) =>{
        return payment.customer.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
      }      
    );

    return (
      <main>
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
          animationDuration={500}>
            <div>
                <FormEdicaoConsulta id={this.state.pacienteId}/>
            </div>
        </Modal>
        <header className="content-head">
          <h1>Consultas</h1>
          <div className="action">
            <button onClick={this.toggleHidden.bind(this)}>
              Nova Consulta
            </button>
          </div>
        </header>

        <div className="appointments-content">
         {formularioConsulta}
          <div id="tabela-pagamentos">
            <ReactTable
              pageText='Pagina'
              ofText='de'
              nextText='Proxima'
              previousText='Anterior'
              rowsText='linhas'
              data={filteredPayments}

              columns={[
                {
                  Header: "Cliente",
                  columns: [
                    {
                      Header: "Nome",
                      accessor: "customer",
                      Cell: row => (
                        <span id={row.original.id} onClick={this.onOpenModal}>
                          {row.value}
                        </span>)
                    }
                  ]
                },
                {
                  Header: "Consulta",
                  columns: [
                    {
                      Header: "Data",
                      accessor: "start_time",
                      Cell: row => (
                        <span>
                          {row.value.split('T', 1)[0].split('-').reverse().join('/')}
                        </span>)
                    },
                    {
                      Header: "Hora",
                      id: "status",
                      accessor: "start_time",
                      Cell: row => (
                        <span>
                          {row.value.split('T')[1].split('.',1)}
                        </span>)
                    },
                    {
                      Header: "Ação",
                      id: "acao",
                      accessor: "status",
                      Cell: row => (
                        <span>{
                          row.original.status === true ? 
                          <Button variant="outlined" color="primary" id={row.original.id} onClick={this.cancelarConsulta}>Cancelar</Button>
                          : <Button variant="outlined" color="secondary" id={row.original.id} onClick={this.atenderConsulta}>Atender</Button>
                        }
                        </span>
                      )
                    }
                  ]
                }
              ]}
            defaultPageSize={10}
            className="-striped -highlight"/>
          </div>
        </div>
      </main>
    );
  }
}
export default Consultas;
