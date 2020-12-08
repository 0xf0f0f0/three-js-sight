import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
import Layout from './layout';
import Sight from './three.sight';

export class App {
    constructor() {
        const width = this.width = window.innerWidth;
        const height = this.height = window.innerHeight;

        const scene = this.scene = new THREE.Scene;
        scene.background = new THREE.Color(0x01bdff);
        const camera = this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        const renderer = this.renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);

        document.body.appendChild( this.renderer.domElement );

        this.controls = new OrbitControls(camera, renderer.domElement);
        
        window.camera = camera;
    }

    init() {
        this._init();
        this.update();
    }

    _init() {
        const {scene, camera} = this;

        camera.position.set(15, 20, 15);

        const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        scene.add( light );

        this.layout = new Layout(scene);


        this.state = {
            viewRadius: 5,
            viewAngle: 44,
            viewSegments: 32,
            rotate: false
        };

        this.sight = new Sight(this.state);
        this.sight.position.y = 1;
        scene.add(this.sight);

        this.addGUI();
        this.sight.rotation.y = .5;
        this.sight.getIntersection(this.layout.intersectionObj);
        
    }

    addGUI() {
        const gui = this.gui = new GUI({autoPlace: false, width: 260, hideable: true});
        const sightF = gui.addFolder('Sight');

        [
            sightF.add(this.state, 'viewRadius', 1, 10),
            sightF.add(this.state, 'viewAngle', 0, 360),
        ]//.forEach((prop) => prop.onChange(() => this.updateSigthProps()));

        const guiWrap = document.createElement('div');
        document.body.appendChild( guiWrap );
        guiWrap.classList.add('gui-wrap');
        guiWrap.appendChild(gui.domElement);
        gui.open();
    }

    updateSigthProps() {
        const {state, sight} = this;

        
    }

    update() {
        requestAnimationFrame(this.update.bind(this));
        this.layout.update();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);


        this.sight.rotation.y += .02;
        this.sight.position.x -= Math.sin(this.sight.rotation.y) / 50;
        this.sight.position.z -= Math.sin(this.sight.rotation.y) / 50;

        this.sight.getIntersection(this.layout.intersectionObj);
    }
}
