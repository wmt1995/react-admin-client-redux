import React,{Component} from 'react'
import {Input,Form} from 'antd'
import PropTypes from 'prop-types'
const Item=Form.Item
class AddForm extends Component{
	static propTypes = {
		setForm:PropTypes.func.isRequired
	}
	componentWillMount() {
		this.props.setForm(this.props.form)
	}
	render (){
		const  { getFieldDecorator}=this.props.form
		return(
		<Form labelCol={{span:5}} wrapperCol={{span:18}}>
			<Item label='角色名称 '>
				{getFieldDecorator('roleName',{
						initialValue:'',
						rules:[{
							required:true,message:'角色名称必须输入'
						}]
					})(
							<Input placeholder='请输入角色名称'/>
					)}
			</Item>
		</Form>
		)
	}
}
const WrapAddForm =Form.create()(AddForm)
export default WrapAddForm