import {
    Scene,
    BoxGeometry,
    Mesh,
    Vector3,
    ConeGeometry,
    TextureLoader,
    RepeatWrapping,
    MeshBasicMaterial
} from "three";

export default class House {

    /**
     * @param {number} scale
     */
    constructor(scale) {
      this._scale = scale;
    }

    /**
     * @param {Scene} scene
     * @param {Vector3} initialPosition
     */
    init(scene, initialPosition) {
      const scale = this._scale;
      const repeat = scale * 4;
      const repeatDak = repeat + (2 * scale);
      this._pos = initialPosition;

      var geometry = new BoxGeometry(5 * scale, 5 * scale, 5 * scale);
      var texture = new TextureLoader().load('./src/resources/models/textures/BrickWall/Brick_Wall_017_basecolor.jpg');
      texture.repeat.set(repeat, repeat);
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.repeat.set( repeat, repeat);
      var material = new MeshBasicMaterial({map: texture});
      var huisBase = new Mesh(geometry, material);
      huisBase.position.set(this._pos.x, this._pos.y + (5 * scale / 2), this._pos.z);
      scene.add(huisBase);
      
      var geometry = new ConeGeometry(4.5 * scale, 2.5 * scale, 4, 1, false, Math.PI / 4);
      var texture = new TextureLoader().load('./src/resources/models/textures/TerracottaRoof/Shingles_Terracotta_001_basecolor.jpg');
      texture.repeat.set(repeatDak, repeatDak);
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.repeat.set( repeatDak, repeatDak);
      
      var material = new MeshBasicMaterial({map: texture});
      
      var huisDak = new Mesh(geometry, material);
      
      huisDak.position.set(huisBase.position.x, huisBase.position.y + 3.8, huisBase.position.z);
      
      scene.add(huisDak);
    }
}