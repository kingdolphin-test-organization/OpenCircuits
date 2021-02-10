import {V} from "Vector";

import {Component} from "core/models";
import {TranslateAction} from "core/actions/transform/TranslateAction";

import {CreateModule, ModuleConfig, UseModuleProps} from "./Module";


const XConfig: ModuleConfig<[Component], number> = {
    types: [Component],
    getProps: (o) => o.getPos().x,
    getAction: (s, newX) => new TranslateAction(s,
                                                s.map(s => s.getPos()),
                                                s.map(s => V(newX, s.getPos().y)))
}
const XModule = CreateModule({
    inputType: "float",
    config: XConfig,
    step: 0.5,
    alt: "X-Position of object(s)"
});

const YConfig: ModuleConfig<[Component], number> = {
    types: [Component],
    getProps: (o) => o.getPos().y,
    getAction: (s, newY) => new TranslateAction(s,
                                                s.map(s => s.getPos()),
                                                s.map(s => V(s.getPos().x, newY)))
}
const YModule = CreateModule({
    inputType: "float",
    config: YConfig,
    step: 10,
    alt: "Y-Position of object(s)"
});

export const PositionModule = (props: UseModuleProps) => {
    const mx = XModule(props);
    const my = YModule(props);
    if (mx === null && my === null)
        return null;
    return (
        <div key="selection-popup-position-module">
            Position
            <label unselectable="on">
                {mx}
                {my}
            </label>
        </div>
    );
}
