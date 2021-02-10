import {Create} from "serialeazy";
import {useEffect, useLayoutEffect, useRef} from "react";

import {V} from "Vector";
import {Camera} from "math/Camera";

import {SelectionsWrapper}  from "core/utils/SelectionsWrapper";
import {RenderQueue}        from "core/utils/RenderQueue";
import {Input}              from "core/utils/Input";
import {CircuitInfo}        from "core/utils/CircuitInfo";

import {HistoryManager} from "core/actions/HistoryManager";
import {PlaceAction}    from "core/actions/addition/PlaceAction";

import {ToolManager}        from "core/tools/ToolManager";
import {InteractionTool}    from "core/tools/InteractionTool";
import {PanTool}            from "core/tools/PanTool";
import {RotateTool}         from "core/tools/RotateTool";
import {TranslateTool}      from "core/tools/TranslateTool";
import {WiringTool}         from "core/tools/WiringTool";
import {SplitWireTool}      from "core/tools/SplitWireTool";
import {SelectionBoxTool} from "core/tools/SelectionBoxTool";

import {Renderer}           from "core/rendering/Renderer";
import {CreateRenderers}    from "core/rendering/CreateRenderers";
import {Grid}               from "core/rendering/Grid";

import {DigitalCircuitDesigner, DigitalComponent} from "digital/models";
import {WireRenderer}           from "digital/rendering/ioobjects/WireRenderer";
import {ComponentRenderer}      from "digital/rendering/ioobjects/ComponentRenderer";
import {ToolRenderer} from "digital/rendering/ToolRenderer";

import {useWindowSize} from "site/utils/hooks/useWindowSize";

import "./index.scss";
import {SelectionPopup} from "../SelectionPopup";
import {Event} from "core/utils/Events";
import {PositionModule} from "../SelectionPopup/modules/PositionModule";
import {InputCountModule} from "../SelectionPopup/modules/InputCountModule";
import {ColorModule} from "../SelectionPopup/modules/ColorModule";
import {ClockFrequencyModule} from "../SelectionPopup/modules/ClockFrequencyModule";
import {OutputCountModule} from "../SelectionPopup/modules/OutputCountModule";


export const MainDesigner = (() => {
    const camera = new Camera();
    const renderQueue = new RenderQueue();
    const history = new HistoryManager();
    const designer = new DigitalCircuitDesigner(1, () => renderQueue.render());
    const selections = new SelectionsWrapper();

    type listener = (ev: Event, change: boolean) => void;
    const eventHandler = {
        listeners: [] as listener[],
        addListener: (l: listener) => {
            eventHandler.listeners.push(l);
        }
    }

    const toolManager = new ToolManager(
        new InteractionTool(),
        PanTool,
        RotateTool,
        TranslateTool,
        WiringTool,
        SplitWireTool,
        SelectionBoxTool
    );

    const circuitInfo: CircuitInfo = {
        locked: false,

        history,
        camera,

        designer,

        input: undefined, // Initialize on init
        selections
    };
    function CreateDigitalRenderers(renderer: Renderer) {
        return CreateRenderers(renderer, circuitInfo, {
            gridRenderer: Grid,
            wireRenderer: WireRenderer,
            componentRenderer: ComponentRenderer,
            toolRenderer: ToolRenderer
        });
    }
    function render({renderer, Grid, Wires, Components, Tools}: ReturnType<typeof CreateDigitalRenderers>) {
        const selections = circuitInfo.selections.get();

        renderer.clear();

        Grid.render();

        Wires.renderAll(designer.getWires(), selections);
        Components.renderAll(designer.getObjects(), selections);

        Tools.render(toolManager);
    }


    return (
        () => {
            const {w, h} = useWindowSize();
            const canvas = useRef<HTMLCanvasElement>();


            // On resize (useLayoutEffect happens sychronously so
            //  there's no pause/glitch when resizing the screen)
            useLayoutEffect(() => {
                camera.resize(w, h); // Update camera size when w/h changes
                renderQueue.render(); // Re-render

                console.log("resized");
            }, [w, h]);


            // Initial function called after the canvas first shows up
            useEffect(() => {
                const renderer = new Renderer(canvas.current);
                const input = new Input(canvas.current);
                const renderers = CreateDigitalRenderers(renderer);

                circuitInfo.input = input;

                input.addListener((event) => {
                    let change = toolManager.onEvent(event, circuitInfo);
                    if (change)
                        renderQueue.render();
                    eventHandler.listeners.forEach(l => l(event, change));
                });

                // selections.addChangeListener(() => {
                //     // forceSelectionPopupUpdate();
                // });

                renderQueue.setRenderFunction(() => render(renderers));
                renderQueue.render();

                console.log("i have been called");
            }, []); // Pass empty array so that this only runs once on mount

            console.log("main render");

            return (<>
                <SelectionPopup camera={camera}
                                modules={[PositionModule, InputCountModule,
                                          OutputCountModule,
                                          ColorModule, ClockFrequencyModule]}
                                selections={selections}
                                addAction={(a) => {
                                    history.add(a);
                                }}
                                render={() => renderQueue.render()}
                                eventHandler={eventHandler} />
                    {/* <PositionModule selections={selections} addAction={(a) => {
                                    history.add(a);
                                    renderQueue.render();
                                }} /> */}


                <canvas
                    width={w}
                    height={h-65}
                    ref={canvas}
                    onDragOver={(ev) => {
                        ev.preventDefault();
                    }}
                    onDrop={(ev) => {
                        const uuid = ev.dataTransfer.getData("custom/component");
                        if (!uuid)
                            return;
                        const rect = canvas.current.getBoundingClientRect();
                        const pos = V(ev.pageX, ev.clientY-rect.top);
                        const component = Create<DigitalComponent>(uuid);
                        component.setPos(camera.getWorldPos(pos));
                        history.add(new PlaceAction(designer, component).execute());
                        renderQueue.render();
                    }} />
            </>);
        }
    )
})();

