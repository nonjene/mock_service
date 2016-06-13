/**
 * Created by Nonjene on 16/6/4.
 */
export default class DBHandler {
    constructor( {storeName,openStore, ...opt} ) {
        this.opt = opt;
        this.storeName = storeName;
        if(openStore==='instant'){
            this.promiseOpenStore = this.openStore();
        }
    }

    openStore() {
        return new Promise( ( resolve, reject )=> {
            var indexedDB = window.indexedDB;
            if (!indexedDB) {
                return console.log( "Your browser doesn't support a stable version of IndexedDB." ) || reject( 'browser not support' );
            }
            var request = indexedDB.open( this.storeName, 1 );

            request.onerror = function ( e ) {
                console.log( "error open " + this.storeName );
                return reject( e );
            }.bind( this );

            request.onsuccess = function ( e ) {
                this.db = request.result;
                console.log( 'success open:' + this.storeName );
                return resolve( this );
            }.bind( this );

            /**
             * @当首次打开这个库的时候,就会执行这个,可以在这初始化一些数据
             * @type {function(this:IndexedDB)}
             */
            request.onupgradeneeded = function ( e ) {
                var db = e.target.result;
                var objectStore = db.createObjectStore( this.storeName, {keyPath: this.opt.keyPath} );
                try {
                    objectStore.add( this.opt.initStoreData||{name: 'init_test'} );
                } catch ( e ) {
                    return reject( e );
                }
                //return resolve( this );
            }.bind( this );
        } );

    }

    /**
     * @desc  有就覆盖, 没有就新建
     * @param id
     * @param o
     * @returns {Promise}
     */
    writeOne( id, o ) {
        return new Promise( ( resolve )=> {
            this.readOne( id )
                .then( ()=>this.removeData( id ) )
                .then( ()=> this.addData( o ) )
                .then( ()=>resolve() )
                .catch( ()=>this.addData( o ) )
                .then( ()=>resolve() );
        } );
    }

    readAll() {
        return new Promise( ( resolve )=> {
            var objectStore = this.db.transaction( this.storeName ).objectStore( this.storeName );
            var data = [];
            objectStore.openCursor().onsuccess = function ( event ) {
                var cursor = event.target.result;
                if (cursor) {
                    data.push( cursor.value );
                    cursor.continue();
                } else {
                    resolve( data )
                }

            }.bind( this );
        } )
    }

    readOne( id ) {
        return new Promise( ( resolve, reject )=> {
            var transaction = this.db.transaction( [this.storeName] );
            var objectStore = transaction.objectStore( this.storeName );
            var request = objectStore.get( id );
            request.onerror = function ( e ) {
                console.log( "Unable to retrieve daa from database!" );
            };
            request.onsuccess = function ( e ) {
                // Do something with the request.result!
                if (request.result) {
                    resolve( request.result );
                } else {
                    reject( id );
                }
            };
        } )
    }

    addData( data ) {
        return new Promise( ( resolve, reject )=> {
            var request = this.db.transaction( [this.storeName], "readwrite" )
                .objectStore( this.storeName )
                .add( data );

            request.onsuccess = function ( e ) {
                console.log( "add success!" );
                //todo update state

                resolve( e.result )
            };

            request.onerror = function ( e ) {
                var str = data.id + " is aready exist in your database! ";
                console.log( str );
                reject( str )
            }
        } )
    }

    removeData( id ) {
        return new Promise( ( resolve,reject )=> {

            var request = this.db.transaction( [this.storeName], "readwrite" )
                .objectStore( this.storeName )
                .delete( id );
            request.onsuccess = function ( event ) {
                console.log( id + " removed" );
                //todo update state
                resolve();
            };
            request.onerror = reject;
        } )

    }
}