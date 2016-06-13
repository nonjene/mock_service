import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import '../lib/css/normalize.scss';
import css from "./css.scss";

import {DBList} from './db-list.jsx';
//import {HandleBar} from './handle-bar.jsx';

/*
ReactDOM.render( (
    <div className={css.wrap}>
        <IndexedDB storeName="LizhiMockAPI8" keyPath="name" instantUse={window.o_import}>
            <HandleBar/>
        </IndexedDB>
        
    </div>
), document.getElementById( 'list' ) );
*/

ReactDOM.render( (
    <div className={css.wrap}>
        <DBList storeName="LizhiMockAPI13" keyPath="id" instantUse={window.o_import}/>

    </div>
), document.getElementById( 'list' ) );