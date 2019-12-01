import React ,{Component} from 'react'
import {Card,Icon,List} from 'antd'
import {BASE_IMG_URL} from "../../utils/constants"
import LinkButton from '../../component/link-button'
import {reqCategory} from '../../api/'
import PicturesWall from './pictures-wall'
import memoryUtils from "../../utils/memoryUtils";
const Item=List.Item
/*商品详情路由*/
export default class  ProductDetail extends Component {
	state = {
		cName1:'',//一级分类名称
		cName2:'',//二级分类名称
	}
	async componentDidMount () {
		const {pCategoryId, categoryId} = memoryUtils.product
		if(pCategoryId==='0'){
			const result=await reqCategory(categoryId)
			this.setState({
				cName1:result.data.name
			})
		}else {
			//通过多个await 方式发多个请求：后面一个请求是在前一个请求成功返回之后才发送
			// const result1=await reqCategory(pCategoryId) //获取一级分类
			// const result2=await reqCategory(categoryId)  //获取二级分类
			// const cName1=result1.data.name
			// const cName2=result2.data.name

			//一次性发送多个请求，只有都成功了，才正常处理
			const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
			const cName1=results[0].data.name
			const cName2=results[1].data.name
			this.setState({
				cName1,
				cName2
			})
		}


	}
	//在写在之前清除保存的数据
	componentWillUnmount(){
		memoryUtils.product={}
	}
	render () {
		//读取携带的state数据
		const {name,desc,imgs,price,detail} = memoryUtils.product
		const {cName1,cName2} = this.state
		const title=(
			<span>
				<LinkButton>
					<Icon
						type='arrow-left'
						style={{marginRight:10,fontSize:20,}}
						onClick={() =>this.props.history.goBack()}
					></Icon>
				</LinkButton>
				<span>商品详情</span>
			</span>
		)
		return (
			<Card title={title} className='product-detail'>
				<List>
					<Item>
						<span className='left'>商品名称:</span>
						<span>{name}</span>
					</Item>
					<Item>
						<span className='left'>商品描述:</span>
						<span>{desc}</span>
					</Item>
					<Item>
						<span className='left'>商品价格:</span>
						<span>{price}元</span>
					</Item>
					<Item>
						<span className='left'>所属分类:</span>
						<span>{cName1}{cName2 ? '-->'+cName2:''}</span>
					</Item>
					<Item>
						<span className='left'>商品图片:</span>
						{
							imgs.map(img =>(
									<img
											key={img}
											className='product-img'
											src={BASE_IMG_URL + img}
											alt="img"/>
							))

						}
					</Item>
					<Item>
						<span className='left'>商品详情:</span>
						{/*dangerouslySetInnerHTML:react中的属性，dom中innerHTML的替代*/}
						<span dangerouslySetInnerHTML={{__html:detail}}></span>
					</Item>





				</List>
			</Card>
		)
	}
}