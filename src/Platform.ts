import { API, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig } from "homebridge";

const accessories: Map<string, PlatformAccessory> = new Map();

const platform: string = "Mitsubishi Kumo";
const plugin: string = "@mkellsy/homebridge-mitsubishi-kumo";

export { accessories, platform, plugin };

export class Platform implements DynamicPlatformPlugin {
    private readonly log: Logging;
    private readonly config: PlatformConfig;
    private readonly homebridge: API;

    constructor(log: Logging, config: PlatformConfig, homebridge: API) {
        this.log = log;
        this.config = { ...config };
        this.homebridge = homebridge;

        this.homebridge.on("didFinishLaunching", () => {
            /* todo */
        });
    }

    public configureAccessory(accessory: PlatformAccessory): void {
        accessories.set(accessory.UUID, accessory);
    }
}
