import * as THREE from 'three';

export default class SightThree extends THREE.Object3D {
    static defaultProps = {
        viewRadius: 5,
        viewAngle: 50,
        viewSegments: 32
    };

    constructor(props, mat) {
        super();

        this.props = {
            ...SightThree.defaultProps,
            ...props
        };

        this.dirFromAngelVec3 = new THREE.Vector3;

        const {viewAngle, viewSegments, viewRadius: radius} = this.props;
        const angleSize = viewAngle / viewSegments;

        const geometry = this.geometry = new THREE.Geometry;
        geometry.vertices.push(new THREE.Vector3);

        for (let i = 0; i < viewSegments; i++) {
            const angle = -viewAngle / 2 + angleSize * i;
            const {x, z} = this.dirFromAngle(angle, false);

            geometry.vertices.push(new THREE.Vector3(
                radius * x, 0, radius * z
            ));

            if (i > 0) {
                geometry.faces.push(new THREE.Face3(0, i, i + 1));
            }
        }

        geometry.computeVertexNormals();
        geometry.computeFaceNormals();

        geometry.dynamic = true;

        let material = mat;

        if (!mat) {
            material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: .8
            });
        }

        this.mesh = new THREE.Mesh(this.geometry, material);
        this.add(this.mesh);

        this.originVec3 = new THREE.Vector3;
        this.dirVec3 = new THREE.Vector3(0, 1, 0);
        this.raycaster = new THREE.Raycaster(this.originVec3, this.dirVec3, 0, 100);
    }

    dirFromAngle(angleInDegrees, angleIsGlobal) {
        let angleInRad = THREE.MathUtils.degToRad(angleInDegrees);
        if (angleIsGlobal) {
            angleInRad += this.rotation.y;
        }
        return new THREE.Vector3(Math.sin(angleInRad), 0, Math.cos(angleInRad));
    }

    getIntersections(objects) {
        const {viewAngle, viewSegments, viewRadius: radius} = this.props;
        const angleSize = viewAngle / viewSegments;

        this.updateWorldMatrix();
        this.getWorldPosition(this.originVec3);

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
                this.mesh.geometry.vertices[i].x = d * localXYZ.x;
                this.mesh.geometry.vertices[i].z = d * localXYZ.z;
            } else {
                this.mesh.geometry.vertices[i].x = radius * localXYZ.x;
                this.mesh.geometry.vertices[i].z = radius * localXYZ.z;
            }

            this.mesh.geometry.verticesNeedUpdate = true;
        }

        this.dirFromAngelVec3.set(0, 0, 0);
    }
}
