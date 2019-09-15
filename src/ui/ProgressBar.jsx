import React, {Component} from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

export default class ProgressBar extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return(
            // <div style={{marginBottom: '15px'}} className="progressbar-wrapper">
            //     {/* <div style={{color: "white", marginRight: "5px"}}>{`${Math.floor(this.props.progress/1000/60)}:${('00'+Math.round((this.props.progress % 60000)/1000)).slice(-2)}`}</div> */}
            //     {/* <div className="progressbar-bg">
            //         <div style={{ width: `${(this.props.progress / this.props.length) * 100}%`}} className="progressbar"></div>
            //     </div> */}

            //     {/* <div style={{color: "white", marginLeft : "5px"}}>{`${Math.floor(this.props.length/1000/60)}:${('00'+Math.round((this.props.length % 60000)/1000)).slice(-2)}`}</div> */}
            // </div>
            <LinearProgress style={{marginBottom: '15px'}}  color="secondary" variant="determinate" value={(this.props.progress / this.props.length) * 100} />
        );

    }
}