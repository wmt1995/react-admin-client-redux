import React ,{Component} from 'react'
import {Card,Button,Table,message,Modal} from 'antd'
import LinkButton from "../../component/link-button";
import {reqUsers,reqAddOrUpdateUser, reqDeleteUser} from '../../api'
import {formateDate} from '../../utils/dateUtils'
import {PAGE_SIZE} from "../../utils/constants";
import ShowForm from './show-form'
const { confirm } = Modal;
/*用户路由*/
export default class  User extends Component {
	state = {
		loading:false,  //TABLE加载
		users:[],  //所有用户列表
		roles:[],  //所有角色列表
		isShow:false,
	}

	//初始化列表头
	initColumns =()=>{
		this.columns=[
			{
				title:'用户名',
				dataIndex:'username',
			},
			{
				title:'邮箱',
				dataIndex:'email',
			},
			{
				title:'电话',
				dataIndex:'phone',
			},
			{
				title:'注册时间',
				dataIndex:'create_time',
				render:formateDate
			},
			{
				title:'所属角色',
				dataIndex:'role_id',
				// render:(role_id)=>this.getrole(role_id),太费事费时
				render:(role_id)=>this.roleNames[role_id]

			},
			{
				title:'操作',
				dataIndex:'',
				render:(users)=>(
						<span>
							<LinkButton onClick={()=>{this.showUpdate(users)}}>修改</LinkButton>
							<LinkButton  onClick={()=>{this.showDeleteConfirm(users)}} type="dashed">删除</LinkButton>
							{/*<LinkButton onClick={()=>{this.deleteUser(users._id)}}>删除</LinkButton>*/}
						</span>
				)
			}

		]
	}
	//获得列表数据
	getUsers =async()=>{
		this.setState({loading:true})
		const result=await reqUsers()
		this.setState({loading:false})
		if(result.status===0){
			const users = result.data.users
			const roles = result.data.roles
			this.initRoleNames(roles)
			this.setState({users,roles})
		}else{
			message.error('获取用户列表失败')
		}
	}

  //根据roles生成,只遍历一次：role._id=role.name
	initRoleNames = (roles) =>{
		const roleNames =roles.reduce((pre,role)=>{
			pre[role._id]=role.name
			return pre
		},{})
	//保存
		this.roleNames=roleNames
	}

	// getrole=(role_id)=>{
		// const {roles} = this.state
		// const result = roles.find((item)=>item._id===role_id)
		// if(result){
		// 	return result.name
		// }
	// }

	//删除用户
	showDeleteConfirm =(user) => {
		confirm({
			title: `确定要删除${user.username}用户么?`,
			okText: '确定',
			okType: 'danger',
			cancelText: '取消',
			onOk:async() =>{
				const result = await reqDeleteUser(user._id)
				if(result.status===0){
					message.success('删除用户成功')
					this.getUsers()
				}else{
					message.error('删除用户失败')
				}
			}
		});
}

	showUpdate =(user)=>{
		this.setState({isShow:true})
		if(user){
			this.user=user
		}else{
			this.user=null
		}

	}

	onOK =()=>{
		this.form.validateFields(async(err,value)=>{
			if(!err){
				if(this.user){value._id=this.user._id}
				console.log(value)
				const result = await reqAddOrUpdateUser(value)
				if(result.status===0){
					this.getUsers()
					this.setState({isShow:false})
					message.success(`${this.user ? '修改':'添加'}用户成功`)
					this.form.resetFields()
				}else{
					message.error(`${this.user ? '修改':'添加'}用户失败`)
				}
			}
			this.user=null
		})
	}

	componentWillMount () {
		this.initColumns()
	}
	//
	componentDidMount () {
		this.getUsers()
	}
	render () {
		const {loading, users,isShow,roles} = this.state
		const title=(
			<Button type='primary' onClick={()=>{this.showUpdate()}}>创建用户</Button>
		)
		return (
			<Card title={title}>
				<Table
					loading={loading}
					dataSource={users}
					bordered
					columns={this.columns}
					rowKey='_id'
					pagination={
						{
							defaultPageSize:PAGE_SIZE,
							showQuickJumper:true,
						}
					}
				/>
				{/*创建角色*/}
				<Modal
					title={this.user ? '修改用户':'添加用户'}
					visible={isShow}
					onOk={this.onOK}
					onCancel={()=>{
						this.setState({isShow:false})
						this.form.resetFields()
					}}
				>
					<ShowForm setForm={(form)=>this.form=form} roles={roles} user={this.user}/>
				</Modal>


			</Card>
		)
	}
}