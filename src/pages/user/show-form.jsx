import React ,{Component} from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
const Option = Select.Option
class ShowForm extends Component {

	static propTypes = {
		setForm:PropTypes.func.isRequired,
		roles:PropTypes.array.isRequired,
		user:PropTypes.object
	}
	componentWillMount() {
		this.props.setForm(this.props.form)
	}
	render (){
		const {roles}=this.props
		const  {getFieldDecorator}=this.props.form
		const formItemLayout = {
			labelCol:{span:5} ,
			wrapperCol:{span:18},
		}
		const user = this.props.user || {}
		return(
		<Form {...formItemLayout}>
			<Item label='用户名 '>
				{getFieldDecorator('username',{
						initialValue:user.username,
						rules:[{
							required:true,message:'用户名必须输入'
						}]
					})(
							<Input placeholder='请输入用户名'/>
					)}
			</Item>
			{user._id ?null:(<Item label='密码 '>
				{getFieldDecorator('password',{
						initialValue:'',
						rules:[{
							required:true,message:'密码必须输入'
						}]
					})(
							<Input placeholder='请输入密码'/>
					)}
			</Item>)}

			<Item label='手机号 '>
				{getFieldDecorator('phone',{
						initialValue:user.phone,
						rules:[{

						}]
					})(
							<Input placeholder='请输入手机号'/>
					)}
			</Item>
			<Item label='邮箱 '>
				{getFieldDecorator('email',{
						initialValue:user.email,
						rules:[{
							type: 'email',
							message: 'The input is not valid E-mail!',
						}]
					})(
							<Input placeholder='请输入邮箱'/>
					)}
			</Item>
			<Item label='角色 '>
				{getFieldDecorator('role_id',{
						initialValue:user.role_id,
					})(
						<Select placeholder='请选择角色'>
							{
								roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
							}
						</Select>
					)}
			</Item>
		</Form>
		)
	}
}
const WrapShowForm = Form.create()(ShowForm)
export default WrapShowForm