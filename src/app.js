import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Demo } from './demo';

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
    }

    init() {
        this.camera.position.set(15, 20, 15);
        const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        this.scene.add( light );

        this.demo = new Demo(this.scene);
        this.update();
    }

    update() {
        requestAnimationFrame(this.update.bind(this));
        this.demo && this.demo.update();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        
    }
}
