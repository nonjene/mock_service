import React from 'react';
import ReactDOM from 'react-dom';

import {App} from './App.jsx';
import Router from './Router.jsx';

ReactDOM.render( (
   <Router map={['home', 'autoResponse']}>
       <App />
   </Router>
), document.getElementById( 'root' ) );

