import React from "react";

import Header from "../layouts/header";
import '../assets/css/Cards.css'

import { ApiCari } from "../services/apirest";
import axios from "axios";

class Inicio extends React.Component {

    manejadorSubmit = e => {
        e.preventDefault();
    }

    state = {
        reportes : [],
        clientes : [],
        problemas : [],
        form : {
            "PKTblClientes" : "",
            "PKCatProblemas" : "",
            "descripcionProblema" : "",
            "observaciones" : "",
            "PKTblEmpleados" : localStorage.getItem("PKTblEmpleados")
        },
        message : false,
        textMessage : "",
        typeMessage : 'alert alert-success alert-dismissible',
        errMessage : false,
        errTextMessage : "",
        errTypeMessage : 'alert alert-danger alert-dismissible',
        formConsulta : {
            "formNombreCliente" : "",
            "formFolio" : "",
            "formNombre" : "",
            "formAPaterno" : "",
            "formAMaterno" : "",
            "formTelefono" : "",
            "formTelefono2" : "",
            "formPoblacion" : "",
            "formCooredenadas" : "",
            "formDireccion" : "",
            "formReferencias" : "",
            "formProblema" : "",
            "formDescripcionProblema" : "",
            "formObservaciones" : "",
            "formDiagnostico" : "",
            "formSolucion" : "",
            "formEmpleadoRecibio" : "",
            "formFechaAlta" : "",
            "formHoraAlta" : ""
        },
        detalleReporte : true
    }

    clickDetalleReporte (pk) {
        let url = ApiCari + "obtener_detalleReporte/"+ pk;

        axios.get(url).then(response => {
            this.setState({
                formConsulta : {
                    formNombreCliente       : response.data[0].nombreCliente+' '+response.data[0].apellidoPaterno+' '+response.data[0].apellidoMaterno,
                    formFolio               : response.data[0].folio,
                    formNombre              : response.data[0].nombreCliente,
                    formAPaterno            : response.data[0].apellidoPaterno,
                    formAMaterno            : response.data[0].apellidoMaterno,
                    formTelefono            : response.data[0].telefono,
                    formTelefono2           : response.data[0].telefonoOpcional,
                    formPoblacion           : response.data[0].nombrePoblacion,
                    formCooredenadas        : response.data[0].coordenadas,
                    formDireccion           : response.data[0].direccion,
                    formReferencias         : response.data[0].referencias,
                    formProblema            : response.data[0].nombreProblema,
                    formDescripcionProblema : response.data[0].descripcionProblema,
                    formObservaciones       : response.data[0].observaciones,
                    formDiagnostico         : response.data[0].diagnostico,
                    formSolucion            : response.data[0].solucion,
                    formEmpleadoRecibio     : response.data[0].empleadoRecibio,
                    formFechaAlta           : response.data[0].fechaAlta,
                    formHoraAlta            : response.data[0].horaAlta
                },
                detalleReporte : true
            })
        })
    }

    componentDidMount () {
        let reportesAtr = ApiCari + "obtener_insumos";

        axios.get(reportesAtr).then(response => {
            this.setState({
                reportes    : response.data.reportes,
                clientes    : response.data.clientes,
                problemas   : response.data.problemas
            })
        }).catch( e => {
            console.log(e);
        })
    }

    manejadorChange = async e => {
        await this.setState({
            form : {
                ...this.state.form,
                [e.target.name] : e.target.value
            }
        })
    }

    registrarReporte = () => {
        let registrarReporte = ApiCari + 'registrar_reporte';

        if (
            this.state.form.PKCatProblemas      != null && this.state.form.PKCatProblemas      != "" &&
            this.state.form.PKTblClientes       != null && this.state.form.PKTblClientes       != "" &&
            this.state.form.PKTblEmpleados      != null && this.state.form.PKTblEmpleados      != "" &&
            this.state.form.descripcionProblema != null && this.state.form.descripcionProblema != "" &&
            this.state.form.observaciones       != null && this.state.form.observaciones       != ""
        ) {
            axios.post(registrarReporte, this.state.form).then( response => {
                this.setState({
                    message : true,
                    textMessage : 'Registro exitoso',
                })
            }).catch( e => {
                this.setState({
                    errMessage : true,
                    errTextMessage : e.response.data.message,
                })
            })
            document.querySelector('#cerrarModal').click();
        } else {
            this.setState({
                errMessage : true,
                errTextMessage : 'Aún hay campos vacíos',
            })
        }
    }

    render() { 
        return (
            <React.Fragment>
                <Header></Header>

                <div className="col-md-12">
                    <br/>
                    <div className="container">
                        {this.state.message === true &&
                            <div className="form-group col-md-12" style={{marginTop: '1%'}}>
                                <div className="alert alert-success alert-dismissible">
                                    {this.state.textMessage}
                                </div>
                            </div>
                        }
                    </div>
                    <h2 align="center"><b className="title">Pendientes</b></h2>
                    <br/>
                    <div className="container">
                        <h4 align="center"><b className="subtitle">Reportes</b></h4>
                        <div className="notifications">

                            { this.state.reportes.map((value, index) => {
                                return (
                                    <div className="notifications__item verModalReporte" key={index} data-bs-toggle='modal' data-bs-target='#verModalReporte' onClick={()=>this.clickDetalleReporte(value.folio)}>
                            
                                        <div className="notifications__item__avatar">
                                            <img src="https://cari.villasoftsolutions.com/project/public/images/reportes/1.png"/>
                                        </div>

                                        <div className="notifications__item__content">
                                            <span className="notifications__item__title"><b>{value.nombreCliente} {value.apellidoPaterno} {value.apellidoMaterno}</b></span>
                                            <span className="notifications__item__message"><b>{value.nombrePoblacion}</b></span>
                                            <span className="notifications__item__message">{value.nombreProblema}</span>
                                            <span className="notifications__item__message">{value.fechaAlta}</span>
                                        </div>

                                    </div>
                                )
                            })}

                            <a href="/reportes"><h4><b className="subtitle">Ver más...</b></h4></a>
                        </div>
                    </div>
                </div>

                {this.state.detalleReporte === true &&
                    <div id="verModalReporte" className="modal" role="dialog">
                        <div className="modal-dialog modal-dialog-scrollable modal-lg">
                            <div className="modal-content">
                                <div className="modal-header colorFondoTitulo" style={{textAlign: 'center'}}>
                                    <h4 data-bs-dismiss="modal" className="modal-title"><center><b className="tituloPrincipalModal">{this.state.formConsulta.formNombreCliente}</b></center></h4>
                                    <section id="atendiendo" style={{marginTop: '0px'}}></section>
                                </div>
                                <div className="modal-body">
                                    <form className="form-horizontal" autoComplete="nope" method="post">
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Folio:</b></label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="PKTblReportes" readOnly style={{background: 'white'}} value={this.state.formConsulta.formFolio}/>
                                            </div>
                                        </div>
    
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Nombre:</b></label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="nombreCliente" readOnly style={{background: 'white'}} value={this.state.formConsulta.formNombre}/>
                                            </div>
                                        </div>
    
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Apellido Paterno:</b></label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="apellidoPaterno" readOnly style={{background: 'white'}} value={this.state.formConsulta.formAPaterno}/>
                                            </div>
                                        </div>
    
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Apellido Materno:</b></label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="apellidoMaterno" readOnly style={{background: 'white'}} value={this.state.formConsulta.formAMaterno}/>
                                            </div>
                                        </div>
    
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Tel&eacute;fono:</b></label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" maxLength="10" name="telefono" readOnly style={{background: 'white'}} value={this.state.formConsulta.formTelefono}/>
                                            </div>
                                        </div>
    
                                        <section className="telefonoOcional"></section>
    
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Población:</b></label>
                                            <div className="col-sm-9">
                                                <select name="PKCatPoblaciones" className="form-control poblacion" readOnly style={{background: '#FFDFDF'}}>
                                                    <option>{this.state.formConsulta.formPoblacion}</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Coordenadas:</b></label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" style={{background: '#6DB3FF', color: 'white'}} name="coordenadas" readOnly placeholder="Coordenadas" value={this.state.formConsulta.formCooredenadas}/>
                                            </div>
                                        </div>
                                        
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Dirección:</b></label>
                                            <div className="col-sm-9">
                                                <textarea rows="1" className="form-control" name="direccion" id="direccion3" readOnly style={{background: 'white'}} defaultValue={this.state.formConsulta.formDireccion}></textarea>
                                            </div>
                                        </div>
                                        
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Referencias:</b></label>
                                            <div className="col-sm-9">
                                                <textarea rows="1" className="form-control" name="referencias" id="referencias3" readOnly style={{background: 'white'}} defaultValue={this.state.formConsulta.formReferencias} placeholder="Referencias"></textarea>
                                            </div>
                                        </div>
                                        <h6 align="center">
                                            <b>Detalles del reporte</b>
                                        </h6>
                                        <hr/>
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Problema:</b></label>
                                            <div className="col-sm-9">
                                                <select name="PKCatProblemas" className="form-control tproblema" readOnly style={{background: '#FFDFDF'}}>
                                                    <option>{this.state.formConsulta.formPoblacion}</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Descripción del problema:</b></label>
                                            <div className="col-sm-9">
                                                <textarea rows="1" className="form-control" name="descripcionProblema" defaultValue={this.state.formConsulta.formDescripcionProblema}></textarea>
                                            </div>
                                        </div>
                                        
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Observaciones:</b></label>
                                            <div className="col-sm-9">
                                                <textarea rows="1" className="form-control" name="observaciones" defaultValue={this.state.formConsulta.formObservaciones} placeholder="Observaciones"></textarea>
                                            </div>
                                        </div>
                                        
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Diagnostico:</b></label>
                                            <div className="col-sm-9">
                                                <textarea rows="1" className="form-control" name="diagnostico" defaultValue={this.state.formConsulta.formDiagnostico} placeholder="Diagnostico"></textarea>
                                            </div>
                                        </div>
                                        
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Solución:</b></label>
                                            <div className="col-sm-9">
                                                <textarea rows="1" className="form-control" name="solucion" defaultValue={this.state.formConsulta.formSolucion} placeholder="Solución"></textarea>
                                            </div>
                                        </div>
    
                                        <h6 align="center">
                                            <b>Registrado por 
                                                <b style={{color: '#008FFF'}}> {this.state.formConsulta.formEmpleadoRecibio}</b>
                                            </b>
                                        </h6>
                                        <hr/>
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Fecha:</b></label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" readOnly style={{background: 'white'}} value={this.state.formConsulta.formFechaAlta}/>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-12">
                                            <label className="control-label col-sm-3"><b>Hora:</b></label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" readOnly style={{background: 'white'}} value={this.state.formConsulta.formHoraAlta}/>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3 apartadoBotones" style={{textAlign: 'center'}}></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <div id="modalReporte" className="modal" role="dialog">
                    <div className="modal-dialog modal-dialog-scrollable modal-lg">

                        <div className="modal-content">
                            <div className="modal-header" data-bs-dismiss="modal" style={{textAlign: 'center !important'}}>
                                <center><h4 className="modal-title"><b>Generar reporte</b></h4></center>
                            </div>
                            <div className="modal-body">
                                <form className="form-<horizontal" onSubmit={this.manejadorSubmit}>

                                    <div className="form-group col-md-12">
                                        <label className="control-label col-sm-3"><b>Cliente:</b></label>
                                        <div className="col-sm-9">
                                            <select name="PKTblClientes" className="form-control" required style={{background: '#D5EDFF'}} onChange={this.manejadorChange}>
                                                <option value={""} style={{visibility: 'hidden', display: 'none'}}>Seleccione un cliente</option>
                                                { this.state.clientes.map((value, index) => {
                                                    return (
                                                        <option key={index} value={value.PKTblClientes}>{value.nombreCliente} {value.apellidoPaterno} {value.apellidoMaterno}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="form-group col-md-12">
                                        <label className="control-label col-sm-3"><b>Problema:</b></label>
                                        <div className="col-sm-9">
                                            <select id="tproblema" name="PKCatProblemas" className="form-control" required style={{background: '#D5EDFF'}} onChange={this.manejadorChange}>
                                                <option value={""} style={{visibility: 'hidden', display: 'none'}}>Seleccione un problema</option>
                                                { this.state.problemas.map((value, index) => {
                                                    return (
                                                        <option key={index} value={value.PKCatProblemas}>{value.nombreProblema}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group col-md-12">
                                        <label className="control-label col-sm-3"><b>Descripción del problema:</b></label>
                                        <div className="col-sm-9">
                                            <textarea rows="1" className="form-control" id="problema" placeholder="Descripción del problema" name="descripcionProblema" required onChange={this.manejadorChange}></textarea>
                                        </div>
                                    </div>

                                    <div className="form-group col-md-12">
                                        <label className="control-label col-sm-3"><b>Observaciones:</b></label>
                                        <div className="col-sm-9">
                                            <textarea rows="1" className="form-control" id="observaciones" placeholder="Observaciones" name="observaciones" onChange={this.manejadorChange}></textarea>
                                        </div>
                                    </div>

                                    {this.state.errMessage === true &&
                                        <div className="form-group col-md-12" style={{marginTop: '1%'}}>
                                            <div className={this.state.errTypeMessage}>
                                                <strong>Upss!</strong> {this.state.errTextMessage}
                                            </div>
                                        </div>
                                    }

                                    <div className="form-group col-md-12">
                                        <div className="col-sm-9" style={{textAlign: 'center'}}>
                                            <button name="registrar" className="btn form-control" style={{background: '#FFA26D', fontWeight: 'bold', color: 'white'}} onClick={()=>this.registrarReporte()}><b>Generar reporte</b></button>
                                        </div>
                                        <div className="col-sm-3">
                                            <button id="cerrarModal" data-bs-dismiss="modal" className="btn form-control" style={{background: '#FF6A6A', color: 'white'}}><b>X</b></button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
                

            </React.Fragment>
        );
    }
}

export default Inicio