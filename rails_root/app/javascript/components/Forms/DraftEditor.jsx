import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


class EditorConvertToHTML extends Component {
  constructor(props) {
    super(props);
    const html = (`<div className="row">
            <div className="col-12 mt-1">
              <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-6">
                  <p className="gray-modal-offers-text">Оплачиваемая цель</p>
                </div>
                <div className="col-6 pull-left">
                  <div className="text-left">

                    <p className="gray-modal-offers-text">Гео</p>
                  </div>
                </div>
              </div>
            </div>


            <div className="col-12 mt">
              <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-6">
                  <p className="black-modal-offers-text">Ревшара</p>
                </div>
                <div className="col-6 pull-left">
                  <div className="text-left">

                    <p className="black-modal-offers-text">RUS</p>
                  </div>
                </div>
              </div>
            </div>


            <div className="col-12 mt">
              <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-12">
                  <p className="gray-modal-offers-text">Порядок сверки и оплаты</p>
                </div>
                <div className="col-11">
                  <div className="text-left">

                    <p className="black-modal-offers-text">Сверка проводится два раза в месяц 2-6 числа и 16-20 за предыдущий период. Оплата проводится после сверки в ближайшую пятницу.</p>
                  </div>
                </div>
              </div>
            </div>


            <div className="col-12 mt-1">
              <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-12">
                  <p className="gray-modal-offers-text">Правила  траффика</p>
                </div>
                <div className="col-11">
                  <div className="text-left">

                    <p className="black-modal-offers-text">Не оплачивается мотив, фрод, трафик низкого качества (школьники, мертвые миндепы, etc). Если трафик уличен в мошенничестве, то оплачиваться не будет полностью. Категорически запрещено указывать сумму минимального депозита в креативах. Если такой факт будет обнаружен, то такой трафик не будет оплачен.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 mt-1">
              <div className="row no-gutters align-items-center justify-content-between">
                <div className="col-12">
                  <p className="gray-modal-offers-text">ОБЯЗАТЕЛЬНО ДЛЯ ВСЕХ ВЕБМАСТЕРОВ</p>
                </div>
                <div className="col-11">
                  <div className="text-left">

                    <p className="black-modal-offers-text">Не оплачивается мотив, фрод, трафик низкого качества (школьники, мертвые миндепы, etc). Если трафик уличен в мошенничестве, то оплачиваться не будет полностью. Категорически запрещено указывать сумму минимального депозита в креативах. Если такой факт будет обнаружен, то такой трафик не будет оплачен.</p>
                  </div>
                </div>
              </div>
            </div>


          </div>`);
    const contentBlock = htmlToDraft('');
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      }

    } else {
			this.state = {
				editorState: EditorState.createEmpty()
			}

		}
	}


  onEditorStateChange: Function = (editorState) => {
		// console.log('editor', editorState.getCurrentContent());
		// console.log('editortoJS', editorState.toJS());
		// console.log('convertTOraw',  convertToRaw(editorState.getCurrentContent()));
		// console.log('draftToHTML',  draftToHtml(convertToRaw(editorState.getCurrentContent())));
    this.setState({
      editorState,
    });
		this.props.textChange(editorState);
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={this.props.editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.props.textChange}
        />
      </div>
    );
  }
}


export default EditorConvertToHTML;
