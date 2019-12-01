import React, {Component} from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'
const Item=Form.Item


class UndateForm extends Component {
	static propTypes = {
		categoryName:PropTypes.string.isRequired,
		setForm:PropTypes.func.isRequired
	}
	componentWillMount() {
		//将form 传给父组件，然后父组件执行this.form=form
			this.props.setForm(this.props.form)
		}
	render(){
		const {categoryName}=this.props
		const  { getFieldDecorator}=this.props.form
		return(
			<Form>
				<Item>
					{getFieldDecorator('categoryName',{
						initialValue:categoryName,
						rules:[{
							required:true,message:'分类名称必须输入'
						}
						]
					})(
							<Input placeholder='请输入分类名称'/>
					)

					}
				</Item>
			</Form>
		)
	}
}

export default Form.create()(UndateForm)