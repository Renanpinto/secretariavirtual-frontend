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
                        color: row.value === true ? '#ff2e00' : '#57d500',
                      }}>
                        &#x25cf;
                      </span> {
                        row.value === true ? 'Vencido': 'A vencer'
                      }
                    </span>)
                  },
                  {
                    Header: "Ação",
                    id: "acao",
                    accessor: "status",
                    Cell: row => (
                      <span>{
                        row.value === true ? 
                        <Button variant="outlined" color="primary" type="submit">Cancelar</Button>
                        : <Button variant="outlined" color="secondary" type="submit">Quitar</Button>
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

      </main>
    );
  }
}
export default Pagamentos;
