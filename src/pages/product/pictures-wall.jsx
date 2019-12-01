import React,{Component} from 'react'
import Proptypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd';
import {reqDeleteImg} from '../../api'
import {BASE_IMG_URL} from '../../utils/constants'
// 用于图片上传的组件
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default class PicturesWall extends Component {

	static propTypes = {
		ims:Proptypes.array
	}
	// state = {
	// 	previewVisible: false, //标识Modal隐藏
	// 	previewImage: '', //Modal显示的图片src
	// 	fileList: [],
	// };

	constructor (props){
		super(props)
		let fileList=[]
		const {imgs}=this.props
		if(imgs &&imgs.length>0){
			fileList=imgs.map((img,index) => ({
				uid:index*(-1),
				name:img,
				url:BASE_IMG_URL + img
			}))
		}
		this.state ={
			previewVisible: false, //标识Modal隐藏
			previewImage: '', //Modal显示的图片src
			fileList  //所有已上传图片的数组
		}
	}

	//获取所有已上传图片文件名的数组
	getImgs =()=>{
		return  this.state.fileList.map(item=>(item.name))
	}

	handleCancel = () => this.setState({ previewVisible: false });

	handlePreview = async file => {
		//file :当前操作的文件对象。
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}

		this.setState({
			previewImage: file.url || file.preview,
			previewVisible: true,
		});
	};

		//上传中、完成、失败都会调用这个函数。
		//file :当前操作的文件对象。
		//fileList 当前的文件列表。
	handleChange = async({ file,fileList }) => {
		if(file.status==='done'){
			const result = file.response //{status:0,data:{name:'111',url:'图片地址'}}
			if(result.status===0){
				message.success('上传图片成功')
				const {name,url}=result.data
				file=fileList[fileList.length-1]
				file.name=name
				file.url=url
			}else{
				message.error('上传图片失败')
			}
		}else if (file.status==='removed'){
			const result =await reqDeleteImg(file.name)
			if(result.status===0){
				message.success('删除图片成功')
			}else{
				message.error('删除图片失败')
			}
	}

	this.setState({ fileList })};

	render() {
		const { previewVisible, previewImage, fileList } = this.state;
		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">Upload</div>
			</div>
		);
		return (
			<div>
				{/*
				accept:接受上传的文件类型
				action：上传的地址
				name	发到后台的文件参数名
				listType：上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
				fileList	已经上传的文件列表（受控）
				onPreview：点击文件链接或预览图标时的回调*/}
				<Upload
						accept='image/*'
						action="/manage/img/upload"
						name='image'
						listType="picture-card"
						fileList={fileList}
						onPreview={this.handlePreview}
						onChange={this.handleChange}
				>
					{fileList.length >= 8 ? null : uploadButton}
				</Upload>
				{/*footer={null}：不需要默认底部按钮时设置此属性*/}
				<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</div>
		);
	}
}
/*
* 1.子组件调用父组件方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
* 2.父组件调用子组件方法：在父组件中通过ref得到子组件标签对象()，调用其方法
* */