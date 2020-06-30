import React from 'react';
import { Spinner } from 'reactstrap';

const SpinnerEx = (props) => {
  return (
    <div>
      <Spinner style={{ width: '3.3rem', height: '3.3rem' }} color="primary" />
      <Spinner style={{ width: '3.3rem', height: '3.3rem' }} color="secondary" />
      <Spinner style={{ width: '3.3rem', height: '3.3rem' }} color="success" />
      <Spinner style={{ width: '3.3rem', height: '3.3rem' }} color="danger" />
      <Spinner style={{ width: '3.3rem', height: '3.3rem' }} color="warning" />
      <Spinner style={{ width: '3.3rem', height: '3.3rem' }} color="info" />
      <Spinner style={{ width: '3.3rem', height: '3.3rem' }} color="light" />
      <Spinner style={{ width: '3.3rem', height: '3.3rem' }} color="dark" />
    </div>
  );
}

export default SpinnerEx;
