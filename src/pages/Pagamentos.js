import React, { Component } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import '../css/react-table.css';
import '../css/pagamentos.css';
import $ from 'jquery';
import { Grid } from '@material-ui/core';


class Pagamentos extends Component {
  constructor() {
    super();
    this.state = {
      lista: [],
      search: ''
    };
    // this.updateSearch = this.updateSearch.bind(this);
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
  }

  updateSearch(event) {
    this.setState({ search: event.target.value.substr(0, 20) })
  }

  render() {
    let filteredPayments = this.state.lista.filter(
      (paciente) => {
        return paciente.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
      }
    );

    return (

      <main className="content-wrap">

        <header className="content-head">



          <h1>Pagamentos</h1>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z" /></svg>
            <input type="text" id='searchs' value={this.props.search} onChange={this.updateSearch.bind(this)}></input>
          </Grid>

        </header>
        <br></br>

        <div>
          <ReactTable
            pageText='Pagina'
            ofText='de'
            nextText='Proxima'
            previousText='Anterior'
            rowsText='linhas'
            data={filteredPayments}

            columns={[
              {
                Header: "Paciente",
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
                Header: "Quantidade",
                columns: [
                  {
                    Header: "N de consultas",
                    //só colocar o nome da propriedade
                    accessor: "phone"
                  }
                ]
              },
              {
                Header: "Pagamento",
                columns: [
                  {
                    Header: "Vencimento",
                    accessor: "created_at"
                  },
                  {
                    Header: "Valor R$",
                    accessor: "updated_at"
                  },
                  {
                    Header: "Status",
                    id: "status",
                    accessor: d => d.status.toString()
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
