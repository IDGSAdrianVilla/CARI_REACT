import React from "react";
import '../assets/css/Login.css';
import { ApiCari } from "../services/apirest";
import axios from "axios";

class Login extends React.Component {

    constructor (props) {
        super(props);
    }

    state = {
        from:{
            "correo" : "",
            "contrasenia" : ""
        },
        error : false,
        errorMsg : ""
    }

    manejadorSubmit = e => {
        e.preventDefault();
    }

    manejadorChange = async e => {
        await this.setState({
            form : {
                ...this.state.form,
                [e.target.name] : e.target.value
            }
        })
    }

    manejadorBoton=()=>{
        let url = ApiCari + 'login_react';

        axios.post(url, this.state.form).then( response => {
            localStorage.setItem("token", response.data.token_key);
            localStorage.setItem("PKTblEmpleados", response.data.PKTblEmpleados);
            this.props.history.push("/inicio");
        }).catch( e => {
            this.setState({
                error : true,
                errorMsg : e.response.data.message
            })
        })
    }

    render () {
        return (
            <React.Fragment>
                <div className="container-fluid ps-md-0">
                    <div className="row g-0">
                        <div className="d-none d-md-flex col-md-4 col-lg-7 bg-image"></div>
                        <div className="col-md-8 col-lg-5">
                            <div className="login d-flex align-items-center py-5">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-9 col-lg-8 mx-auto">
                                            <h2 className="login-heading mb-4"><b>Bienvenid@ a CARI</b></h2>
                                            <form onSubmit={this.manejadorSubmit}>
                                                <div className="form-floating mb-3">
                                                    <input type="email" className="form-control" id="correo" name="correo" placeholder="correo" onChange={this.manejadorChange}/>
                                                    <label>Correo electrónico</label>
                                                    <br/>
                                                    <b id="result"></b>
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <input type="password" className="form-control" id="contrasenia" name="contrasenia" placeholder="contrasenia" onChange={this.manejadorChange}/>
                                                    <label>Contraseña</label>
                                                </div>

                                                <center>
                                                    <div className="g-recaptcha" data-sitekey="6Le3XXogAAAAAGgD2zCTsaVT6cMwAFzF68aKgEoE"></div>
                                                    <br/>
                                                </center>

                                                <div className="form-check mb-3">
                                                    <input className="form-check-input" type="checkbox" value="" id="rememberPasswordCheck"/>
                                                    <label className="form-check-label">
                                                        Recordar contraseña
                                                    </label>
                                                </div>

                                                {this.state.error === true &&
                                                    <center><b className="msjError">{this.state.errorMsg}</b></center>
                                                }
                                                <br/>
                                                <div className="d-grid">
                                                    <button className="btn btn-lg btn-login text-uppercase fw-bold mb-2" type="submit" onClick={this.manejadorBoton}>Entrar</button>
                                                    <div className="text-center">
                                                        <a className="small" href="#">¿Olvidaste tu contraseña?</a>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <footer>
                    <p>
                        ©Copyright
                        <a href="#"> VillaSoftSolutions.com</a> | 
                        Designed By
                        <a target="_blank" href="https://idgsadrianvilla.github.io/"> Adrián Villa</a>
                    </p>
                </footer>
            </React.Fragment>
        )
    }

}

export default Login