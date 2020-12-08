import { GUI } from 'dat.gui';

import SightThree from "./components/three-sight";

export class Demo {
    constructor(scene) {
        this.scene = scene;
        this.sight = null;
        this.sightProps = {
            viewRadius: 5,
            viewAngle: 50,
            viewSegments: 32
        };
        this.intersectionObjects = [];
        this.rT = 0;

        this.createGround();
        this.createObjects();
        this.createSight();
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

    createObjects() {
        const {scene} = this;

        const material = new THREE.MeshBasicMaterial( {color: 0x0000ff, transparent: true, opacity: .2} );
        const boxG = new THREE.BoxBufferGeometry( 2, 2, 2 );
        const sphereG = new THREE.SphereBufferGeometry(2, 32, 32);

        const cube = new THREE.Mesh( boxG, material );
        cube.position.set(1, 1, 4);
        cube.geometry.computeBoundingBox();
        scene.add( cube );

        const sphere = new THREE.Mesh( sphereG, material );
        sphere.position.set(-4, 1, 4);
        scene.add( sphere );

        const cube2 = new THREE.Mesh( boxG, material );
        cube2.position.set(-4, 1, -4);
        scene.add( cube2 );

        const sphere2 = new THREE.Mesh( sphereG, material );
        sphere2.position.set(4, 1, -4);
        scene.add( sphere2 );

        this.intersectionObjects.push(cube, cube2, sphere, sphere2);

        this.intersectionObjects.forEach(o => {
            o.updateMatrix();
            o.updateWorldMatrix();
        });
    }

    createSight() {
        const sight = this.sight = new SightThree(this.sightProps);
        sight.position.y = 1;
        this.scene.add(sight);

        this.addGUI();

        sight.rotation.y = 0.2;

        this.sight.getIntersections(this.intersectionObjects);
    }

    addGUI() {
        const gui = this.gui = new GUI({
            autoPlace: false, width: 260, hideable: true
        });
        const sightFolder = gui.addFolder('sightProps');

        sightFolder.add(this.sightProps, 'viewRadius', 1, 10).onChange((v) => {
            this.sight.props.viewRadius = v;
        });

        sightFolder.add(this.sightProps, 'viewAngle', 0, 180).onChange((v) => {
            this.sight.props.viewAngle = v;
        });

        const guiWrap = document.createElement('div');
        document.body.appendChild( guiWrap );
        guiWrap.classList.add('gui-wrap');
        guiWrap.appendChild(gui.domElement);
        gui.open();
    }

    update() {
        if (this.sight) {
            this.sight.rotation.y += .02;
            this.sight.position.x = Math.sin(this.rT);
            this.sight.position.z = Math.cos(this.rT) * Math.random() / 100;

            this.sight.getIntersections(this.intersectionObjects);

            this.rT += .02;
        }
    }
}