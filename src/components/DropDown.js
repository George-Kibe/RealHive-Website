"use client"
import { DownOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'
import React from 'react'

export const DropDown = () => {
  const defaultOrder = ["Latest"]
  return (
    <Dropdown
        menu={{items: defaultOrder}}
        placement="bottomLeft"
        trigger={["hover"]}
    >
        <a onClick={(e) => e.preventDefault()}>
        {`Default Order `}
        <DownOutlined />
        </a>
    </Dropdown>
  )
}
