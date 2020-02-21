import {Euler, Vector2, Vector3} from "three";

export default class MovementControls {

    /** @param {Window} window */
    constructor(window) {
        this._window = window;

        this.velocity = new Vector3();
        this._heading = new Vector2();
        this.lockY = true;

        this._isMouseDown = false;

        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    }

    /**
     * @param {THREE.Camera} camera
     */
    init(camera) {
        this._window.addEventListener("keydown", this.keyDownHandler);
        this._window.addEventListener("keyup", () => (this._keyDown = false));

        this._window.addEventListener("mousemove", this.mouseMoveHandler);
        this._window.addEventListener("mousedown", () => (this._isMouseDown = true));
        this._window.addEventListener("mouseup", () => (this._isMouseDown = false));


        this._camera = camera;

        // This ensures the horizon won't roll. https://stackoverflow.com/questions/17517937/three-js-camera-tilt-up-or-down-and-keep-horizon-level/
        this._camera.rotation.order = "YXZ"
    }

    /** @param {number} deltaMillis */
    update(deltaMillis) {
        const displacement = new Vector3().copy(this.velocity).multiplyScalar(deltaMillis / 1000.0);
        const previousPosition = this._camera.position.clone();

        if (!this._keyDown) {
            // decay velocity
            this.velocity.multiplyScalar(.9);
        }

        // Sideways
        const localXAxis = this.headingAxis();

        // Forwards
        const localZAxis = new Vector3(-localXAxis.z, 0, localXAxis.x);
        this._camera.translateOnAxis(localXAxis, displacement.x);
        this._camera.translateOnAxis(localZAxis, displacement.z);

        //  Ensure y stays the same
        if (this.lockY) {
            this._camera.position.y = previousPosition.y;
        }
    }

    keyDownHandler(e) {
        if (e.code === "KeyA") this.velocity.x = -5;
        else if (e.code === "KeyD") this.velocity.x = 5;
        else if (e.code === "KeyW") this.velocity.z = -5;
        else if (e.code === "KeyS") this.velocity.z = 5;

        this._keyDown = true;
    };

    normalisedHeading() {
        const normalisedHeading = this._heading.clone();
        normalisedHeading.normalize();

        return normalisedHeading;
    }

    headingAxis() {
        const normalisedHeading = this.normalisedHeading();

        return new Vector3(Math.cos(normalisedHeading.x), 0, Math.sin(normalisedHeading.x));
    }

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