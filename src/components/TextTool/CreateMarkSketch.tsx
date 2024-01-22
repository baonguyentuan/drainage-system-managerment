import { DndContext,MouseSensor,TouchSensor,useSensor,useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import SketchItem from './SketchItem'
type Props = {}

const CreateMarkSketch = (props: Props) => {
    let [list, setList] = useState([
        { id: 1, name: "123" },
        { id: 2, name: "456" },
        { id: 3, name: "789" },
        { id: 4, name: "012" },
    ])
    let [listV2, setListV2] = useState([
        { id: 9, name: "qaz" },
        { id: 8, name: "wsx" },
        { id: 7, name: "edc" },
        { id: 6, name: "rfv" },
    ])
    const mouseSensor=useSensor(MouseSensor,{
        activationConstraint:{distance:10}
    })
    const touchSensor=useSensor(TouchSensor,{
        activationConstraint:{
            delay:250,
            tolerance:10
        }
    })
    const sensors=useSensors(mouseSensor,touchSensor)
    const sort = (event: any) => {
        let currrentIndex = list.findIndex(station => station.id === event.active.id)
        let overId = list.findIndex(station => station.id === event.over.id)
        if (currrentIndex !== -1 && overId !== -1) {
            console.log(event);   
            setList(arrayMove(list, currrentIndex, overId))
        }
    }

    return (
        <div>
            <DndContext onDragEnd={sort} sensors={sensors}>
                <SortableContext items={list.map(station => station.id)} strategy={verticalListSortingStrategy}>
                    {list.map((item, index) => {
                        return <SketchItem key={item.id} id={item.id} name={item.name} />
                    })}
                </SortableContext>
                <SortableContext items={listV2.map(station => station.id)} strategy={verticalListSortingStrategy}>
                    {listV2.map((item, index) => {
                        return <SketchItem key={item.id} id={item.id} name={item.name} />
                    })}
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default CreateMarkSketch