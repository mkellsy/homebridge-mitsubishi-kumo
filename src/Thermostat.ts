import * as Kumo from "@mkellsy/mitsubishi-kumo-client";

import { API, CharacteristicValue, Logging, Service } from "homebridge";

import { Common } from "./Common";
import { Device } from "./Device";

/**
 * Creates a temperature sensor device.
 * @private
 */
export class Thermostat extends Common<Kumo.Thermostat> implements Device {
    private service: Service;

    /**
     * Creates a temperature sensor device.
     *
     * @param homebridge A reference to the Homebridge API.
     * @param device A reference to the discovered device.
     * @param log A refrence to the Homebridge logger.
     */
    constructor(homebridge: API, device: Kumo.Thermostat, log: Logging) {
        super(homebridge, device, log);

        this.service =
            this.accessory.getService(this.homebridge.hap.Service.Thermostat) ||
            this.accessory.addService(this.homebridge.hap.Service.Thermostat, this.device.name);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.CurrentHeatingCoolingState)
            .onGet(this.onGetState);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.CurrentTemperature)
            .onGet(this.onGetTemperature);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.TargetTemperature)
            .onGet(this.onGetTargetTemperature)
            .onSet(this.onSetTargetTemperature);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.TargetHeatingCoolingState)
            .onGet(this.onGetState)
            .onSet(this.onSetState);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.CoolingThresholdTemperature)
            .onGet(this.onGetCoolingThresholdTemperature)
            .onSet(this.onSetCoolingThresholdTemperature);

        this.service
            .getCharacteristic(this.homebridge.hap.Characteristic.HeatingThresholdTemperature)
            .onGet(this.onGetHeatingThresholdTemperature)
            .onSet(this.onSetHeatingThresholdTemperature);
    }

    /**
     * Updates Homebridge accessory when an update comes from the device.
     *
     * @param state The current temperature sensor state.
     */
    public onUpdate(state: Kumo.ThermostatState): void {
        this.log.debug(`Thermostat: ${this.device.name} State: ${state.state}`);
        this.log.debug(`Thermostat: ${this.device.name} Temprature: ${state.temprature}`);

        switch (state.state) {
            case "Auto":
                this.service.updateCharacteristic(
                    this.homebridge.hap.Characteristic.TargetHeatingCoolingState,
                    this.homebridge.hap.Characteristic.TargetHeatingCoolingState.AUTO,
                );

                break;

            case "Cool":
                this.service.updateCharacteristic(
                    this.homebridge.hap.Characteristic.CurrentHeatingCoolingState,
                    this.homebridge.hap.Characteristic.CurrentHeatingCoolingState.COOL,
                );

                this.service.updateCharacteristic(
                    this.homebridge.hap.Characteristic.TargetHeatingCoolingState,
                    this.homebridge.hap.Characteristic.TargetHeatingCoolingState.COOL,
                );

                break;

            case "Heat":
                this.service.updateCharacteristic(
                    this.homebridge.hap.Characteristic.CurrentHeatingCoolingState,
                    this.homebridge.hap.Characteristic.CurrentHeatingCoolingState.HEAT,
                );

                this.service.updateCharacteristic(
                    this.homebridge.hap.Characteristic.TargetHeatingCoolingState,
                    this.homebridge.hap.Characteristic.TargetHeatingCoolingState.HEAT,
                );

                break;

            case "Off":
                this.service.updateCharacteristic(
                    this.homebridge.hap.Characteristic.CurrentHeaterCoolerState,
                    this.homebridge.hap.Characteristic.CurrentHeatingCoolingState.OFF,
                );

                this.service.updateCharacteristic(
                    this.homebridge.hap.Characteristic.TargetHeatingCoolingState,
                    this.homebridge.hap.Characteristic.TargetHeatingCoolingState.OFF,
                );

                break;
        }

        this.service.updateCharacteristic(this.homebridge.hap.Characteristic.CurrentTemperature, state.temprature);

        this.service.updateCharacteristic(
            this.homebridge.hap.Characteristic.CoolingThresholdTemperature,
            state.coolTarget,
        );

        this.service.updateCharacteristic(
            this.homebridge.hap.Characteristic.HeatingThresholdTemperature,
            state.heatTarget,
        );
    }

    /**
     * Fetches the current state when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetState = async (): Promise<CharacteristicValue> => {
        await this.device.query();

        switch (this.device.status.state) {
            case "Auto":
                return this.homebridge.hap.Characteristic.TargetHeatingCoolingState.AUTO;

            case "Cool":
                return this.homebridge.hap.Characteristic.TargetHeatingCoolingState.COOL;

            case "Heat":
                return this.homebridge.hap.Characteristic.TargetHeatingCoolingState.HEAT;

            default:
                return this.homebridge.hap.Characteristic.TargetHeatingCoolingState.OFF;
        }
    };

    /**
     * Updates the device when a change comes in from Homebridge.
     *
     * @param value The characteristic value from Homebrtidge.
     */
    private onSetState = async (value: CharacteristicValue): Promise<void> => {
        switch (value) {
            case this.homebridge.hap.Characteristic.TargetHeatingCoolingState.AUTO:
                this.log.debug(`Thermostat Set State: ${this.device.name} Auto`);

                await this.device.set({ state: "Auto" });

                break;

            case this.homebridge.hap.Characteristic.TargetHeatingCoolingState.COOL:
                this.log.debug(`Thermostat Set State: ${this.device.name} Cool`);

                await this.device.set({ state: "Cool" });

                break;

            case this.homebridge.hap.Characteristic.TargetHeatingCoolingState.HEAT:
                this.log.debug(`Thermostat Set State: ${this.device.name} Heat`);

                await this.device.set({ state: "Heat" });

                break;

            case this.homebridge.hap.Characteristic.TargetHeatingCoolingState.OFF:
                this.log.debug(`Thermostat Set State: ${this.device.name} Off`);

                await this.device.set({ state: "Off" });

                break;
        }

        await this.device.query();
    };

    /**
     * Fetches the current state when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetTemperature = (): CharacteristicValue => {
        return this.device.status.temprature;
    };

    /**
     * Fetches the current state when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetTargetTemperature = (): CharacteristicValue => {
        switch (this.device.status.state) {
            case "Auto":
            case "Cool":
                return this.device.status.coolTarget;

            default:
                return this.device.status.heatTarget;
        }
    };

    /**
     * Updates the device when a change comes in from Homebridge.
     *
     * @param value The characteristic value from Homebrtidge.
     */
    private onSetTargetTemperature = async (value: CharacteristicValue): Promise<void> => {
        await this.device.query();

        switch (this.device.status.state) {
            case "Cool":
                await this.device.set({ coolTarget: value as number });

                break;

            case "Heat":
                await this.device.set({ heatTarget: value as number });

                break;
        }

        await this.device.query();
    };

    /**
     * Fetches the current brightness when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetCoolingThresholdTemperature = (): CharacteristicValue => {
        return this.device.status.coolTarget;
    };

    /**
     * Updates the device when a change comes in from Homebridge.
     *
     * @param value The characteristic value from Homebrtidge.
     */
    private onSetCoolingThresholdTemperature = async (value: CharacteristicValue): Promise<void> => {
        const target = (value || 0) as number;

        if (this.device.status.coolTarget !== target) {
            this.log.debug(`Thermostat Set Cool Target: ${this.device.name} ${target}`);

            await this.device.set({ coolTarget: target });
        }

        await this.device.query();
    };

    /**
     * Fetches the current brightness when Homebridge asks for it.
     *
     * @returns A characteristic value.
     */
    private onGetHeatingThresholdTemperature = (): CharacteristicValue => {
        return this.device.status.heatTarget;
    };

    /**
     * Updates the device when a change comes in from Homebridge.
     *
     * @param value The characteristic value from Homebrtidge.
     */
    private onSetHeatingThresholdTemperature = async (value: CharacteristicValue): Promise<void> => {
        const target = (value || 0) as number;

        if (this.device.status.heatTarget !== target) {
            this.log.debug(`Thermostat Set Heat Target: ${this.device.name} ${target}`);

            await this.device.set({ heatTarget: target });
        }

        await this.device.query();
    };
}
