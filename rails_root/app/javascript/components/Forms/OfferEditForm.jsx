import React from 'react';
import { Form, Button, FormGroup, Col, Row, Input } from 'reactstrap';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { Example, ExamplePhone, ExampleSelect } from './FormGroup';
import SpinnerEx from '../Spinner';
import AppDataManager from '../AppDataManager';
import { logIn } from 'store/auth/actions';
import { notikNotik } from 'store/notifications/actions';
import { updateCashback } from 'store/offers/actions';
import { withRouter } from 'react-router-dom';
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from 'draft-js';
import EditorConvertToHTML from './DraftEditor';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Link } from 'react-router-dom';

class OfferEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id || '',
      title: props.title || '',
      cashback: props.cashback || 0,
      link: props.link || '',
      offer_type: props.offer_type || '',
      bonus_type: props.bonus_type || '',
      payout: props.payout || 0,
      affise_revenue: props.affise_revenue || 0,
      subtitle: props.subtitle || '',
      currency: props.currency || '',
      description: EditorState.createEmpty(),
      errors: {
        link: [],
        title: [],
        phone: [],
        password: [],
        password_confirmation: [],
        description: [],
        offer_type: [],
        payout: [],
        affise_revenue: [],
        subtitle: [],
        bonus_type: [],
        currency: []
      },

      validations: {
        title: {
          dirty: false,
          valid: false,
        },

        cashback: {
          dirty: false,
          valid: false,
        },

        link: {
          dirty: false,
          valid: false,
        },

        description: {
          dirty: false,
          valid: false,
        },

        offer_type: {
          dirty: false,
          valid: false,
        },

        payout: {
          dirty: false,
          valid: false,
        },

        affise_revenue: {
          dirty: false,
          valid: false,
        },

        subtitle: {
          dirty: false,
          valid: false,
        },

        bonus_type: {
          dirty: false,
          valid: false,
        },
        currency: {
          dirty: false,
          valid: false,
        },
      },

      formValid: false,
      isLoad: false,
    };
  }

  componentDidMount = () => {};

  handleInputChange = (event) => {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    console.log('Name/value', name, value);

    if (name == 'title') {
      this.props.updateTitle(value);
      this.setState({ [name]: value }, () => {
        this.validateField(name, value);
      });
    } else if (name == 'cashback') {
      this.setState({ [name]: value }, () => {
        this.props.updateCashback(value);
        this.validateField(name, value);
      });
    } else if (name == 'currency') {
      this.setState({ [name]: value }, () => {
        this.props.updateCurrency(value);
        this.validateField(name, value);
      });
    } else if (name == 'subtitle') {
      this.props.updateSubTitle(value);
      this.setState({ [name]: value }, () => {
        this.validateField(name, value);
      });
    } else if (name == 'payout') {
      this.props.updatePayout(value);
      this.setState({ [name]: value }, () => {
        this.validateField(name, value);
      });
    } else if (name == 'affise_revenue') {
      this.props.updateAffiseRevenue(value);
      this.setState({ [name]: value }, () => {
        this.validateField(name, value);
      });
    } else if (name == 'offer_type') {
      this.props.updateOfferType(value);
      this.setState({ [name]: value }, () => {
        this.validateField(name, value);
      });
    } else if (name == 'bonus_type') {
      this.props.updateBonusType(value);
      this.setState({ [name]: value }, () => {
        this.validateField(name, value);
      });
    } else if (name == 'link') {
      this.props.updateOfferLink(value);
      this.setState({ [name]: value }, () => {
        this.validateField(name, value);
      });
    } else {
      this.setState({ [name]: value }, () => {
        this.validateField(name, value);
      });
    }
  };

  handleChange = (editorState) => {
    this.setState({ description: editorState });
  };

  handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    this.setState({ isLoad: true });

    const {
      title,
      link,
      cashback,
      offer_type,
      payout,
      affise_revenue,
      subtitle,
      bonus_type,
      currency
    } = this.state;
    const { id } = this.props;
    const preEditorState = this.state.description || EditorState.createEmpty();
    const l = this.state.description
      ? this.state.description.getCurrentContent()
      : preEditorState.getCurrentContent();
    const description = convertToRaw(l);
    let json;
    try {
      const urlM = `/admin/offers/${this.props.id}`;

      json = await AppDataManager.api(urlM, {
        method: 'PATCH',
        parameters: {
          offer: {
            id,
            title,
            link,
            cashback,
            description,
            offer_type,
            payout,
            affise_revenue,
            subtitle,
            bonus_type,
            currency
          },
        },
      });
      this.props.updateOffer(json.offer);
    } catch (e) {
      const { validations } = this.state;
      const { errors } = e.json;

      for (const [key, value] of Object.entries(errors)) {
        validations[key].valid = false;
      }
      this.setState({
        errors,
        validations,
        formValid: false,
        isLoad: false,
      });
      console.warn(e);
      return;
    }

    this.setState({ errors: [], isLoad: false });

    const notikMessage = (
      <div className="mb-2">
        <p> {`Offer # ${id} успешно обновлен`}</p>
        <p>{`После сохранения статус оффера изменится`}</p>
      </div>
    );
    this.props.notikNotik(notikMessage);
  };

  validateField(fieldName, value) {
    const fieldValidationErrors = this.state.errors;
    let titleValid = this.state.validations.title.valid;
    let cashbackValid = this.state.validations.cashback.valid;
    let linkValid = this.state.validations.link.valid;
    let descValid = this.state.validations.description.valid;
    let offerTypeValid = this.state.validations.offer_type.valid;
    let payoutValid = this.state.validations.payout.valid;
    let affiseRevenueValid = this.state.validations.affise_revenue.valid;
    let subTitleValid = this.state.validations.subtitle.valid;
    let bonusTypeValid = this.state.validations.bonus_type.valid;
    let currencyValid = this.state.validations.currency.valid;

    const validationFields = this.state.validations;

    validationFields[fieldName].dirty = true;
    switch (fieldName) {
      case 'title':
        titleValid = value && value.length >= 6 && value.length < 245;
        console.log('titleValid', titleValid);
        fieldValidationErrors.title = titleValid
          ? ''
          : 'Некорректная длина title';
        validationFields[fieldName].valid = titleValid;
        break;

      case 'subtitle':
        subTitleValid = value && value.length >= 6 && value.length < 140;
        fieldValidationErrors.subtitle = subTitleValid
          ? ''
          : 'Некорректная длина subtitle';
        validationFields[fieldName].valid = subTitleValid;
        break;

      case 'offer_type':
        offerTypeValid = value && value.length >= 0;
        fieldValidationErrors.title = offerTypeValid
          ? ''
          : 'Выберите либо рубли, либо %';
        validationFields[fieldName].valid = offerTypeValid;
        break;

      case 'bonus_type':
        bonusTypeValid = value && value.length >= 0;
        fieldValidationErrors.title = bonusTypeValid
          ? ''
          : 'Выберите тип бонуса оффера';
        validationFields[fieldName].valid = bonusTypeValid;
        break;

      case 'currency':
        currencyValid = value && value.length >= 0;
        fieldValidationErrors.title = currencyValid
          ? ''
          : 'Выберите тип бонуса оффера';
        validationFields[fieldName].valid = currencyValid;
        break;

      case 'link':
        linkValid = value && value.length >= 6;
        fieldValidationErrors.link = linkValid ? '' : 'Link слишком короткий';
        validationFields[fieldName].valid = linkValid;
        break;

      case 'payout':
        payoutValid = value && value > 0;
        fieldValidationErrors.payout = payoutValid
          ? ''
          : 'Payout должен быть больше 0';
        validationFields[fieldName].valid = payoutValid;
        break;

      case 'affise_revenue':
        affiseRevenueValid = value && value > 0;
        console.log('affiseRevenueValid', affiseRevenueValid);
        fieldValidationErrors.affise_revenue = affiseRevenueValid
          ? ''
          : 'Revenue должен быть больше 0';
        validationFields[fieldName].valid = affiseRevenueValid;
        break;

      case 'description':
        descValid = value && value.length >= 25;
        fieldValidationErrors.link = descValid
          ? ''
          : 'Описание слишком короткое';
        validationFields[fieldName].valid = descValid;
        break;

      case 'cashback':
        cashbackValid = value && value > 0;
        fieldValidationErrors.cashback = cashbackValid
          ? ''
          : 'Должен быть больше 0';
        validationFields[fieldName].valid = cashbackValid;
        break;
      default:
        break;
    }
    this.setState(
      {
        errors: fieldValidationErrors,
        validations: validationFields,
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.validations.title.valid &&
        this.state.validations.subtitle.valid &&
        this.state.validations.offer_type.valid &&
        this.state.validations.payout.valid &&
        this.state.validations.affise_revenue.valid &&
        this.state.validations.cashback.valid &&
        this.state.validations.link.valid &&
        this.state.validations.currency.valid &&
        this.state.validations.bonus_type.valid
    });
  }

  descToDraft = (desc) => {
    const contentBlock = convertFromRaw(JSON.parse(desc));
    console.log('content from Raw', contentBlock);
    if (contentBlock) {
      //const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentBlock);
      return editorState;
    } else {
      return EditorState.createEmpty();
    }
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.title !== this.props.title ||
      nextProps.subtitle !== this.props.subtitle ||
      nextProps.link !== this.props.link ||
      nextProps.cashback !== this.props.cashback ||
      (nextProps.description !== this.props.description) ||
      nextProps.offer_type !== this.props.offer_type ||
      nextProps.bonus_type !== this.props.bonus_type ||
      nextProps.payout !== this.props.payout ||
      nextProps.currency !== this.props.currency ||
      nextProps.affise_revenue !== this.props.affise_revenue
    ) {
      const { validations } = this.state;
      for (const name of [
        'title',
        'link',
        'cashback',
        'description',
        'offer_type',
        'payout',
        'affise_revenue',
        'subtitle',
        'bonus_type',
        'currency'
      ]) {
        if (name == 'description') {
        console.log('this/next', this.props[name], nextProps[name]);
        console.log('Name', name);
        }

        if (name != 'description') {
          this.setState({ [name]: nextProps[name] });
          this.validateField(name, nextProps[name]);
        } else {
          const editorDesc =
            typeof nextProps[name] == 'string'
              ? this.descToDraft(nextProps[name])
              : nextProps[name];
          console.log('editorDesc', editorDesc);
          if (!nextProps[name] && this.state.description) {
            return;
          }
          this.setState({ [name]: editorDesc });
          this.validateField(name, editorDesc);
        }
      }
    }
  }

  render() {
    const { isLoad } = this.state;

    if (!this.props.offerLoad) {
      return <SpinnerEx />;
    }

    if (isLoad) {
      return <SpinnerEx />;
    }

    const styles = {
      editor: {
        border: '1px solid gray',
        minHeight: '6em',
      },
    };

    const affiseLink = 'https://my.3snet.ru/offer/' + this.props.affise_id;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row className="p-2">
          <Col className="pr-1" md="12">
            <FormGroup>
              <label>3snet Title (disabled)</label>
              <Input
                className="text-center"
                defaultValue={this.props.affise_title}
                disabled
                placeholder="Company"
                type="text"
              />
            </FormGroup>
            <Row>
              <Col md="3">
                <FormGroup>
                  <label>3snet Id</label>
                  <Input
                    className="text-center"
                    defaultValue={this.props.affise_id}
                    disabled
                    placeholder="Affise ID"
                    type="text"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <label>Affise Revenue</label>
                  <Input
                    className="text-center"
                    defaultValue={this.props.affise_revenue}
                    disabled
                    placeholder="Company"
                    type="text"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label>Ссылка в 3snet</label>
                  <Button
                    href={affiseLink}
                    tag={'a'}
                    target="_blank"
                    type="button"
                    className=" mt-0 form-control"
                  >
                    cсылка на 3snet
                  </Button>
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="p-2">
          <Col className="pr-1" md="12">
            <label>Заголовок оффера</label>
            <Example
              name="title"
              defaultValue={this.state.title}
              placeholder="Title"
              onChange={(e) => this.handleInputChange(e)}
              errors={this.state.errors.title}
              isValid={this.state.validations.title.valid}
              isDirty={this.state.validations.title.dirty}
            />
          </Col>

          <Col className="pr-1" md="6">
            <label>Кэшбек оффера</label>
            <Example
              name="cashback"
              type="number"
              defaultValue={this.state.cashback}
              placeholder="Cashback"
              onChange={(e) => this.handleInputChange(e)}
              errors={this.state.errors.cashback}
              isValid={this.state.validations.cashback.valid}
              isDirty={this.state.validations.cashback.dirty}
            />
          </Col>
          <Col className="pr-1" md="6">
            <label>Процент/$/рубли</label>
            <ExampleSelect
              name="offer_type"
              placeholder="Рубли/$/проценты"
              onChange={(e) => this.handleInputChange(e)}
              options={[null, 'rub', 'percent', '$']}
              errors={this.state.errors.offer_type}
              value={this.state.offer_type}
              isValid={this.state.validations.offer_type.valid}
              isDirty={this.state.validations.offer_type.dirty}
            />
          </Col>

          <Col className="pr-1" md="12">
            <label>Подзаголовок оффера</label>
            <Example
              name="subtitle"
              defaultValue={this.state.subtitle}
              placeholder="SubTitle"
              onChange={(e) => this.handleInputChange(e)}
              errors={this.state.errors.subtitle}
              isValid={this.state.validations.subtitle.valid}
              isDirty={this.state.validations.subtitle.dirty}
            />
          </Col>

          <Col className="pr-1" md="6">
            <label>Affise Revenue (приходит от 3snet)</label>
            <Example
              name="affise_revenue"
              type="number"
              defaultValue={this.state.affise_revenue}
              placeholder="Affise Revenue"
              onChange={(e) => this.handleInputChange(e)}
              errors={this.state.errors.affise_revenue}
              isValid={this.state.validations.affise_revenue.valid}
              isDirty={this.state.validations.affise_revenue.dirty}
            />
          </Col>
          <Col className="pr-1" md="6">
            <label>Бонус/Кэшбек</label>
            <ExampleSelect
              name="bonus_type"
              placeholder="Кэшбек/Бонус"
              onChange={(e) => this.handleInputChange(e)}
              options={[null, 'кэшбек', 'бонус']}
              errors={this.state.errors.bonus_type}
              value={this.state.bonus_type}
              isValid={this.state.validations.bonus_type.valid}
              isDirty={this.state.validations.bonus_type.dirty}
            />
          </Col>

          <Col className="pr-1" md="6">
            <label>Payout (получает юзер)</label>
            <Example
              name="payout"
              type="number"
              defaultValue={this.state.payout}
              placeholder="Payout"
              onChange={(e) => this.handleInputChange(e)}
              errors={this.state.errors.payout}
              isValid={this.state.validations.payout.valid}
              isDirty={this.state.validations.payout.dirty}
            />
          </Col>

          <Col className="pr-1" md="6">
            <label>Валюта оффера</label>
            <ExampleSelect
              name="currency"
              placeholder="Валюта оффера"
              onChange={(e) => this.handleInputChange(e)}
              options={[null, 'rub', '$', 'euro']}
              errors={this.state.errors.currency}
              value={this.state.currency}
              isValid={this.state.validations.currency.valid}
              isDirty={this.state.validations.currency.dirty}
            />
          </Col>
          <Col className="pr-1" md="12">
            <label>Ссылка</label>
            <Example
              type="url"
              name="link"
              placeholder="Link"
              defaultValue={this.state.link}
              onChange={(e) => this.handleInputChange(e)}
              errors={this.state.errors.link}
              isValid={this.state.validations.link.valid}
              isDirty={this.state.validations.link.dirty}
            />

            <FormGroup>
              <label>Описание</label>

              <EditorConvertToHTML
                editorState={this.state.description}
                textChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Button
                disabled={!this.state.formValid}
                color="danger"
                className="col-12 registration-button-submit"
              >
                Update Profile
              </Button>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     cashback: state.offer.cashback,
//   };
// };
const mapDispatchToProps = {
  logIn,
  notikNotik
};
export default withRouter(connect(null, mapDispatchToProps)(OfferEditForm));
