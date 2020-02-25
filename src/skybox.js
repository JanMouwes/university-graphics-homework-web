import {MeshNormalMaterial, TextureLoader} from "three";
import {MeshBasicMaterial, BoxGeometry, Mesh, BackSide} from "three";

/**
 *
 * @param {{path: string, "x-positive": string, "x-negative": string, "y-positive": string, "y-negative": string, "z-positive": string, "z-negative": string, distance: {width: number, height: number, depth: number}}} settings
 * @returns {Mesh}
 */
export default function createSkybox(settings) {
    //  This needs to stay in-order
    const directions = ["x-positive", "x-negative", "y-positive", "y-negative", "z-positive", "z-negative"];
    const path = "src/resources/textures/" + settings.path;

    const textureLoader = new TextureLoader();

    const materialArray = [];
    for (let i = 0; i < 6; i++) {
        const direction = directions[i];
        const texturePath = path + "/" + settings[direction];
        materialArray.push(
            new MeshBasicMaterial({map: textureLoader.load(texturePath), side: BackSide})
        );
    }

    const skyGeometry = new BoxGeometry(settings.distance.width, settings.distance.height, settings.distance.depth);
    const skyBox = new Mesh(skyGeometry, materialArray);

    return skyBox;
}