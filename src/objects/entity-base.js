import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Vector3} from "three";

export default class EntityBase {
    get pos() {
        return this._pos;
    }

    set pos(value) {
        this._pos = value;
        this.object3d.position.set(
            this._pos.x,
            this._pos.y,
            this._pos.z
        )
    }

    /**
     * @param {string} resourceName
     * @param {number} scale
     * @param {number} minPosY
     */
    constructor(resourceName, scale, minPosY) {
        this._resourceName = resourceName;
        this._scale = scale;
        this._minPosY = minPosY;

        /**
         * @type {Scene | null}
         * @protected
         */
        this._object3d = null;

        /** @type {Vector3} */
        this.velocity = new Vector3();

        this._pos = new Vector3();
    }

    /**
     * @param {GLTFLoader} loader
     * @param {Scene} scene
     * @param {Vector3} initialPosition
     */
    init(loader, scene, initialPosition) {
        this._pos = initialPosition;

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
        this._pos.add(relativeVelocity);

        if (this._pos.y < this._minPosY) {
            this._pos.y = this._minPosY;
        }

        if (this._object3d) {
            this._object3d.position.set(this._pos.x, this._pos.y, this._pos.z);
        }
    }

    get object3d() {
        return this._object3d;
    }
}