import React, { Component } from 'react';

export default class Background extends Component {
    constructor(props)
    {
        super(props)
    }

    render()
    {
        return (
            <div className="bg">
                <div>
                <img style={{ opacity: this.props.opacity }} className="image" src={this.props.albumArt} alt="Album Art" />
                </div>
            </div>
        );
    }
}