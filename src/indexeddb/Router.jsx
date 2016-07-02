import React from 'react';

export default class Router extends React.Component {
    constructor( props ) {
        super( props );

        this.dressedChildren = React.Children.map( this.props.children, child=> {
            return React.cloneElement( child, {
                route: this.getRoute(),
                routeChange: this.routeChange.bind(this)
            } )
        } );
    }

    routeChange( route ) {
        if(this.props.map){
            route= this.props.map[route]
        }
        window.location.hash = route;
    }

    getRoute() {
        var route = window.location.hash.substr( 1 );
        if (this.props.map) {
            route = this.props.map.indexOf( route );
            if (route === -1) route = 0;
        }

        return route;
    }


    render() {

        return (
            <div>
                {this.dressedChildren}
            </div>

        );
    }
}