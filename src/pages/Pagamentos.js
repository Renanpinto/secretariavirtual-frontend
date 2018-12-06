import React, { Component } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import '../css/react-table.css';
import '../css/pagamentos.css';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import Button from '@material-ui/core/Button';


class Pagamentos extends Component {
  constructor() {
    super();
    this.state = {
      pagamentos: [],
      paymentsCheck: [],
      search: '',
    };
  }

  componentDidMount() {

    $.ajax({
      url: 'http://ema-api.herokuapp.com/api/invoices',
      crossDomain: true,
      dataType: 'json',
      success: function (resultado) {
        this.setState({ pagamentos: resultado })
        this.setState({ paymentsCheck: resultado })
        console.log("result" ,resultado)
      }.bind(this),
      error: function (resultado) {
        console.log("deu ruim: ", resultado);
      }     
    });

    PubSub.subscribe('atualiza-busca', function(topico,data) {
      this.updateSearch(data)
    }.bind(this));
  }

  updateSearch(event) {
    this.setState({ search: event.substr(0, 20) })
  }

  getCurrentDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    } 
    if (mm < 10) {
      mm = '0' + mm;
    } 
    return yyyy + '-' + mm + '-' + dd;
  }

  toggleAppointments(event) {

    if(event.target.checked) {
     this.setState({ pagamentos: this.state.pagamentos.filter(
       payments => {    
           return payments.status === false
       })}) 
       
    }else {
     this.setState({ pagamentos: this.state.paymentsCheck.filter(
       payments => {    
           return payments
       })})
    }
   }
 
  quitarExtornarFatura(event) {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    } 
    if (mm < 10) {
      mm = '0' + mm;
    }    
    const data = yyyy + '-' + mm + '-' + dd
    
  $.ajax({
    url: 'http://ema-api.herokuapp.com/api/invoice',
    crossDomain: true,
    contentType: 'application/json',
    dataType: 'json',
    method: 'put',
    data: JSON.stringify({
      id: event.currentTarget.id,
      payment: data ,
    }),
    success: function (resultado) {
      console.log('resultado ', resultado)
    },
    error: function (resultado) {
      console.log("deu ruim: ", resultado);
    }     
  });
  
  }

  render() {
    let filteredPayments = this.state.pagamentos.filter(
      (payment) => {
        return payment.customer.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
      }
    );

    return (

      <main className="content-wrap">

        <header className="content-head">

          <h1>Pagamentos a receber</h1>

        </header>
        <br></br>

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
                    accessor: "customer.name"
                  },
                  {
                    Header: "E-Mail",
                    accessor: "customer.email"
                  }
                ]
              },
              {
                Header: "Dados da fatura",
                columns: [
                  {
                    Header: "Atendimentos",
                    //só colocar o nome da propriedade
                    accessor: "appointments"
                  },
                  {
                    Header: "R$",
                    //só colocar o nome da propriedade
                    accessor: "value"
                  }
                ]
              },
              {
                Header: "Valor em aberto: ",
                columns: [
                  {
                    Header: "Vencimento",
                    accessor: "due_date",
                    Cell: row => (
                      <span>
                        {row.value.split('-').reverse().join('/')}
                      </span>)
                  },
                  {
                    Header: "Status",
                    id: "status",
                    accessor: "status",
                    Cell: row => (
                    <span>
                      <span style={{
                        
                        color: row.original.due_date < this.getCurrentDate() ? '#ff2e00' : '#57d500',
                      }}>
                        &#x25cf;
                      </span> {
                        row.original.due_date < this.getCurrentDate() ? 'Vencido': 'A vencer'
                      }
                    </span>)
                  },
                  {
                    Header: "Ação",
                    id: "acao",
                    accessor: "status",
                    Cell: row => (
                      <span>
                        {row.value === true ? 
                        <Button variant="outlined" color="primary" id={row.original.appointment_id} onClick={this.quitarExtornarFatura}>Estornar</Button>
                        : <Button variant="outlined" color="secondary" id={row.original.appointment_id} onClick={this.quitarExtornarFatura}>Quitar</Button>
                      }</span>
                    )
                  }
                ]
              }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
          />

        </div>
          <div>
            <input type="checkbox" onChange={this.toggleAppointments.bind(this)} />Exibir somente faturas em aberto
          </div>

      </main>
    );
  }
}
export default Pagamentos;
