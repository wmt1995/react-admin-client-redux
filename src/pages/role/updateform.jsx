import React,{Component} from 'react'
import {Input,Form,Tree} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'
const Item=Form.Item
const { TreeNode } = Tree;
export default class UpdateForm extends Component{
	static poropTypes ={
		role:PropTypes.object.isRequired
	}
	constructor (props) {
		super(props)
		//根据传入的menus初始化状态
		const {menus}=this.props.role
		this.state={
			checkedKeys:menus
		}
	}
	//为父组件提交最新的menu数据方法
	getMenus =()=> this.state.checkedKeys

	getTreeNodes =(menuList) =>{
		return menuList.reduce((pre,item)=>{
				pre.push(
					(<TreeNode title={item.title} key={item.key}>
						{item.children ? this.getTreeNodes(item.children) : null}
						</TreeNode>)
				)
			return pre
		},[])
	}
	 onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };
	componentWillMount (){
		this.treeNodes=this.getTreeNodes(menuList)
	}

	//根据新传入的role来更新checkedKeys
	//组件接收到新的属性时调用,初次显示页面时不会调用
	componentWillReceiveProps(nextProps){
		const menus = nextProps.role.menus
		//在这里这样写也可以，因为componentWillReceiveProps执行后会重新render
		// this.state.checkedKeys=menus
		this.setState({
			checkedKeys:menus
		})
	}
	render (){
		const {role} = this.props
		return(
			<div>
				<Item label={'角色名称'} labelCol={{span:5}} wrapperCol={{span:18}}>
					<Input value={role.name} disabled/>
				</Item>
				<Tree
					checkable     //节点前添加 Checkbox 复选框
					defaultExpandAll={true}
					//selectedKeys={role.menus}  //打开时默认选中项
					checkedKeys={this.state.checkedKeys}
					onCheck={this.onCheck}
				>
					<TreeNode title='平台权限' key='all'>
						{this.treeNodes}
					</TreeNode>
				</Tree>
			</div>

		)
	}
}
