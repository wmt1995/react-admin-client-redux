import React ,{Component} from 'react'
import {Card,Table,Button,Icon, message, Modal} from 'antd'
import {reqCategorys, reqAddCategorys,reqUpdateCategorys, reqCategory} from "../../api";
import LinkButton from '../../component/link-button'
import AddForm from "./add-form";
import UndataFrom from './undate-form'
/*商品分类路由*/
export default class  Category extends Component {
	state = {
		loading:false, //是否在正在获取数据中，没有
		categorys:[], //一级分类列表
		subCategorys:[], //二级分类列表
		parentId:'0', //当前需要显示的分类列表的父类Id
		parentName:'', //当前需要显示的分类列表的父类名称
		showStatus:0,//标识添加/修改分类状态。0:都不显示；1：显示添加；2：显示更新
	}

	//初始化table所有列的数组
	initColumns = () =>{
			this.columns = [

			{
				title: '分类的名称',
				dataIndex: 'name',  //显示数据名
			},
			{
				title: '操作',
				//指定某列宽度
				width:300,

				//category为渲染每一行时的数据对象
				render: (category) => (

						<span>
							<LinkButton onClick={() =>this.showUpdate(category)}>修改分类</LinkButton>
							{/*如何向事件回调函数传递参数：先定义一个匿名参数，在函数调用处理的函数并传入参数*/
							/*不能写成-->onClink={this.showSubCategorys(category)}
							* 这样就函数调用
							* */}
							{this.state.parentId==='0'?<LinkButton onClick={() => {this.showSubCategorys(category)}}>查看子分类</LinkButton> : null}

						</span>
				)
			},
];
	}

	//异步获取一级/二级分类列表
	//parentId:不赋值从状态中取值
	getCategorys = async(parentId) =>{

		//在发送前，显示loading
		this.setState({loading:true})

		parentId = parentId ||this.state.parentId
		//发ajax获取数据
		const result =await reqCategorys(parentId)
		//请求完成后隐藏loading
		this.setState({loading:false})
		if(result.status===0){
			//取出分类数组（可能是一级也可能是二级）
			const categorys=result.data

			if(parentId==='0'){
				//更新一级分类状态
				this.setState({categorys})
			}else {
				//更新二级分类状态
				this.setState({subCategorys:categorys})
			}


		} else {
			message.error('获取一级列表失败')
		}
	}

	//显示指定一级分类获取二级分类列表
	showSubCategorys = (category) =>{
		//更新状态,并不会立即更新，不能获取最新状态，目前可理解为异步
		this.setState({
			parentId:category._id,
			parentName:category.name
		}, () =>{//这是一个回调函数，在状态更新且重新render()后执行

			this.getCategorys()
		})
		//setState异步更新，不能立即更新状态
	}

	//显示一级分类
	showCategorys =()=> {
		this.setState({
			parentId: '0',
			parentName: '',
			subCategorys: []
		})
	}

	//响应点击取消：隐藏确认框
	handleCancel =()=>{
		//清除数据
		this.form.resetFields()
		//隐藏
		this.setState({
			showStatus:0
		})
	}

	//显示添加
	showAdd =() =>{
		this.setState({
			showStatus:1
		})
	}

	//显示修改
	showUpdate =(category) =>{
		//保存分类对象
		this.category=category
		this.setState({
			showStatus:2
		})
	}

	//添加分类
	addCategory =() => {

		//进行表单验证，通过后再处理
		this.form.validateFields(async(err,values)=>{
			if(!err){
				//1.隐藏确认框
				this.setState({
					showStatus:0,
				})
				//2.提交添加请求
				const {categoryName,parentId}=values
				//清除数据
				this.form.resetFields()

				const result= await reqAddCategorys({categoryName,parentId})

				if(result.status===0){
					//3.更新列表,如果非当前列表则跳转
					if (parentId===this.state.parentId){
						this.getCategorys()
					}else {
						const result2=await reqCategory(parentId)
							if(result2.status===0){

							const parentName=result2.data.name

							this.setState({
								parentId,
								parentName
							},() => this.getCategorys())
						}
					}
			}
			}
		})

	}




	//更新分类
	updateCategory =() =>{
			//进行表单验证，通过后再处理
		this.form.validateFields(async(err,values)=>{
			if(!err){

				//1.隐藏确认框
				this.setState({
					showStatus:0
				})
				const categoryId=this.category._id
				const {categoryName}=values
				//清除数据
				this.form.resetFields()

				//2.发送更新请求
				const result = await reqUpdateCategorys(categoryName,categoryId)

				if(result.status===0){
					//3.更新列表
					this.getCategorys()
				}
			}
		})
	}





	//为第一次render()准备数据
	componentWillMount () {
		this.initColumns()
	}

	//执行异步任务：发送ajax请求
	componentDidMount() {
		this.getCategorys()
	}
	render () {
		//读取数据
		const {categorys,loading,subCategorys,parentId,parentName,showStatus} = this.state
		//点击 修改后   category才有值
		const category=this.category ||{}
		//Card 左侧
		const title = parentId==='0'?'一级分类列表':(
				<span>
					<LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
						<Icon type='arrow-right'/>
						<span style={{padding:'0 5px'}}>{parentName}</span>
				</span>
		)

		//Card 右侧
		const extra= (
				<Button type='primary' onClick={this.showAdd}>
					<Icon type='plus'/>
					添加
				</Button>
		)

		return (
			<div>
				<Card title={title} extra={extra} style={{ width: '100%' }}>

					<Table
							//边框
							bordered

							//用'_id'作为dataSource中唯一的key
							rowKey='_id'

							loading={loading}

							//数据
							dataSource={parentId==='0' ? categorys:subCategorys}

							//标题，其中dataIndex与dataSource中内容一致
							columns={this.columns}

							//defaultPageSize:每页显示几条数据
							pagination={{defaultPageSize:8,showQuickJumper:true}}
					/>

					{/*添加分类*/}
					<Modal
          title="添加分类"
          visible={showStatus===1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm categorys={categorys}
									 parentId={parentId}
									 setForm={(form) =>{

									 	return this.form=form}}/>

        </Modal>

					{/*修改分类*/}
					<Modal
          title="修改分类"
          visible={showStatus===2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UndataFrom
							categoryName={category.name}
							setForm={(form) =>{this.form=form}}/>
        </Modal>
				</Card>
			</div>
		)
	}
}

