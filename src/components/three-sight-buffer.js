import * as THREE from 'three';

export default class BufferSightThree {
    static defaultProps = {
        viewRadius: 5,
        viewAngle: 50,
        viewSegments: 32
    };

    constructor(scene, props, mat) {
        this.scene = scene;
        this.props = {
            ...BufferSightThree.defaultProps,
            ...props
        };

        const {viewAngle, viewSegments, viewRadius: radius} = this.props;
        const angleSize = viewAngle / viewSegments;

        const geometry = this.geometry = new THREE.BufferGeometry;
        const vertices = new Float32Array( (viewSegments + 1) * 3 );
        const indices = [];

        vertices.set([0, 0, 0], 0);

        for (let i = 0; i < viewSegments; i++) {
            const angle = -viewAngle / 2 + angleSize * i;
            const {x, y, z} = this.dirFromAngle(angle, false);

            vertices.set([radius * x, y, radius * z], (i + 1) * 3);

            if (i > 0) {
                indices.push(0, i, i + 1);
            }
        }

        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        let material = mat;

        if (!mat) {
            material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: .8
            });
        }

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.y = 1;
        this.scene.add(this.mesh);

        this.originVec3 = new THREE.Vector3;
        this.dirVec3 = new THREE.Vector3(0, 1, 0);
        this.raycaster = new THREE.Raycaster(this.originVec3, this.dirVec3, 0, 100);
    }

    dirFromAngle(angleInDegrees, angleIsGlobal) {
        let angleInRad = THREE.MathUtils.degToRad(angleInDegrees);
        if (angleIsGlobal) {
            angleInRad += this.mesh.rotation.y;
        }
        return {
            x: Math.sin(angleInRad),
            y: 0,
            z: Math.cos(angleInRad)
        };
    }

    getIntersections(objects) {
        const {viewAngle, viewSegments, viewRadius: radius} = this.props;
        const angleSize = viewAngle / viewSegments;

        this.mesh.updateWorldMatrix();
        this.mesh.getWorldPosition(this.originVec3);

        this.raycaster.far = radius;
        for (let i = 1; i < viewSegments + 1; i++) {
            const angle = -viewAngle / 2 + angleSize * i;

            const globalXYZ = this.dirFromAngle(angle, true);
            const localXYZ = this.dirFromAngle(angle, false);
            
            this.dirVec3.set(radius * globalXYZ.x, globalXYZ.y, radius * globalXYZ.z).normalize();
            this.raycaster.set(this.originVec3, this.dirVec3);
            
            const intersection = this.raycaster.intersectObjects(objects);

            if (intersection.length > 0) {
                const {distance: d} = intersection[0];
                this.geometry.getAttribute('position').set([
                    d * localXYZ.x,
                    0,
                    d * localXYZ.z
                ], i * 3);
            } else {
                this.geometry.getAttribute('position').set([
                    radius * localXYZ.x,
                    0,
                    radius * localXYZ.z
                ], i * 3);
            }
        }
        this.geometry.getAttribute('position').needsUpdate = true;
    }
}
