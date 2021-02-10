import {GroupAction} from "core/actions/GroupAction";
import {ColorChangeAction} from "digital/actions/ColorChangeAction";
import {Label, LED} from "digital/models/ioobjects";
import {CreateModule, ModuleConfig, UseModuleProps} from "./Module";


const Config: ModuleConfig<[LED, Label], string> = {
    types: [LED, Label],
    getProps: (o) => o.getColor(),
    getAction: (s, newCol) => new GroupAction(s.map(o => new ColorChangeAction(o, newCol)))
}

const Module = CreateModule({
    inputType: "color",
    config: Config,
    alt: "Color of object(s)"
});

export const ColorModule = (props: UseModuleProps) => {
    const m = Module(props);
    if (m === null)
        return null;
    return (
        <div key="selection-popup-color-module">
            Color
            <label unselectable="on">
                {m}
            </label>
        </div>
    );
}
