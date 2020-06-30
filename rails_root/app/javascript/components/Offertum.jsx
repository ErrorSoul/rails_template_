import React, {Component} from 'react';
import { render } from 'react-dom';
import {EditorState} from "draft-js";
import {Editor} from "react-draft-wysiwyg"



// function uploadImageCallBack(file) {
//   return new Promise(
//     (resolve, reject) => {
//       const xhr = new XMLHttpRequest();
//       xhr.open('POST', 'https://api.imgur.com/3/image');
//       xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
//       const data = new FormData();
//       data.append('image', file);
//       xhr.send(data);
//       xhr.addEventListener('load', () => {
//         const response = JSON.parse(xhr.responseText);
//         resolve(response);
//       });
//       xhr.addEventListener('error', () => {
//         const error = JSON.parse(xhr.responseText);
//         reject(error);
//       });
//     }
//   );
// }


class EditorContainer extends Component{


  render(){

    return <div className='editor'>
      <Editor
        editorState={this.props.editorState}
        onEditorStateChange={this.props.draftChange}

      />
    </div>
  }
}






const App = (props) => (
  <div>
    <EditorContainer {...props} />
  </div>
);

export default App;
