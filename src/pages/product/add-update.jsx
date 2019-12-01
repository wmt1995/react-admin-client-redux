import React ,{Component} from 'react'
import {Card,Button,Form,Input,Icon,Cascader,message } from 'antd'
import LinkButton from "../../component/link-button";
import {reqCategorys,reqAddProduct,reqUpdateProduct,reqAddOrUpdateProduct} from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import memoryUtils from "../../utils/memoryUtils";
const Item = Form.Item
const {TextArea}=Input
/*商品添加和更新子路由*/
class  ProductAddUpdate extends Component {
	state = {
		options:[]
	}

	constructor (props){
		super(props)
	//	创建用来保存ref标识的的标签容器
		this.pw = React.createRef()
		this.editor = React.createRef()
	}
	//验证价格的自定义验证函数
	validatePrice =(rule,value,callback)=> {
		if(value*1>0){ //验证通过
			callback()  //不传参数代表成功
		}else{ //没通过
			callback('价格必须大于0')  //传参数代表失败，内容为提示错误的内容
		}
	}

	//表单提交
	submit =()=>{
		//进行表单验证，通过后再发送请求
		this.props.form.validateFields(async(err,values)=>{
			if(!err){
				//1.收集数据
				const {name, desc, price,categoryIds}=values
				let pCategoryId,categoryId
				if(categoryIds.length>1){
					pCategoryId=categoryIds[0]
					categoryId=categoryIds[1]
				}else{
					pCategoryId='0'
					categoryId=categoryIds[0]
				}
				const imgs=this.pw.current.getImgs() //调用子组件方法
				const detail=this.editor.current.getDetail() //调用子组件方法

				const product={categoryId,pCategoryId,name,desc,price,detail,imgs}
				if(this.isUpdate){
					product._id=this.product
				}
				console.log(product)
				/*if(this.isUpdate){
					const {_id}=this.product
					const result = await reqUpdateProduct({_id,categoryId,pCategoryId,name,desc,price,detail,imgs})
					if(result.status===0){
						message.success('修改商品成功')
					}else{
						message.error('修改商品失败')
					}
				}else{
					const result = await reqAddProduct({categoryId,pCategoryId,name,desc,price,detail,imgs})
					if(result.status===0){
						message.success('添加商品成功')
					}else{
						message.error('添加商品失败')
					}
				}*/

				//2.调用接口函数去添加或更新
				const result=await reqAddOrUpdateProduct(product)
				//3.更新列表
				if(result.status===0){
					message.success(`${this.isUpdate? '更新':'添加'}商品成功`)
					this.props.history.goBack()
				}else {
					message.error(`${this.isUpdate? '更新':'添加'}商品失败`)
				}


			}

		})
	}

	//获取一级/二级分类的列表，参数只能是对象，即使只有一个参数
	//async返回结果是promise对象
	getCategorys=async (parentId)=>{
		const result=await reqCategorys(parentId)
		if(result.status===0){
			const categorys=result.data
			if(parentId==='0'){
				this.initOptions(categorys)
			}else{ //二级列表
				//返回二级列表 ==>当前async函数返回的promise就会成功且value为categorys
				return categorys
			}
		}
	}

	//根据categorys，获得options
	initOptions =async (categorys) =>{
		const options = categorys.map(item=>({
			value:item._id,
			label:item.name,
			isLeaf:false, //有下级列表
		}))
		const {isUpdate, product} = this
		const {pCategoryId, categoryId} =product
		//如果是一个二级分类商品的更新
		if(isUpdate &&  pCategoryId!=='0') {
			//获取二级列表
			const  subCategorys =await this.getCategorys(pCategoryId)
			//生成二级下拉列表的options
			const childOptions = subCategorys.map(item => ({
				value:item._id,
				label:item.name,
				isLeaf:true
			}))
			const targetOption =options.find(option => option.value===pCategoryId)
			//关联对应的一级分类列表
			targetOption.children=childOptions
		}

		this.setState({
			options
		})
	}

	//
	loadData =async selectedOptions =>{
		//选择的项
		const targetOption =selectedOptions[0]
		targetOption.loading=true

		//根据选中分类获取二级列表
		const subCategory = await this.getCategorys(targetOption.value)
		targetOption.loading=false
		if(subCategory && subCategory.length>0){
			const subOptions = subCategory.map(item =>({
				value:item._id,
				label:item.name,
				isLeaf:true  //没有下级列表
			}))
			targetOption.children=subOptions
		}else{  //当前一级列表没有二级分类
			targetOption.isLeaf=true
		}
		this.setState({
			options:[...this.state.options]
		})
	}

	componentWillMount (){
		let product={}
		if(memoryUtils.product){
			product = memoryUtils.product
			this.isUpdate = true
		}else{
			this.isUpdate=false    //保存标识：是否为更新
		}
		this.product = product || {}
		// const {product} = this.props.location.state
		// this.product = product || {}
		// this.isUpdate =!!product

	}

	componentDidMount () {
		this.getCategorys('0')
	}
	//在写在之前清除保存的数据
	componentWillUnmount(){
		memoryUtils.product={}
	}
	render () {
		const {isUpdate, product} = this
		const {pCategoryId, categoryId} =product

		//商品类别默认显示的数组
		const categoryIds = []
		if(pCategoryId==='0'){
			categoryIds.push(categoryId)
		}else{
			categoryIds.push(pCategoryId)
			categoryIds.push(categoryId)
		}

		const {getFieldDecorator} = this.props.form
		const title =(
			<span>
				<LinkButton onClick={() =>this.props.history.goBack()}>
					<Icon
						type='arrow-left'
						style={{marginRight:10,fontSize:20,}}
					></Icon>
				</LinkButton>
				<span>{isUpdate ?'修改商品':'添加商品'}</span>
			</span>
		)
		const formItemLayout = {
			labelCol: {  //指定label宽度，100%=24，
				 span: 2 ,
			},
			wrapperCol: {
				 span: 7 , //右侧框框的宽度
			},
		};
		const {options} = this.state
		return (
		<Card title={title}>
			{/*如果用onSubmit，必须阻止表单默认行为*/}
			<Form {...formItemLayout}>

				<Item label='商品名称'>
					{
						getFieldDecorator('name', {
							initialValue:product.name,
							rules: [
								{
									required: true,
									message: '必须输入商品名称!',
								},
							],
						})(<Input placeholder='请输入商品名称'/>)
					}
				</Item>

				<Item label='商品描述'>
					{
						getFieldDecorator('desc', {
							initialValue:product.desc,
							rules: [
								{
									required: true,
									message: '必须输入商品描述!',
								},
							],
						})(<TextArea placeholder='请输入商品描述' autosize={{ minRows: 2, maxRows: 6 }}/>)
					}
				</Item>

				<Item label='商品价格'>
					{
						getFieldDecorator('price', {
							initialValue:product.price,
							rules: [
								{
									validator:this.validatePrice
								},
								{
									required: true,
									message: '必须输入商品价格!',
								},
							],
						})(<Input
								type='number'
								addonAfter="元"
								placeholder='请输入商品价格'
						/>)
					//addonAfter：后缀
					}
				</Item>

				<Item label='商品分类'>
					{
						getFieldDecorator('categoryIds', {
							initialValue:categoryIds,
							rules: [
								{
									required: true,
									message: '必须输入商品分类!',
								},
							],
						})(
							<Cascader
								placeholder='请输入商品分类'
								options={options}
								loadData={this.loadData}
							/>)
					}
				</Item>

				<Item label='商品图片'>
					<PicturesWall ref={this.pw}  imgs={product.imgs}/>
				</Item>

				<Item label='商品详情' wrapperCol={{span:20}}>
					<RichTextEditor ref={this.editor} detail={product.detail}/>

				</Item>
				<Item>
					<Button type='primary' onClick={this.submit} >提交</Button>
				</Item>
			</Form>
		</Card>
		)
	}
}

const  WrapProductAddUpdate=Form.create()(ProductAddUpdate)
export default WrapProductAddUpdate