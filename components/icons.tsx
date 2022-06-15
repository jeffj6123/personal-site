export interface Icon {
    color?: string;
    icon?: string;
    url?: string;
}

export interface IconProps {
    icon: Icon;
}
export function Icon(props: IconProps) {
    if(props.icon?.url){
        return <img src={props.icon.url} className="resource" style={{ height: '30px' }}></img>
    }
    return <i style={{ color: props.icon.color }} className={`${props.icon.icon} resource`}></i>
}

export const HTMLIcon = {color: '#f14e00', icon: 'ri-html5-line'};
export const CSSIcon = {color: '#30ace0', icon: 'ri-css3-line'};
export const AngularIcon = {color: '#f00000', icon: 'ri-angularjs-line'};

export const PythonIcon = {url: 'python-logo.svg'};
export const ReactIcon = {url: 'react.svg'};
export const TypescriptIcon = {url: 'typescript-log.svg'};