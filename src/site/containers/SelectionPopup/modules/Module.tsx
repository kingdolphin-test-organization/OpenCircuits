import {useLayoutEffect, useState} from "react";

import {Clamp} from "math/MathUtils";
import {Selectable} from "core/utils/Selectable";
import {SelectionsWrapper} from "core/utils/SelectionsWrapper";
import {Action} from "core/actions/Action";


export type ModuleTypes = number | string;

export type ModuleConfig<T extends any[], P extends ModuleTypes> = {
    types: (Function & {prototype: T[number]})[],
    getProps: (o: T[number]) => P,
    getAction: (s: (T[number])[], newVal: P) => Action
}

type State = {
    active: true;
    focused: boolean;
    textVal: string;
} | {
    active: false;
}

export type UseModuleProps = {
    selections: SelectionsWrapper;
    addAction: (action: Action) => void;
    render: () => void;
}


type ModuleProps<T extends any[], P extends ModuleTypes> = {
    inputType: "float" | "int" | "text" | "color" | "select";
    config: ModuleConfig<T, P>;
    step?: number;
    min?: number;
    max?: number;
    alt: string;
}
export const CreateModule = (<T extends any[], P extends ModuleTypes>({inputType, config, step, min, max, alt}: ModuleProps<T, P>) => {
    let val: P;
    let same: boolean;
    let tempAction: Action;
    let prevDependencyStr: string;


    const parseVal = (s: string) => {
        switch (inputType) {
            case "float":
                return parseFloat(s) as P;
            case "int":
                return parseInt(s) as P;
            default:
                return s as P;
        }
    }

    const isValid = (v: P) => {
        if (typeof v === "number") {
            let mn = (min ?? -Infinity);
            let mx = (max ?? +Infinity);
            return !isNaN(v) && (mn <= v && v <= mx);
        }
        return true;
    }

    const filterTypes = (s: Selectable[]) => {
        return config.types.reduce((cur, Type) => [...cur, ...s.filter(s => s instanceof Type)], []) as T;
    }

    const parseFinalVal = (v: P) => {
        if (typeof v === "number") {
            let mn = (min ?? -Infinity);
            let mx = (max ?? +Infinity);
            return Clamp(v, mn, mx) as P;
        }
        return v;
    }

    const getDependencies = (state: State, selections: SelectionsWrapper) => {
        let str = "";
        if (state.active && state.focused)
            return prevDependencyStr;
        str += filterTypes(selections.get()).map(s => config.getProps(s));
        prevDependencyStr = str;
        return str;
    }

    return function ModuleRender({selections, addAction, render}: UseModuleProps) {
        const [state, setState] = useState<State>({active: false});

        const numSelections = selections.amount();
        const dependencyStr = getDependencies(state, selections);

        useLayoutEffect(() => {
            // This means Selections changed, so we must check if
            //  we should should show this module or not
            if (selections.amount() === 0) {
                setState({active: false});
                return;
            }

            // Make sure all selections are exactly of types:
            const active = config.types.reduce((enabled, Type) =>
                enabled || (selections.get().filter(s => s instanceof Type).length === selections.amount()),
            false);
            if (!active) {
                setState({active: false});
                return;
            }

            const comps = selections.get() as T;

            const counts = comps.map(s => config.getProps(s));

            same = counts.every(c => (c === counts[0]));
            val = counts[0];

            setState({
                active: true,
                focused: false,
                textVal: (same ? val.toString() : "")
            });
        }, [selections, numSelections, dependencyStr]);

        if (!state.active)
            return null;

        const {focused, textVal} = state;

        const onChange = (newVal: string) => {
            const val = parseVal(newVal);

            // Do action w/o saving it if the textVal is valid right now
            if (isValid(val)) {
                if (tempAction)
                    tempAction.undo();
                tempAction = config.getAction(selections.get() as T, val).execute();
                tempAction.execute();
                render();
            }

            setState({...state, textVal: newVal});
        }
        const onSubmit = () => {
            // If temp action doesn't exist, it means that nothing was changed
            //  So we shouldn't commit an action if nothing changed
            if (!tempAction) {
                setState({...state, focused: false});
                render();
                return;
            }

            // Temp action exists, so undo it before committing the final action
            tempAction.undo();
            tempAction = undefined;

            const finalVal = parseFinalVal(parseVal(textVal));
            if (!isValid(finalVal)) {
                // Invalid final input, so reset back to starting state
                setState({...state, focused: false, textVal: val.toString()});
                render();
                return;
            }

            const action = config.getAction(selections.get() as T, finalVal).execute();
            addAction(action);
            render();

            // When submitting, it will be true
            //  that all the values are the same
            //  and they will all be `newVal`
            val = finalVal;
            same = true;

            setState({...state, focused: false});
        }

        return (
            <input type={(inputType === "float" || inputType === "int" ? "number" : inputType)}
                   value={focused ? textVal : (same ? val : "")}
                   placeholder={same ? "" : "-"}
                   step={step}
                   min={min}
                   max={max}
                   onChange={(ev) => onChange(ev.target.value)}
                   onFocus={() => setState({...state, focused: true, textVal: val.toString()})}
                   onBlur={() => onSubmit()}
                   onKeyPress={({target, key}) => (inputType !== "color" &&
                                                   key === "Enter" &&
                                                   (target as HTMLInputElement).blur())}
                   alt={alt} />
        )
    }
});
