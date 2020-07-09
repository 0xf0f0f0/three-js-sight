export default class Layout {
    constructor(scene) {

        this.scene = scene;
        this.intersectionObj = [];

        this.createGround();
        this.createElements();
    }

    createGround() {
        const {scene} = this;
        const geometry = new THREE.PlaneBufferGeometry( 20, 20, 32 );
        const material = new THREE.MeshBasicMaterial({
            color: 0x0aff00,
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = Math.PI / 2;
        scene.add( plane );
    }

    createElements() {
        const {scene} = this;

        const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
        const material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.set(2, 1, 4);
        scene.add( cube );

        const cube1 = new THREE.Mesh( geometry, material );
        cube1.position.set(-4, 1, 4);
        scene.add( cube1 );

        const cube2 = new THREE.Mesh( geometry, material );
        cube2.position.set(-4, 1, -4);
        scene.add( cube2 );


        this.intersectionObj.push(cube, cube1, cube2);
    }

    update() {

    }
}