import React, { Component } from 'react';
import './consulta.css';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import FormCadastroConsulta from './components/FormCadastroConsulta';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';


function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class Consultas extends Component {
  constructor() {
    super();
    this.state = {
      lista: [],
      isHidden: true,
      phone: '',
      search: '',
      open: false,
      value: 'dia',
      rows: [],
      page: 0,
      rowsPerPage: 5,
    };
    this.updateSearch = this.updateSearch.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

 componentDidMount() {
    $.ajax({
      url: 'http://ema-api.herokuapp.com/api/appointments',
      crossDomain: true,
      dataType: 'json',
      success: function(resultado){
        console.log('resultado', resultado);
        this.setState({rows: resultado})
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
    this.setState({ isHidden: !this.state.isHidden })
  }

  updateSearch(event) {
    this.setState({ search: event.target.value.substr(0, 20) });
  }

  handleTabChange(event, value) {
    this.setState({ value });
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleFirstPageButtonClick = event => {
    this.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.onChangePage(event, this.page - 1);
  };

  handleNextButtonClick = event => {
    this.onChangePage(event, this.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.onChangePage(
      event,
      Math.max(0, Math.ceil(this.count / this.rowsPerPage) - 1),
    );
  };

  render() {
    const { value } = this.state;
    const { rows, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    let formularioConsulta;
    if (!this.state.isHidden) {
      formularioConsulta = <FormCadastroConsulta/>
    }

    return (
      <main>
        <header className="content-head">
          <h1>Consultas</h1>
          <div className="action">
            <button onClick={this.toggleHidden.bind(this)}>
              Nova Consulta
            </button>
          </div>
        </header>

        <div className="content">
         {formularioConsulta}
          <div className="calendar-header">
            <AppBar position="relative">
              <Tabs value={value} onChange={this.handleTabChange} centered fullWidth>
                <Tab value="dia" label="Consultas do dia" />
                <Tab value="mes" label="Próximas consultas" />
              </Tabs>
            </AppBar>
            <section className="calendar-body">
              {value === 'dia' && <TabContainer>
              {
                this.state.lista.map(function(paciente, i){
                  return (
                    <div key={paciente.customer_id}>
                      <Table className=''>
                        <TableBody>
                          <TableRow>
                            <TableCell component="td" scope="row">
                              <ListItemText primary={paciente.customer}/>
                            </TableCell>
                            <TableCell numeric>
                              <ListItemText secondary={paciente.date}/>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <List>
                        <ListItem>
                          <ListItemText key={i} primary={paciente.customer} secondary={paciente.date} />
                        </ListItem>
                      </List>
                    </div>
                  );
                 })
              }
              </TabContainer>}
              {value === 'mes' && <TabContainer className="style1"> 
              {/*<div className="">
              <IconButton
                onClick={this.handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="First Page"
              >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
              </IconButton>
              <IconButton
                onClick={this.handleBackButtonClick}
                disabled={page === 0}
                aria-label="Previous Page"
              >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              </IconButton>
              <IconButton
                onClick={this.handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="Next Page"
              >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
              </IconButton>
              <IconButton
                onClick={this.handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="Last Page"
              >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
              </IconButton>
            </div> */}
                  <Table className=''>
                    <TableBody>
                      {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                      let rowDate = new Date(row.date);
                      let day = rowDate.getDate();
                      let month = rowDate.getMonth()+1;
                      let year = rowDate.getFullYear();
                      let hour = rowDate.getUTCHours();
                      let minutes = rowDate.getUTCMinutes();

                      let date = `${day}/${month}/${year}`; 
                      let hourDate = `${hour}:${minutes}`;
                    return (
                    <TableRow key={row.customer_id}>
                      <TableCell component="td" scope="row">
                        <ListItemText primary={row.customer}/>
                      </TableCell>
                      <TableCell numeric>
                        <ListItemText secondary={date}/>
                      </TableCell>
                      <TableCell numeric>
                        <ListItemText secondary={hourDate}/>
                      </TableCell>
                    </TableRow>
                  );
                       })}
                      {emptyRows > 0 && (
                      <TableRow style={{ height: 48 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          colSpan={3}
                          count={rows.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onChangePage={this.handleChangePage}
                          onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TabContainer>}
              </section>
            </div>
        </div>
      </main>
    );
  }
}

export default Consultas;
