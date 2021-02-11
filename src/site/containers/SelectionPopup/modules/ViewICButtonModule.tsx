import {InputPort} from "digital/models/ports/InputPort";
import {ButtonPopupModule, UseModuleProps} from "./Module";


export const ViewICButtonModule = (props: UseModuleProps) => {
    const m = <ButtonPopupModule
        key="selection-popup-view-ic-button-module"
        text="View IC"
        alt="View the inside of this IC"
        getDependencies={(s) => (s instanceof InputPort ? ""+s.getWires().length : "")}
        isActive={(selections) => {
            return true;
        }}
        onClick={(selections) => {
        }}
        {...props} />;

    return m;
}
