import React, { Component } from 'react';
import './pacientes.css';
import $ from 'jquery';
import { Scrollbars } from 'react-custom-scrollbars';
import PubSub from 'pubsub-js';
import MenuLateral from './components/Menu';
import TopMenu from './components/TopMenu';
import FormCadastroConsulta from './components/FormCadastroConsulta';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import './custom-animation.css';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}
const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

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
    };
    this.updateSearch = this.updateSearch.bind(this);
    // this.onOpenModal=this.onOpenModal.bind(this);
    // this.onCloseModal=this.onCloseModal.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
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
    this.setState({ isHidden: !this.state.isHidden })
  }

  updateSearch(event) {
    this.setState({ search: event.target.value.substr(0, 20) });
  }

  handleTabChange(event, value) {
    this.setState({ value });
  }

  render() {
    const { open } = this.state;
    const { value } = this.state;
    let formularioConsulta;
    if (!this.state.isHidden) {
      formularioConsulta = <FormCadastroConsulta/>
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

         {formularioConsulta}

         <div>
        <AppBar position="sticky">
          <Tabs value={value} onChange={this.handleTabChange}>
            <Tab value="dia" label="Consultas do dia" />
            <Tab value="mes" label="Consultas do mês" />
          </Tabs>
        </AppBar>
        {value === 'dia' && <TabContainer><section className="person-boxes">
        {
          this.state.lista.map(function(paciente, i){
            return (
              <div>
              <List>
                <ListItem>
                  <ListItemText primary={paciente.customer} secondary={paciente.start_time} />
                </ListItem>
              </List>
              </div>
              );
            }.bind(this))
            }
           </section></TabContainer>}
        {value === 'mes' && <TabContainer>Item Two</TabContainer>}
      </div>

          </Scrollbars>
        </div>
      </main>
    </div>
    );
  }
}

export default Consultas;
