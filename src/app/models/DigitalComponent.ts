import {serialize} from "serialeazy";

import {Vector} from "Vector";
import {ClampedValue} from "math/ClampedValue";

import {Component} from "core/models/Component";

import {Port} from "core/models/ports/Port";
import {PortSet} from "core/models/ports/PortSets";
import {Positioner} from "core/models/ports/positioners/Positioner";

import {DigitalWire, DigitalCircuitDesigner} from "./index";

import {InputPort} from "./ports/InputPort";
import {OutputPort} from "./ports/OutputPort";

export abstract class DigitalComponent extends Component {
    @serialize
    protected designer: DigitalCircuitDesigner;

    @serialize
    protected inputs:  PortSet<InputPort>;
    @serialize
    protected outputs: PortSet<OutputPort>;

    protected constructor(inputPortCount: ClampedValue, outputPortCount: ClampedValue, size: Vector,
                          inputPositioner:  Positioner<InputPort>  = new Positioner<InputPort>("left"),
                          outputPositioner: Positioner<OutputPort> = new Positioner<OutputPort>("right")) {
        super(size);

        this.inputs  = new PortSet<InputPort> (this, inputPortCount, inputPositioner, InputPort);
        this.outputs = new PortSet<OutputPort>(this, outputPortCount, outputPositioner, OutputPort);
    }

    /**
     * Activates this component with the given signal
     *  through the output port at index i
     * @param signal The signal (on or off)
     * @param i      The index of the output port
     *               Must be 0 <= i < outputs.length
     */
    public activate(signal: boolean, i: number = 0): void {
        // Don't try to activate an Output component since it has no outputs
        if (this.outputs.isEmpty())
            return;

        this.outputs.get(i).activate(signal);
    }


    public setDesigner(designer?: DigitalCircuitDesigner): void {
        this.designer = designer;
    }


    public setInputPortCount(val: number): void {
        this.inputs.setPortCount(val);
        this.onTransformChange();
    }

    public setOutputPortCount(val: number): void {
        this.outputs.setPortCount(val);
        this.onTransformChange();
    }


    public getInputPort(i: number): InputPort {
        return this.inputs.get(i);
    }

    public getInputPortPos(i: number): Vector {
        return this.getInputPort(i).getWorldTargetPos();
    }

    public getInputPorts(): InputPort[] {
        return this.inputs.getPorts();
    }

    public getInputPortCount(): ClampedValue {
        return this.inputs.getCount();
    }

    public getInputs(): DigitalWire[] {
        // Get each wire connected to each InputPort
        //  and then filter out the null ones
        return this.getInputPorts().map((p) => p.getInput())
                .filter((w) => w != null);
    }

    public numInputs(): number {
        return this.inputs.length;
    }


    public getOutputPort(i: number): OutputPort {
        return this.outputs.get(i);
    }

    public getOutputPortPos(i: number): Vector {
        return this.getOutputPort(i).getWorldTargetPos();
    }

    public getOutputPorts(): OutputPort[] {
        return this.outputs.getPorts();
    }

    public getOutputPortCount(): ClampedValue {
        return this.outputs.getCount();
    }

    public getOutputs(): DigitalWire[] {
        // Accumulate all the OutputPort connections
        return this.getOutputPorts().flatMap(p => p.getConnections());
    }

    public numOutputs(): number {
        return this.outputs.length;
    }

    public getPorts(): Port[] {
        return (this.getInputPorts() as Port[]).concat(this.getOutputPorts());
    }

    public getConnections(): DigitalWire[] {
        return this.getInputs().concat(this.getOutputs());
    }


    public getDesigner(): DigitalCircuitDesigner {
        return this.designer;
    }

}
