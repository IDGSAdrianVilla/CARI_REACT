import React from "react";

import Header from "../layouts/header";
import '../assets/css/Cards.css';

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
        reportesPendientes : [],
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
                    formCooredenadasMaps    : 'https://www.google.es/maps?q='+response.data[0].coordenadas,
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

        let reportesPendientes = ApiCari + "obtener_reportes/Pendiente";

        axios.get(reportesPendientes).then(response => {
            this.setState({
                reportesPendientes : response.data
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

                    <div className="container">
                        <div className="form-group">
                            <br />
                            <label htmlFor="" className="label-control"><b>Buscar reporte pendiente:</b></label>
                            <input className="form-control" type="text" placeholder="Buscar reporte pendiente"/>
                            <br />
                        </div>
                    </div>

                    <table className="table">
                        <thead style={{background: '#5F5F5F', color: 'white'}}>
                            <tr>
                                <th scope="col" style={{textAlign: 'center'}}>Folio</th>
                                <th scope="col" style={{textAlign: 'center'}}>Cliente</th>
                                <th scope="col" style={{textAlign: 'center'}}>Teléfono</th>
                                <th scope="col" style={{textAlign: 'center'}}>Problema</th>
                                <th scope="col" style={{textAlign: 'center'}}>Fecha</th>
                                <th scope="col" style={{textAlign: 'center'}}>Población</th>
                                <th scope="col" style={{textAlign: 'center'}}>Maps</th>
                                <th scope="col" style={{textAlign: 'center'}}>Atender</th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.state.reportesPendientes.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <td data-bs-toggle='modal' data-bs-target='#verModalReporte' onClick={()=>this.clickDetalleReporte(value.folio)} style={{textAlign: 'center'}} scope="col">{value.folio}</td>
                                        <td data-bs-toggle='modal' data-bs-target='#verModalReporte' onClick={()=>this.clickDetalleReporte(value.folio)} style={{textAlign: 'center'}} >{value.nombreCliente}</td>
                                        <td style={{textAlign: 'center', color:'gray'}} scope="col"><b>{value.telefono}</b></td>
                                        <td data-bs-toggle='modal' data-bs-target='#verModalReporte' onClick={()=>this.clickDetalleReporte(value.folio)} style={{textAlign: 'center'}} >{value.nombreProblema}</td>
                                        <td data-bs-toggle='modal' data-bs-target='#verModalReporte' onClick={()=>this.clickDetalleReporte(value.folio)} style={{textAlign: 'center'}} >{value.fechaAlta}</td>
                                        <td data-bs-toggle='modal' data-bs-target='#verModalReporte' onClick={()=>this.clickDetalleReporte(value.folio)} style={{textAlign: 'center'}} >{value.nombrePoblacion}</td>
                                        <td style={{textAlign: 'center'}} >
                                            <a target="_blank" href={value.formCooredenadasMaps}>
                                                <div style={{width: '100%', height: '100%'}}>
                                                    <img src="https://cari.villasoftsolutions.com/project/public/images/maps.png" alt="" width="22px" />
                                                </div>
                                            </a>
                                        </td>
                                        <td style={{textAlign: 'center'}} >
                                            <img src="https://cari.villasoftsolutions.com/project/public/images/incompleto.png" alt="" width="22px" />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
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