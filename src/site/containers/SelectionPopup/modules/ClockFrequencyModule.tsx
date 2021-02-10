import {GroupAction} from "core/actions/GroupAction";
import {ClockFrequencyChangeAction} from "digital/actions/ClockFrequencyChangeAction";
import {Clock} from "digital/models/ioobjects";
import {CreateModule, ModuleConfig, UseModuleProps} from "./Module";


const Config: ModuleConfig<[Clock], number> = {
    types: [Clock],
    getProps: (o) => o.getFrequency(),
    getAction: (s, newFreq) => new GroupAction(s.map(o => new ClockFrequencyChangeAction(o, newFreq)))
}

const Module = CreateModule({
    inputType: "int",
    config: Config,
    step: 100,
    min: 200,
    max: 10000,
    alt: "Clock delay in milliseconds"
});

export const ClockFrequencyModule = (props: UseModuleProps) => {
    const m = Module(props);
    if (m === null)
        return null;
    return (
        <div key="selection-popup-clock-freq-module">
            Clock Delay
            <label unselectable="on">
                {m}
            </label>
        </div>
    );
}
