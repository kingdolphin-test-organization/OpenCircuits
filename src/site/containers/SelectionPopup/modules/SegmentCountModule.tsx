import {GroupAction} from "core/actions/GroupAction";
import {ClockFrequencyChangeAction} from "digital/actions/ClockFrequencyChangeAction";
import {Clock} from "digital/models/ioobjects";
import {CreateModule, ModuleConfig, UseModuleProps} from "./Module";


const Config: ModuleConfig<[Clock], number> = {
    types: [Clock],
    parseVal: (v) => parseInt(v),
    isValid: (_) => true,
    getProps: (o) => o.getFrequency(),
    getAction: (s, newFreq) => new GroupAction(s.map(o => new ClockFrequencyChangeAction(o, newFreq)))
}

const Module = CreateModule({
    inputType: "number",
    config: Config,
    step: 100,
    min: 200,
    max: 10000,
    alt: "Clock delay in milliseconds"
});

export const SegmentCountModule = (props: UseModuleProps) => {
    const m = Module(props);
    if (m === null)
        return null;
    return (
        <div key="selection-popup-segment-count-module">
            Segment Count
            <label unselectable="on">
                {m}
            </label>
        </div>
    );
}
