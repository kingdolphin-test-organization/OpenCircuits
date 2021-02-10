import {GroupAction} from "core/actions/GroupAction";

import {ANDGate, Decoder, ORGate, XORGate} from "digital/models/ioobjects";
import {Gate} from "digital/models/ioobjects/gates/Gate";
import {NANDGate} from "digital/models/ioobjects/gates/ANDGate";
import {NORGate} from "digital/models/ioobjects/gates/ORGate";
import {XNORGate} from "digital/models/ioobjects/gates/XORGate";
import {Mux} from "digital/models/ioobjects/other/Mux";

import {InputPortChangeAction} from "digital/actions/ports/InputPortChangeAction";
import {MuxPortChangeAction} from "digital/actions/ports/MuxPortChangeAction";
import {CoderPortChangeAction} from "digital/actions/ports/CoderPortChangeAction";

import {CreateModule, ModuleConfig, UseModuleProps} from "./Module";


const Config: ModuleConfig<[ANDGate, NANDGate, ORGate,
                            NORGate, XORGate, XNORGate,
                            Mux, Decoder], number> = {
    types: [ANDGate, NANDGate, ORGate,
            NORGate, XORGate, XNORGate,
            Mux, Decoder],
    getProps: (o) => (o instanceof Mux ? o.getSelectPortCount() : o.getInputPortCount()).getValue(),
    getAction: (s, newCount) => (
        new GroupAction(
            s.map(o => {
                if (o instanceof Gate)
                    return new InputPortChangeAction(o, o.getInputPortCount().getValue(),  newCount);
                else if (o instanceof Mux)
                    return new MuxPortChangeAction  (o, o.getSelectPortCount().getValue(), newCount);
                else // Decoder
                    return new CoderPortChangeAction(o, o.getInputPortCount().getValue(),  newCount);
            })
        )
    )
}

const Module = CreateModule({
    inputType: "int",
    config: Config,
    step: 1,
    min: 2,
    max: 8,
    alt: "Number of inputs object(s) have"
});

export const InputCountModule = (props: UseModuleProps) => {
    const m = Module(props);
    if (m === null)
        return null;
    return (
        <div key="selection-popup-input-count-module">
            Input Count
            <label unselectable="on">
                {m}
            </label>
        </div>
    );
}
