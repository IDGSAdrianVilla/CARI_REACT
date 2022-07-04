import React from "react";
import './assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from "./components/Login";
import Inicio from "./components/Inicio";
import Reportes from "./components/Reportes";
import { BrowserRouter , Switch , Route } from "react-router-dom";

function App() {
    return (
        <React.Fragment>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact render = { props => ( <Login {...props} />)}></Route>
                    <Route path="/inicio" exact render = { props => ( <Inicio {...props} />)}></Route>
                    <Route path="/reportes" exact render = { props => ( <Reportes {...props} />)}></Route>
                </Switch>
            </BrowserRouter>
        </React.Fragment>
    );
}

export default App;