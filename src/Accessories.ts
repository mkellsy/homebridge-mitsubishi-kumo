import * as Kumo from "@mkellsy/mitsubishi-kumo-client";

import { API, Logging } from "homebridge";
import { DeviceType, Device as IDevice } from "@mkellsy/hap-device";

import { accessories, devices, platform, plugin } from "./Platform";

import { Thermostat } from "./Thermostat";
import { Device } from "./Device";

/**
 * Accessory factory.
 * @private
 */
export abstract class Accessories {
    /**
     * Creates respective devices from a common device discovery.
     *
     * @param homebridge A reference to the Homebridge API.
     * @param device A reference to the common device object.
     * @param log A reference to the Homebridge logger.
     *
     * @returns A device or undefined if not configured.
     */
    public static create(homebridge: API, device: IDevice, log: Logging): Device | undefined {
        switch (device.type) {
            case DeviceType.Thermostat:
                return new Thermostat(homebridge, device as Kumo.Thermostat, log);
        }

        return undefined;
    }

    /**
     * Fetches an internally cached device.
     *
     * @param homebridge A reference to the Homebridge API.
     * @param device A reference to the common device object.
     *
     * @returns The cached device or undefined if not available.
     */
    public static get(homebridge: API, device: IDevice): Device | undefined {
        const id = homebridge.hap.uuid.generate(device.id);

        return devices.get(id);
    }

    /**
     * Removes an internally cached device.
     *
     * @param homebridge A reference to the Homebridge API.
     * @param device A reference to the common device object.
     */
    public static remove(homebridge: API, device: IDevice): void {
        const id = homebridge.hap.uuid.generate(device.id);
        const accessory = accessories.get(id);

        if (accessory != null) {
            homebridge.unregisterPlatformAccessories(plugin, platform, [accessory]);
        }
    }
}
