import React ,{Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import { Layout } from 'antd';
import {connect} from 'react-redux'

import LeftNav from '../../component/left-nav'
import Header from  '../../component/header'

import Home from '../home/home'
import Product from '../product/product'
import Category from '../category/category'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../charts/bar'
import Pie from '../charts/pie'
import Line from '../charts/line'
import NotFound from '../not-found/not-found'

const { Footer, Sider, Content } = Layout;
 class  Admin extends Component {
	render () {
		const user= this.props.user
		//如果内存没有存储user==>当前没登陆
		if(!user || !user._id){
			//自动跳转到登录（在render（）中）
			return <Redirect to='/login'/>
		}
		return (

					<Layout style={{minHeight:'100%'}}>
						<Sider><LeftNav/></Sider>
						<Layout>
							<Header></Header>
							<Content style={{margin:'20px',backgroundColor:'#fff'}}>
								<Switch>
									<Redirect exact={true} from='/' to='/home' />
									<Route path='/home' component={Home}/>
									<Route path='/category' component={Category}/>
									<Route path='/product' component={Product}/>
									<Route path='/role' component={Role}/>
									<Route path='/user' component={User}/>
									<Route path='/charts/bar' component={Bar}/>
									<Route path='/charts/line' component={Line}/>
									<Route path='/charts/pie' component={Pie}/>
									{/*<Redirect to='/home' /> /!*前面都不对*!/*/}
									<Route component={NotFound}/>
								</Switch>
							</Content>
							<Footer style={{textAlign:'center',color:'#ccc'}}>推荐使用谷歌浏览器，可以获得更佳的页面操作体验</Footer>
						</Layout>
					</Layout>

		)
	}
}

//包装成容器组件
export default connect(
		state=>({user:state.user}),
		{}
)(Admin)