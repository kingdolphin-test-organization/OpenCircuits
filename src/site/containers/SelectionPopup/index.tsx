import {useLayoutEffect, useRef, useState} from "react";

import {V} from "Vector";
import {Camera} from "math/Camera";

import {Event} from "core/utils/Events";
import {SelectionsWrapper} from "core/utils/SelectionsWrapper";

import {Action} from "core/actions/Action";

import {UseModuleProps} from "./modules/Module";

import "./index.scss";
import {TitleModule} from "./modules/TitleModule";


type Props = {
    camera: Camera;
    selections: SelectionsWrapper;
    modules: ((props: UseModuleProps) => JSX.Element)[];
    addAction: (action: Action) => void;
    render: () => void;
    eventHandler: {
        addListener: (listener: (ev: Event, change: boolean) => void) => void;
    };
}
export function SelectionPopup({modules, camera, selections, addAction, render, eventHandler}: Props) {
    const ref = useRef<HTMLDivElement>();
    const [state, setState] = useState({
        visible: false,
        pos: V()
    });

    useLayoutEffect(() => {
        eventHandler.addListener((ev, change) => {
            const getPos = () => {
                const midpoint = selections.midpoint(true);
                return camera.getScreenPos(midpoint).sub(V(0, /*ref.current.clientHeight/2 ?????? */));
            }

            // Don't show popup if dragging
            if (ev.type === "mousedrag" && change) {
                setState({
                    pos: V(),
                    visible: false
                });
            } else if (change) {
                setState({
                    pos: getPos(),
                    visible: (selections.amount() > 0)
                });
            }
        });
    }, [eventHandler, camera, selections]);

    return (
        <div className="selection-popup"
             ref={ref}
             style={{
                left: `${state.pos.x}px`,
                top:  `${state.pos.y}px`,
                visibility: (state.visible ? "visible": "hidden")
             }}
             tabIndex={-1}>
            {/* <input type="text" placeholder="Name" alt="Name of object(s)" /> */}
            <TitleModule selections={selections} addAction={addAction} render={render} />
            <hr />
            {modules.map(m => m({
                selections,
                addAction,
                render
            }))}
        </div>
    )
}
