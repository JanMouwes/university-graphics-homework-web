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

      // Adding the base of the house with a stone texture
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
      
      // Adding the roof of the house with a terracotta texture
      var geometry = new ConeGeometry(4.5 * scale, 2.5 * scale, 4, 1, false, Math.PI / 4);
      var texture = new TextureLoader().load('./src/resources/models/textures/TerracottaRoof/Shingles_Terracotta_001_basecolor.jpg');
      texture.repeat.set(repeatDak, repeatDak);
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.repeat.set( repeatDak, repeatDak);
      
      var material = new MeshBasicMaterial({map: texture});
      
      var huisDak = new Mesh(geometry, material);
      
      huisDak.position.set(huisBase.position.x, huisBase.position.y + (3.8 * scale), huisBase.position.z);
      
      scene.add(huisDak);

      // Adding the door of the house
      var geometry = new BoxGeometry(1.5, 2, 0.25);
      var material = new MeshBasicMaterial( { color: 0xffffff, wireframe: false });
      var huisDeur = new Mesh(geometry, material);
      
      huisDeur.position.set(huisBase.position.x + (5 * scale / 2) - 1.5, 1, huisBase.position.z + (5 * scale / 2));

      scene.add(huisDeur);

      // Adding the windows of the house
      console.log('start');
      var i;
      var j = 1;
      var floor = 0;
      const width = 2 * scale;
      for (i = 1; i < (4 * scale * scale); i++) {
        var geometry = new BoxGeometry(1.25, 1.25, 0.25);
        var material = new MeshBasicMaterial( { color: 0x000000, wireframe: false });
        var huisRaam = new Mesh(geometry, material);

        if (i%width == 0 && i !=0) {
          j = 1;
          floor += 1;
          console.log('floor: ' + floor);
          huisRaam.position.set(huisBase.position.x + ((5 * scale / width) * j) - 1.5, 1.375 + (2.5 * floor), huisBase.position.z + (5 * scale / 2));
        } else {
          huisRaam.position.set(huisBase.position.x - ((5 * scale / width) * j) + 1.5, 1.375 + (2.5 * floor), huisBase.position.z + (5 * scale / 2));
        }
        console.log(i);
        j++;

        console.log(huisRaam.position);
        scene.add(huisRaam);
      }
    }
}