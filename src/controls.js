import {Vector3} from "three";

export default class MovementControls {

    /** @param {Window} window */
    constructor(window) {
        this._window = window;

        this.velocity = new Vector3();
        this.lockY = true;

        this._isMouseDown = false;

        /**
         *
         * @type {Map<string, boolean>}
         * @private
         */
        this._keyState = new Map();

        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    }

    /**
     * @param {THREE.Camera} camera
     */
    init(camera) {
        this._window.addEventListener("keydown", this.keyDownHandler);
        this._window.addEventListener("keyup", (e) => (this._keyState.set(e.code, false)));

        this._window.addEventListener("mousemove", this.mouseMoveHandler);
        this._window.addEventListener("mousedown", () => (this._isMouseDown = true));
        this._window.addEventListener("mouseup", () => (this._isMouseDown = false));


        this._camera = camera;

        // This ensures the horizon won't roll. https://stackoverflow.com/questions/17517937/three-js-camera-tilt-up-or-down-and-keep-horizon-level/
        this._camera.rotation.order = "YXZ"
    }

    /** @param {number} deltaMillis */
    update(deltaMillis) {
        const displacement = this.velocity.clone().multiplyScalar(deltaMillis / 1000.0);
        const previousPosition = this._camera.position.clone();

        // decay velocity
        this.velocity.multiplyScalar(.8);
        if (this.velocity.lengthSq() < 0.001) {
            this.velocity.set(0, 0, 0);
        }

        if (this._keyState.get("KeyA")) this.velocity.x = -5;
        if (this._keyState.get("KeyD")) this.velocity.x = 5;
        if (this._keyState.get("KeyW")) this.velocity.z = -5;
        if (this._keyState.get("KeyS")) this.velocity.z = 5;

        this._camera.translateX(displacement.x);
        this._camera.translateZ(displacement.z);

        //  Ensure y stays the same
        if (this.lockY) {
            this._camera.position.y = previousPosition.y;
        }
    }

    keyDownHandler(e) {
        this._keyState.set(e.code, true);
    };

    /** @param {MouseEvent} e */
    mouseMoveHandler(e) {
        // Only handle when the mouse-button is down
        if (!this._isMouseDown) {
            return;
        }

        //  Movement around the X-axis, in radians
        const movementXRadians = (e.movementY / this._window.innerHeight) * 2 * Math.PI;
        //  Movement around the Y-axis, in radians
        const movementYRadians = (e.movementX / this._window.innerWidth) * 2 * Math.PI;

        this._camera.rotation.x += movementXRadians;
        this._camera.rotation.y += movementYRadians;
    }
}