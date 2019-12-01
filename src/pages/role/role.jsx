
import React ,{Component} from 'react'
import {Card,Button,Table,message,Modal} from 'antd'
import {connect} from 'react-redux'

import {PAGE_SIZE} from "../../utils/constants"
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import AddForm from "./add-form"
import UpdateForm from './updateform'
import {formateDate} from '../../utils/dateUtils'
import {logout} from '../../redux/actions'

/*角色路由*/
class  Role extends Component {
	state={
		loading:false,
		role: {}, //选中角色列表
		roles:[], //所有角色列表
		selectedRowKeys:[], //指定选中项的 key 数组
		isShowAdd:false,
		isShowUpdate:false,
	}
	constructor (props){
		super(props)
		this.update = React.createRef()

	}
	//设置角色表的列头
	initColumns =()=>{
		this.columns=[
			{ title: '角色名称',
				dataIndex: 'name',
			},
			{
				title: '创建时间',
				dataIndex: 'create_time',
				render: (create_time) => formateDate(create_time)
			},
			{ title: '授权时间',
				dataIndex: 'auth_time',
				render: formateDate
			},
			{ title: '授权人',
				dataIndex: 'auth_name',
			}

		]
	}
	//获取角色列表
	getRoles =async()=>{
		this.setState({loading:true})
		const result=await reqRoles()
		this.setState({loading:false})
		if(result.status===0){
			const roles=result.data
			this.setState({
				roles,
			})
		}else{
			message.error('获取角色列表失败')
		}
	}


	//展示创建角色对话框
	showAddRole = () => {
		this.setState({isShowAdd:true})
	}
	//展示设置权限对话框
	showUpdateRole = () => {
		this.setState({isShowUpdate:true})
	}
	//添加角色
	addRoleOK =()=>{
		//进行表单验证，验证通过后再做以下处理
		this.form.validateFields(async(err,values)=>{
			if(!err){
				//发送请求
				const result=await reqAddRole(values.roleName)
				//请求成功，更新列表
				if(result.status===0){
					this.setState({isShowAdd:false})
					//清空表单数据
					this.form.resetFields()
					//获取新产生的角色信息
					const role=result.data

					//更新roles
					// const roles =this.state.roles    react不建议这么做,这样直接操作state
					/*
						const roles=[...this.state.roles]
					 	 roles.push(role)
					   this.setState({roles})
					*/
					//react 最推荐以下做法，基于原本状态数据更新
					this.setState((state,props) =>({
						roles:[...state.roles,role]
					}))

					// this.getRoles()
				}else{
					message.error('添加角色失败')
				}
			}
		})

	}
	//设置角色权限成功
	updateRoleOK=async()=>{
		const {role}=this.state  //role  是对象的引用变量，修改role，roles也能改
		const menus=this.update.current.getMenus()
		role.menus=menus
		role.auth_name=this.props.user.username
		role.auth_time=Date.now()
		// role.auth_time=1558679920395
		 //请求更新
		const result=await reqUpdateRole(role)
		if(result.status===0){
			this.setState({isShowUpdate:false})
			if(this.props.user.role_id===role._id){
				this.props.logout()
				message.success('当前用户角色权限成功')
			}else{
				message.success('设置角色权限成功')
				// this.getRoles()
			this.setState({
				roles:[...this.state.roles]
				})
			}



		}else{
			message.error('设置角色权限失败')
		}

	}
	handleCancel =()=>{
		this.setState({isShowUpdate:false})
	}

	onRow =(role) => {
		return{
			onClick:event => {//点击行时
				this.setState({role})
			}
		}
	}

	componentWillMount (){
		this.initColumns()
	}
	componentDidMount () {
		this.getRoles()
	}
	render () {
		const {loading,roles,role,isShowAdd,isShowUpdate}=this.state
		const title=(
				<span>
					<Button type='primary' style={{marginRight:10}} onClick={()=>{this.showAddRole()}}>创建角色</Button>
					<Button type='primary' disabled={!role._id} onClick={()=>{this.showUpdateRole()}}>设置角色权限</Button>
				</span>
		)
		const rowSelection = {
      selectedRowKeys:[role._id],  //点击项被选中，是由于selectedRowKeys与rowKey一致
			type:'radio',
			onSelect:(role)=>{  //选择某个radio时回调
				this.setState({role})
			}
    };
		return (
			<Card title={title}>
				<Table
					loading={loading}
					dataSource={roles}
					columns={this.columns}
					rowKey='_id'  //设置每行的key
					rowSelection={rowSelection}
					bordered
					pagination={
							{
								defaultPageSize:PAGE_SIZE,
								showQuickJumper:true,
							}
						}
					onRow={this.onRow}
				/>
				{/*创建角色*/}
				<Modal
					title='创建角色'
					visible={isShowAdd}
					onOk={this.addRoleOK}
					onCancel={()=>{
						this.setState({isShowAdd:false})
						this.form.resetFields()
					}}
				>
					<AddForm setForm={(form) => this.form=form}/>
				</Modal>

				{/*设置角色权限*/}
				<Modal
					title='设置角色权限'
					visible={isShowUpdate}
					onOk={this.updateRoleOK}
					onCancel={this.handleCancel}
				>
					<UpdateForm role={role} ref={this.update}/>
				</Modal>
			</Card>
	  )
	}
}
export default connect(
		state=>({user:state.user}),
		{logout}
)(Role)