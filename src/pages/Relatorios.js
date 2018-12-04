import React, { Component } from 'react';
import $ from 'jquery';
import { CSVLink } from "react-csv";
import moment from 'moment';

class Relatorios extends Component {
    constructor() {
        super();
        this.state = {
            customers: [],
            appointments: [],
            payments: [],
        };
      
    }

    componentDidMount() {

        $.ajax({
            url: 'http://ema-api.herokuapp.com/api/invoices',
            crossDomain: true,
            dataType: 'json',
            success: function (resultado) {
                console.log(" Faturas ", resultado)
                resultado.forEach(payment => {
                    //TODO -- da conflito com o status do costumers, se deixar os 2 um nao pega
                    payment.status = payment.status === true ? "Pago" : "Em Aberto"
                });
                this.setState({ payments: resultado })
            }.bind(this)
        });


        $.ajax({
            url: 'http://ema-api.herokuapp.com/api/appointments',
            crossDomain: true,
            dataType: 'json',
            success: function (resultado) {
                resultado.forEach((appointment) => {
                    if (appointment.start_time) {
                        appointment.start_time = moment(appointment.start_time).format("DD/MM/YYYY");
                    }
                    if (appointment.end_time) {
                        appointment.end_time = moment(appointment.end_time).format("DD/MM/YYYY");
                    }
                    // if(appointment.status) {
                    //     //TODO -- true = ??
                    //     appointment.status = appointment.status === true ? "...": "..."
                    // }                                                                                                                                                                                                                                          
                })
                this.setState({ appointments: resultado })
            }.bind(this)
        })


        $.ajax({
            url: 'http://ema-api.herokuapp.com/api/customers',
            crossDomain: true,
            dataType: 'json',
            success: function (resultado) {
                resultado.forEach(customer => {
                    //TODO -- da conflito com o status do payments, se deixar os 2 um nao pega
                    customer.status = customer.status === true ? "Ativo" : "Inativo";
                    //TODO -- CRASHA O RESTO DAS DATAS
                    customer.created_at = moment(customer.created_at).format("DD/MM/YYYY");
                });
                this.setState({ customers: resultado })
            }.bind(this),
            error: function (resultado) {
                console.log("deu ruim: ", resultado);
            }
        });
    }

    render() {

        let headersCustomers = [
            { label: "Id", key: "id" },
            { label: "Nome", key: "name" },
            { label: "Email", key: "email" },
            { label: "Telefone", key: "phone" },
            { label: "Cliente desde", key: "created_at" },
            { label: "Status", key: "status" },
        ];

        let headersAppointments = [
            { label: "Id", key: "id" },
            { label: "Nome", key: "customer" },
            { label: "Data de Inicio", key: "start_time" },
            { label: "Data de Encerramento", key: "end_time" },
            { label: "Preço", key: "price" },
            { label: "Status", key: "status" },
        ];

        let headersPayments = [
            { label: "Id", key: "id" },
            { label: "Competencia", key: "competence" },
            { label: "Valor", key: "value" },
            { label: "Data de Vencimento", key: "due_date" },
            { label: "Data de Pagamento", key: "payment" },
            { label: "Status", key: "status" }
        ];

        return (
            <main className="content-wrap">
                <header className="content-head">
                    <h1>Relatórios</h1>
                </header>
                <div className="content">
                    <section className="info-report">
                        <div className="info-box">
                            <div className="box-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21 20V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1zm-2-1H5V5h14v14z" /><path d="M10.381 12.309l3.172 1.586a1 1 0 0 0 1.305-.38l3-5-1.715-1.029-2.523 4.206-3.172-1.586a1.002 1.002 0 0 0-1.305.38l-3 5 1.715 1.029 2.523-4.206z" /></svg>
                            </div>
                            <CSVLink filename={"relatorios-pagamentos.csv"} className="exportReport" data={this.state.payments} headers={headersPayments}>
                                Relatorio de Pagamentos
                        </CSVLink>
                        </div>

                        <div className="info-box">
                            <div className="box-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 10H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V11a1 1 0 0 0-1-1zm-1 10H5v-8h14v8zM5 6h14v2H5zM7 2h10v2H7z" /></svg>
                            </div>

                            <CSVLink filename={"relatorio-consultas.csv"} className="exportReport" data={this.state.appointments} headers={headersAppointments}>
                                Relatório de Consultas
                        </CSVLink>
                        </div>

                        <div className="info-box active">
                            <div className="box-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3,21c0,0.553,0.448,1,1,1h16c0.553,0,1-0.447,1-1v-1c0-3.714-2.261-6.907-5.478-8.281C16.729,10.709,17.5,9.193,17.5,7.5 C17.5,4.468,15.032,2,12,2C8.967,2,6.5,4.468,6.5,7.5c0,1.693,0.771,3.209,1.978,4.219C5.261,13.093,3,16.287,3,20V21z M8.5,7.5 C8.5,5.57,10.07,4,12,4s3.5,1.57,3.5,3.5S13.93,11,12,11S8.5,9.43,8.5,7.5z M12,13c3.859,0,7,3.141,7,7H5C5,16.141,8.14,13,12,13z" /></svg>
                            </div>
                            <CSVLink filename={"relatorio-clientes.csv"} className="exportReport" data={this.state.customers} headers={headersCustomers}>
                                Relatório de Clientes
                        </CSVLink>

                        </div>

                    </section>
                </div>
            </main>
        );
    }
}

export default Relatorios;