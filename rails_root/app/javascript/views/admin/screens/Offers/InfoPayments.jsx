import React from "react";

class InfoAreas extends React.Component {
  render() {
    return (

      <div style={{'backgroundColor': 'white'}} className="mb-2 p-2 info">
        <div className='col-12'>
          <h4 className="info-title">Affise Payments</h4>
           <div className="col">
             <pre>{
                 JSON.stringify(this.props.payments, null, 2)
               }</pre>

				   </div>
          <p>
           Скоро: более красивая верстка
          </p>
        </div>
      </div>

    );
  }
}

export default InfoAreas;
