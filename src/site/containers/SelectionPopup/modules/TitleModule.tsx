import {GroupAction} from "core/actions/GroupAction";
import {IOObject} from "core/models";
import {SetNameAction} from "core/actions/SetNameAction";
import {CreateModule, ModuleConfig, UseModuleProps} from "./Module";


const Config: ModuleConfig<[IOObject], string> = {
    types: [IOObject],
    parseVal: (v) => v,
    isValid: (_) => true,
    getProps: (o) => o.getName(),
    getAction: (s, newName) => new GroupAction(s.map(o => new SetNameAction(o, newName)))
}

const Module = CreateModule({
    inputType: "text",
    config: Config,
    alt: "Name of object(s)"
});

export const TitleModule = (props: UseModuleProps) => {
    const m = Module(props);
    if (m === null)
        return null;
    return (
        <div key="selection-popup-title-module">
            {m}
        </div>
    );
}
