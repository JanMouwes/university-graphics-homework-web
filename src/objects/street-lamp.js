import EntityBase from "./entity-base";
import {Color, CylinderGeometry, Mesh, MeshBasicMaterial, MeshPhongMaterial, PointLight, SphereGeometry} from "three";

export default class StreetLamp extends EntityBase {

    constructor() {
        super("none", 0, 0); // this doesn't apply, TODO rework hierarchy
    }

    init(loader, scene, initialPosition) {
        const poleGeometry = new CylinderGeometry(.1, .1, 4, 60);
        const poleMaterial = new MeshPhongMaterial({
            color: new Color(0x909090),
        });
        const pole = new Mesh(poleGeometry, poleMaterial);
        pole.position.set(initialPosition.x, 2 + initialPosition.y, initialPosition.z);
        scene.add(pole);

        const poleLampGeometry = new SphereGeometry(.3, 60, 60,);
        const poleLampMaterial = new MeshBasicMaterial({
            opacity: .7,
            transparent: true
        });
        poleLampMaterial.color.setHex(0xFFFF00);
        const poleLamp = new Mesh(poleLampGeometry, poleLampMaterial);
        poleLamp.position.set(initialPosition.x, 4.1 + initialPosition.y, initialPosition.z);
        scene.add(poleLamp);

        const light = new PointLight(0xFFFF00, 50, 25);
        light.position.set(initialPosition.x, 4.1 + initialPosition.y, initialPosition.z);
        scene.add(light);
    }
}