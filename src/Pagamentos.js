import React, { Component } from 'react';
import './pagamentos.css';
import $ from 'jquery';
import MenuLateral from './components/Menu';
import TopMenu from './components/TopMenu';
import ReactTable from "react-table";
import "react-table/react-table.css";
import './react-table.css';


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
    $.ajax({
      url: 'http://ema-api.herokuapp.com/api/customers',
      crossDomain: true,
      dataType: 'json',
      success: function(resultado){        
        this.setState({lista: resultado})        
      }.bind(this),
      error: function(resultado) {
        console.log("deu ruim API: ", resultado);
      }
      
    });
   
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

    <div className="dashboard">

        <TopMenu onSearch={this.updateSearch}/>
        <MenuLateral/>

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
      </div>
    );
  }
}
export default Pagamentos;
