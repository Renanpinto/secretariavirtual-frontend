import React, { Component } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import '../css/react-table.css';
import '../css/pagamentos.css';
import $ from 'jquery';
import PubSub from 'pubsub-js';


class Pagamentos extends Component {
  constructor() {
    super();
    this.state = {
      lista: [],
      search: ''
    };
  }

  componentDidMount() {

    $.ajax({
      url: 'http://ema-api.herokuapp.com/api/customers',
      crossDomain: true,
      dataType: 'json',
      success: function (resultado) {
        this.setState({ lista: resultado })
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
    // let filteredPayments = this.state.lista.filter(
    //   (paciente) => {
    //     return paciente.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
    //   }
    // );

    // console.log("filteredPayments", filteredPayments)

    // const filteredPayments = [{
    //   id: 1,
    //   name: "Cliente A",
    //   email: "cliente_a@email.com",
    //   appointments: "4",
    //   value: "440,00",
    //   status: false,
    //   created_at: "20/10/2018"
    // }]
    
    let filteredPayments = this.state.lista.filter(
      (payment) =>{
        //TODO quando apontar para api de pagamentos, ver por qual atribuito sera feita a busca
        return payment.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
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
                    accessor: "name"
                  },
                  {
                    Header: "E-Mail",
                    accessor: "email"
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
                    accessor: "created_at"
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
