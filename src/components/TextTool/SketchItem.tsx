import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'

type Props = {
    id:number,
    name:string
}

const SketchItem = (props: Props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.id })
    const style = {
        transform: CSS.Transform.toString(transform), transition
    }
    return (
        <div>
            <p ref={setNodeRef} style={style} {...attributes} {...listeners} key={props.id} className="bg-red-300 p-2 m-2">{props.name}</p >
        </div>
    )
}

export default SketchItem