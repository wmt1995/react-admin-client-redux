import React, {Component} from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

/*
后台管理的折线图路由组件
 */
export default class Bar extends Component {
	state ={
		sales:[5, 20, 36, 10, 10, 20],
		stores:[15, 24, 31, 13, 10, 20]
	}
	getOption =(sales,stores) =>{

		return{
			title: {
						text: 'ECharts 入门示例'
				},
				tooltip: {},
				legend: {
						data:['销量','库存']
				},
				xAxis: {
						data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
				},
				yAxis: {},
				series: [{
						name: '销量',
						type: 'line',
						data: sales
				},{
						name: '库存',
						type: 'line',
						data: stores
				}]
		}
	}

	update = () =>{
		this.setState(state =>({
			sales:state.sales.map(sale => sale+1),
			stores:state.stores.reduce((pre,store)=>{
				pre.push(store-1)
				return pre
			},[])
		}))
	}

  render() {
    const {sales, stores} = this.state
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.update}>更新</Button>
        </Card>

        <Card title='折线图一'>
					<ReactEcharts option={this.getOption(sales,stores)} />
        </Card>

      </div>
    )
  }
}