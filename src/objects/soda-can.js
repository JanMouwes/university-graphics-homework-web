import {Vector3} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import EntityBase from "./entity-base";

export default class SodaCan extends EntityBase {
    /**
     * @param {number} scale
     */
    constructor(scale) {
        super("can.gltf", scale);
    }
}