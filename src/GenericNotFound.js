import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class GenericNotFound extends Component {
    render() {
        return (
            <div>
                <p style={{textAlign:"center"}}>
                <Link to="/">Go to Home </Link>
            </p>
            </div>
        )
    }
}

export default GenericNotFound;