import React ,{Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu, Icon} from 'antd';
import {connect} from 'react-redux'


import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'

import {setHeadTitle} from '../../redux/actions'
//默认暴露（export default）的可以随意起名字
const { SubMenu } = Menu;

class  LeftNav extends Component {

	hasAuth = (item) =>{
		/*
		* 1.用户是admin
		* 2.当前item是公开的
		* 3.用户有item权限，item.key 是否在menus中
		* 4.如果有子item
		* */
		const {key, isPublic} = item
		const menus = this.props.user.role.menus
		const username = this.props.user.username
		if (username==='admin' ||isPublic||menus.indexOf(key)!==-1){
			return true
		}else if(item.children){ //4.如果当前用户由此item的某个子item 有menus
			return !!item.children.find(child => menus.indexOf(child.key)!==-1)
		}
		return false
	}
	/*根据menu生成对应的标签数组
	* 使用map()+递归调用*/
	getMenuNodes_map= (menuList) => {
		return menuList.map(item => {
			if(!item.children){
				return(
					<Menu.Item key={item.key}>
						<Link to={item.key}>
							<Icon type={item.icon} />
							<span>{item.title}</span>
						</Link>
					</Menu.Item>
				)
			}else {
				return (
					<SubMenu
						key={item.key}
						title={
							<span>
								<Icon type={item.icon} />
								<span>{item.title}</span>
							</span>
						}>
						{this.getMenuNodes_map(item.children)}
					</SubMenu>
				)
			}
		})
	}


	/*根据menu生成对应的标签数组
	* 使用reduce()+递归调用*/
	getMenuNodes = (menuList) => {
		const path = this.props.location.pathname

		return menuList.reduce((pre,item) => {

			if(this.hasAuth(item)){

				if(!item.children){
					//判断item是否是当前要显示的item
					if(item.key===path ||path.indexOf(item.key)===0){
						//更新redux中的headerTitle状态
						this.props.setHeadTitle(item.title)

					}

					// this.props.setHeadTitle(item.title)
					pre.push((
						<Menu.Item key={item.key}>
							<Link to={item.key} onClick={()=>{this.props.setHeadTitle(item.title)}}>
								<Icon type={item.icon} />
								<span>{item.title}</span>
							</Link>
						</Menu.Item>
					))
				}else {
					//查找与当前路径匹配的子item
					// const cItem = item.children.find(cItem => cItem.key===path)
					//   /product/detail时要打开左边栏的相应选项
					const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
					if (cItem){
						this.openKey=item.key
					}

					pre.push((
						<SubMenu
							key={item.key}
							title={
								<span>
									<Icon type={item.icon} />
									<span>{item.title}</span>
								</span>
							}>
							{this.getMenuNodes(item.children)}
						</SubMenu>
					))
				}
			}


			return pre
		},[])
	}

	/*在第一次render()之前执行一次
	为第一个render()准备数据必须同步执行
	* */
	componentWillMount () {
		this.menuNodes = this.getMenuNodes(menuList)
	}
	render () {
		// const path = '/user'
		let path = this.props.location.pathname

		const openKey = this.openKey
		if(path.indexOf('/product')===0){
			path='/product'
		}
		return (
				<div  className="left-nav">
					<Link to='/' className="left-nav-header">
						<img src={logo} alt="logo"/>
						<h1>后台管理</h1>
					</Link>
					<Menu
						selectedKeys={[path]}    //当前选中的菜单项 key 数组,动态匹配，根据url
						mode="inline"    //菜单类型，现在支持垂直、水平、和内嵌模式三种
						theme="dark"
						defaultOpenKeys={[openKey]}  //初始选中的菜单项 key 数组,打开的列表
					>
						{this.menuNodes}


					</Menu>

				</div>
		)
	}
}
/*
withRouter高阶组件：
包装非路由组件，发回一个新的组件
新的组件向非路由组件传递3个属性值：history/location/match
*/

//包装成容器组件
export default connect(
		state=>({user:state.user}),
		{setHeadTitle}
)(withRouter(LeftNav))