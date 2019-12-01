import React ,{Component} from 'react'
import {Switch, Route, Redirect } from 'react-router-dom'
import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

import './product.less'
/*商品路由*/
export default class  Product extends Component {
	render () {
		return (
				<Switch>
					{/*默认：逐层匹配；exact:完全匹配*/}
					<Route exact path='/product' component={ProductHome}></Route>
					<Route path='/product/addupdate' component={ProductAddUpdate}></Route>
					<Route path='/product/detail' component={ProductDetail}></Route>

					{/*重定向，以上都没有的话，进行重定向*/}
					<Redirect to='/product'/>
				</Switch>
		)
	}
}