import React from 'react'
import {Drawer} from "antd";

export default function Prompt(props: {
  title: React.ReactNode,
  onClose: Function,
  children: React.ReactElement
}) {
  return <Drawer open={true} size={'large'} title={props.title} onClose={() => props.onClose()}>
    {props.children}
  </Drawer>
}
