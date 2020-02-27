import EntityBase from "./entity-base";
import {
    Color,
    CameraHelper, 
    CylinderGeometry,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    PointLight,
    SphereGeometry
} from "three";

export default class StreetLamp extends EntityBase {

    constructor() {
        super("none", 0, 0); // this doesn't apply, TODO rework hierarchy
    }

    init(loader, scene, initialPosition) {
        const poleGeometry = new CylinderGeometry(.03, .1, 3, 60);
        const poleMaterial = new MeshPhongMaterial({
            color: new Color(0x909090),
            castShadow: true,
            shininess: 40
        });
        const pole = new Mesh(poleGeometry, poleMaterial);
        pole.position.set(initialPosition.x, 1.5 + initialPosition.y, initialPosition.z);
        scene.add(pole);

        const poleLampGeometry = new SphereGeometry(.3, 60, 60,);
        const poleLampMaterial = new MeshBasicMaterial({
            castShadow: true,
            opacity: .7,
            transparent: true
        });
        poleLampMaterial.color.setHex(0xFFFF00);
        const poleLamp = new Mesh(poleLampGeometry, poleLampMaterial);
        poleLamp.position.set(initialPosition.x, 3.3 + initialPosition.y, initialPosition.z);
        scene.add(poleLamp);

        const light = new PointLight(0xAAAA00, 2, 25);
        light.position.set(initialPosition.x, 3.3 + initialPosition.y, initialPosition.z);
        light.castShadow = true;
        scene.add(light);
        // debug
        var helper = new CameraHelper(light.shadow.camera);
        scene.add(helper);
    }
}