import React ,{Component} from 'react'
import {Card,Select,Input,Button,Icon,Table,message} from 'antd'
import LinkButton from "../../component/link-button";
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
import memoryUtils from "../../utils/memoryUtils";
/*商品路由*/
const Option=Select.Option
export default class  ProductHome extends Component {
	state={
		products:[], //商品的数组
		total:0, //商品列表项总数
		loading:false,
		searchName:'',//搜索的关键字
		searchType:'productName'

	}

	//初始化列表头
	initColumns = () =>{
		this.columns=[
		{
			title: '商品名称',
			dataIndex: 'name',
		},
		{
			title: '商品描述',
			dataIndex: 'desc',

		},
		{
			title: '价格',
			dataIndex: 'price',
			render:(price)=>'￥'+price   //当前指定了对应属性，传入的是指定属性值
		},
		{
			width:100,
			title: '状态',
			dataIndex: '',
			render:(produc)=>{
				const {status,_id}=produc
				const newStatus = status ===1 ? 2:1
				return (
				<span>
					<Button
							type='primary'
							onClick={() => this.updateStatus(_id,newStatus)}
					>
						{status===1 ? '下架':'上架'}
					</Button>
					<span>{status===1 ? '在售':'已下架'}</span>
				</span>
				)
			}
		},
		{
			width:100,
			title: '操作',
			dataIndex: '',
			render:(product)=>{
				return (
				<span>
						{/*将product对象使用states传递给目标路由组件，只适合BrowserRouter*/}
						<LinkButton onClick={() =>this.showDetail(product)}>详情</LinkButton>
						{/*{product}:传递的是对象 state.product.内容;product:传递的是内容 state.内容*/}
						<LinkButton onClick={() =>this.showAddUpdate(product)}>修改</LinkButton>

					</span>
				)
			}
		},
	]
	}

	showAddUpdate = (product) =>{
		//缓存product对象，给detail组件使用
		memoryUtils.product=product
		this.props.history.push('product/addupdate')
	}
	showDetail =(product)=>{
		//缓存product对象，给detail组件使用
		memoryUtils.product=product
		this.props.history.push('product/detail')
	}
	//获取商品列表分页
	getProducts = async(pageNum) =>{
		this.pageNum=pageNum  //保存pageNum,让其他方法看到
		this.setState({loading:true})
		const {searchName ,searchType} = this.state
		let result

		if(searchName===''){
			result=await reqProducts(pageNum,PAGE_SIZE)
		}else{
			result=await reqSearchProducts({pageNum, pageSize:PAGE_SIZE, searchType, searchName})
		}
		this.setState({loading:false})
		if(result.status===0){
			const {list,total} =result.data
			this.setState({
				total,
				products:list
			})
		}else{
			message.error('获取商品列表失败')
		}
	}

	updateStatus =async(productId,status) =>{
		const result = await reqUpdateStatus(productId,status)

		if(result.status===0){

			message.success('商品状态修改成功')
			this.getProducts(this.pageNum)
		}
	}
	componentWillMount (){
		this.initColumns()
	}
	componentDidMount (){
		this.getProducts(1)
	}
	render () {
		const {products, total, loading,searchName ,searchType} = this.state
		const title =(
				<span>
					<Select
							defaultValue={searchType}
							onChange={(value)=>{this.setState({searchType:value})}}
							style={{width:150}}>
						<Option value='productName'>按名称搜索</Option>
						<Option value='productDesc'>按描述搜索</Option>
					</Select>

					<Input
							placeholder='关键字'
							value={searchName}
							onChange={(e)=>{this.setState({searchName:e.target.value})}}
							style={{width:150,margin:'0 15px'}}/>
					<Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
				</span>
		)

		const extra = (
				<Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
					<Icon type='plus'></Icon>
					添加商品
				</Button>
		)
		return (
				<Card title={title} extra={extra}>
					<Table

							loading={loading}
							bordered
							dataSource={products}
							columns={this.columns}
							rowKey='_id'
							pagination={
								{
									current:this.pageNum,
									defaultPageSize:PAGE_SIZE,
									showQuickJumper:true,
									total,
									onChange:this.getProducts
								}
							}
					/>
				</Card>
		)
	}
}