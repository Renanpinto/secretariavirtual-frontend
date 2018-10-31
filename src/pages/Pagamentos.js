import React, { Component } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import '../css/react-table.css';
import '../css/pagamentos.css';
import request from '../request/helper/customer';


class Pagamentos extends Component {
  constructor() {
    super();
    this.state = {
      lista: [],
      search:''
    };
    this.updateSearch = this.updateSearch.bind(this);
  }

  componentDidMount() {
    const resultado = request.getCustomers();
    console.log(resultado.then())
    if (resultado) this.setState({ lista: resultado })
  }

   updateSearch(event){
    this.setState({search: event.target.value.substr(0,20)})
    console.log('entrou aki')
  }

 render() {

  let filteredPayments = this.state.lista.filter(
      (paciente) =>{
        return paciente.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
      }      
    );


  return (

        <main className="content-wrap">

          <header className="content-head">
            <h1>Pagamentos</h1>               
          </header>
          <br></br>
          
              <div>
                <ReactTable
                  pageText= 'Pagina'
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
                          id: "email",
                          accessor: d => d.email
                        }
                      ]
                    },
                    {
                      Header: "Quantidade",
                      columns: [
                        {
                          Header: "N de consultas",
                          accessor: "age"
                        }
                      ]
                    },
                    {
                      Header: "Pagamento",
                      columns: [                      
                        {
                          Header: "Vencimento",
                          accessor: "status"
                        },
                        {
                          Header: "Valor R$",
                          accessor: "status"
                        },
                        {
                          Header: "Status",
                          accessor: "visits"
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
