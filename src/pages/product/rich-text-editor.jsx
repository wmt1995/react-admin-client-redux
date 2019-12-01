import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from 'prop-types'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {
	static propTypes = {
		detail:PropTypes.string
	}
	constructor(props) {
    super(props);
    const html=this.props.detail
		let editorState
		if(html){
    	const contentBlock = htmlToDraft(html)
			const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      editorState = EditorState.createWithContent(contentState)
		}else{
    	editorState = EditorState.createEmpty()
		}
		this.state = {
        editorState,
      }
  }

  state = {
  	//创建一个没有内容的编辑对象
    editorState: EditorState.createEmpty(),
  }

  onEditorStateChange= (editorState) => {
    this.setState({
      editorState,
    });
  };
	getDetail = ()=>{
		const {editorState} = this.state
		//返回输入的文本的html格式
		return draftToHtml(convertToRaw(editorState.getCurrentContent()))
	}

uploadImageCallBack=(file)=> {
  return new Promise(
    (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/manage/img/upload');
      xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
      const data = new FormData();
      data.append('image', file);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        const url=response.data.url
        resolve({data:{link:url}});
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    }
  );
}
	componentDidMount () {

	}
  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{border:'1px solid black',minHeight:200,paddingLeft:10}}
          onEditorStateChange={this.onEditorStateChange}
					toolbar={{

      			image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
    }}
        />
      </div>
    );
  }
}