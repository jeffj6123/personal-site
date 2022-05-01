import React from "react"

export interface PropsWithChild {
    children: any[]
}

export const Li = (props: PropsWithChild) => {
    console.log(props)
    const title = props.children[0] //props.children.find(node => node.type.name === "LiTop")
    const body = props.children[1]//props.children.find(node => node.type.name === "LiBottom")

    return (<div className="technology-section">
        <h3>
            {title}
        </h3>
        <div className="technology-details">
            {body}
        </div>
    </div>)
}

export class LiTop extends React.Component<{}, {}> {
    public data = 'liTop'
    render () {
        return (<div>{this.props.children}</div>)
    }
}

export const LiBottom = (props: PropsWithChild) => {
    return (<div>{props.children}</div>)
}