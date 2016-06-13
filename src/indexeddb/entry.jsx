import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import '../lib/css/normalize.scss';
import css from "./css.scss";

import {IndexedDB} from './indexeddb-ui.jsx';
import {HandleBar} from './handle-bar.jsx';


//

ReactDOM.render( (
    <div className={css.wrap}>
        <IndexedDB storeName="LizhiMockAPI8" keyPath="name" instantUse={window.o_import}>
            <HandleBar/>
        </IndexedDB>
        
    </div>
), document.getElementById( 'list' ) );