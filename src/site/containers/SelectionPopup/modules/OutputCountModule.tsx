import {GroupAction} from "core/actions/GroupAction";
import {Encoder} from "digital/models/ioobjects";
import {CoderPortChangeAction} from "digital/actions/ports/CoderPortChangeAction";
import {CreateModule, ModuleConfig, UseModuleProps} from "./Module";


const Config: ModuleConfig<[Encoder], number> = {
    types: [Encoder],
    getProps: (o) => o.getOutputPortCount().getValue(),
    getAction: (s, newCount) => new GroupAction(s.map(o =>
        new CoderPortChangeAction(o, o.getOutputPortCount().getValue(), newCount)))
}

const Module = CreateModule({
    inputType: "int",
    config: Config,
    step: 1,
    min: 2,
    max: 8,
    alt: "Number of outputs object(s) have"
});

export const OutputCountModule = (props: UseModuleProps) => {
    const m = Module(props);
    if (m === null)
        return null;
    return (
        <div key="selection-popup-output-count-module">
            Output Count
            <label unselectable="on">
                {m}
            </label>
        </div>
    );
}
