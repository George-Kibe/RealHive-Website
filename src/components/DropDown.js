"use client"
import { Select, Menu} from 'antd'
const { Option } = Select;

export const DropDown = () => {
  return (
    <div className=''>
      <Select defaultValue="For rent" style={{ width: 120 }}>
        <Option value="Bedsitter">Bedsitter</Option>
        <Option value="One Bedroom">One Bedroom</Option>
        <Option value="Two Bedroom">Two Bedroom</Option>
        <Option value="3+ Bedroom">3+ Bedrooms</Option>
        <Option value="Office Space">Office Space</Option>
        <Option value="PentHouse">PentHouse</Option>
        <Option value="For Sale">For Sale</Option>
      </Select>
    </div>
  )
}
