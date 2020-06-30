import React from "react";

import {
  FormGroup,
  Label,
  Input,
  FormText
} from "reactstrap";

import {Button} from "reactstrap";

const Forms = () => {
  return (
    <form>
      <FormGroup>
        <Label for="exampleEmail">Email address</Label>
        <Input
          type="email"
          name="email"
          id="exampleEmail"
          placeholder="Enter email"
        />
        <FormText color="muted">
          We'll never share your email with anyone else.
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input
          type="password"
          name="password"
          id="examplePassword"
          placeholder="Password"
        />
      </FormGroup>
      <FormGroup check>
        <Label check>
          <Input type="checkbox" />{' '}
          Check me out
          <span className="form-check-sign">
            <span className="check"></span>
        </span>
        </Label>
      </FormGroup>
      <Button color="primary" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default Forms;
