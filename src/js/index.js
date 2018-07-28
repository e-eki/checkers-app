
//import '../less/template.less';
import './app.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';

ReactDOM.render(
    (
        <App height = {document.documentElement.clientHeight} width = {document.documentElement.clientWidth}/>
    ),
    document.getElementById("root")
  );