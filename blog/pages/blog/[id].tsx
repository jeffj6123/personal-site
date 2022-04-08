// import Layout from '../../components/layout'

export interface TagProps {
    name: string;
}

export function Tag(props: TagProps){
    return (<span className="tag">{props.name}</span>)
}

export default function Post() {
    const tags = [{ name: 'React' }, { name: 'Node js' }, { name: 'Datastore' }]
    return (<div className="layout-container">
        <h1 className="blog-title">Building A SouthPark Site</h1>
        <div className="underline"></div>
        <div className="tag-container">
            {tags.map(tag => <Tag name={tag.name}></Tag>)}
        </div>

        <div className="content">

        </div>

    </div>)
}