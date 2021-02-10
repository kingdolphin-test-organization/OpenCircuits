import React, {Dispatch} from "react";
import {connect} from "react-redux";

import {AppState} from "site/state";
import {AllActions} from "site/state/actions";
import {ToggleItemNav} from "site/state/ItemNav/actions";

import "./index.scss";


export type ItemNavConfig = {
    imgRoot: string;
    sections: {
        id: string;
        label: string;
        items: {
            id: string;
            label: string;
            icon: string;
        }[];
    }[];
}


type OwnProps = {
    config: ItemNavConfig;
}
type StateProps = {
    isOpen: boolean;
    isEnabled: boolean;
    isLocked: boolean;
}
type DispatchProps = {
    toggle: () => void;
}

type Props = StateProps & DispatchProps & OwnProps;
function _ItemNav({ isOpen, isEnabled, isLocked, config, toggle }: Props) {
    return (
    <>
        { // Hide tab if the circuit is locked
        (isEnabled && !isLocked) &&
            <div className={`tab ${isOpen ? "tab__closed" : ""}`}
                 title="Circuit Components"
                 onClick={() => toggle()}></div>
        }
        <nav className={`itemnav ${(isOpen) ? "" : "itemnav__move"}`}>
            {config.sections.map((section) =>
                <React.Fragment key={`itemnav-section-${section.id}`}>
                    <h4>{section.label}</h4>
                    {section.items.map((item) =>
                        <button key={`itemnav-section-${section.id}-item-${item.id}`}
                                onDragStart={(ev) => {
                                    ev.dataTransfer.setData("custom/component", item.id);
                                    ev.dataTransfer.dropEffect = "copy";
                                }}>
                            <img src={`/${config.imgRoot}/${section.id}/${item.icon}`} alt={item.label} />
                            <br />
                            {item.label}
                        </button>
                    )}
                </React.Fragment>
            )}
        </nav>
    </>
    );
}


const MapState = (state: AppState) => ({
    isLocked: state.circuit.isLocked,
    isEnabled: state.itemNav.isEnabled,
    isOpen: state.itemNav.isOpen
});

const MapDispatch = (dispatch: Dispatch<AllActions>) => ({
    toggle: () => dispatch(ToggleItemNav())
});

export const ItemNav = connect<StateProps, DispatchProps, OwnProps, AppState>(MapState, MapDispatch)(_ItemNav);
