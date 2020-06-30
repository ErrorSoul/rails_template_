import React from 'react';
import {
  FormGroup, Label, Input, FormText, FormFeedback, CustomInput,
} from 'reactstrap';
import InputMask from 'react-input-mask';

const FeedBack = (props) => (
  <FormFeedback
    className={props.isValid ? '' : 'v-f'}
  >
    {props.errorText}
  </FormFeedback>

);

const Example = (props) => {
  const isValid = !!props.isValid;
  const { isDirty } = props;
  const classNames = ['border-top-0 border-right-0 border-left-0 my-input-border', props.className].join(' ');
  return (

    <FormGroup className={props.formGroupClassName}>
      <FeedBack isValid={isValid} errorText={props.errors} />
      <Input
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.onChange}
        className={classNames}
        defaultValue={props.defaultValue}
        valid={isValid}
        invalid={!isValid && isDirty}
        type={props.type}
        maxLength={props.maxlength}
        minLength={props.minlength}
        readOnly={props.readonly}
	min={props.min}
	max={props.max}
      />
    </FormGroup>
  );
};


const ExampleProfile = (props) => {
  const isValid = !!props.isValid;
  const { isDirty } = props;
  const classNames = props.className;
  return (

    <FormGroup className={props.formGroupClassName}>
      <FeedBack isValid={isValid} errorText={props.errors} />
      <Input
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.onChange}
        className={classNames}

        value={props.value || props.defaultValue || ''}
        valid={isValid}
        invalid={!isValid && isDirty}
        type={props.type}
        maxLength={props.maxlength}
        minLength={props.minlength}
        readOnly={props.readonly}
	min={props.min}
	max={props.max}
        pattern={props.pattern}
      />
    </FormGroup>
  );
};

const ExampleText = (props) => {
  const isValid = !!props.isValid;
  const { isDirty } = props;
  const classNames = ['border-top-0 border-right-0 border-left-0 my-input-border', props.className].join(' ');
  return (

    <FormGroup className={props.formGroupClassName}>
      <FeedBack isValid={isValid} errorText={props.errors} />
      <Input
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.onChange}
        className={classNames}
        defaultValue={props.defaultValue}
        valid={isValid}
        invalid={!isValid && isDirty}
        type={"textarea"}
        maxLength={props.maxlength}
        minLength={props.minlength}
        readOnly={props.readonly}
      />
    </FormGroup>
  );
};


const ExampleSelect = (props) => {
  // select use Value, not defaultValue
  // https://github.com/reactstrap/reactstrap/issues/1501
  const isValid = !!props.isValid;
  const { isDirty } = props;
  const { options } = props;
  const classNames = ['border-top-0 border-right-0 border-left-0 my-input-border', props.className].join(' ');
  const mapOptions = () => {
    return(options.map((opt, index) => (<option key={index}>{opt}</option>)))
  }

  return (
    <FormGroup className={props.formGroupClassName}>
      <FeedBack isValid={isValid} errorText={props.errors} />
      <Input
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.onChange}
        className={classNames}
        defaultValue={props.defaultValue}
        valid={isValid}
        invalid={!isValid && isDirty}
        type='select'
        value={props.value}
        readOnly={props.readonly}
      >
        {mapOptions()}
      </Input>
    </FormGroup>
  );
};


const ExampleSelectProfile = (props) => {
  // select use Value, not defaultValue
  // https://github.com/reactstrap/reactstrap/issues/1501
  const isValid = !!props.isValid;
  const { isDirty } = props;
  const { options } = props;
  const classNames = ['border-top-0 border-right-0 border-left-0 my-input-border', props.className].join(' ');
  const mapOptions = () => {
    return(Object.keys(options).map((opt, index) => (<option value={options[opt]} key={index}>{opt}</option>)))
  }

  return (
    <FormGroup className={props.formGroupClassName}>
      <FeedBack isValid={isValid} errorText={props.errors} />
      <Input
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.onChange}
        className={classNames}
        defaultValue={props.defaultValue}
        valid={isValid}
        invalid={!isValid && isDirty}
        type='select'
        value={props.value}
        readOnly={props.readonly}
      >
        {mapOptions()}
      </Input>
    </FormGroup>
  );
};

const ExamplePhone = (props) => {
  const isValid = !!props.isValid;
  const { isDirty } = props;
  return (
    <FormGroup>
      <FeedBack isValid={isValid} errorText={props.errors} />
      <Input
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.onChange}
        className="border-top-0 border-right-0 border-left-0 my-input-border"
        defaultValue={props.defaultValue}
        valid={isValid}
        invalid={!isValid && isDirty}
        type="tel"
        mask="+7 999 999 99 99"
        maskChar={null}
        tag={InputMask}
      />
    </FormGroup>
  );
};


const ExampleProfilePhone = (props) => {
  const isValid = !!props.isValid;
  const { isDirty } = props;
  return (
    <FormGroup>
      <FeedBack isValid={isValid} errorText={props.errors} />
      <Input
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.onChange}
        className={props.classNames}
        defaultValue={props.defaultValue}
        valid={isValid}
        invalid={!isValid && isDirty}
        type="tel"
        mask="+7 999 999 99 99"
        maskChar={null}
        tag={InputMask}
      />
    </FormGroup>
  );
};

const ExampleCheck = (props) => {
  const isValid = !!props.isValid;
  const { isDirty } = props;
  return (

    <FormGroup>

      <CustomInput
        label={(
          <p className="p-checkbox-label">
Согласен с
            <span className="span-condition"> Условиями обработки персональных данных </span>
          </p>
      )}
        type="checkbox"
        id="exampleCustomCheckbox"
        name={props.name}
        onChange={props.onChange}
        className=""
        defaultValue={props.defaultValue}
        valid={isValid}
        invalid={!isValid && isDirty}
        maxLength={props.maxlength}
        minLength={props.minlength}
      />
      <FeedBack isValid={isValid} errorText={props.errors} />
    </FormGroup>
  );
};

export { Example, ExamplePhone, ExampleCheck, ExampleSelect, ExampleText, ExampleProfile, ExampleProfilePhone, ExampleSelectProfile };
