import React, { Component } from 'react'

export default class Text extends Component
{
    constructor(props)
    {
        super(props);
    }

    loadURL()
    {
        window.shell.openExternal(this.props.url);
    }

    render()
    {
        return (
            <a onClick={this.loadURL.bind(this)} className={"text " + this.props.type}>{this.props.text}</a>
        );
    }
}