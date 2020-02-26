import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Vector3} from "three";

export default class EntityBase {
    /**
     * @param {string} resourceName
     * @param {number} scale
     */
    constructor(resourceName, scale) {
        this._resourceName = resourceName;
        this._scale = scale;

        /**
         * @type {Scene | null}
         * @protected
         */
        this._object3d = null;

        /** @type {Vector3} */
        this.velocity = new Vector3();

        this.pos = new Vector3();
    }

    /**
     * @param {GLTFLoader} loader
     * @param {Scene} scene
     * @param {Vector3} initialPosition
     */
    init(loader, scene, initialPosition) {
        this.pos = initialPosition;

        const scale = this._scale;

        const resourceName = this._resourceName;

        const onTextureLoaded = (gltf) => {
            gltf.scene.scale.set(scale, scale, scale);

            gltf.scene.clone()

            gltf.scene.position.set(
                initialPosition.x,
                initialPosition.y,
                initialPosition.z
            );

            this._object3d = gltf.scene;
            scene.add(gltf.scene);
        };

        // Load a glTF resource
        loader.load(
            // resource URL
            './src/resources/models/' + resourceName,
            // called when the resource is loaded
            onTextureLoaded,
            // called while loading is progressing
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            function (error) {
                console.log('Error when loading resource ' + resourceName + ': ' + error.message);
            }
        );
    }

    /** @param {number} deltaMillis */
    update(deltaMillis) {
        const deltaSeconds = (deltaMillis / 1000.0);

        const relativeVelocity = this.velocity.clone().multiplyScalar(deltaSeconds);
        this.pos.add(relativeVelocity);

        if (this.pos.y < 0) {
            this.pos.y = 0;
        }

        if (this._object3d) {
            this._object3d.position.set(this.pos.x, this.pos.y, this.pos.z);
        }
    }

    get object3d() {
        return this._object3d;
    }
}